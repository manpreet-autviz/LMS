import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlogResultComponent } from './view-blog-result.component';

describe('ViewBlogResultComponent', () => {
  let component: ViewBlogResultComponent;
  let fixture: ComponentFixture<ViewBlogResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBlogResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBlogResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
