import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTreeDataComponent } from './ngx-tree-data.component';

describe('NgxTreeDataComponent', () => {
  let component: NgxTreeDataComponent;
  let fixture: ComponentFixture<NgxTreeDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxTreeDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxTreeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
