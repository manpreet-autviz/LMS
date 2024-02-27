import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartfreeTrialComponent } from './startfree-trial.component';

describe('StartfreeTrialComponent', () => {
  let component: StartfreeTrialComponent;
  let fixture: ComponentFixture<StartfreeTrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartfreeTrialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartfreeTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
