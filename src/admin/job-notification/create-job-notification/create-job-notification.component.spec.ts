import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobNotificationComponent } from './create-job-notification.component';

describe('CreateJobNotificationComponent', () => {
  let component: CreateJobNotificationComponent;
  let fixture: ComponentFixture<CreateJobNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJobNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
