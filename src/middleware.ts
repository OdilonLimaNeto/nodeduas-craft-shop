import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

// O usuário não deve acessar o signIn quando estiver logado,
const publicRoutes = [{ path: "/", whenAuthenticated: "redirect" }] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE = "/";

export default async function middleware(request: NextRequest) {
  // Pega o endereço que vem depois da URL principal da aplicação
  const path = request.nextUrl.pathname;

  // Verifica se o caminho (path) termina com uma extensão de arquivo (por exemplo, ".png", ".css", ".js", etc.)
  if (/\.[^/]+$/.test(path)) return NextResponse.next();

  const publicRoute = publicRoutes.find((route) => route.path === path);

  const authToken = request.cookies.get("next-auth.session-token");

  // Se não estiver autenticado e for rota pública -> acesso permitido
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // Se não estiver autenticado e for rota privada
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE;

    // Redireciona para o Login
    return NextResponse.redirect(redirectUrl);
  }

  // Se estiver autenticado e for rota pública e tentar acessar o login -> redireciona para a main
  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/main";

    return NextResponse.redirect(redirectUrl);
  }

  // Se estiver autenticado e acessar rota privada -> validar validade do token
  if (authToken && !publicRoute) {
    try {
      const decoded = await decode({
        secret: process.env.NEXTAUTH_SECRET as string,
        token: authToken.value,
      });

      const expTimestamp = decoded?.exp;

      // // Se o token não possuir data de expiração redireciona para a página de autenticação
      if (!expTimestamp) {
        const redirectUrl = request.nextUrl.clone();

        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE;

        return NextResponse.redirect(redirectUrl);
      }

      const expDate = new Date(+expTimestamp * 1000);

      // Se o token estiver expirado, redireciona para a página de autenticação
      if (new Date() > expDate) {
        const redirectUrl = request.nextUrl.clone();

        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE;

        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      // Se falhou na decodificação, redireciona para a página de autenticação
      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE;

      return NextResponse.redirect(redirectUrl);
    }
  }
}

// Middleware não deve ser executado para: API, arquivos estáticos, imagens, etc.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
