import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInstructionsComponent } from './general-instructions.component';

describe('GeneralInstructionsComponent', () => {
  let component: GeneralInstructionsComponent;
  let fixture: ComponentFixture<GeneralInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralInstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
