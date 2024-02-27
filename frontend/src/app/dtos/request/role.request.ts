export class RoleRequestDTO {
  title: string;
  description: string;
  constructor(data: any) {
    this.title = data.title;
    this.description = data.description;
  }
}

export class ApproveRoleRequestDTO {
  id: number;
  constructor(data: any) {
    this.id = data.id;
  }
}

export class RejectRoleRequestDTO {
  id: number;
  constructor(data: any) {
    this.id = data.id;
  }
}
