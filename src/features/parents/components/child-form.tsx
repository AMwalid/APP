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
import { createChild, updateChild } from "../actions";
import { createChildSchema } from "../schemas";
import type { Child, ChildFormValues } from "../types";

type ChildFormProps = {
  /** Closes the dialog. Called on cancel and after a successful submit. */
  onDone: () => void;
} & ({ mode: "create"; child?: undefined } | { mode: "edit"; child: Child });

/**
 * The body of the create/edit child dialog.
 *
 * One form for both modes. The only branch on `mode` is the action call; the
 * fields, validation, error mapping and busy state are identical, because an
 * edit has to obey exactly the same rules as a create.
 *
 * Separate from `ChildDialog` so it can be loaded on demand: this module is what
 * pulls in zod and react-hook-form, and the children page must not ship that to
 * a visitor who never opens the dialog.
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
export function ChildForm(props: ChildFormProps) {
  const t = useTranslations("Dashboard");
  const schema = useMemo(() => createChildSchema(t), [t]);
  const [formError, setFormError] = useState<string | null>(null);

  const child = props.mode === "edit" ? props.child : undefined;

  const form = useForm<ChildFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: child?.name ?? "",
      // Back to a string: the input's value type, and what the schema expects.
      age: child ? String(child.age) : "",
      school: child?.school ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result =
      props.mode === "edit"
        ? await updateChild(props.child.id, values)
        : await createChild(values);

    if (result.status === "success") {
      // Radix unmounts the content, so there is no stale state to reset.
      props.onDone();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        form.setError(field as keyof ChildFormValues, { message });
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
              <FormLabel>{t("children.form.fields.name.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  autoComplete="off"
                  placeholder={t("children.form.fields.name.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("children.form.fields.age.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  inputMode="numeric"
                  // Digits stay left-to-right even on an Arabic page.
                  dir="ltr"
                  min={3}
                  max={25}
                  autoComplete="off"
                  placeholder={t("children.form.fields.age.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("children.form.fields.school.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder={t("children.form.fields.school.placeholder")}
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
            {t("children.form.cancel")}
          </Button>
          <Button type="submit" size="md" disabled={isSubmitting}>
            {isSubmitting
              ? t("children.form.submitBusy")
              : props.mode === "edit"
                ? t("children.form.submitEdit")
                : t("children.form.submit")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
