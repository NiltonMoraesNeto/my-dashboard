import { z } from "zod";

export const schemaAvisoNew = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  tipo: z.string().optional(),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataFim: z.string().optional(),
  destaque: z.boolean().optional(),
});

export const schemaAvisoEdit = z.object({
  titulo: z.string().min(1, "Título é obrigatório").optional(),
  descricao: z.string().min(1, "Descrição é obrigatória").optional(),
  tipo: z.string().optional(),
  dataInicio: z.string().min(1, "Data de início é obrigatória").optional(),
  dataFim: z.string().optional(),
  destaque: z.boolean().optional(),
});

