import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addcat } from './addcat';

describe('Addcat', () => {
  let component: Addcat;
  let fixture: ComponentFixture<Addcat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addcat],
    }).compileComponents();

    fixture = TestBed.createComponent(Addcat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
