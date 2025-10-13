import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectionStateService {
  private connectedSource = new BehaviorSubject<boolean>(false);
  connected$ = this.connectedSource.asObservable();

  setConnected(value: boolean) {
    this.connectedSource.next(value);
  }

  isConnected(): boolean {
    return this.connectedSource.value;
  }
}
