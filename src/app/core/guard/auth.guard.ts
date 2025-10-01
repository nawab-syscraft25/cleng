import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (
    private _localStorage: LocalStorageService,
    private router: Router
  ){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const status = this._localStorage.isAuthenticated();
    
    const user = this._localStorage.getUserCredentials();
    const currentUser = user.accountType.accountTypeName;
      if (currentUser && status) {
          // check if route is restricted by role
          
          // Syscraft comment
          // if (route.data.roles && route.data.roles.indexOf(currentUser) === -1) {
            if (route.data['roles'] && route.data['roles'].indexOf(currentUser) === -1) {
              // role not authorised so redirect to home page
              this.router.navigate(['/']);
          }

          // authorised so return true
          return true;
      }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});

    return false;
    
  }
  
}
