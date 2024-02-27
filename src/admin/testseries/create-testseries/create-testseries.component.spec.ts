import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestseriesComponent } from './create-testseries.component';

describe('CreateTestseriesComponent', () => {
  let component: CreateTestseriesComponent;
  let fixture: ComponentFixture<CreateTestseriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTestseriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
