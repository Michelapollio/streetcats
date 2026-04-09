import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColonyCard } from './colony-card';

describe('ColonyCard', () => {
  let component: ColonyCard;
  let fixture: ComponentFixture<ColonyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColonyCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ColonyCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
