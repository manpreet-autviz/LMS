import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQutionsComponent } from './edit-qutions.component';

describe('EditQutionsComponent', () => {
  let component: EditQutionsComponent;
  let fixture: ComponentFixture<EditQutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditQutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
