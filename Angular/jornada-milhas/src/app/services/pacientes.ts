import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DadosCadastroPaciente, DadosListagemPaciente, Page } from '../../types/type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Pacientes {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(pagina = 0, tamanho = 10): Observable<Page<DadosListagemPaciente>> {
    const params = new HttpParams()
      .set('page', pagina)
      .set('size', tamanho)
      .set('sort', 'nome');

    return this.http.get<Page<DadosListagemPaciente>>(`${this.apiUrl}/pacientes`, { params });
  }

  // O backend devolve 200 sem corpo (método void no controller), por isso Observable<void>.
  cadastrar(dados: DadosCadastroPaciente): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/pacientes`, dados);
  }
}
