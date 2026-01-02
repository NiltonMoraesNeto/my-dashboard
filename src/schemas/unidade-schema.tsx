import { z } from "zod";

export const schemaUnidadeNew = z.object({
  numero: z.string().min(1, "Número é obrigatório"),
  bloco: z.string().optional(),
  apartamento: z.string().optional(),
  tipo: z.string().optional(),
  status: z.string().optional(),
  proprietario: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  moradorId: z.string().optional(),
});

export const schemaUnidadeEdit = z.object({
  numero: z.string().min(1, "Número é obrigatório").optional(),
  bloco: z.string().optional(),
  apartamento: z.string().optional(),
  tipo: z.string().optional(),
  status: z.string().optional(),
  proprietario: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  moradorId: z.string().optional(),
});

