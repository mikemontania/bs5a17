import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../auth/interfaces/auth-status.enum';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('authGuard')
  console.log(state.url)
  const authService = inject(AuthService);


  if (authService.authStatus() === AuthStatus.checking) {
    return false;
  }

  if (authService.authStatus() === AuthStatus.notAuthenticated) {
    const router = inject(Router);
    router.navigateByUrl('/login');
    return false;
  }
  if (state.url !== '/') {
    // Guarda la ruta actual en el localStorage
    localStorage.setItem('app-path', state.url);
  }
  return true;
};
