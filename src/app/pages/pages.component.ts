import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStatus } from '../auth/interfaces/auth-status.enum';
import { AuthService } from '../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../layout/footer/footer.component';
import { HeaderComponent } from '../layout/header/HeaderComponent';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent,SidebarComponent, FooterComponent  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent {
  menuStatus: boolean = false;
  private authService = inject( AuthService );
  private router = inject( Router );

  public finishedAuthCheck = computed<boolean>( () => {
    console.log(this.authService.authStatus() )
    if ( this.authService.authStatus() === AuthStatus.checking ) {
      return false;
    }

    return true;
  });


  public authStatusChangedEffect = effect(() => {

    switch( this.authService.authStatus() ) {

      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard');
        return;

      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/login');
        return;

    }




  });


}
