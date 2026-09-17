import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDepoimento } from './card-depoimento';

describe('CardDepoimento', () => {
  let component: CardDepoimento;
  let fixture: ComponentFixture<CardDepoimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDepoimento],
    }).compileComponents();

    fixture = TestBed.createComponent(CardDepoimento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
