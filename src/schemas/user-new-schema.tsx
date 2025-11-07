import * as z from "zod";

export const schemaUserNew = z.object({
  nome: z
    .string({ required_error: "Nome é obrigatório" })
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email("Email inválido"),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
  perfilId: z
    .number({ required_error: "Perfil é obrigatório" })
    .min(1, "Selecione um perfil"),
  cep: z
    .string()
    .max(8, "CEP deve ter no máximo 8 caracteres")
    .optional()
    .or(z.literal("")),
});
