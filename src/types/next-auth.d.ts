import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
    // Access token atual para chamadas no cliente (quando necessário)
    accessToken?: string;
    // Erro propagado quando o refresh falha
    error?: string;
  }

  interface User extends DefaultUser {
    role: string;
  }
}
