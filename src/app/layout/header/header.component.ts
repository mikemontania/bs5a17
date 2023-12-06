import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() toggleSidebarButton = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  ngOnInit() {}
  toggleSidebar() {
    this.menuStatus = !this.menuStatus;
    this.toggleSidebarButton.emit(this.menuStatus);
  }
}
