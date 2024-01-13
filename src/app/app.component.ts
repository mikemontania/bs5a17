import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { AuthService } from './auth/services/auth.service';

// @Component: Decorador para definir el componente AppComponent
@Component({
  selector: 'app-root', // Selector del componente
  standalone: true,
  imports: [CommonModule, RouterOutlet, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  // Inyección de servicios
  private authService = inject(AuthService);
  private router = inject(Router);

  // Propiedades para la ruta actual y la ruta almacenada
  path = '';
  storedPath: string | null = ''; // Se inicializa con valor vacío

  // Propiedad computada para indicar si la comprobación de autenticación ha finalizado
  public finishedAuthCheck = computed<boolean>(() => {
    console.log('finishedAuthCheck');
    console.log(this.authService.authStatus());
    return this.authService.authStatus() !== AuthStatus.checking;
  });

  // Efecto para reaccionar a cambios en el estado de autenticación
  public authStatusChangedEffect = effect(() =>
  {
    console.log('efecto');
    console.log(this.authService.authStatus());
    switch (this.authService.authStatus()) {
      case AuthStatus.checking:
        return; // No se realizan acciones mientras se verifica la autenticación
      case AuthStatus.authenticated:
        if (this.storedPath) {
          this.router.navigateByUrl(this.storedPath);
        } else {
          // Redirigir a la ruta predeterminada para usuarios autenticados
          this.router.navigateByUrl('/dashboard'); // Ejemplo
        }
        return; // El guard se encarga de las redirecciones en este caso
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/login'); // Redirige al login si no está autenticado
        return;
    }
  });

  // Constructor del componente
  constructor() {
    this.path = this.router.url; // Asigna la ruta actual
    this.storedPath = localStorage.getItem('app-path'); // Obtiene la ruta almacenada
  }

  // ngOnInit: Se ejecuta al iniciar el componente
  ngOnInit() {
    if (this.storedPath && this.authService.authStatus() === AuthStatus.authenticated) {
      this.router.navigateByUrl(this.storedPath); // Redirige a la ruta almacenada si existe y está autenticado
    }
  }
}
