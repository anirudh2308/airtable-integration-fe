import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { ConnectionStateService } from '../../services/connection-state.service';

@Component({
  selector: 'app-airtable-auth',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './airtable-auth.component.html',
  styleUrl: './airtable-auth.component.scss',
})
export class AirtableAuthComponent implements OnInit {
  isConnected = false;
  loading = false;

  constructor(
    private auth: AuthService,
    private state: ConnectionStateService
  ) {}

  ngOnInit() {
    this.checkStatus();
  }

  connect() {
    const popup = this.auth.openOAuth();
    if (!popup) return;

    this.loading = true;

    const listener = (event: MessageEvent) => {
      if (event.data === 'oauth-success') {
        console.log('✅ OAuth completed');
        popup.close();
        window.removeEventListener('message', listener);
        this.checkStatus();
      }
    };

    window.addEventListener('message', listener);
  }

  checkStatus() {
    this.auth
      .getStatus()
      .pipe(
        catchError((err) => {
          console.error('Failed to check status:', err);
          this.isConnected = false;
          this.state.setConnected(false);
          return of(null);
        })
      )
      .subscribe((res: any) => {
        const connected = !!res?.connected;
        this.isConnected = connected;
        this.state.setConnected(connected);
        this.loading = false;
      });
  }
}
