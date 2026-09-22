import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { Medicos } from '../../services/medicos';
import { DadosDetalhamentoMedico, Especialidade } from '../../../types/type';
import { extrairMensagemErro } from '../../utils/erro-http';
import { catchError, distinctUntilChanged, EMPTY, filter, map, switchMap } from 'rxjs';
import { Cep } from '../../services/cep';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Dado injetado no diálogo (MAT_DIALOG_DATA): se vier um médico, o formulário
// abre em modo edição (PUT); se vier vazio/undefined, abre em modo cadastro (POST).
// Isso evita duplicar template e lógica entre as duas telas.
export interface MedicoFormData {
  medico?: DadosDetalhamentoMedico;
}

@Component({
  selector: 'app-medico-form',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './medico-form.html',
  styleUrl: './medico-form.css',
})
export class MedicoForm {
  private readonly service = inject(Medicos);
  private readonly dialogRef = inject(MatDialogRef<MedicoForm>);
  private readonly fb = inject(FormBuilder);
  private readonly data = inject<MedicoFormData>(MAT_DIALOG_DATA, { optional: true });
  private readonly cepService = inject(Cep);

  readonly especialidades: Especialidade[] = ['ORTOPEDIA', 'GINECOLOGIA', 'CARDIOLOGIA', 'DERMATOLOGIA'];
  readonly medico = this.data?.medico;
  readonly emEdicao = !!this.medico;
  erro = '';
  tentouSalvar = false;
  salvando = signal(false);

  form = this.fb.nonNullable.group({
    nome: [this.medico?.nome ?? '', Validators.required],
    email: [this.medico?.email ?? '', [Validators.required, Validators.email]],
    telefone: [this.medico?.telefone ?? '', Validators.required],
    crm: [this.medico?.crm ?? '', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
    especialidade: [(this.medico?.especialidade ?? '') as Especialidade, Validators.required],
    logradouro: [this.medico?.endereco?.logradouro ?? '', Validators.required],
    bairro: [this.medico?.endereco?.bairro ?? '', Validators.required],
    cep: [this.medico?.endereco?.cep ?? '', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    cidade: [this.medico?.endereco?.cidade ?? '', Validators.required],
    uf: [this.medico?.endereco?.uf ?? '', Validators.required],
    numero: [this.medico?.endereco?.numero ?? ''],
    complemento: [this.medico?.endereco?.complemento ?? ''],
  });

  constructor() {
    // Regra da API: em edição, crm/email/especialidade são imutáveis.
    // Desabilitar os controles evita que o usuário tente alterá-los à toa.
    if (this.emEdicao) {
      this.form.controls.email.disable();
      this.form.controls.crm.disable();
      this.form.controls.especialidade.disable();
    }

    this.form.controls.cep.valueChanges.pipe(
      map(cep => cep?.replace(/\D/g, '') ?? ''),
      filter(cep => cep.length === 8),
      distinctUntilChanged(),
      switchMap(cep => this.cepService.buscar(cep).pipe(
        catchError(() => EMPTY)
      )),
      takeUntilDestroyed(),
    ).subscribe(dados => {
      this.form.patchValue({
        logradouro: dados.logradouro,
        cidade: dados.localidade,
        uf: dados.uf,
      });
    });
  }

  salvar(): void {
    this.tentouSalvar = true;
    if (this.form.invalid) {
      return;
    }

    const v = this.form.getRawValue();
    const endereco = {
      logradouro: v.logradouro,
      bairro: v.bairro,
      cep: v.cep,
      cidade: v.cidade,
      uf: v.uf,
      numero: v.numero,
      complemento: v.complemento,
    };

    const requisicao = this.emEdicao
      ? this.service.atualizar({ id: this.medico!.id, nome: v.nome, telefone: v.telefone, endereco })
      : this.service.cadastrar({
          nome: v.nome,
          telefone: v.telefone,
          email: v.email,
          crm: v.crm,
          especialidade: v.especialidade,
          endereco,
        });

    this.salvando.set(true);
    requisicao.subscribe({
      // Fecha o diálogo devolvendo `true`: quem abriu usa esse retorno pra saber
      // que precisa recarregar a listagem. Não precisa `salvando.set(false)`
      // aqui — o diálogo fecha e o componente é destruído.
      next: () => this.dialogRef.close(true),
      error: (e: HttpErrorResponse) => {
        this.erro = extrairMensagemErro(e);
        this.salvando.set(false);
      },
    });
  }
}
