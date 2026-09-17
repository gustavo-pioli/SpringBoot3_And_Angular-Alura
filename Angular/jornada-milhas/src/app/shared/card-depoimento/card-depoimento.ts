import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card-depoimento',
  imports: [MatCardModule],
  templateUrl: './card-depoimento.html',
  styleUrl: './card-depoimento.css',
})
export class CardDepoimento {
  depoimento: string = `
    Recomendo fortemente a agência de viagens Jornada.
    Eles oferecem um serviço personalizado e de alta qualidade
    que excedeu minhas expectativas em minha última viagem.
  `
  autoria: string = 'Mariana Faustino'
}
