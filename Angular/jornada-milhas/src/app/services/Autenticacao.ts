import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DadosAutenticacao, DadosTokenJWT } from '../../types/type';
import { Observable, map, tap } from 'rxjs';
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
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken); 
        this.authenticated.set(true)
      })
    );
  }

  logout(){
    const refreshToken = localStorage.getItem("refreshToken");
    this.http.post(`${this.apiUrl}/login/logout`, {refreshToken}).subscribe({
      complete: () => this.limparSessaoLocal(),
      error: () => this.limparSessaoLocal(),
    })
  }

  renovarToken(): Observable<string>{
    const refreshToken = localStorage.getItem("refreshToken");
    return this.http.post<DadosTokenJWT>(`${this.apiUrl}/login/refresh`, { refreshToken }).pipe(
      tap(res => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);
      }),
      map(res => res.token),
    );
  }

  private limparSessaoLocal(){
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.authenticated.set(false);
  }
}
