import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DadosAutenticacao, DadosTokenJWT } from '../../types/type';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Autenticacao {
  private readonly apiUrl: string = environment.apiUrl;
  public authenticated = signal(false);

  constructor(private http: HttpClient){
    if(isPlatformBrowser(inject(PLATFORM_ID))){
      this.authenticated.set(!!localStorage.getItem("token"))
    }
  }

  login(body: DadosAutenticacao): Observable<DadosTokenJWT> {
    return this.http.post<DadosTokenJWT>(`${this.apiUrl}/login`, body).pipe(
      tap(res => {localStorage.setItem('token', res.token); this.authenticated.set(true)})
    );
  }

  logout(){
      localStorage.removeItem("token");
      this.authenticated.set(false);
  }
}
