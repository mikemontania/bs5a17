import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output, inject } from "@angular/core";
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css"
})
export class HeaderComponent {
  authService =inject(AuthService);
  @Output() menuToggled = new EventEmitter<boolean>();
  menuStatus: boolean = true;

  MenuToggled() {
    this.menuStatus = !this.menuStatus;
    this.menuToggled.emit(this.menuStatus);
  }


  logout() {
    this.authService.logout()
  }
}
