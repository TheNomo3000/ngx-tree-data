import { TestBed } from '@angular/core/testing';

import { NgxTreeDataService } from './ngx-tree-data.service';

describe('NgxTreeDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxTreeDataService = TestBed.get(NgxTreeDataService);
    expect(service).toBeTruthy();
  });
});
