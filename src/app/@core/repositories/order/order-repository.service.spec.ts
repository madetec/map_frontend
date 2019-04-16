import { TestBed } from '@angular/core/testing';

import { OrderRepositoryService } from './order-repository.service';

describe('OrderRepositoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderRepositoryService = TestBed.get(OrderRepositoryService);
    expect(service).toBeTruthy();
  });
});
