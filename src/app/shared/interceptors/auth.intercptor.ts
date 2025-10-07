import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '@shared/services/local-storage.service';

const excludedUrls: string[] = ['/auth-identity/v1/auth'];

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const localStorageService = inject(LocalStorageService);
  const shouldSkip = excludedUrls.some((url) => req.url.includes(url));

  if (shouldSkip) {
    return next(req);
  }

  let session = localStorageService.getState().session;

  if (!session.token) {
    return next(req);
  }

  const reqWithHeaders = req.clone({
    setHeaders: {
      Authorization: `Bearer ${session.token}`,
    },
  });
  return next(reqWithHeaders);
};
