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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-medico-tabela',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './medico-tabela.html',
  styleUrl: './medico-tabela.css',
})
export class MedicoTabela implements OnInit {
  private readonly service = inject(Medicos);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);


  // Colunas exibidas pelo mat-table: precisa bater com os matColumnDef do template.
  readonly colunas = ['nome', 'email', 'crm', 'especialidade', 'acoes'];

  private readonly tabela = criarTabelaPaginada((pagina, tamanho) => this.service.listar(pagina, tamanho));
  readonly medicos = this.tabela.itens;
  readonly totalElementos = this.tabela.totalElementos;
  readonly pagina = this.tabela.pagina;
  readonly tamanhoPagina = this.tabela.tamanhoPagina;
  readonly erro = this.tabela.erro;
  readonly carregando = this.tabela.carregando;

  ngOnInit(): void {
    this.tabela.buscar();
  }

  paginar(evento: PageEvent): void {
    this.tabela.paginar(evento);
  }

  cadastrar(): void {
    abrirEAtualizar(this.dialog, this.snackBar, MedicoForm, () => this.tabela.buscar(), "Medico cadastrado com sucesso");
  }

  editar(id: number): void {
    // Busca o detalhamento completo (a listagem não traz telefone/endereço)
    // antes de abrir o formulário de edição.
    this.service.detalhar(id).subscribe((medico) => {
      abrirEAtualizar(this.dialog, this.snackBar, MedicoForm, () => this.tabela.buscar(), "Medico atualizado com sucesso", { data: { medico } });
    });
  }

  excluir(id: number): void {
    if (!confirm('Excluir este médico?')) {
      return;
    }

    this.service.excluir(id).subscribe(() => this.tabela.buscar());
  }
}
