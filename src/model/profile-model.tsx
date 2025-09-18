export interface TokenPayload {
  sub: string; // user id
  email: string;
  perfilId: number;
  exp: number; // expiração do token
  iat?: number; // issued at
  nome?: string; // nome do usuário
  avatar?: string; // avatar do usuário
}

export interface ProfileList {
  id: number;
  descricao: string;
}

export interface FormDataAddProfile {
  descricao: string;
}
