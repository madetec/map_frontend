import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveModalPage } from './active-modal.page';

describe('ActiveModalPage', () => {
  let component: ActiveModalPage;
  let fixture: ComponentFixture<ActiveModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
