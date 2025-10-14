import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { ConnectionStateService } from '../../services/connection-state.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-airtable-auth',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './airtable-auth.component.html',
  styleUrl: './airtable-auth.component.scss',
})
export class AirtableAuthComponent implements OnInit {
  isConnected = false;
  loading = false;

  constructor(
    private auth: AuthService,
    private state: ConnectionStateService,
    private router: Router,
    private route: ActivatedRoute
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
        console.log('OAuth completed');
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
        const valid = !!res?.tokenValid;
        this.isConnected = connected && valid;
        this.state.setConnected(connected && valid);
        this.loading = false;

        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        if (this.isConnected && redirect) {
          this.router.navigateByUrl(redirect);
        }
      });
  }
}
