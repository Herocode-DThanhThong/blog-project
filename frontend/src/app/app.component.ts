import { CommonModule, Location } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FooterComponent } from './component/footer/footer.component';
import { HeaderComponent } from './component/header/header.component';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { isAdminPath, isAdminRole } from './utils';
import { CommonService } from './services/common/common.service';
import { TokenService } from './services/token/token.service';
import { NgxLoadingModule } from 'ngx-loading';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    HeaderComponent,
    FooterComponent,
    VerifyEmailComponent,
    NgxLoadingModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterContentChecked {
  isCollapsed = false;
  isAdminRoute = false;
  loading = false;
  location: Location;
  constructor(
    location: Location,
    private commonservice: CommonService,
    private tokenService: TokenService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.location = location;
    this.loading = false;
  }
  ngOnInit(): void {
    this.checAdminRole();
    this.commonservice.getIsAdmin().subscribe((isAdmin) => {
      this.isAdminRoute = isAdmin;
    });

    this.commonservice.getIsLoading().subscribe((isLoading) => {
      this.loading = isLoading;
    });
  }

  checAdminRole() {
    const token = this.tokenService.getToken();
    const isAdmin = token ? isAdminRole(token) : false;
    this.commonservice.setIsAdmin(isAdmin);
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}
