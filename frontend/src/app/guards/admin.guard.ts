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
export class AdminGuard {
  constructor(private tokenService: TokenService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      if (isAdminRole(token)) return true;
      return false;
    } else {
      this.router.navigate(['/login/admin']);
      return false;
    }
  }
}

export const AdminGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AdminGuard).canActivate(next, state);
};
