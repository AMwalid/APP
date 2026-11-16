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
import { createLoginSchema } from "../schemas";
import type { LoginValues } from "../types";
import { AuthCard } from "./auth-card";

/**
 * Login form shell.
 *
 * Validation is real; submission is not wired yet. `noValidate` keeps the
 * browser's unlocalised bubbles out of the way so every message comes from the
 * translated Zod schema. The email field is forced to `dir="ltr"` because an
 * address is Latin text even when the page is Arabic; the label and any error
 * still follow the document direction.
 */
export function LoginForm() {
  const t = useTranslations("Auth");
  const schema = useMemo(() => createLoginSchema(t), [t]);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <AuthCard
      title={t("Login.title")}
      subtitle={t("Login.subtitle")}
      footerText={t("Login.noAccount")}
      footerLinkLabel={t("Login.signupLink")}
      footerHref="/signup"
    >
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(() => setSubmitted(true))}
          className="space-y-5"
        >
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

          <Button type="submit" size="md" className="w-full">
            {t("Login.submit")}
          </Button>

          {submitted ? (
            <p
              role="status"
              className="rounded-control bg-primary-soft p-3 text-sm leading-relaxed text-primary-deep"
            >
              {t("notice")}
            </p>
          ) : null}
        </form>
      </Form>
    </AuthCard>
  );
}
