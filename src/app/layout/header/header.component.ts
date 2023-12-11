import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output, inject } from "@angular/core";
import { ThemeService } from "../../theme.service";
import { AuthService } from "../../auth/services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css"
})
export class HeaderComponent {
  @Output() toggleSidebarButton = new EventEmitter<boolean>();
  menuStatus: boolean = false;
  _authService = inject(AuthService);

  ngOnInit() {}

  toggleSidebar() {
    this.menuStatus = !this.menuStatus;
    this.toggleSidebarButton.emit(this.menuStatus);
  }

  logout() {
    this._authService.logout();
  }

}
