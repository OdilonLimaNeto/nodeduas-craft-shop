import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Informe o e-mail",
    })
    .email("Email Inválido")
    .transform((email) => {
      return email.trim();
    }),
  password: z.string().min(1, {
    message: "Informe a senha",
  }),
});

export type signInData = z.infer<typeof signInSchema>;
