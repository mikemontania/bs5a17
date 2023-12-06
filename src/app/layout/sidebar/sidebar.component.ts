import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule,  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',

})
export class SidebarComponent {

  menuItems = [
    {
      title: 'Dashboard',
      icon: 'bi bi-grid',
      url: 'index.html'
    },
    {
      title: 'Components',
      icon: 'bi bi-menu-button-wide',
      subitems: [
        { title: 'Alsdsdferts', url: '' },
        { title: 'Accordion', url: '' },
        { title: 'Badges', url: '' },
        { title: 'Breadcrumbs', url: '' },
        { title: 'Buttons', url: '' },
        { title: 'Cards', url: '' },
        { title: 'Carousel', url: '' },
        { title: 'List group', url: '' },
        { title: 'Modal', url: '' },
        { title: 'Tabs', url: '' },
        { title: 'Pagination', url: '' },
        { title: 'Progress', url: '' },
        { title: 'Spinners', url: '' },
        { title: 'Tooltips', url: '' }
      ]
    },
    {
      title: 'Forms',
      icon: 'bi bi-journal-text',
      subitems: [
        { title: 'Form Elements', url: 'user' },
        { title: 'Form Layouts', url: 'user' },
        { title: 'Form Editors', url: 'user' },
        { title: 'Form Validation', url: 'user' }
      ]
    },
    {
      title: 'Tables',
      icon: 'bi bi-layout-text-window-reverse',
      subitems: [
        { title: 'General Tables', url: 'tables-general.html' },
        { title: 'Data Tables', url: 'tables-data.html' }
      ]
    },
    {
      title: 'Charts',
      icon: 'bi bi-bar-chart',
      subitems: [
        { title: 'Chart.js', url: 'charts-chartjs.html' },
        { title: 'ApexCharts', url: 'charts-apexcharts.html' },
        { title: 'ECharts', url: 'charts-echarts.html' }
      ]
    },
    {
      title: 'Icons',
      icon: 'bi bi-gem',
      subitems: [
        { title: 'Bootstrap Icons', url: 'icons-bootstrap.html' },
        { title: 'Remix Icons', url: 'icons-remix.html' },
        { title: 'Boxicons', url: 'icons-boxicons.html' },
        { title: 'Bootstrap Icons', url: 'icons-bootstrap.html' },
        { title: 'Remix Icons', url: 'icons-remix.html' },
        { title: 'Boxicons', url: 'icons-boxicons.html' }
      ]
    },
    {
      title: 'Pages',
      icon: 'bi bi-gem',
      subitems: [
        { title: 'Bootstrap Icons', url: 'icons-bootstrap.html' },
        { title: 'Remix Icons', url: 'icons-remix.html' },
        { title: 'Boxicons', url: 'icons-boxicons.html' },
        { title: 'Bootstrap Icons', url: 'icons-bootstrap.html' },
        { title: 'Remix Icons', url: 'icons-remix.html' },
        { title: 'Boxicons', url: 'icons-boxicons.html' }
      ]
    },
    {
      title: 'Otros',
      icon: 'bi bi-grid',
      url: 'index.html'
    },
  ];
}
