import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashbardComponent } from './dashbard/dashbard.component';
import { UsersComponent } from './users/users.component';
import { verifyTokenGuard } from '../guards/verify-token.guard';


export default [
  { path: '', component: PagesComponent  ,
  children: [
    { path: 'dashboard', canActivate:[verifyTokenGuard], component: DashbardComponent },
    { path: 'user', canActivate:[verifyTokenGuard], component: UsersComponent },
    { path: '**',  redirectTo: 'dashboard' },
   ]
  }
] as Route[];
