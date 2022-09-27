import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {

  private loggedIn : boolean;

  constructor() {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     
      let value = JSON.parse(sessionStorage.getItem('loggedIn'));
      console.log('Auth Guard :: ', ((value == true)? true : false));
      return  ((value == true)? true : false);

  }

  
}


