import { Component,   } from '@angular/core';
import {  RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FooterComponent } from '../layout/footer/footer.component';
import { SideNavToggle, SidebarComponent } from '../layout/sidebar/sidebar.component';
import { HeaderComponent } from '../layout/header/header.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent,SidebarComponent, FooterComponent  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent {
  collapsed: boolean = true;


  onToggleSideNav(event: SideNavToggle): void {
    this.collapsed = event.collapsed;
    console.log('Collapsed:', this.collapsed);
  }


}
