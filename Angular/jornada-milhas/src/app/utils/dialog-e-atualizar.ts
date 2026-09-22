import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Generic sobre o componente do diálogo (T) e o tipo que ele devolve ao
// fechar (R): abrir um diálogo e, se ele fechar com um resultado "verdadeiro"
// (convenção usada por MedicoForm/PacienteForm/ConsultaForm/ConsultaCancelamento
// — fecham com `true` quando salvam, ou nada quando só cancela), recarrega a
// tabela que chamou. Evita repetir esse `open().afterClosed().subscribe(...)`
// em cadastrar/editar/excluir/agendar/cancelar de cada tabela.
export function abrirEAtualizar<T, R = boolean>(
  dialog: MatDialog,
  snackBar: MatSnackBar,
  componente: ComponentType<T>,
  aoAtualizar: () => void,
  mensagemSucesso: string,
  config?: MatDialogConfig,
): void {
  dialog
    .open(componente, config)
    .afterClosed()
    .subscribe((resultado: R) => {
      if (resultado) {
        aoAtualizar();
        snackBar.open(mensagemSucesso, 'OK', { duration:3000 });
      }
    });
}
