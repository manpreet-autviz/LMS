import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMocktestComponent } from './create-mocktest.component';

describe('CreateMocktestComponent', () => {
  let component: CreateMocktestComponent;
  let fixture: ComponentFixture<CreateMocktestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMocktestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMocktestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
