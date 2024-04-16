import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

import { navbarData } from '../layout/sidebar/side-data';
export const roleGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.currentUser()?.rol;
  const currentPath = `/${segments.join('/')}`;
  console.log(currentPath)
  console.log('Can Match');
     console.log({ route, segments })// routes.path =>clientes
     console.log({ userRole }) //=> vendedor/admin

     const matchingNavItem = navbarData.find(item => {
      const itemPath = `/${item.routeLink}`;// Construye la ruta a partir del elemento navData
      return currentPath.startsWith(itemPath); // Comprobar si la ruta actual comienza con la ruta del elemento navData
    });

    if (!matchingNavItem) {
     // Ruta no coincidente (ruta potencialmente no controlada)
      console.warn(`Route not found in navData: ${currentPath}`);
      return true; // Permitir el acceso por ahora (considere manejar rutas no coincidentes por seguridad)
    }

// Comprobar si el rol del usuario tiene permiso para acceder a la ruta (si los roles están definidos)
  if (matchingNavItem.rol?.some(allowedRole => allowedRole === userRole)) {
    return true; // El usuario tiene permiso
  }

  console.warn(`Acceso no autorizado: Ruta: ${currentPath}, Rol de usuario: ${userRole}`);
  router.navigateByUrl('/dashboard'); // Redireccionar a la página de error
  return false;

};
