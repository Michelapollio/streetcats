import { TestBed } from '@angular/core/testing';

import { Cats } from './cats';

describe('Cats', () => {
  let service: Cats;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cats);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
