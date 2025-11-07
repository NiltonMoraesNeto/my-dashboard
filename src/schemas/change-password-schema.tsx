import * as z from "zod";

export const schemaChangePassword = z
  .object({
    currentPassword: z
      .string({ required_error: "Senha atual é obrigatória" })
      .min(6, "Senha deve ter no mínimo 6 caracteres"),
    newPassword: z
      .string({ required_error: "Nova senha é obrigatória" })
      .min(6, "Nova senha deve ter no mínimo 6 caracteres"),
    confirmNewPassword: z
      .string({ required_error: "Confirme a nova senha" })
      .min(6, "Confirmação deve ter no mínimo 6 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  });
