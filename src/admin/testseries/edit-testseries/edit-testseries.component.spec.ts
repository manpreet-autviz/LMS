import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTestseriesComponent } from './edit-testseries.component';

describe('EditTestseriesComponent', () => {
  let component: EditTestseriesComponent;
  let fixture: ComponentFixture<EditTestseriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTestseriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTestseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
