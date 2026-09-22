import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { Page } from '../../types/type';
import { extrairMensagemErro } from './erro-http';

// Generic sobre o tipo de item (T): cada tabela (médico, paciente, consulta)
// só difere no tipo que lista e em qual método do serviço chama pra buscar
// a página — o estado (signals) e a lógica de paginação são idênticos, então
// isso concentra num só lugar em vez de repetir em cada componente de tabela.
export function criarTabelaPaginada<T>(
  buscarPagina: (pagina: number, tamanho: number) => Observable<Page<T>>,
  tamanhoInicial = 5,
) {
  const itens = signal<T[]>([]);
  const totalElementos = signal(0);
  const pagina = signal(0);
  const tamanhoPagina = signal(tamanhoInicial);
  const erro = signal('');
  const carregando = signal(false);


  function buscar(): void {
    erro.set('');
    carregando.set(true);
    buscarPagina(pagina(), tamanhoPagina()).subscribe({
      next: (res) => {
        itens.set(res.content);
        totalElementos.set(res.totalElements);
        carregando.set(false);
      },
      // Antes disso a chamada falhava em silêncio: nenhum `*-tabela` tinha
      // callback de erro, então um 401/403/500 deixava a tabela vazia sem
      // nenhum aviso pro usuário.
      error: (e: HttpErrorResponse) => {
        erro.set(extrairMensagemErro(e)),
        carregando.set(false);
      }
      });
  }

  // O mat-paginator já resolve a UI de página/tamanho; só repassamos os
  // valores ao serviço e buscamos de novo.
  function paginar(evento: PageEvent): void {
    pagina.set(evento.pageIndex);
    tamanhoPagina.set(evento.pageSize);
    buscar();
  }

  return { itens, totalElementos, pagina, tamanhoPagina, erro, carregando, buscar, paginar };
}
