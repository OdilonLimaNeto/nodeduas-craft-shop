// Configuração do NextAuth com fluxo de refresh de token baseado em cookies e JWT
import { login, refresh as refreshTokens } from "@/services/auth-service";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

// Objeto que persistimos dentro do token JWT do NextAuth para controlar expiração e usuário
type JWTToken = {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
};

// Tenta renovar o accessToken usando o refreshToken na API
async function refreshAccessToken(token: JWTToken): Promise<JWTToken> {
  try {
    // Se não há refreshToken, não conseguimos renovar
    if (!token.refreshToken) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    // Chama o serviço para obter novos tokens
    const response = await refreshTokens(token.refreshToken);
    const data = response?.data ?? {};

    // Se a API não respondeu OK ou não retornou access_token, falhamos
    if (
      !(response?.status && response.status >= 200 && response.status < 300) ||
      !data?.access_token
    ) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    // Decodifica o JWT para inferir o timestamp de expiração (ms)
    const decoded: { exp?: number } = jwtDecode(data.access_token);
    const accessTokenExpires = decoded?.exp
      ? decoded.exp * 1000
      : Date.now() + 5 * 60 * 1000;

    // Atualiza cookies para o cliente também usar o token renovado
    const cookieStore = await cookies();
    cookieStore.set("jwt", data.access_token);
    if (data.refresh_token || token.refreshToken) {
      cookieStore.set(
        "refresh_token",
        data.refresh_token ?? token.refreshToken!
      );
    }

    // Devolve token JWT (NextAuth) atualizado
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires,
      refreshToken: data.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch {
    // Qualquer falha marca erro para que o cliente possa reautenticar
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const nextAuthOptions: NextAuthOptions = {
  // Mantemos a sessão em JWT para poder controlar expiração/refresh
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        try {
          // Chama login na API
          const response = await login(credentials.email, credentials.password);
          console.log("response", response);

          // Login precisa retornar 201 conforme seu backend
          if (response.status !== 201) return null;

          // Extrai usuário e tokens retornados
          const { user: userInfo, access_token, refresh_token } = response.data;

          if (!userInfo || !access_token || !refresh_token) return null;

          // Armazena tokens e usuário em cookies para consumo no cliente
          (await cookies()).set("jwt", access_token);
          (await cookies()).set("refresh_token", refresh_token);
          (await cookies()).set("user", JSON.stringify(userInfo));

          // Retorna um usuário com tokens para o callback JWT inicial
          const user: User & { accessToken: string; refreshToken: string } = {
            id: userInfo.id.toString(),
            email: userInfo.email,
            name: userInfo.name,
            role: userInfo.role,
            accessToken: access_token,
            refreshToken: refresh_token,
          };

          if (user) return user;
        } catch (error) {
          console.log(error);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    // Callback executado a cada leitura/gravação do JWT do NextAuth
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        // No primeiro login, copiamos tokens do usuário retornado por authorize
        const typedUser = user as User & {
          accessToken?: string;
          refreshToken?: string;
        };
        const access = typedUser.accessToken;
        const refresh = typedUser.refreshToken;

        if (access) {
          // Calcula expiração do access token
          const decoded: { exp?: number } = jwtDecode(access);
          const accessTokenExpires = decoded?.exp
            ? decoded.exp * 1000
            : Date.now() + 5 * 60 * 1000;

          // Espelha tokens em cookies para consumo no cliente (axios, etc.)
          const cookieStore = await cookies();
          cookieStore.set("jwt", access);
          if (refresh) cookieStore.set("refresh_token", refresh);

          // Estrutura do token JWT que manteremos no NextAuth
          const newToken: JWTToken = {
            accessToken: access,
            accessTokenExpires,
            refreshToken: refresh,
            user: {
              id: typedUser.id!,
              email: typedUser.email!,
              name: typedUser.name!,
              role: typedUser.role as string,
            },
          };

          return newToken as unknown as typeof token;
        }
      }

      const jwtToken = token as unknown as JWTToken;

      // Se ainda não expirou, devolve o token atual
      if (
        jwtToken.accessToken &&
        jwtToken.accessTokenExpires &&
        Date.now() < jwtToken.accessTokenExpires
      ) {
        return token;
      }

      // Access token expirou: tenta atualizar via API
      const refreshed = await refreshAccessToken(jwtToken);
      return refreshed as unknown as typeof token;
    },
    // Projeta dados do token JWT na sessão enviada ao cliente
    async session({ session, token }) {
      const jwtToken = token as unknown as JWTToken;
      if (jwtToken?.user) {
        session.user = jwtToken.user;
      }
      if (jwtToken?.accessToken) {
        session.accessToken = jwtToken.accessToken;
      }
      if (jwtToken?.error) {
        session.error = jwtToken.error;
      }
      return session;
    },
  },
};
