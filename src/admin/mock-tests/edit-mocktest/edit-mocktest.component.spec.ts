import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMocktestComponent } from './edit-mocktest.component';

describe('EditMocktestComponent', () => {
  let component: EditMocktestComponent;
  let fixture: ComponentFixture<EditMocktestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMocktestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMocktestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
