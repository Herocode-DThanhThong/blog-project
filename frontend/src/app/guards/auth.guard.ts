import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { TokenService } from '../services/token/token.service';
import { isAdminRole } from '../utils';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private tokenService: TokenService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      if (isAdminRole(token)) {
        this.router.navigate(['/admin/user']);
      } else {
        this.router.navigate(['/']);
      }
      return false;
    } else {
      return true;
    }
  }
}

export const AuthGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AuthGuard).canActivate(next, state);
};
