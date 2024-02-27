import { CommonService } from './../../../services/common/common.service';
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { TokenService } from '../../../services/token/token.service';
import { isAdminRole } from '../../../utils';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    RouterOutlet,
    NzTableModule,
    NzDividerModule,
    RouterLink,
    NzButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  currentPath: string = '';
  constructor(
    private commonService: CommonService,
    private tokenService: TokenService,
    private location: Location,
    private router: Router
  ) {
    this.currentPath = this.location.path();
  }
  ngOnInit(): void {
    const token = this.tokenService.getToken();
    const isAdmin = token ? isAdminRole(token) : false;
    this.commonService.setIsAdmin(isAdmin);
  }
  logOut(): void {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    this.commonService.setIsLogged(false);
    this.commonService.setIsAdmin(false);
    this.router.navigate(['/login/admin']);
  }
  onMenuChange(path: string): void {
    this.currentPath = path;
  }
}
