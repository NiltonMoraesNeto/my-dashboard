import { z } from "zod";

export const schemaEntregaNew = z.object({
  titulo: z.string().optional(),
  dataHora: z.union([
    z.string().min(1, "Data e hora são obrigatórias"),
    z.date(),
  ]),
  nomeRecebedor: z.string().min(1, "Nome do recebedor é obrigatório"),
  recebidoPor: z.enum(["portaria", "zelador", "morador"], {
    errorMap: () => ({ message: "Selecione quem recebeu a entrega" }),
  }),
  unidadeId: z.string().min(1, "Unidade é obrigatória"),
  anexo: z.custom<File>((val) => val === undefined || val instanceof File, {
    message: "Anexo deve ser um arquivo",
  }).optional(),
});

export const schemaEntregaEdit = z.object({
  titulo: z.string().optional(),
  dataHora: z.union([
    z.string().min(1, "Data e hora são obrigatórias"),
    z.date(),
  ]).optional(),
  nomeRecebedor: z.string().min(1, "Nome do recebedor é obrigatório").optional(),
  recebidoPor: z.enum(["portaria", "zelador", "morador"], {
    errorMap: () => ({ message: "Selecione quem recebeu a entrega" }),
  }).optional(),
  unidadeId: z.string().min(1, "Unidade é obrigatória").optional(),
  anexo: z.custom<File | string | undefined>(
    (val) => val === undefined || val instanceof File || typeof val === "string",
    {
      message: "Anexo deve ser um File ou string",
    }
  ).optional(),
});
