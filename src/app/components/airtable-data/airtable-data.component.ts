import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AirtableService } from '../../services/airtable.service';

@Component({
  selector: 'app-airtable-data',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AgGridModule,
  ],
  templateUrl: './airtable-data.component.html',
  styleUrls: ['./airtable-data.component.scss'],
})
export class AirtableDataComponent implements OnInit {
  bases: any[] = [];
  tables: any[] = [];
  records: any[] = [];
  users: any[] = [];
  loading = false;
  errorMsg = '';

  activeTab = 'bases';

  baseCols: ColDef[] = [
    { headerName: 'Base ID', field: 'id', flex: 1, filter: true },
    { headerName: 'Name', field: 'name', flex: 1.5, filter: true },
    { headerName: 'Permission', field: 'permissionLevel', flex: 1 },
  ];

  tableCols: ColDef[] = [
    { headerName: 'Table ID', field: 'id', flex: 1, filter: true },
    { headerName: 'Name', field: 'name', flex: 1.5, filter: true },
    { headerName: 'Base ID', field: 'baseId', flex: 1 },
    { headerName: 'Primary Field', field: 'primaryFieldId', flex: 1.2 },
  ];

  recordCols: ColDef[] = [
    { headerName: 'Record ID', field: 'id', flex: 1, filter: true },
    { headerName: 'Base ID', field: 'baseId', flex: 1 },
    { headerName: 'Table ID', field: 'tableId', flex: 1 },
    {
      headerName: 'Created Time',
      field: 'createdTime',
      flex: 1.3,
      valueFormatter: (p) =>
        new Date(p.value).toLocaleString('en-CA', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
    },
  ];

  userCols: ColDef[] = [
    { headerName: 'User ID', field: 'id', flex: 1, filter: true },
    { headerName: 'Name', field: 'name', flex: 1.5, filter: true },
    { headerName: 'Email', field: 'email', flex: 1 },
  ];

  constructor(private airtable: AirtableService) {}

  ngOnInit() {
    this.loadFromDB();
  }

  loadFromDB() {
    this.loading = true;
    this.airtable.getAllFromDB().subscribe({
      next: (res: any) => {
        console.log(res);
        this.bases = res.bases || [];
        this.tables = res.tables || [];
        this.records = res.records || [];
        this.users = res.users || [];
        if (
          this.bases.length == 0 &&
          this.tables.length == 0 &&
          this.records.length == 0 &&
          this.users.length == 0
        )
          this.fetchAll();
        else this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cached data:', err);
        this.loading = false;
      },
    });
  }

  getTabIndex(tab: string): number {
    return ['bases', 'tables', 'records', 'users'].indexOf(tab);
  }

  onTabChange(index: number) {
    this.activeTab = ['bases', 'tables', 'records', 'users'][index];
  }

  fetchAll() {
    this.loading = true;
    this.errorMsg = '';
    this.bases = [];
    this.tables = [];
    this.records = [];
    this.users = [];

    this.airtable.fetchAll().subscribe({
      next: (res: any) => {
        console.log(res);
        this.bases = res?.bases || [];
        this.tables = res?.tables || [];
        this.records = res?.records || [];
        this.users = res?.users || [];
        console.log('Airtable data fetched:', res);
        this.loading = false;
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.errorMsg = 'Failed to fetch Airtable data.';
        this.loading = false;
      },
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
