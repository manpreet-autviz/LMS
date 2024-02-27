import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQutionsComponent } from './add-qutions.component';

describe('AddQutionsComponent', () => {
  let component: AddQutionsComponent;
  let fixture: ComponentFixture<AddQutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
