import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Page } from '../../types/type';
import { criarTabelaPaginada } from './tabela-paginada';

// `criarTabelaPaginada` não injeta nada (nem HttpClient, nem MatDialog) — só
// usa `signal()`, que funciona fora de um contexto de injeção. Por isso este
// teste não precisa de `TestBed`: só chama a função e confere os signals.
function paginaFalsa<T>(content: T[], totalElements = content.length): Page<T> {
  return { content, totalElements, totalPages: 1, number: 0, size: content.length, first: true, last: true };
}

describe('criarTabelaPaginada', () => {
  it('começa vazia e não chama buscarPagina antes de buscar() ser chamado', () => {
    const buscarPagina = vi.fn();
    const tabela = criarTabelaPaginada(buscarPagina);

    expect(tabela.itens()).toEqual([]);
    expect(tabela.totalElementos()).toBe(0);
    expect(tabela.pagina()).toBe(0);
    expect(tabela.tamanhoPagina()).toBe(5);
    expect(buscarPagina).not.toHaveBeenCalled();
  });

  it('buscar() chama buscarPagina com a página/tamanho atuais e preenche os signals com a resposta', () => {
    const resposta = paginaFalsa(['medico a', 'medico b'], 42);
    const buscarPagina = vi.fn().mockReturnValue(of(resposta));
    const tabela = criarTabelaPaginada(buscarPagina);

    tabela.buscar();

    expect(buscarPagina).toHaveBeenCalledWith(0, 5);
    expect(tabela.itens()).toEqual(['medico a', 'medico b']);
    expect(tabela.totalElementos()).toBe(42);
  });

  it('paginar() atualiza pagina/tamanhoPagina e busca de novo com os novos valores', () => {
    const buscarPagina = vi.fn().mockReturnValue(of(paginaFalsa<string>([])));
    const tabela = criarTabelaPaginada(buscarPagina);

    tabela.paginar({ pageIndex: 2, pageSize: 20, length: 100 });

    expect(tabela.pagina()).toBe(2);
    expect(tabela.tamanhoPagina()).toBe(20);
    // Uma vez na chamada acima; buscar() não é disparado sozinho na criação.
    expect(buscarPagina).toHaveBeenCalledTimes(1);
    expect(buscarPagina).toHaveBeenCalledWith(2, 20);
  });

  it('buscar() preenche erro() quando buscarPagina falha, sem alterar os itens já carregados', () => {
    const erroHttp = new HttpErrorResponse({ status: 500 });
    const buscarPagina = vi.fn().mockReturnValue(throwError(() => erroHttp));
    const tabela = criarTabelaPaginada(buscarPagina);

    tabela.buscar();

    expect(tabela.erro()).toBe('Ocorreu um erro inesperado. Tente novamente.');
    expect(tabela.itens()).toEqual([]);
  });

  it('buscar() limpa um erro anterior assim que uma nova tentativa é chamada', () => {
    const buscarPagina = vi
      .fn()
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })))
      .mockReturnValueOnce(of(paginaFalsa(['ok'])));
    const tabela = criarTabelaPaginada(buscarPagina);

    tabela.buscar();
    expect(tabela.erro()).not.toBe('');

    tabela.buscar();
    expect(tabela.erro()).toBe('');
    expect(tabela.itens()).toEqual(['ok']);
  });
});
