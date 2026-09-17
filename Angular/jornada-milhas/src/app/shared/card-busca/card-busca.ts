import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DadosListagemMedico } from '../../../types/type';


@Component({
  selector: 'app-card-busca',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './card-busca.html',
  styleUrl: './card-busca.css',
})
export class CardBusca {
  @Input() medicos!: DadosListagemMedico
}
