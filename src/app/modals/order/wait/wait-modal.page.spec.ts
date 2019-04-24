import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitModalPage } from './wait-modal.page';

describe('WaitModalPage', () => {
  let component: WaitModalPage;
  let fixture: ComponentFixture<WaitModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
