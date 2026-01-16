import * as z from "zod";

export const schemaUserNew = z.object({
  nome: z
    .string({ required_error: "Nome é obrigatório" })
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string({ required_error: "Email é obrigatório" }).email("Email inválido"),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
  perfilId: z.number({ required_error: "Perfil é obrigatório" }).min(1, "Selecione um perfil"),
  cpf: z.string().optional(),
  dataNascimento: z.date().optional().or(z.string().optional()),
  cep: z
    .string({ required_error: "CEP é obrigatório" })
    .min(1, "CEP é obrigatório")
    .refine((val) => {
      const cepLimpo = val.replace(/\D/g, "");
      return cepLimpo.length === 8;
    }, "CEP deve conter 8 dígitos"),
  logradouro: z.string({ required_error: "Logradouro é obrigatório" }).min(1, "Logradouro é obrigatório"),
  numero: z.string({ required_error: "Número é obrigatório" }).min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string({ required_error: "Bairro é obrigatório" }).min(1, "Bairro é obrigatório"),
  cidade: z.string({ required_error: "Cidade é obrigatória" }).min(1, "Cidade é obrigatória"),
  uf: z.string({ required_error: "UF é obrigatória" }).min(2, "UF deve ter 2 caracteres").max(2, "UF deve ter 2 caracteres"),
  condominioId: z.string().optional(),
  empresaId: z.string().optional(),
});
