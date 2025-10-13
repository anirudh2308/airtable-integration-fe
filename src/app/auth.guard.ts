import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ConnectionStateService } from './services/connection-state.service';

export const AuthGuard: CanActivateFn = () => {
  const state = inject(ConnectionStateService);
  const router = inject(Router);

  if (!state.isConnected()) {
    router.navigate(['/auth']);
    return false;
  }
  return true;
};
