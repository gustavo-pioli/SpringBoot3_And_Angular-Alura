import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Container } from '../../shared/container/container';
import { MedicoTabela } from '../../components/medico-tabela/medico-tabela';
import { PacienteTabela } from '../../components/paciente-tabela/paciente-tabela';
import { ConsultaTabela } from '../../components/consulta-tabela/consulta-tabela';

@Component({
  selector: 'app-gerenciamento',
  imports: [MatTabsModule, Container, MedicoTabela, PacienteTabela, ConsultaTabela],
  templateUrl: './gerenciamento.html',
  styleUrl: './gerenciamento.css',
})
export class Gerenciamento {}
