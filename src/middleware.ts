import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Rotas públicas
const publicRoutes = [
  { path: "/admin/login", whenAuthenticated: "redirect" }, // O usuário não deve acessar o signIn quando estiver logado
  { path: "/produto/:id", whenAuthenticated: "next" },
  //{ path: "/user/callback-sso", whenAuthenticated: "redirect" },
  { path: "/", whenAuthenticated: "next" }, // se estiver autenticado e tentar acessa a home --> acesso permitido
] as const;

// Rota que devemos redirecionar o usuário quando ele tentar acessar uma rota autenticada e não estiver autenticado
const REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE = "/admin/login";

export function middleware(request: NextRequest) {
  // endereço que vem depois da URL principal da aplicação
  const path = request.nextUrl.pathname;

  if (/\.[^/]+$/.test(path)) {
    return NextResponse.next();
  }

  const publicRoute = publicRoutes.find((route) => route.path === path);

  const authToken = request.cookies.get("jwt");

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE;

    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/";

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    const decoded = jwtDecode(authToken.value);

    const expTimestamp = decoded.exp;

    // Se o token não possuir data de expiração redireciona para a página de autenticação
    if (!expTimestamp) {
      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE;

      return NextResponse.redirect(redirectUrl);
    }

    const expDate = new Date(expTimestamp * 1000);

    // Se o token estiver expirado, redireciona para a página de autenticação
    if (new Date() > expDate) {
      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE;

      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
