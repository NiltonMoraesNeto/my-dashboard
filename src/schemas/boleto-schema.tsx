import { z } from "zod";

export const schemaBoletoNew = z.object({
  unidadeId: z.string().min(1, "Unidade é obrigatória"),
  mes: z.number().min(1).max(12, "Mês deve ser entre 1 e 12"),
  ano: z.number().min(2000, "Ano inválido"),
  valor: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  codigoBarras: z.string().optional(),
  nossoNumero: z.string().optional(),
  status: z.string().optional(),
  dataPagamento: z.string().optional(),
  observacoes: z.string().optional(),
});

export const schemaBoletoEdit = z.object({
  unidadeId: z.string().min(1, "Unidade é obrigatória").optional(),
  mes: z.number().min(1).max(12, "Mês deve ser entre 1 e 12").optional(),
  ano: z.number().min(2000, "Ano inválido").optional(),
  valor: z.number().min(0, "Valor deve ser maior ou igual a zero").optional(),
  vencimento: z.string().min(1, "Data de vencimento é obrigatória").optional(),
  codigoBarras: z.string().optional(),
  nossoNumero: z.string().optional(),
  status: z.string().optional(),
  dataPagamento: z.string().optional(),
  observacoes: z.string().optional(),
});

