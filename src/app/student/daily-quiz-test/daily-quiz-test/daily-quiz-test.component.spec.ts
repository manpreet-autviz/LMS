import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyQuizTestComponent } from './daily-quiz-test.component';

describe('DailyQuizTestComponent', () => {
  let component: DailyQuizTestComponent;
  let fixture: ComponentFixture<DailyQuizTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyQuizTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyQuizTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
