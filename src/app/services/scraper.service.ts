import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ScraperService {
  private baseUrl = `${environment.apiBaseUrl}/scraper`;

  constructor(private http: HttpClient) {}

  loginWithMFA(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { code });
  }

  runAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/run-all`);
  }

  checkCookies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/check-cookies`);
  }
}
