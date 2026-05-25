export interface AuthUserPayload {
  sub: string;
  email: string;
  perfilId: number;
  nome?: string;
  avatar?: string;
}

export type TokenPayload = AuthUserPayload;

export interface ProfileList {
  id: number;
  descricao: string;
}

export interface FormDataAddProfile {
  descricao: string;
}
