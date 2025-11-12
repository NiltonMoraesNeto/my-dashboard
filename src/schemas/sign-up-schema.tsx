import * as z from "zod";

export const schemaSignUp = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").nonempty("Nome é obrigatório"),
    email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
    password: z
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .nonempty("Senha é obrigatória"),
    confirmPassword: z.string().nonempty("Confirmação de senha é obrigatória"),
    perfilId: z.number({ required_error: "Perfil é obrigatório" }).min(1, "Selecione um perfil"),
    cep: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
