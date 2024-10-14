import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isInitialized) {
    return new Promise<boolean | UrlTree>((resolve) => {
      authService.initialize().then(() => {
        if (authService.isAuthenticated()) {
          resolve(true);
        } else {
          resolve(router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }));
        }
      });
    });
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};





