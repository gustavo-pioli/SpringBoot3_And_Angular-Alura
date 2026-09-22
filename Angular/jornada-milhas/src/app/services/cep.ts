import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DadosCep } from '../../types/type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Cep {
  private readonly apiUrl = environment.apiUrl;
  constructor(private http: HttpClient){}

  buscar(cep: string): Observable<DadosCep> {
    return this.http.get<DadosCep>(`${this.apiUrl}/cep/${cep}`);
  }
}
