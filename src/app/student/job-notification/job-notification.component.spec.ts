import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobNotificationComponent } from './job-notification.component';

describe('JobNotificationComponent', () => {
  let component: JobNotificationComponent;
  let fixture: ComponentFixture<JobNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
