import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AirtableService {
  private baseUrl = `${environment.apiBaseUrl}/airtable`;

  constructor(private http: HttpClient) {}

  fetchAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/fetch-all`);
  }
}
