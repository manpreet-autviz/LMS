import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobNotificationComponent } from './edit-job-notification.component';

describe('EditJobNotificationComponent', () => {
  let component: EditJobNotificationComponent;
  let fixture: ComponentFixture<EditJobNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditJobNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJobNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
