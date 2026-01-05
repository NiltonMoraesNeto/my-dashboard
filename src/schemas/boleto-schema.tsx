import { z } from "zod";

export const schemaBoletoNew = z.object({
  unidadeId: z.string().min(1, "Unidade é obrigatória"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  arquivo: z.custom<File>((val) => val instanceof File, {
    message: "Arquivo PDF é obrigatório",
  }),
  status: z.string().optional(),
  dataPagamento: z.string().optional(),
  observacoes: z.string().optional(),
});

export const schemaBoletoEdit = z.object({
  unidadeId: z.string().min(1, "Unidade é obrigatória").optional(),
  descricao: z.string().min(1, "Descrição é obrigatória").optional(),
  valor: z.number().min(0, "Valor deve ser maior ou igual a zero").optional(),
  vencimento: z.string().min(1, "Data de vencimento é obrigatória").optional(),
  arquivo: z.custom<File | string | undefined>(
    (val) => val === undefined || val instanceof File || typeof val === "string",
    {
      message: "Arquivo deve ser um File ou string",
    }
  ).optional(),
  status: z.string().optional(),
  dataPagamento: z.string().optional(),
  observacoes: z.string().optional(),
});

