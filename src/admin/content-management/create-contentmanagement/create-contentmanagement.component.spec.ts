import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContentmanagementComponent } from './create-contentmanagement.component';

describe('CreateContentmanagementComponent', () => {
  let component: CreateContentmanagementComponent;
  let fixture: ComponentFixture<CreateContentmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateContentmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContentmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
