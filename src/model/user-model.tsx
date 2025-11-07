export interface UserList {
  id: string;
  nome: string;
  email: string;
  perfil: {
    id: number;
    descricao: string;
  };
  cep: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}
