import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveClassStudentComponent } from './live-class-student.component';

describe('LiveClassStudentComponent', () => {
  let component: LiveClassStudentComponent;
  let fixture: ComponentFixture<LiveClassStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveClassStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveClassStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
