import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScraperService } from '../../services/scraper.service';

@Component({
  selector: 'app-scraper-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './scraper-dashboard.component.html',
  styleUrl: './scraper-dashboard.component.scss',
})
export class ScraperDashboardComponent {
  mfaCode = '';
  loading = false;
  scraping = false;
  logs: string[] = [];
  success = false;

  constructor(private scraper: ScraperService) {}

  async login() {
    if (!this.mfaCode.trim()) {
      alert('Please enter MFA code');
      return;
    }
    this.loading = true;
    this.logs.push('🔐 Logging in with MFA...');

    this.scraper.loginWithMFA(this.mfaCode).subscribe({
      next: () => {
        this.logs.push('✅ Login successful, session cookies refreshed.');
        this.loading = false;
      },
      error: (err) => {
        this.logs.push('❌ Login failed: ' + err.message);
        this.loading = false;
      },
    });
  }

  runScraper() {
    this.scraping = true;
    this.logs.push('🧩 Starting scraper for all records...');

    this.scraper.runAll().subscribe({
      next: (res) => {
        this.logs.push(
          `✅ Scraper completed successfully: ${JSON.stringify(res)}`
        );
        this.scraping = false;
        this.success = true;
      },
      error: (err) => {
        this.logs.push('❌ Scraper failed: ' + err.message);
        this.scraping = false;
      },
    });
  }
}
