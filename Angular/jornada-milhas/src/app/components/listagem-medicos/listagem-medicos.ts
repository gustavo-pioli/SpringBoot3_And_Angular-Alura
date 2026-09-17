import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { DadosListagemMedico } from '../../../types/type';
import { Medicos } from '../../services/medicos';
import { CardBusca } from '../../shared/card-busca/card-busca';
import { MatButtonModule } from '@angular/material/button';
import { Autenticacao } from '../../services/Autenticacao';

@Component({
  selector: 'app-listagem-medicos',
  imports: [CardBusca, MatButtonModule],
  templateUrl: './listagem-medicos.html',
  styleUrl: './listagem-medicos.css',
})
export class ListagemMedicos {

  medicos = signal<DadosListagemMedico[]>([]);
  readonly service = inject(Medicos);
  readonly auth = inject(Autenticacao)

  constructor(){
    effect(() => {
      if(!this.auth.authenticated()){
        this.medicos.set([]);
      }
    })
  }

  buscar(): void {
    this.service.listar().subscribe(
      res => {
        this.medicos.set(res.content);
      }
    )
  }


  // ngOnInit(): void {
  //   this.service.listar().subscribe(
  //     res => {
  //       this.medicos = res.content;
  //     }
  //   )
  // }
}
