import { NgModule } from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'register',   
    loadChildren: './register/register.module#RegisterModule'
  },
  { 
    path: 'main', 
    loadChildren: './main/main.module#MainModule' ,
    canActivate: [AuthGuard]
  },
  {
    path: 'formTable',
    // loadChildren: () => import('./form-table/form-table.module').then(m => m.FormTableModule)
    loadChildren: './form-table/form-table.module#FormTableModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'matTable',
    loadChildren: './mat-des-table/mat-des-table.module#MatDesTableModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'landing',   
    loadChildren: './landing-page/landing-page.module#LandingPageModule',
    canActivate: [AuthGuard]
  }
]   


@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
