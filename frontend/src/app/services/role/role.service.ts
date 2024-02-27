import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApproveRoleRequestDTO,
  RejectRoleRequestDTO,
  RoleRequestDTO,
} from '../../dtos/request/role.request';
import { RoleRequest, RoleRequestResponse } from '../../response/roleRequest';
import { RoleRequestPaginationDTO } from '../../dtos/pagination/roleRequestPagination';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  constructor(private http: HttpClient) {}
  getRoles(): Observable<String[]> {
    const rolesUrl = `${enviroment.baseUrl}/roles`;
    return this.http.get<String[]>(rolesUrl, this.apiConfig);
  }

  sendRequestChangeRole(payload: RoleRequestDTO): Observable<RoleRequest> {
    const roleRequestUrl = `${enviroment.baseUrl}/role-manager-request`;
    return this.http.post<RoleRequest>(roleRequestUrl, payload, this.apiConfig);
  }

  getRoleRequest(
    params: RoleRequestPaginationDTO
  ): Observable<RoleRequestResponse> {
    const roleRequestUrl = `${enviroment.baseUrl}/role-manager-request`;
    return this.http.get<RoleRequestResponse>(roleRequestUrl, {
      ...this.apiConfig,
      params: { ...params },
    });
  }

  approveRoleRequest(params: ApproveRoleRequestDTO): Observable<RoleRequest> {
    const roleRequestUrl = `${enviroment.baseUrl}/role-manager-request/approve-role-request/${params.id}`;
    return this.http.patch<RoleRequest>(roleRequestUrl, {
      ...this.apiConfig,
    });
  }

  rejectRoleRequest(params: RejectRoleRequestDTO): Observable<RoleRequest> {
    const roleRequestUrl = `${enviroment.baseUrl}/role-manager-request/reject-role-request/${params.id}`;
    return this.http.patch<RoleRequest>(roleRequestUrl, {
      ...this.apiConfig,
    });
  }
}
