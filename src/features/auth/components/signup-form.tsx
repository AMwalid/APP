"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSignupSchema } from "../schemas";
import type { SignupValues } from "../types";
import { AuthCard } from "./auth-card";

/**
 * Signup form shell.
 *
 * Email and password only: the spec leaves "can one account hold multiple
 * roles?" open, so inventing a role picker here would encode an unanswered
 * product question into the UI. Role details belong to a later step, after
 * the account exists.
 */
export function SignupForm() {
  const t = useTranslations("Auth");
  const schema = useMemo(() => createSignupSchema(t), [t]);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <AuthCard
      title={t("Signup.title")}
      subtitle={t("Signup.subtitle")}
      footerText={t("Signup.haveAccount")}
      footerLinkLabel={t("Signup.loginLink")}
      footerHref="/login"
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
                    autoComplete="new-password"
                    placeholder={t("fields.password.placeholder")}
                  />
                </FormControl>
                <FormDescription>{t("Signup.passwordHint")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="md" className="w-full">
            {t("Signup.submit")}
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
