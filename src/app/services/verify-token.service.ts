import { Injectable, inject } from "@angular/core";
import { AuthService } from "../auth/services/auth.service";

@Injectable({
  providedIn: "root"
})
export class VerifyTokenService {
  private authService = inject(AuthService);
  decode(token: string) {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  expirado(fechaExp: number) {
    let ahora = new Date().getTime() / 1000;
    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let tokenExp = new Date(fechaExp * 1000);
      let ahora = new Date();
      ahora.setTime(ahora.getTime() + 10 * 60 * 60 * 1000);
      // ahora.setTime(ahora.getTime() + 10  * 60 * 1000);
      console.log("tokenExp ", tokenExp);
      console.log("ahora", ahora);

      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        this.authService.checkAuthStatus().subscribe({
          next: () => resolve(true),
          error: () =>  reject(false)
        });
      }
    });
  }
}
