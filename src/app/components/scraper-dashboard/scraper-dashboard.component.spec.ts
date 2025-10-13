import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScraperDashboardComponent } from './scraper-dashboard.component';

describe('ScraperDashboardComponent', () => {
  let component: ScraperDashboardComponent;
  let fixture: ComponentFixture<ScraperDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScraperDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScraperDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
