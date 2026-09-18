import { Component, OnInit, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { HttpErrorResponse } from '@angular/common/http';
import { Consultas } from '../../services/consultas';
import { Medicos } from '../../services/medicos';
import { Pacientes } from '../../services/pacientes';
import {
  DadosAgendamentoConsulta,
  DadosListagemMedico,
  DadosListagemPaciente,
  Especialidade,
} from '../../../types/type';
import { extrairMensagemErro } from '../../utils/erro-http';

// Agora que existe GET /consultas, este formulário virou diálogo (mesmo
// padrão de MedicoForm/PacienteForm): fecha com `true` e quem abriu recarrega
// a tabela, em vez de precisar de um output() pra "avisar" o pai a mão.
@Component({
  selector: 'app-consulta-form',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
  ],
  templateUrl: './consulta-form.html',
  styleUrl: './consulta-form.css',
})
export class ConsultaForm implements OnInit {
  private readonly service = inject(Consultas);
  private readonly medicosService = inject(Medicos);
  private readonly pacientesService = inject(Pacientes);
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ConsultaForm>);

  readonly especialidades: Especialidade[] = ['ORTOPEDIA', 'GINECOLOGIA', 'CARDIOLOGIA', 'DERMATOLOGIA'];
  medicosDisponiveis = signal<DadosListagemMedico[]>([]);
  pacientesDisponiveis = signal<DadosListagemPaciente[]>([]);
  erro = '';

  form = this.fb.nonNullable.group({
    idPaciente: [null as number | null, Validators.required],
    escolha: ['especialidade' as 'medico' | 'especialidade', Validators.required],
    idMedico: [null as number | null],
    especialidade: ['' as Especialidade | ''],
    data: ['', Validators.required],
    hora: ['', Validators.required],
  });

  // Lido diretamente do FormControl, o template acabava vendo o valor mudar
  // depois de já ter sido checado (NG0100), porque o mat-radio-group escreve
  // seu valor inicial num momento do ciclo de vida posterior a essa leitura.
  // `toSignal` resolve isso: passa a integrar esse valor no grafo de reatividade
  // do Angular em vez de ler a propriedade "ao vivo" a cada verificação.
  readonly escolha = toSignal(this.form.controls.escolha.valueChanges, {
    initialValue: this.form.controls.escolha.value,
  });

  ngOnInit(): void {
    // Só para preencher os selects de médico e paciente (ambas as listagens
    // agora devolvem id, então dá pra escolher em vez de digitar o id "no escuro").
    this.medicosService.listar(0, 50).subscribe((res) => this.medicosDisponiveis.set(res.content));
    this.pacientesService.listar(0, 50).subscribe((res) => this.pacientesDisponiveis.set(res.content));
  }

  agendar(): void {
    this.erro = '';

    if (this.form.invalid) {
      return;
    }

    const v = this.form.getRawValue();

    // A API exige um dos dois: médico específico OU especialidade (pra
    // escolher um médico automaticamente). Validado aqui em vez de com um
    // validador de formulário cruzado, pra manter a regra simples de ler.
    if (v.escolha === 'medico' && !v.idMedico) {
      this.erro = 'Selecione um médico.';
      return;
    }
    if (v.escolha === 'especialidade' && !v.especialidade) {
      this.erro = 'Selecione uma especialidade.';
      return;
    }

    const dados: DadosAgendamentoConsulta = {
      idPaciente: v.idPaciente!,
      data: v.data +"T"+ v.hora,
      ...(v.escolha === 'medico' ? { idMedico: v.idMedico! } : { especialidade: v.especialidade as Especialidade }),
    };

    this.service.agendar(dados).subscribe({
      next: () => this.dialogRef.close(true),
      error: (e: HttpErrorResponse) => (this.erro = extrairMensagemErro(e)),
    });
  }
}
