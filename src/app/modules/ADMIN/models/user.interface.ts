export interface User {
  id?: string;
  email: string;
  password?: string;
  fullName: string;
  roleId?: number;
  roleName: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}