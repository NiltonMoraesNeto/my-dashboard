import { z } from "zod";

export const schemaBalanceteMovimentacaoNew = z.object({
  tipo: z.enum(["Entrada", "Saída"], {
    errorMap: () => ({ message: "Tipo deve ser Entrada ou Saída" }),
  }),
  data: z.string().min(1, "Data é obrigatória"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  motivo: z.string().min(1, "Motivo é obrigatório"),
});

export const schemaBalanceteMovimentacaoEdit = z.object({
  tipo: z.enum(["Entrada", "Saída"], {
    errorMap: () => ({ message: "Tipo deve ser Entrada ou Saída" }),
  }),
  data: z.string().min(1, "Data é obrigatória"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  motivo: z.string().min(1, "Motivo é obrigatório"),
});

