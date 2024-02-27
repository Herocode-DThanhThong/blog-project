import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { formatDistance, subDays } from 'date-fns';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import {
  APPROVE_ROLE_REQUEST_MESSAGE,
  GET_ROLE_REQUEST_MESSAGE,
  REJECT_ROLE_REQUEST_MESSAGE,
  TYPE_MESSAGE_ERROR,
  TYPE_MESSAGE_SUCCESS,
} from '../../../constants';
import { RoleRequestPaginationDTO } from '../../../dtos/pagination/roleRequestPagination';
import {
  ApproveRoleRequestDTO,
  RejectRoleRequestDTO,
} from '../../../dtos/request/role.request';
import {
  RoleRequest,
  RoleRequestResponse,
} from '../../../response/roleRequest';
import { RoleService } from '../../../services/role/role.service';
import { NotificationComponent } from '../../notification/notification.component';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-role-request',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule,
    NotificationComponent,
    RouterLink,
    NzTagModule,
  ],
  templateUrl: './role-request.component.html',
  styleUrl: './role-request.component.css',
})
export class RoleRequestComponent implements OnInit {
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  roleRequests: Array<RoleRequest>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.roleRequests = [];
    this.pagination = {
      page: 0,
      limit: 8,
      total: 0,
    };
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const { page, limit } = params;
      this.fetchRoleRequests(page - 1, limit, '');
    });
  }

  fetchRoleRequests(page: number, limit: number, sort: string) {
    const roleRequestPaginationDTO = new RoleRequestPaginationDTO({
      page,
      limit,
      sort,
    });
    this.commonService.setIsLoading(true);
    this.roleService.getRoleRequest(roleRequestPaginationDTO).subscribe({
      next: (response: RoleRequestResponse) => {
        this.roleRequests = response.data.map((res) => ({
          ...res,
          createdDate: formatDistance(
            subDays(new Date(res.createdDate), 0),
            new Date(),
            { addSuffix: true }
          ),
        }));
        this.pagination = response.pagination;
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          GET_ROLE_REQUEST_MESSAGE.error,
          error
        );
      },
    });
  }

  approveRoleRequests(id: number) {
    const approveRoleRequestDTO = new ApproveRoleRequestDTO({
      id,
    });
    this.commonService.setIsLoading(true);

    this.roleService.approveRoleRequest(approveRoleRequestDTO).subscribe({
      next: (response: RoleRequest) => {
        this.fetchRoleRequests(this.pagination.page, this.pagination.limit, '');
        this.notificationComponent.notify(
          TYPE_MESSAGE_SUCCESS,
          APPROVE_ROLE_REQUEST_MESSAGE.success
        );
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          APPROVE_ROLE_REQUEST_MESSAGE.error,
          error
        );
      },
    });
  }

  rejectRoleRequests(id: number) {
    const rejectRoleRequestDTO = new RejectRoleRequestDTO({
      id,
    });
    this.commonService.setIsLoading(true);
    this.roleService.rejectRoleRequest(rejectRoleRequestDTO).subscribe({
      next: (response: RoleRequest) => {
        this.fetchRoleRequests(this.pagination.page, this.pagination.limit, '');
        this.notificationComponent.notify(
          TYPE_MESSAGE_SUCCESS,
          REJECT_ROLE_REQUEST_MESSAGE.success
        );
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          REJECT_ROLE_REQUEST_MESSAGE.error,
          error
        );
      },
    });
  }
}
