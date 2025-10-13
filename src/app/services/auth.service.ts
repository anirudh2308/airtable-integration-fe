import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}
  baseUrl = `${environment.apiBaseUrl}/auth`;

  openOAuth(): Window | null {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    return window.open(
      `${this.baseUrl}/login`,
      'Airtable OAuth',
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes,status=1`
    );
  }

  getStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/status`);
  }
}
