import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScraperService } from '../../services/scraper.service';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-scraper-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AgGridModule,
  ],
  templateUrl: './scraper-dashboard.component.html',
  styleUrls: ['./scraper-dashboard.component.scss'],
})
export class ScraperDashboardComponent implements OnInit, OnDestroy {
  mfaCode = '';
  loggedIn = false;
  running = false;
  finished = false;
  message = '';
  resultsCount = 0;
  hasPreviousData = false;
  rowData: any[] = [];
  private pollSub?: Subscription;

  colDefs: ColDef[] = [
    {
      headerName: 'Record ID',
      field: 'issueId',
      flex: 1,
      filter: true,
      resizable: true,
    },
    {
      headerName: 'Column Type',
      field: 'columnType',
      flex: 1,
      filter: true,
      resizable: true,
    },
    {
      headerName: 'Old Value',
      field: 'oldValue',
      flex: 1.5,
      filter: true,
      resizable: true,
    },
    {
      headerName: 'New Value',
      field: 'newValue',
      flex: 1.5,
      filter: true,
      resizable: true,
    },
    {
      headerName: 'Author',
      field: 'authoredBy',
      flex: 1,
      filter: true,
      resizable: true,
    },
    {
      headerName: 'Date',
      field: 'createdDate',
      flex: 1,
      valueFormatter: (p) =>
        new Date(p.value).toLocaleString('en-CA', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
    },
  ];

  constructor(private scraper: ScraperService) {}

  ngOnInit() {
    this.initScraperState();
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  private initScraperState() {
    this.scraper.checkStatus().subscribe({
      next: (res: any) => {
        if (res.loggedIn) {
          this.loggedIn = true;
          this.message = 'Logged in successfully.';
          this.checkExistingData();
        } else {
          this.startLoginPolling();
        }
      },
      error: () => {
        this.message = 'Could not check login status.';
      },
    });
  }

  private startLoginPolling() {
    this.message = 'Waiting for login session to be ready...';
    this.pollSub?.unsubscribe();
    this.pollSub = interval(4000).subscribe(() => {
      this.scraper.checkStatus().subscribe((res: any) => {
        if (res.loggedIn) {
          this.loggedIn = true;
          this.message = 'Logged in successfully.';
          this.pollSub?.unsubscribe();
          this.checkExistingData();
        }
      });
    });
  }

  login() {
    if (!this.mfaCode.trim()) return;
    this.message = 'Logging in...';
    this.scraper.loginWithMFA(this.mfaCode).subscribe({
      next: () => {
        this.message = 'MFA submitted. Waiting for login to complete...';
        this.startLoginPolling();
      },
      error: () => (this.message = 'Login failed. Try again.'),
    });
  }

  private checkExistingData() {
    this.scraper.getAllResults().subscribe({
      next: (res: any) => {
        if (res.count > 0) {
          this.hasPreviousData = true;
          this.resultsCount = res.count;
          this.message = `Found ${res.count} previously scraped records.`;
          console.log(res.data);
          this.rowData = res.data
            ? res.data.flatMap((entry: any) =>
                (entry.data || []).map((d: any) => ({
                  ...d,
                  recordId: entry.recordId,
                  oldValue: d.oldValue ? d.oldValue : 'NULL',
                  newValue: d.newValue ? d.newValue : 'NULL',
                }))
              )
            : [];
          console.log(this.rowData);
          this.finished = true;
        } else {
          this.hasPreviousData = false;
          this.message = 'No scraped data found. You can run the scraper.';
        }
      },
      error: () => {
        this.message = 'Could not check previous scraper data.';
      },
    });
  }

  runScraper() {
    if (this.hasPreviousData) {
      this.message = `Using ${this.resultsCount} existing records.`;
      this.finished = true;
      return;
    }

    this.message = 'Running scraper...';
    this.running = true;
    this.finished = false;

    this.scraper.runAll().subscribe({
      next: () => {
        this.message = 'Scraper started...';
        this.pollProgress();
      },
      error: (err) => {
        this.running = false;
        this.message = 'Scraper failed: ' + err.message;
      },
    });
  }

  private pollProgress() {
    this.pollSub?.unsubscribe();
    this.pollSub = interval(5000).subscribe(() => {
      this.scraper.checkProgress().subscribe((res: any) => {
        if (!res.running) {
          this.running = false;
          this.finished = true;
          this.message = `${res.summary?.message || 'Scraper finished.'}`;
          this.pollSub?.unsubscribe();
          this.fetchResults();
        } else {
          this.message = 'Scraper still running...';
        }
      });
    });
  }

  private fetchResults() {
    this.scraper.getAllResults().subscribe({
      next: (res: any) => {
        this.resultsCount = res.count || 0;
        this.hasPreviousData = this.resultsCount > 0;
        console.log(this.rowData);
        this.rowData = res.data
          ? res.data.flatMap((entry: any) =>
              (entry.data || []).map((d: any) => ({
                ...d,
                recordId: entry.recordId,
                oldValue: d.oldValue ? d.oldValue : 'NULL',
                newValue: d.newValue ? d.newValue : 'NULL',
              }))
            )
          : [];
        console.log(this.rowData);
        this.message = `Scraper done — ${res.count} results fetched.`;
      },
      error: (err) => {
        this.message = 'Failed to load results: ' + err.message;
      },
    });
  }
}
