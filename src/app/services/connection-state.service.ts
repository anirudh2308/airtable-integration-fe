import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectionStateService {
  private connectedSource = new BehaviorSubject<boolean>(this.loadState());
  connected$ = this.connectedSource.asObservable();

  private loadState(): boolean {
    return localStorage.getItem('airtableConnected') === 'true';
  }

  setConnected(value: boolean) {
    this.connectedSource.next(value);
    localStorage.setItem('airtableConnected', String(value));
  }

  isConnected(): boolean {
    return this.connectedSource.value;
  }

  clearConnection() {
    this.connectedSource.next(false);
    localStorage.removeItem('airtableConnected');
  }
}
