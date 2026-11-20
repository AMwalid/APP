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
import { useRouter } from "@/lib/i18n/navigation";
import { signup } from "../actions";
import { createSignupSchema } from "../schemas";
import type { AuthField, SignupValues } from "../types";
import { AuthCard } from "./auth-card";
import { FormAlert } from "@/components/shared/form-alert";
import { AuthSocialButtons } from "./auth-social-buttons";

/**
 * Signup form.
 *
 * Email and password only: the spec leaves "can one account hold multiple
 * roles?" open, so inventing a role picker here would encode an unanswered
 * product question into the UI. Role details belong to a later step, after the
 * account exists.
 *
 * When the project requires email confirmation, `signup` returns no session and
 * the form is replaced by a "check your email" notice — resubmitting would only
 * re-send the same mail.
 */
export function SignupForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const schema = useMemo(() => createSignupSchema(t), [t]);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result = await signup(values);

    if (result.status === "success") {
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    if (result.status === "confirmEmail") {
      setConfirmSent(true);
      return;
    }

    setFormError(result.formError ?? null);

    for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
      form.setError(field as AuthField, { message });
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <AuthCard
      title={t("Signup.title")}
      subtitle={t("Signup.subtitle")}
      footerText={t("Signup.haveAccount")}
      footerLinkLabel={t("Signup.loginLink")}
      footerHref="/login"
    >
      {confirmSent ? (
        <FormAlert tone="success">{t("Signup.checkEmail")}</FormAlert>
      ) : (
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
                      autoComplete="new-password"
                      placeholder={t("fields.password.placeholder")}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("Signup.passwordHint")}
                  </FormDescription>
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
              {isSubmitting ? t("Signup.submitting") : t("Signup.submit")}
            </Button>
          </form>
        </Form>
      )}
      {!confirmSent ? <AuthSocialButtons /> : null}
    </AuthCard>
  );
}
