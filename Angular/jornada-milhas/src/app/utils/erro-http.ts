import { HttpErrorResponse } from '@angular/common/http';
import { ErroValidacao } from '../../types/type';

// O TratadorDeErros (@RestControllerAdvice) do backend não devolve sempre o
// mesmo formato de erro: cada exceção tem seu próprio corpo. Esta função
// concentra essa tradução num único lugar para todos os formulários usarem.
export function extrairMensagemErro(erro: HttpErrorResponse): string {
  // Bean Validation (@Valid) falhou: corpo é uma lista de { campo, mensagem }.
  if (erro.status === 400 && Array.isArray(erro.error)) {
    return (erro.error as ErroValidacao[]).map((e) => `${e.campo}: ${e.mensagem}`).join(' | ');
  }

  // Regra de negócio violada (ValidacaoException): corpo é texto puro.
  if (erro.status === 400 && typeof erro.error === 'string') {
    return erro.error;
  }

  if (erro.status === 401) {
    return 'Sessão expirada. Faça login novamente.';
  }

  if (erro.status === 404) {
    return 'Registro não encontrado.';
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}
