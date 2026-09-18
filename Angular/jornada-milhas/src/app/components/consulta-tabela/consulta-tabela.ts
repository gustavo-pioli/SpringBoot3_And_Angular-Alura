import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Consultas } from '../../services/consultas';
import { ConsultaForm } from '../consulta-form/consulta-form';
import { ConsultaCancelamento } from '../consulta-cancelamento/consulta-cancelamento';
import { criarTabelaPaginada } from '../../utils/tabela-paginada';
import { abrirEAtualizar } from '../../utils/dialog-e-atualizar';

@Component({
  selector: 'app-consulta-tabela',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  templateUrl: './consulta-tabela.html',
  styleUrl: './consulta-tabela.css',
})
export class ConsultaTabela implements OnInit {
  private readonly service = inject(Consultas);
  private readonly dialog = inject(MatDialog);

  readonly colunas = ['id', 'Paciente', 'Medico', 'data', 'acoes'];

  private readonly tabela = criarTabelaPaginada((pagina, tamanho) => this.service.listar(pagina, tamanho));
  readonly consultas = this.tabela.itens;
  readonly totalElementos = this.tabela.totalElementos;
  readonly pagina = this.tabela.pagina;
  readonly tamanhoPagina = this.tabela.tamanhoPagina;
  readonly erro = this.tabela.erro;

  ngOnInit(): void {
    this.tabela.buscar();
  }

  paginar(evento: PageEvent): void {
    this.tabela.paginar(evento);
  }

  agendar(): void {
    abrirEAtualizar(this.dialog, ConsultaForm, () => this.tabela.buscar());
  }

  cancelar(idConsulta: number): void {
    abrirEAtualizar(this.dialog, ConsultaCancelamento, () => this.tabela.buscar(), { data: { idConsulta } });
  }
}
