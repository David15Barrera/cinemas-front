import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { catchError, map, of, tap, take } from 'rxjs';
import { CinemaService } from '../services/cinema.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { AlertStore } from 'app/store/alert.store';

export const hasCinemaGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cinemaService = inject(CinemaService);
  const localStorageService = inject(LocalStorageService);
  const alertStore = inject(AlertStore);

  const session = localStorageService.getState().session;

  // Si no hay sesión, redirigir al login
  if (!session || !session.id) {
    router.navigate(['/session/login']);
    return of(false);
  }

  return cinemaService.getCinemaByAdminUserId(session.id).pipe(
    take(1),
    tap((cinema) => {
      if (!cinema || cinema.adminUserId !== session.id) {
        if (state.url !== '/cinema/global-settings') {
          router.navigate(['/cinema/global-settings']);
          alertStore.addAlert({
            message: `Por favor, primero debe crear un cine para administrar.`,
            type: 'info',
          });
        }
      }
    }),
    map((cinema) => !!cinema && cinema.adminUserId === session.id),
    catchError(() => {
      if (state.url !== '/cinema/global-settings') {
        router.navigate(['/cinema/global-settings']);
        alertStore.addAlert({
          message: `Por favor, primero debe crear un cine para administrar.`,
          type: 'info',
        });
      }
      return of(false);
    })
  );
};
