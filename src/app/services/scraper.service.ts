import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScraperService {
  baseUrl = 'http://localhost:3000/api/scraper';

  constructor(private http: HttpClient) {}

  loginWithMFA(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login?code=${code}`, {});
  }

  checkStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/status`);
  }

  runAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/run-all`);
  }

  checkProgress(): Observable<any> {
    return this.http.get(`${this.baseUrl}/progress`);
  }

  getAllResults(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }
}
