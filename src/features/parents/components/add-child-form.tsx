"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
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
 * Validation mirrors the auth forms — a zod schema built from translated
 * messages, so errors read in the page's language. `noValidate` keeps the
 * browser's unlocalised bubbles out of the way.
 *
 * Nothing is persisted yet; the values are logged and the dialog closes.
 */
export function AddChildForm({ onDone }: AddChildFormProps) {
  const t = useTranslations("Dashboard");
  const schema = useMemo(() => createAddChildSchema(t), [t]);

  const form = useForm<AddChildValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", age: "", school: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    // TODO(PAR-03): replace with createChild() once child profiles are writable.
    console.log("add-child", { ...values, age: Number(values.age) });
    onDone();
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

        <DialogFooter className="pt-1">
          <Button type="button" variant="outline" size="md" onClick={onDone}>
            {t("children.addChildDialog.cancel")}
          </Button>
          <Button type="submit" size="md" disabled={isSubmitting}>
            {t("children.addChildDialog.submit")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
