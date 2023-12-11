import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStatus } from "../auth/interfaces/auth-status.enum";
import { AuthService } from "../auth/services/auth.service";
export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus() === AuthStatus.authenticated) return true;

  router.navigateByUrl("/login");
  return false;
};
