import { z } from "zod";

export const schemaContaPagarNew = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  categoria: z.string().optional(),
  status: z.string().optional(),
  observacoes: z.string().optional(),
  anexo: z.custom<File>((val) => val === undefined || val instanceof File, {
    message: "Anexo deve ser um arquivo",
  }).optional(),
});

export const schemaContaPagarEdit = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória").optional(),
  valor: z.number().min(0.01, "Valor deve ser maior que zero").optional(),
  vencimento: z.string().min(1, "Data de vencimento é obrigatória").optional(),
  categoria: z.string().optional(),
  status: z.string().optional(),
  observacoes: z.string().optional(),
  anexo: z.custom<File>((val) => val === undefined || val instanceof File, {
    message: "Anexo deve ser um arquivo",
  }).optional(),
});
