import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemMedicos } from './listagem-medicos';

describe('ListagemMedicos', () => {
  let component: ListagemMedicos;
  let fixture: ComponentFixture<ListagemMedicos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemMedicos],
    }).compileComponents();

    fixture = TestBed.createComponent(ListagemMedicos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
