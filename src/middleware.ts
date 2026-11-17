import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { isProtectedPath } from "@/lib/constants/protected-routes";
import { routing, type Locale } from "@/lib/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

function isLocale(value: string | undefined): value is Locale {
  return routing.locales.some((locale) => locale === value);
}

/** `/ar/dashboard` → `{ locale: "ar", path: "/dashboard" }`. */
function splitLocale(pathname: string) {
  const [, first, ...rest] = pathname.split("/");

  if (isLocale(first)) {
    return { locale: first, path: `/${rest.join("/")}` };
  }

  return { locale: routing.defaultLocale, path: pathname };
}

/**
 * next-intl owns the URL shape; Supabase owns the session.
 *
 * The i18n response is created first and kept: it carries the forwarded
 * `x-next-intl-locale` header that Server Actions read. The session refresh
 * writes its cookies onto that same response.
 *
 * Auth only runs for protected paths. `getUser()` is a network round trip, and
 * the marketing pages have no reason to pay for it; a token that expires while
 * browsing public pages is refreshed on the first protected request instead.
 */
export default async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  // next-intl answers locale-less paths (and the root) with a redirect. Let it:
  // the browser comes back with the prefix and the check runs on that pass.
  if (response.headers.has("location")) {
    return response;
  }

  const { locale, path } = splitLocale(request.nextUrl.pathname);

  if (!isProtectedPath(path)) {
    return response;
  }

  let user = null;
  try {
    user = await updateSession(request, response);
  } catch (error) {
    // A Supabase outage or a misconfigured project must not 500 every route.
    // Degrading to "signed out" keeps the public site alive; the login attempt
    // then reports the failure to the user.
    console.error("[middleware] session refresh failed", error);
  }

  if (user) {
    return response;
  }

  const login = new URL(`/${locale}/login`, request.url);
  login.searchParams.set("next", path);

  return NextResponse.redirect(login);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
