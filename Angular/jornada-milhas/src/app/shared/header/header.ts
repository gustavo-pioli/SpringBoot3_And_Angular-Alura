import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Login } from '../../components/login/login';
import { MatDialog } from '@angular/material/dialog';
import { Autenticacao } from '../../services/Autenticacao';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly dialog = inject(MatDialog)
  readonly auth = inject(Autenticacao)

  entrarOuSair(){
    if(this.auth.authenticated()){
      this.auth.logout();
    } else {
      this.dialog.open(Login)
    }
  }
}
