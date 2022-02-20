import { TestBed } from '@angular/core/testing';

import { TurnsCalculatorService } from './turns-calculator.service';

describe('TurnsCalculatorService', () => {
  let service: TurnsCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurnsCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
