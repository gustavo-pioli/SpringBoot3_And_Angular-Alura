import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Medicos } from '../../services/medicos';
import { MedicoForm } from '../medico-form/medico-form';
import { criarTabelaPaginada } from '../../utils/tabela-paginada';
import { abrirEAtualizar } from '../../utils/dialog-e-atualizar';

@Component({
  selector: 'app-medico-tabela',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  templateUrl: './medico-tabela.html',
  styleUrl: './medico-tabela.css',
})
export class MedicoTabela implements OnInit {
  private readonly service = inject(Medicos);
  private readonly dialog = inject(MatDialog);

  // Colunas exibidas pelo mat-table: precisa bater com os matColumnDef do template.
  readonly colunas = ['nome', 'email', 'crm', 'especialidade', 'acoes'];

  private readonly tabela = criarTabelaPaginada((pagina, tamanho) => this.service.listar(pagina, tamanho));
  readonly medicos = this.tabela.itens;
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

  cadastrar(): void {
    abrirEAtualizar(this.dialog, MedicoForm, () => this.tabela.buscar());
  }

  editar(id: number): void {
    // Busca o detalhamento completo (a listagem não traz telefone/endereço)
    // antes de abrir o formulário de edição.
    this.service.detalhar(id).subscribe((medico) => {
      abrirEAtualizar(this.dialog, MedicoForm, () => this.tabela.buscar(), { data: { medico } });
    });
  }

  excluir(id: number): void {
    if (!confirm('Excluir este médico?')) {
      return;
    }

    this.service.excluir(id).subscribe(() => this.tabela.buscar());
  }
}
