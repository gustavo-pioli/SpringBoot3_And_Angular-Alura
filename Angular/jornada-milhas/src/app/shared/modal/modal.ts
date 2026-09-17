import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-modal',
  imports: [MatDialogModule, MatChipsModule, MatButtonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {}
