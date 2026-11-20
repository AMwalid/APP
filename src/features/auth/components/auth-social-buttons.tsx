"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/**
 * Visual placeholders for future social login.
 *
 * Intentionally disabled: no handler, no navigation, no provider SDK. Both
 * labels come from the Auth namespace so Arabic/French/English stay in sync.
 * Inline SVG brand marks avoid adding an icon package for two glyphs.
 */
export function AuthSocialButtons() {
  const t = useTranslations("Auth");

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          {t("social.divider")}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-4 grid gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          disabled
          className="w-full"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
          </svg>
          {t("social.google")}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="md"
          disabled
          className="w-full"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          {t("social.apple")}
        </Button>
      </div>
    </div>
  );
}
