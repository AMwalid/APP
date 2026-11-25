"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/shared/form-alert";
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
import { saveInstitutionProfile } from "../actions";
import { createInstitutionSchema } from "../schemas";
import { INSTITUTION_TYPES } from "../types";
import type { InstitutionFormValues } from "../types";

type InstitutionProfileFormProps = {
  defaultValues: InstitutionFormValues;
};

const inputClasses =
  "flex w-full rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-standard placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive";

/** Create/edit form for the signed-in institution admin. */
export function InstitutionProfileForm({
  defaultValues,
}: InstitutionProfileFormProps) {
  const t = useTranslations("Dashboard");
  const schema = useMemo(() => createInstitutionSchema(t), [t]);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<InstitutionFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSuccess(null);

    const payload = new FormData();
    payload.set("name", values.name);
    payload.set("type", values.type);
    payload.set("location", values.location);
    payload.set("description", values.description);

    const result = await saveInstitutionProfile(payload);

    if (result.status === "success") {
      form.reset(values);
      setSuccess(result.message ?? t("institutionProfile.form.success"));
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        form.setError(field as keyof InstitutionFormValues, { message });
      }
    }
    setFormError(result.formError ?? null);
  });

  const { isDirty, isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form noValidate onSubmit={onSubmit} className="space-y-6">
        {success && !isDirty ? (
          <FormAlert tone="success">{success}</FormAlert>
        ) : null}
        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("institutionProfile.form.name")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  maxLength={120}
                  placeholder={t("institutionProfile.form.namePlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("institutionProfile.form.type")}</FormLabel>
              <FormControl>
                <select {...field} className={inputClasses}>
                  {INSTITUTION_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {t(
                        option === "School"
                          ? "institutionProfile.form.typeSchool"
                          : "institutionProfile.form.typeTutoringCenter",
                      )}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("institutionProfile.form.location")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  maxLength={120}
                  placeholder={t("institutionProfile.form.locationPlaceholder")}
                />
              </FormControl>
              <FormDescription>
                {t("institutionProfile.form.locationHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("institutionProfile.form.description")}</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={5}
                  maxLength={2000}
                  placeholder={t("institutionProfile.form.descriptionPlaceholder")}
                  className={`${inputClasses} resize-y leading-relaxed`}
                />
              </FormControl>
              <FormDescription>
                {t("institutionProfile.form.descriptionHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end border-t border-border pt-5">
          <Button type="submit" size="md" disabled={isSubmitting || !isDirty}>
            {isSubmitting
              ? t("institutionProfile.form.submitBusy")
              : t("institutionProfile.form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
