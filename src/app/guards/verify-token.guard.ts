import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { VerifyTokenService } from "../services/verify-token.service";

export const verifyTokenGuard: CanActivateFn = (route, state) => {
  const vf = inject(VerifyTokenService);
  const router = inject(Router);
  const token = localStorage.getItem("token");
  console.log("verifyToken ...");
  if (!token) return false;

  const payload = vf.decode(token);
  if (!payload.exp || vf.expirado(payload.exp)) {
    router.navigate(["/login"]);
    return false;
  }
  return vf.verificaRenueva(payload.exp);
};
