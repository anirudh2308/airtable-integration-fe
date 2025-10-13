import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AirtableService } from '../../services/airtable.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-airtable-data',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './airtable-data.component.html',
  styleUrl: './airtable-data.component.scss',
})
export class AirtableDataComponent {
  bases: any[] = [];
  tables: any[] = [];
  records: any[] = [];
  loading = false;
  errorMsg = '';

  constructor(private airtable: AirtableService) {}

  fetchAll() {
    this.loading = true;
    this.errorMsg = '';
    this.bases = [];
    this.tables = [];
    this.records = [];

    this.airtable.fetchAll().subscribe({
      next: (res: any) => {
        this.bases = res?.bases || [];
        this.tables = res?.tables || [];
        this.records = res?.records || [];
        console.log('✅ All Airtable data fetched:', res);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching all data:', err);
        this.errorMsg = 'Failed to fetch Airtable data.';
        this.loading = false;
      },
    });
  }
}
