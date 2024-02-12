import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { INavbarData, fadeInOut } from './helper';
import { navbarData } from './side-data';
import { SublevelMenuComponent } from './sub-menu-level';
import { AuthService } from '../../auth/services/auth.service';
export interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, SublevelMenuComponent ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class SidebarComponent {
  @Input() collapsed: boolean = true;
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
   screenWidth = 0;
   navData:INavbarData[] = [];
   multiple: boolean = false;

   @HostListener('window:resize', ['$event'])
   onResize(event: any) {
     this.screenWidth = window.innerWidth;
     if(this.screenWidth <= 768 ) {
       this.collapsed = false;
       this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
     }
   }

   constructor(public router: Router, public authService: AuthService) {
    this.navData = this.filterNavbarData(navbarData);
   }

   ngOnInit(): void {
       this.screenWidth = window.innerWidth;


   }

   toggleCollapse(): void {
     this.collapsed = !this.collapsed;
     this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
   }

   closeSidenav(): void {
     this.collapsed = false;
     this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
   }

   handleClick(item: INavbarData): void {
     this.shrinkItems(item);
     item.expanded = !item.expanded
   }

   getActiveClass(data: INavbarData): string {
     return this.router.url.includes(data.routeLink) ? 'active' : '';
   }

   filterNavbarData(navData: INavbarData[]): INavbarData[] {
    return navData
      .filter(item => this.verificaRol(item.rol))
      .map(item => {
        if (item.items) item.items = this.filterNavbarData(item.items);
        return item;
      });
  }

   verificaRol(roles:string[]){
    return roles.some(rol => rol == this.authService.currentUser()?.rol);
   }


   shrinkItems(item: INavbarData): void {
     if (!this.multiple) {
       for(let modelItem of this.navData) {
         if (item !== modelItem && modelItem.expanded) {
           modelItem.expanded = false;
         }
       }
     }
   }
 }
