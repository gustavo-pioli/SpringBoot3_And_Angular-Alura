import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Consultas } from '../../services/consultas';
import { DadosDetalhamentoConsulta } from '../../../types/type';
import { ConsultaForm } from '../consulta-form/consulta-form';
import { ConsultaCancelamento } from '../consulta-cancelamento/consulta-cancelamento';

@Component({
  selector: 'app-consulta-tabela',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  templateUrl: './consulta-tabela.html',
  styleUrl: './consulta-tabela.css',
})
export class ConsultaTabela implements OnInit {
  private readonly service = inject(Consultas);
  private readonly dialog = inject(MatDialog);

  readonly colunas = ['id', 'idPaciente', 'idMedico', 'data', 'acoes'];

  consultas = signal<DadosDetalhamentoConsulta[]>([]);
  totalElementos = signal(0);
  pagina = signal(0);
  tamanhoPagina = signal(5);

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.service.listar(this.pagina(), this.tamanhoPagina()).subscribe((res) => {
      this.consultas.set(res.content);
      this.totalElementos.set(res.totalElements);
    });
  }

  paginar(evento: PageEvent): void {
    this.pagina.set(evento.pageIndex);
    this.tamanhoPagina.set(evento.pageSize);
    this.buscar();
  }

  agendar(): void {
    this.dialog
      .open(ConsultaForm)
      .afterClosed()
      .subscribe((agendou) => {
        if (agendou) {
          this.buscar();
        }
      });
  }

  cancelar(idConsulta: number): void {
    this.dialog
      .open(ConsultaCancelamento, { data: { idConsulta } })
      .afterClosed()
      .subscribe((cancelou) => {
        if (cancelou) {
          this.buscar();
        }
      });
  }
}
