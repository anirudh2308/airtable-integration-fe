import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtableAuthComponent } from './airtable-auth.component';

describe('AirtableAuthComponent', () => {
  let component: AirtableAuthComponent;
  let fixture: ComponentFixture<AirtableAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirtableAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirtableAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
