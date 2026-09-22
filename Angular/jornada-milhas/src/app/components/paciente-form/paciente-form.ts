import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { Pacientes } from '../../services/pacientes';
import { extrairMensagemErro } from '../../utils/erro-http';
import { catchError, distinctUntilChanged, EMPTY, filter, map, switchMap } from 'rxjs';
import { Cep } from '../../services/cep';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Diferente de médico, a API de paciente só tem cadastro (POST) — não há
// edição, então este diálogo não precisa de um "modo edição" como o de médico.
@Component({
  selector: 'app-paciente-form',
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './paciente-form.html',
  styleUrl: './paciente-form.css',
})
export class PacienteForm {
  private readonly service = inject(Pacientes);
  private readonly dialogRef = inject(MatDialogRef<PacienteForm>);
  private readonly fb = inject(FormBuilder);
  private readonly cepService = inject(Cep);

  erro = '';
  tentouSalvar = false;
  salvando = signal(false);

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)]],
    logradouro: ['', Validators.required],
    bairro: ['', Validators.required],
    cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    cidade: ['', Validators.required],
    uf: ['', Validators.required],
    numero: [''],
    complemento: [''],
  });

  constructor() {
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

    const requisicao = this.service.cadastrar({
      nome: v.nome,
      email: v.email,
      telefone: v.telefone,
      cpf: v.cpf,
      endereco: {
        logradouro: v.logradouro,
        bairro: v.bairro,
        cep: v.cep,
        cidade: v.cidade,
        uf: v.uf,
        numero: v.numero,
        complemento: v.complemento,
      },
    });

    this.salvando.set(true);
    requisicao.subscribe({
      next: () => this.dialogRef.close(true),
      error: (e: HttpErrorResponse) => {
        this.erro = extrairMensagemErro(e);
        this.salvando.set(false);
      },
    });
  }
}
