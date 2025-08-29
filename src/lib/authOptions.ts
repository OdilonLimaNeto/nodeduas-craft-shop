import { login } from "@/services/auth-service";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const nextAuthOptions: NextAuthOptions = {
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
          const response = await login(credentials.email, credentials.password);

          if (response.status !== 201) return null;

          const { user: userInfo, access_token, refresh_token } = response.data;

          if (!userInfo || !access_token || !refresh_token) return null;

          (await cookies()).set("jwt", access_token);
          (await cookies()).set("refresh_token", refresh_token);
          (await cookies()).set("user", JSON.stringify(userInfo));

          const user: User & { partnerToken?: string } = {
            id: userInfo.id.toString(),
            email: userInfo.email,
            name: userInfo.name,
            role: userInfo.role,
          };

          if (user) return user;
        } catch (error) {
          console.log(error);
        }

        return null;
      },
    }),
  ],
};
