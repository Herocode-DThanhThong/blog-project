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
export class UserGuard {
  constructor(private tokenService: TokenService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      if (!isAdminRole(token)) return true;
      return false;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const UserGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(UserGuard).canActivate(next, state);
};
