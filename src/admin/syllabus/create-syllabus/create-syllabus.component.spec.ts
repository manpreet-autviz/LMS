import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSyllabusComponent } from './create-syllabus.component';

describe('CreateSyllabusComponent', () => {
  let component: CreateSyllabusComponent;
  let fixture: ComponentFixture<CreateSyllabusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSyllabusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
