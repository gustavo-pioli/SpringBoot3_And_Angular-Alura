import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Card } from '../card/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-form-busca',
  imports: [
    MatButtonToggleModule,
    Card,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './form-busca.html',
  styleUrl: './form-busca.css',
})
export class FormBusca {
  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(Modal);
  }
}
