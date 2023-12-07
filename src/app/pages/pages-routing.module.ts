import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashbardComponent } from './dashbard/dashbard.component';
import { UsersComponent } from './users/users.component';


export default [
  { path: '', component: PagesComponent ,
  children: [
    { path: 'dashboard', component: DashbardComponent },
    { path: 'user', component: UsersComponent },
    { path: '**', redirectTo: 'dashboard' },
   ]
  }
] as Route[];
