import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditstudentprofileComponent } from './editstudentprofile.component';

describe('EditstudentprofileComponent', () => {
  let component: EditstudentprofileComponent;
  let fixture: ComponentFixture<EditstudentprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditstudentprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditstudentprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
