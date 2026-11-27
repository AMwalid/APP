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
import type { InstitutionOption } from "@/features/institutions";
import { updateTeacherProfile } from "../actions";
import { createTeacherProfileSchema } from "../schemas";
import type { TeacherProfileFormValues } from "../types";

type TeacherProfileFormProps = {
  defaultValues: TeacherProfileFormValues;
  institutions: readonly InstitutionOption[];
};

/**
 * The teacher profile form.
 *
 * Validation runs twice with the same schema: here for the user, and again in
 * the action because the browser is not a trust boundary. `noValidate` keeps the
 * browser's unlocalised bubbles out of the way.
 *
 * Field errors from the action are pushed back into the same slots the local
 * check uses, so a server rejection looks identical to a local one. The form
 * stays mounted after a save; the success message is shown only while the form
 * still matches what was saved, and the first keystroke hides it.
 */
export function TeacherProfileForm({
  defaultValues,
  institutions,
}: TeacherProfileFormProps) {
  const t = useTranslations("Dashboard");
  const schema = useMemo(() => createTeacherProfileSchema(t), [t]);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<TeacherProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSaved(false);

    const result = await updateTeacherProfile(values);

    if (result.status === "success") {
      form.reset(values);
      setSaved(true);
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        form.setError(field as keyof TeacherProfileFormValues, { message });
      }
    }

    if (result.formError) {
      setFormError(result.formError);
    }
  });

  const { isDirty, isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form noValidate onSubmit={onSubmit} className="space-y-6">
        {saved && !isDirty ? (
          <FormAlert tone="success">
            {t("teacherProfile.form.success")}
          </FormAlert>
        ) : null}

        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("teacherProfile.form.fullName")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="name"
                  maxLength={80}
                  placeholder={t("teacherProfile.form.fullNamePlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("teacherProfile.form.specialization")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  maxLength={80}
                  placeholder={t(
                    "teacherProfile.form.specializationPlaceholder",
                  )}
                />
              </FormControl>
              <FormDescription>
                {t("teacherProfile.form.specializationHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experienceYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("teacherProfile.form.experienceYears")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={60}
                  step={1}
                  placeholder={t(
                    "teacherProfile.form.experienceYearsPlaceholder",
                  )}
                />
              </FormControl>
              <FormDescription>
                {t("teacherProfile.form.experienceYearsHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentInstitutionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("teacherProfile.form.currentInstitution")}
              </FormLabel>
              <FormControl>
                {/*
                  A styled native select: components/ui has no Select primitive
                  yet, and that generated folder is left untouched. The empty
                  value means "not linked", which the action stores as NULL.
                */}
                <select
                  {...field}
                  className="flex h-10 w-full rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-standard disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
                >
                  <option value="">
                    {t("teacherProfile.form.currentInstitutionNone")}
                  </option>
                  {institutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {t("teacherProfile.form.currentInstitutionOption", {
                        name: institution.name,
                        location: institution.location,
                      })}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormDescription>
                {t("teacherProfile.form.currentInstitutionHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("teacherProfile.form.bio")}</FormLabel>
              <FormControl>
                {/*
                  A styled native textarea: components/ui has no Textarea
                  primitive yet, and that generated folder is left untouched.
                  The classes match Input plus a taller, resizable box.
                */}
                <textarea
                  {...field}
                  rows={5}
                  maxLength={1000}
                  placeholder={t("teacherProfile.form.bioPlaceholder")}
                  className="flex w-full resize-y rounded-control border border-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground transition-colors duration-150 ease-standard placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
                />
              </FormControl>
              <FormDescription>{t("teacherProfile.form.bioHint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end border-t border-border pt-5">
          <Button type="submit" size="md" disabled={isSubmitting || !isDirty}>
            {isSubmitting
              ? t("teacherProfile.form.submitBusy")
              : t("teacherProfile.form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
