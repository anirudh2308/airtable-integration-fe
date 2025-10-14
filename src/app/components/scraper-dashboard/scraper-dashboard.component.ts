import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
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
    MatSnackBarModule,
    AgGridModule,
    MatIconModule,
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
    { headerName: 'Record ID', field: 'issueId', flex: 1, filter: true },
    { headerName: 'Column Type', field: 'columnType', flex: 1, filter: true },
    { headerName: 'Old Value', field: 'oldValue', flex: 1.5, filter: true },
    { headerName: 'New Value', field: 'newValue', flex: 1.5, filter: true },
    { headerName: 'Author', field: 'authoredBy', flex: 1, filter: true },
    {
      headerName: 'Date',
      field: 'createdDate',
      flex: 1.2,
      valueFormatter: (p) =>
        new Date(p.value).toLocaleString('en-CA', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
    },
  ];

  constructor(private scraper: ScraperService, private snack: MatSnackBar) {}

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
          this.loggedIn = false;
          this.message = 'Session invalid or expired.';
          this.snack.open(
            'Session invalid or expired. Please log in using MFA.',
            'Dismiss',
            { duration: 4000 }
          );
        }
      },
      error: () => {
        this.message = 'Could not check login status.';
        this.snack.open('Could not reach scraper service.', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  login() {
    if (!this.mfaCode.trim()) return;
    this.message = 'Submitting MFA...';
    this.scraper.loginWithMFA(this.mfaCode).subscribe({
      next: () => {
        this.message = 'MFA submitted. Waiting for login to complete...';
        this.snack.open('MFA submitted successfully!', 'OK', {
          duration: 3000,
        });
        this.startLoginPolling();
      },
      error: () => {
        this.message = 'Login failed. Try again.';
        this.snack.open('Login failed. Please retry.', 'Dismiss', {
          duration: 4000,
        });
      },
    });
  }

  private startLoginPolling() {
    this.pollSub?.unsubscribe();
    this.pollSub = interval(4000).subscribe(() => {
      this.scraper.checkStatus().subscribe((res: any) => {
        if (res.loggedIn) {
          this.loggedIn = true;
          this.snack.open('Login successful! Session active.', 'OK', {
            duration: 3000,
          });
          this.pollSub?.unsubscribe();
          this.checkExistingData();
        }
      });
    });
  }

  private checkExistingData() {
    this.scraper.getAllResults().subscribe({
      next: (res: any) => {
        if (res.count > 0) {
          this.hasPreviousData = true;
          this.resultsCount = res.count;
          this.message = `Found ${res.count} previously scraped records.`;
          this.rowData = this.flattenScraperData(res.data);
          this.finished = true;
          console.log('Table ready from DB cache');
        } else {
          this.hasPreviousData = false;
          this.finished = false;
          this.message = 'No scraped data found. You can run the scraper.';
        }
      },
      error: () => {
        this.message = 'Could not check previous scraper data.';
      },
    });
  }

  private flattenScraperData(data: any[]): any[] {
    return data
      ? data.flatMap((entry: any) =>
          (entry.data || []).map((d: any) => ({
            ...d,
            recordId: entry.recordId,
            oldValue: d.oldValue || 'NULL',
            newValue: d.newValue || 'NULL',
          }))
        )
      : [];
  }

  runScraper() {
    this.message = 'Starting scraper...';
    this.running = true;
    this.finished = false;
    this.snack.open('Scraper started!', 'OK', { duration: 2000 });

    this.scraper.runAll().subscribe({
      next: () => this.pollProgress(),
      error: (err) => {
        this.running = false;
        this.message = 'Scraper failed: ' + err.message;
        this.snack.open('Scraper failed. Check console.', 'Dismiss', {
          duration: 4000,
        });
      },
    });
  }

  reRunScraper() {
    this.hasPreviousData = false;
    this.rowData = [];
    this.runScraper();
  }

  private pollProgress() {
    this.pollSub?.unsubscribe();
    this.pollSub = interval(5000).subscribe(() => {
      this.scraper.checkProgress().subscribe((res: any) => {
        if (!res.running) {
          this.running = false;
          this.finished = true;
          this.message = `${res.summary?.message || 'Scraper finished.'}`;
          this.snack.open('Scraper finished successfully!', 'OK', {
            duration: 3000,
          });
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
        this.rowData = this.flattenScraperData(res.data);
        this.message = `Scraper done — ${res.count} results fetched.`;
      },
      error: (err) => {
        this.message = 'Failed to load results: ' + err.message;
      },
    });
  }
}
