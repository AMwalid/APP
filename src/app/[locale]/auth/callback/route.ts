import { NextResponse, type NextRequest } from "next/server";
import { exchangeCodeForSession } from "@/features/auth";
import { routing, type Locale } from "@/lib/i18n/routing";

/**
 * Email-confirmation landing point.
 *
 * `@supabase/ssr` uses the PKCE flow, so the confirmation link comes back as
 * `?code=...` rather than a token in the hash. The code has to be exchanged for
 * a cookie-backed session — without this route the user would be confirmed but
 * still signed out, which reads as a broken signup.
 *
 * The exchange itself lives in the auth feature (the only place allowed to talk
 * to Supabase); this route just decides where the browser lands. `emailRedirectTo`
 * in the signup action points here, and the URL must be allowlisted in the
 * Supabase project's Redirect URLs.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: requested } = await params;
  const locale: Locale = routing.locales.some((item) => item === requested)
    ? (requested as Locale)
    : routing.defaultLocale;

  const code = request.nextUrl.searchParams.get("code");

  if (code && (await exchangeCodeForSession(code))) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
}
