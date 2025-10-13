import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtableDataComponent } from './airtable-data.component';

describe('AirtableDataComponent', () => {
  let component: AirtableDataComponent;
  let fixture: ComponentFixture<AirtableDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirtableDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirtableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
