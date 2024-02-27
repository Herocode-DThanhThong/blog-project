import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { GET_CURRENT_USER_MESSAGE, TYPE_MESSAGE_ERROR } from '../../constants';
import { UserResponse } from '../../response/user';
import { CommonService } from '../../services/common/common.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzButtonModule,
    CommonModule,
    RouterLink,
    NzFormModule,
    FormsModule,
    NzIconModule,
    NzInputModule,
    NzPopoverModule,
    NzAvatarModule,
    NzDividerModule,
    NotificationComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  user: UserResponse;
  visible: boolean;
  isLogged: boolean;
  searchText: string;

  constructor(
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private userService: UserService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.user = {};
    this.visible = false;
    this.isLogged = false;
    this.searchText = '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const { text } = params;
      this.searchText = text || '';
    });
    this.checkLogged();
    this.commonService.getIsLogged().subscribe((logged) => {
      this.isLogged = logged;
      if (logged) this.fetchUser();
    });
  }

  checkLogged() {
    this.isLogged =
      !!this.tokenService.getToken() && !!this.tokenService.getRefreshToken();
    this.commonService.setIsLogged(
      !!this.tokenService.getToken() && !!this.tokenService.getRefreshToken()
    );
  }

  fetchUser() {
    this.commonService.setIsLoading(true);
    this.userService.getMe().subscribe({
      next: (response: UserResponse) => {
        this.user = response;
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          GET_CURRENT_USER_MESSAGE.error,
          error
        );
      },
    });
  }

  logOut(): void {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    this.isLogged = false;
    this.commonService.setUser({});
    this.commonService.setIsLogged(false);
    this.router.navigate(['/login']);
  }

  onSearch(event: KeyboardEvent): void {
    const { queryParams } = this.route.snapshot;
    if (event.key === 'Enter') {
      this.router.navigate(['/'], {
        queryParams: {
          ...queryParams,
          text: this.searchText,
        },
      });
    }
  }

  onPopoverChange(isVisible: boolean): void {
    this.visible = isVisible;
  }

  onClosePopover(): void {
    this.visible = false;
  }
}
