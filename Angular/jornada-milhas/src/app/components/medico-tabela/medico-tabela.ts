import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Medicos } from '../../services/medicos';
import { DadosListagemMedico } from '../../../types/type';
import { MedicoForm } from '../medico-form/medico-form';

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

  medicos = signal<DadosListagemMedico[]>([]);
  totalElementos = signal(0);
  pagina = signal(0);
  tamanhoPagina = signal(5);

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.service.listar(this.pagina(), this.tamanhoPagina()).subscribe((res) => {
      this.medicos.set(res.content);
      this.totalElementos.set(res.totalElements);
    });
  }

  // O mat-paginator já resolve a UI de página/tamanho; só repassamos os valores
  // ao serviço e buscamos de novo.
  paginar(evento: PageEvent): void {
    this.pagina.set(evento.pageIndex);
    this.tamanhoPagina.set(evento.pageSize);
    this.buscar();
  }

  cadastrar(): void {
    this.dialog
      .open(MedicoForm)
      .afterClosed()
      .subscribe((atualizou) => {
        if (atualizou) {
          this.buscar();
        }
      });
  }

  editar(id: number): void {
    // Busca o detalhamento completo (a listagem não traz telefone/endereço)
    // antes de abrir o formulário de edição.
    this.service.detalhar(id).subscribe((medico) => {
      this.dialog
        .open(MedicoForm, { data: { medico } })
        .afterClosed()
        .subscribe((atualizou) => {
          if (atualizou) {
            this.buscar();
          }
        });
    });
  }

  excluir(id: number): void {
    if (!confirm('Excluir este médico?')) {
      return;
    }

    this.service.excluir(id).subscribe(() => this.buscar());
  }
}
