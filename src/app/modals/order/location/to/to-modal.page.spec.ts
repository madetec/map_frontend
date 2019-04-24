import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToModalPage } from './to-modal.page';

describe('ToModalPage', () => {
  let component: ToModalPage;
  let fixture: ComponentFixture<ToModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
