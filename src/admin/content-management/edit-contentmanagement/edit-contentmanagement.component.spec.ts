import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContentmanagementComponent } from './edit-contentmanagement.component';

describe('EditContentmanagementComponent', () => {
  let component: EditContentmanagementComponent;
  let fixture: ComponentFixture<EditContentmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditContentmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContentmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
