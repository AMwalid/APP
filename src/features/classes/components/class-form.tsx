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
import { createClass, updateClass } from "../actions";
import { createClassSchema } from "../schemas";
import type { Class, ClassFormValues } from "../types";

type ClassFormProps = {
  /** Closes the dialog. Called on cancel and after a successful submit. */
  onDone: () => void;
} & ({ mode: "create"; classItem?: undefined } | { mode: "edit"; classItem: Class });

/**
 * The body of the create/edit class dialog.
 *
 * One form for both modes. The only branch on `mode` is the action call; the
 * fields, validation, error mapping and busy state are identical, because an
 * edit has to obey exactly the same rules as a create.
 *
 * Separate from `ClassDialog` so it can be loaded on demand: this module is what
 * pulls in zod and react-hook-form, and the classes page must not ship that to a
 * teacher who never opens the dialog.
 *
 * Validation runs twice with the same schema: here for the user, and again in
 * the action because the browser is not a trust boundary. `noValidate` keeps the
 * browser's unlocalised bubbles out of the way.
 *
 * Field errors from the action are pushed back into the same `FormMessage` slots
 * the client-side check uses, so a server rejection looks identical to a local
 * one. Only the form-level message (expired session, failed write) needs its own
 * slot.
 *
 * Closing the dialog unmounts this component, so every open starts from the
 * values passed in — no stale fields and no manual `reset()`.
 */
export function ClassForm(props: ClassFormProps) {
  const t = useTranslations("Dashboard");
  const schema = useMemo(() => createClassSchema(t), [t]);
  const [formError, setFormError] = useState<string | null>(null);

  const classItem = props.mode === "edit" ? props.classItem : undefined;

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: classItem?.name ?? "",
      subject: classItem?.subject ?? "",
      gradeLevel: classItem?.gradeLevel ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result =
      props.mode === "edit"
        ? await updateClass(props.classItem.id, values)
        : await createClass(values);

    if (result.status === "success") {
      // Radix unmounts the content, so there is no stale state to reset.
      props.onDone();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        form.setError(field as keyof ClassFormValues, { message });
      }
    }

    if (result.formError) {
      setFormError(result.formError);
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form noValidate onSubmit={onSubmit} className="mt-5 space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("classes.form.fields.name.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  autoComplete="off"
                  placeholder={t("classes.form.fields.name.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("classes.form.fields.subject.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder={t("classes.form.fields.subject.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gradeLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("classes.form.fields.gradeLevel.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder={t("classes.form.fields.gradeLevel.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}

        <DialogFooter className="pt-1">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={props.onDone}
          >
            {t("classes.form.cancel")}
          </Button>
          <Button type="submit" size="md" disabled={isSubmitting}>
            {isSubmitting
              ? t("classes.form.submitBusy")
              : props.mode === "edit"
                ? t("classes.form.submitEdit")
                : t("classes.form.submit")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
