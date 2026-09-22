import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Pacientes } from '../../services/pacientes';
import { PacienteForm } from '../paciente-form/paciente-form';
import { criarTabelaPaginada } from '../../utils/tabela-paginada';
import { abrirEAtualizar } from '../../utils/dialog-e-atualizar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-paciente-tabela',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './paciente-tabela.html',
  styleUrl: './paciente-tabela.css',
})
export class PacienteTabela implements OnInit {
  private readonly service = inject(Pacientes);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  // Sem coluna de ações: a API não expõe edição nem exclusão de paciente.
  readonly colunas = ['nome', 'email', 'cpf'];

  private readonly tabela = criarTabelaPaginada((pagina, tamanho) => this.service.listar(pagina, tamanho));
  readonly pacientes = this.tabela.itens;
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
    abrirEAtualizar(this.dialog, this.snackBar, PacienteForm, () => this.tabela.buscar(), "Paciente cadastrado com sucesso");
  }
}
