import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInstruction2Component } from './general-instruction2.component';

describe('GeneralInstruction2Component', () => {
  let component: GeneralInstruction2Component;
  let fixture: ComponentFixture<GeneralInstruction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralInstruction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInstruction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
