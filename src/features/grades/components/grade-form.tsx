"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/shared/form-alert";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createGrade } from "../actions";
import { createGradeSchema } from "../schemas";
import type { GradeFormValues } from "../types";

/**
 * The body of the Add Grade dialog.
 *
 * Same shape as the class form: react-hook-form validates with the same schema
 * the Server Action uses, `noValidate` keeps the browser's unlocalised bubbles
 * away, and server field errors are pushed back into the same FormMessage slots.
 *
 * Values stay strings. A number input produces a string, and the schema checks
 * its exact shape (up to two decimals, no exponents) before the action converts
 * it to a number for Postgres.
 */
export function GradeForm({
  classId,
  enrollmentId,
  onDone,
}: {
  classId: string;
  enrollmentId: string;
  onDone: () => void;
}) {
  const t = useTranslations("Dashboard");
  const schema = useMemo(() => createGradeSchema(t), [t]);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<GradeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", score: "", maxScore: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result = await createGrade(classId, enrollmentId, values);

    if (result.status === "success") {
      onDone();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        form.setError(field as keyof GradeFormValues, { message });
      }
    }

    if (result.formError) {
      setFormError(result.formError);
    }
  });

  return (
    <Form {...form}>
      <form noValidate onSubmit={onSubmit} className="mt-5 space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("gradebook.add.fields.title.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  autoComplete="off"
                  placeholder={t("gradebook.add.fields.title.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("gradebook.add.fields.score.label")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    autoComplete="off"
                    placeholder={t("gradebook.add.fields.score.placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("gradebook.add.fields.maxScore.label")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    autoComplete="off"
                    placeholder={t("gradebook.add.fields.maxScore.placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}

        <DialogFooter className="pt-1">
          <Button type="button" variant="outline" size="md" onClick={onDone}>
            {t("gradebook.add.cancel")}
          </Button>
          <Button type="submit" size="md" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? t("gradebook.add.submitBusy")
              : t("gradebook.add.submit")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
