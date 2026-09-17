import { Component, inject } from '@angular/core';
import { Autenticacao } from '../../services/Autenticacao';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    MatDialogModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private service = inject(Autenticacao);
  private dialogRef = inject(MatDialogRef<Login>)
  private fb = inject(FormBuilder);
  public form = this.fb.nonNullable.group({
    login: ["", [Validators.required, Validators.email]],
    senha: ["", Validators.required]
  })

  public errorMessage = "";

  entrar() {
    if(this.form.invalid){
      return;
    }

    this.service.login(this.form.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.errorMessage = `Erro` 
    })
  }

}
