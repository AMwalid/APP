import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

/**
 * Refreshes the Supabase session and returns the current user, or null.
 *
 * The response is passed in rather than created here, and refreshed cookies are
 * written onto it. Building a second `NextResponse.next({ request })` would
 * replace the forwarded request headers and drop `x-next-intl-locale`, which is
 * the only thing that tells `getLocale()` / `getTranslations()` inside Server
 * Actions which language to use. That failure is silent — every action would
 * fall back to Arabic — so the dependency is made explicit in the signature.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse,
): Promise<User | null> {
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
