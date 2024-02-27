import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QutionsComponent } from './qutions.component';

describe('QutionsComponent', () => {
  let component: QutionsComponent;
  let fixture: ComponentFixture<QutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
