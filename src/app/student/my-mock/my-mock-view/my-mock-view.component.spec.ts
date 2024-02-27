import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMockViewComponent } from './my-mock-view.component';

describe('MyMockViewComponent', () => {
  let component: MyMockViewComponent;
  let fixture: ComponentFixture<MyMockViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyMockViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMockViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
