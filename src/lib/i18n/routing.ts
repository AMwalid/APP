import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "fr"],
  defaultLocale: "ar",
  localePrefix: "always",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
