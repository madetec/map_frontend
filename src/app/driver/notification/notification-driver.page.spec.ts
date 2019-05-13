import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDriverPage } from './notification-driver.page';

describe('NotificationDriverPage', () => {
  let component: NotificationDriverPage;
  let fixture: ComponentFixture<NotificationDriverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationDriverPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
