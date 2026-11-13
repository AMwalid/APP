import { env } from "./env";

export const siteConfig = {
  name: "IBNI",
  tagline: "Crafting the Leaders of Tomorrow. Today.",
  url: env.NEXT_PUBLIC_SITE_URL,
  locales: ["ar", "fr", "en"] as const,
  defaultLocale: "ar" as const,
} as const;
