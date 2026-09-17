import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Pacientes } from '../../services/pacientes';
import { DadosListagemPaciente } from '../../../types/type';
import { PacienteForm } from '../paciente-form/paciente-form';

@Component({
  selector: 'app-paciente-tabela',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './paciente-tabela.html',
  styleUrl: './paciente-tabela.css',
})
export class PacienteTabela implements OnInit {
  private readonly service = inject(Pacientes);
  private readonly dialog = inject(MatDialog);

  // Sem coluna de ações: a API não expõe edição nem exclusão de paciente.
  readonly colunas = ['nome', 'email', 'cpf'];

  pacientes = signal<DadosListagemPaciente[]>([]);
  totalElementos = signal(0);
  pagina = signal(0);
  tamanhoPagina = signal(5);

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.service.listar(this.pagina(), this.tamanhoPagina()).subscribe((res) => {
      this.pacientes.set(res.content);
      this.totalElementos.set(res.totalElements);
    });
  }

  paginar(evento: PageEvent): void {
    this.pagina.set(evento.pageIndex);
    this.tamanhoPagina.set(evento.pageSize);
    this.buscar();
  }

  cadastrar(): void {
    this.dialog
      .open(PacienteForm)
      .afterClosed()
      .subscribe((cadastrou) => {
        if (cadastrou) {
          this.buscar();
        }
      });
  }
}
