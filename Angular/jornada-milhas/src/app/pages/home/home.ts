import { Component } from '@angular/core';
import { Banner } from '../../shared/banner/banner';
import { Container } from '../../shared/container/container';
import { CardDepoimento } from '../../shared/card-depoimento/card-depoimento';
import { FormBusca } from '../../shared/form-busca/form-busca';
import { ListagemMedicos } from '../../components/listagem-medicos/listagem-medicos';

@Component({
  selector: 'app-home',
  imports: [Banner, Container, CardDepoimento, FormBusca, ListagemMedicos],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
