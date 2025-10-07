export interface Login {
  email: string;
  password: string;
}

export interface Register {
  cui: string;
  email: string;
  password: string;
}

export interface Confirmation {
  email: string;
  code: string;
}

export interface Recover {
  email: string;
  code: string;
  password: string;
}
export interface Session {
  token: string;
  id: number;
  email: string;
  cui: string;
  active: boolean;
  employeeId: string;
  customerId: string;
  roleName: Rol;
}

export enum Rol {
  CLIENTE = 'CLIENTE',
}
