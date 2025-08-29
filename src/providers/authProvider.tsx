"use client";

// Provider de sessão que também lida com erro de refresh no cliente
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <SessionProvider>
      {/* Boundary para reagir a erros de refresh e reautenticar */}
      <AuthSessionBoundary>{children}</AuthSessionBoundary>
    </SessionProvider>
  );
};

const AuthSessionBoundary = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  useEffect(() => {
    // Se o servidor sinalizou falha ao renovar, força novo sign-in
    if (
      (session &&
        "error" in session &&
        (session as { error?: string }).error) === "RefreshAccessTokenError"
    ) {
      signIn();
    }
  }, [session]);

  return <>{children}</>;
};
