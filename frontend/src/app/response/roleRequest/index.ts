export interface RoleRequest {
  createdDate: string;
  updatedDate: string;
  id: number;
  title: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  user: {
    createdDate: string;
    updatedDate: string;
    id: 0;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    avatar: string;
    activatedAccount: true;
    role: 'USER' | 'MANAGER' | 'ADMIN';
  };
}

export interface RoleRequestResponse {
  data: RoleRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
