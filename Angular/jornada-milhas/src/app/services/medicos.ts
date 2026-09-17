import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DadosAtualizacaoMedico,
  DadosCadastroMedico,
  DadosDetalhamentoMedico,
  DadosListagemMedico,
  Page,
} from '../../types/type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Medicos {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(pagina = 0, tamanho = 10): Observable<Page<DadosListagemMedico>> {
    const params = new HttpParams()
      .set('page', pagina)
      .set('size', tamanho)
      .set('sort', 'nome');

    return this.http.get<Page<DadosListagemMedico>>(`${this.apiUrl}/medicos`, { params });
  }

  detalhar(id: number): Observable<DadosDetalhamentoMedico> {
    return this.http.get<DadosDetalhamentoMedico>(`${this.apiUrl}/medicos/${id}`);
  }

  cadastrar(dados: DadosCadastroMedico): Observable<DadosDetalhamentoMedico> {
    return this.http.post<DadosDetalhamentoMedico>(`${this.apiUrl}/medicos`, dados);
  }

  // A API espera PUT em /medicos (sem id na URL) com o id dentro do corpo.
  atualizar(dados: DadosAtualizacaoMedico): Observable<DadosDetalhamentoMedico> {
    return this.http.put<DadosDetalhamentoMedico>(`${this.apiUrl}/medicos`, dados);
  }

  // Exclusão lógica no backend (marca ativo=false), por isso some da listagem
  // mas continua existindo no banco.
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/medicos/${id}`);
  }
}
