import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DadosAgendamentoConsulta,
  DadosCancelamentoConsulta,
  DadosDetalhamentoConsulta,
  Page,
} from '../../types/type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Consultas {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(pagina = 0, tamanho = 10): Observable<Page<DadosDetalhamentoConsulta>> {
    const params = new HttpParams().set('page', pagina).set('size', tamanho).set('sort', 'data');

    return this.http.get<Page<DadosDetalhamentoConsulta>>(`${this.apiUrl}/consultas`, { params });
  }

  agendar(dados: DadosAgendamentoConsulta): Observable<DadosDetalhamentoConsulta> {
    return this.http.post<DadosDetalhamentoConsulta>(`${this.apiUrl}/consultas`, dados);
  }

  // DELETE com corpo: o HttpClient aceita isso via a opção `body`, mesmo o
  // DELETE "clássico" do HTTP normalmente não carregar payload.
  cancelar(dados: DadosCancelamentoConsulta): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/consultas`, { body: dados });
  }
}
