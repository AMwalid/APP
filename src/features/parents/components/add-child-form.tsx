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
import { createChild } from "../actions";
import { createAddChildSchema } from "../schemas";
import type { AddChildValues } from "../types";

type AddChildFormProps = {
  /** Closes the dialog. Called on cancel and after a successful submit. */
  onDone: () => void;
};

/**
 * The body of the "add child" dialog.
 *
 * Separate from `AddChildDialog` so it can be loaded on demand: this module is
 * what pulls in zod and react-hook-form, and the children page must not ship
 * that to a visitor who never opens the dialog. `AddChildDialog` loads it with
 * `next/dynamic` once the dialog mounts.
 *
 * Validation runs twice with the same schema: here for the user, and again in
 * `createChild` because the browser is not a trust boundary. `noValidate` keeps
 * the browser's unlocalised bubbles out of the way.
 *
 * Field errors from the action are pushed back into the same `FormMessage`
 * slots the client-side check uses, so a server rejection looks identical to a
 * local one. Only the form-level message (expired session, failed insert) needs
 * its own slot.
 */
export function AddChildForm({ onDone }: AddChildFormProps) {
  const t = useTranslations("Dashboard");
  const schema = useMemo(() => createAddChildSchema(t), [t]);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<AddChildValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", age: "", school: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result = await createChild(values);

    if (result.status === "success") {
      // Radix unmounts the content, so there is no stale state to reset.
      onDone();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        form.setError(field as keyof AddChildValues, { message });
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
              <FormLabel>
                {t("children.addChildDialog.fields.name.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  autoComplete="off"
                  placeholder={t("children.addChildDialog.fields.name.placeholder")}
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
              <FormLabel>
                {t("children.addChildDialog.fields.age.label")}
              </FormLabel>
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
                  placeholder={t("children.addChildDialog.fields.age.placeholder")}
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
              <FormLabel>
                {t("children.addChildDialog.fields.school.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder={t(
                    "children.addChildDialog.fields.school.placeholder",
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}

        <DialogFooter className="pt-1">
          <Button type="button" variant="outline" size="md" onClick={onDone}>
            {t("children.addChildDialog.cancel")}
          </Button>
          <Button type="submit" size="md" disabled={isSubmitting}>
            {isSubmitting
              ? t("children.addChildDialog.submitBusy")
              : t("children.addChildDialog.submit")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
