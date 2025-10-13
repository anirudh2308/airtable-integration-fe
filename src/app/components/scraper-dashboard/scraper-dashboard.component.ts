import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ScraperService } from '../../services/scraper.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scraper-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './scraper-dashboard.component.html',
  styleUrl: './scraper-dashboard.component.scss',
})
export class ScraperDashboardComponent {
  mfaCode = '';
  logs: string[] = [];
  loading = false;

  constructor(private scraper: ScraperService) {}

  private log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.unshift(`${timestamp} — ${message}`);
  }

  login() {
    if (!this.mfaCode.trim()) {
      this.log('⚠️ MFA code required');
      return;
    }

    this.loading = true;
    this.log('Attempting MFA login...');
    this.scraper.loginWithMFA(this.mfaCode).subscribe({
      next: () => {
        this.log('✅ MFA login successful');
        this.loading = false;
      },
      error: (err) => {
        this.log(`❌ MFA login failed: ${err.message}`);
        this.loading = false;
      },
    });
  }

  runAll() {
    this.loading = true;
    this.log('🚀 Running scraper...');
    this.scraper.runAll().subscribe({
      next: () => {
        this.log('✅ Scraper completed successfully');
        this.loading = false;
      },
      error: (err) => {
        this.log(`❌ Scraper failed: ${err.message}`);
        this.loading = false;
      },
    });
  }

  checkCookies() {
    this.loading = true;
    this.scraper.checkCookies().subscribe({
      next: (res) => {
        this.log(`🍪 Cookies valid: ${JSON.stringify(res)}`);
        this.loading = false;
      },
      error: (err) => {
        this.log(`❌ Cookie check failed: ${err.message}`);
        this.loading = false;
      },
    });
  }
}
