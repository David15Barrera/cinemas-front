export interface Login {
  email: string;
  password: string;
}

export interface Register {
  email: string;
  password: string;
  fullName: string;
  role: Rol;
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
  id: string;
  email: string;
  active: boolean;
  roleName: Rol;
}

export enum Rol {
  ADMIN_SIS = 'ADMIN_SIS',
  ADMIN_CINE = 'ADMIN_CINE',
  ANUNCIADOR = 'ANUNCIADOR',
  CLIENTE = 'CLIENTE',
}

export interface Role {
  name: string;
  id: number;
  description: string;
}
