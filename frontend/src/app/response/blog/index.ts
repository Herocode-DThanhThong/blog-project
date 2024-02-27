export interface BlogResponse {
  data: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface Blog {
  createdDate: string;
  updatedDate: string;
  id: number;
  title: string;
  content: string;
  user: {
    createdDate: string;
    updatedDate: string;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    avatar: string;
    activatedAccount: boolean;
    role: 'MANAGER' | 'ADMIN' | 'USER';
  };
}

export interface BlogEdit {
  id?: number;
  title?: string;
  content?: string;
}
