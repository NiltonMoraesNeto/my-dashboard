import { z } from "zod";

export const schemaMoradorNew = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
  cep: z.string().optional(),
});

export const schemaMoradorEdit = z.object({
  nome: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
  cep: z.string().optional(),
});

