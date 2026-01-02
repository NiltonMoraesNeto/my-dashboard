import { z } from "zod";

export const schemaReuniaoNew = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
  hora: z.string().min(1, "Hora é obrigatória"),
  local: z.string().optional(),
  tipo: z.string().optional(),
  pauta: z.string().optional(),
  status: z.string().optional(),
});

export const schemaReuniaoEdit = z.object({
  titulo: z.string().min(1, "Título é obrigatório").optional(),
  data: z.string().min(1, "Data é obrigatória").optional(),
  hora: z.string().min(1, "Hora é obrigatória").optional(),
  local: z.string().optional(),
  tipo: z.string().optional(),
  pauta: z.string().optional(),
  status: z.string().optional(),
});

