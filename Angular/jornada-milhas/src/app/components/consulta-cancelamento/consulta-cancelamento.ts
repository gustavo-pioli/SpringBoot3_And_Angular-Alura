import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { Consultas } from '../../services/consultas';
import { MotivoCancelamento } from '../../../types/type';
import { extrairMensagemErro } from '../../utils/erro-http';

// Aberto a partir de uma linha da tabela de consultas, então o id já vem
// pronto via MAT_DIALOG_DATA: só falta perguntar o motivo do cancelamento.
export interface ConsultaCancelamentoData {
  idConsulta: number;
}

@Component({
  selector: 'app-consulta-cancelamento',
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './consulta-cancelamento.html',
  styleUrl: './consulta-cancelamento.css',
})
export class ConsultaCancelamento {
  private readonly service = inject(Consultas);
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ConsultaCancelamento>);
  readonly data = inject<ConsultaCancelamentoData>(MAT_DIALOG_DATA);

  readonly motivos: MotivoCancelamento[] = ['PACIENTE_DESISTIU', 'MEDICO_CANCELOU', 'OUTROS'];
  erro = '';

  form = this.fb.nonNullable.group({
    motivo: ['' as MotivoCancelamento, Validators.required],
  });

  cancelar(): void {
    if (this.form.invalid) {
      return;
    }

    this.service.cancelar({ idConsulta: this.data.idConsulta, motivo: this.form.getRawValue().motivo }).subscribe({
      next: () => this.dialogRef.close(true),
      error: (e: HttpErrorResponse) => (this.erro = extrairMensagemErro(e)),
    });
  }
}
