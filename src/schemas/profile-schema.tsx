import * as z from "zod";

export const schemaAddProfile = z.object({
  descricao: z.string().nonempty("Nome do perfil é obrigatório"),
});
