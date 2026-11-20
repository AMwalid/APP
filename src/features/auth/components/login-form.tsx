"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { login } from "../actions";
import { createLoginSchema } from "../schemas";
import type { AuthField, LoginValues } from "../types";
import { AuthCard } from "./auth-card";
import { FormAlert } from "@/components/shared/form-alert";
import { AuthSocialButtons } from "./auth-social-buttons";

const DEFAULT_TARGET = "/dashboard";

/**
 * The middleware stores the intercepted path without a locale prefix, because
 * the locale-aware router adds it back. A hand-edited `?next=` must not be able
 * to leave the site or double the prefix.
 */
function safeNextPath(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_TARGET;
  }

  const [, first, ...rest] = value.split("/");

  return routing.locales.some((locale) => locale === first)
    ? `/${rest.join("/")}`
    : value;
}

type LoginFormProps = {
  /** Path the middleware intercepted, e.g. `/parents/track-kid`. */
  nextPath?: string;
};

/**
 * Login form.
 *
 * Validation runs twice: here through the zod resolver, and again inside the
 * Server Action. `noValidate` keeps the browser's unlocalised bubbles out of the
 * way so every message comes from the translated schema. The email field is
 * forced to `dir="ltr"` because an address is Latin text even when the page is
 * Arabic; the label and any error still follow the document direction.
 */
export function LoginForm({ nextPath }: LoginFormProps) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const schema = useMemo(() => createLoginSchema(t), [t]);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result = await login(values);

    if (result.status === "success") {
      router.replace(safeNextPath(nextPath));
      router.refresh();
      return;
    }

    if (result.status === "error") {
      setFormError(result.formError ?? null);

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(field as AuthField, { message });
      }
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <AuthCard
      title={t("Login.title")}
      subtitle={t("Login.subtitle")}
      footerText={t("Login.noAccount")}
      footerLinkLabel={t("Login.signupLink")}
      footerHref="/signup"
    >
      <Form {...form}>
        <form noValidate onSubmit={onSubmit} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.email.label")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    placeholder={t("fields.email.placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.password.label")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder={t("fields.password.placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}

          <Button
            type="submit"
            size="md"
            className="w-full"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? t("Login.submitting") : t("Login.submit")}
          </Button>
        </form>
      </Form>
      <AuthSocialButtons />
    </AuthCard>
  );
}
