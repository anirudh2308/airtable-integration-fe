import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './services/auth.service';
import { ConnectionStateService } from './services/connection-state.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, of } from 'rxjs';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const snack = inject(MatSnackBar);
  const auth = inject(AuthService);
  const conn = inject(ConnectionStateService);

  return auth.checkConnection().pipe(
    map((res: any) => {
      const connected = res?.connected;
      const tokenValid = res?.tokenValid;

      if (connected && tokenValid) {
        conn.setConnected(true);
        return true;
      }

      conn.setConnected(false);

      const msg = connected
        ? 'Airtable token expired — please reconnect.'
        : 'Not connected to Airtable.';
      snack.open(msg, 'OK', { duration: 4000, panelClass: ['snack-error'] });

      router.navigate(['/auth'], {
        queryParams: { redirect: state.url },
      });

      return false;
    }),
    catchError(() => {
      conn.setConnected(false);
      snack.open('Unable to verify Airtable connection.', 'OK', {
        duration: 4000,
        panelClass: ['snack-error'],
      });
      router.navigate(['/auth']);
      return of(false);
    })
  );
};
