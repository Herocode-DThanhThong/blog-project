import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { VERIFY_ACCOUNT_MESSAGE } from '../../constants';
import { VerifyAccountDTO } from '../../dtos/user/verifyAccountDTO';
import { UserService } from '../../services/user/user.service';
import { CommonService } from '../../services/common/common.service';
@Component({
  selector: 'app-verify-account-result',
  standalone: true,
  imports: [CommonModule, NzAlertModule],
  templateUrl: './verify-account-result.component.html',
})
export class VerifyAccountResultComponent implements OnInit {
  verifySuccess: boolean;
  title: string;
  message: string;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private commonService: CommonService
  ) {
    this.verifySuccess = false;
    this.title = '';
    this.message = '';
  }
  ngOnInit(): void {
    this.fetchVerifyAccount();
  }

  fetchVerifyAccount() {
    const token = this.route.snapshot.queryParams['token'];
    const verifyAccountDTO = new VerifyAccountDTO({
      token,
    });
    this.commonService.setIsLoading(true);
    this.userService.verifyAccount(verifyAccountDTO).subscribe({
      next: (response: any) => {
        this.verifySuccess = true;
        this.title = VERIFY_ACCOUNT_MESSAGE.success;
        this.message = '';
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.verifySuccess = false;
        this.title = VERIFY_ACCOUNT_MESSAGE.error;
        if (error?.error) {
          this.message = error.error.message;
        }
      },
    });
  }
}
