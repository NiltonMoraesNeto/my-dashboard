import type { TFunction } from "i18next";
import { z } from "zod";

export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .nonempty(t("auth.form.validation.emailRequired"))
      .email(t("auth.form.validation.emailInvalid")),
    password: z
      .string()
      .nonempty(t("auth.form.validation.passwordRequired"))
      .min(6, t("auth.form.validation.passwordMin")),
  });

export type LoginSchema = z.infer<ReturnType<typeof createLoginSchema>>;
