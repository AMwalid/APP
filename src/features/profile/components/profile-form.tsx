"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";
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
import { updateProfile } from "../actions";
import { createProfileSchema } from "../schemas";
import { USER_ROLES, type ProfileFormValues } from "../types";

type ProfileFormProps = {
  /** The profile as the server read it, or the empty defaults when it is missing. */
  defaultValues: ProfileFormValues;
};

/**
 * The account settings form: full name and role.
 *
 * Validation runs twice with the same schema: here for the user, and again in
 * the action because the browser is not a trust boundary. `noValidate` keeps the
 * browser's unlocalised bubbles out of the way.
 *
 * Field errors from the action are pushed back into the same slots the
 * client-side check uses, so a server rejection looks identical to a local one.
 *
 * Unlike the child dialog this form stays mounted after a save, so success is a
 * piece of state rather than an unmount. It is shown only while the form still
 * matches what was saved: the first keystroke hides it, because the values on
 * screen are no longer the values in the database.
 *
 * The submit button is disabled until something changes. Saving an unchanged
 * profile is a write that can only fail.
 */
export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const t = useTranslations("Dashboard");
  const schema = useMemo(() => createProfileSchema(t), [t]);
  const roleErrorId = useId();
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSaved(false);

    const result = await updateProfile(values);

    if (result.status === "success") {
      // New defaults: the form is clean again, so the button disables and the
      // success message can stay up until the next edit.
      form.reset(values);
      setSaved(true);
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        form.setError(field as keyof ProfileFormValues, { message });
      }
    }

    if (result.formError) {
      setFormError(result.formError);
    }
  });

  const { errors, isDirty, isSubmitting } = form.formState;
  const roleError = errors.role?.message;

  return (
    <Form {...form}>
      <form noValidate onSubmit={onSubmit} className="space-y-6">
        {saved && !isDirty ? (
          <FormAlert tone="success">{t("settings.form.success")}</FormAlert>
        ) : null}

        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.form.fullName")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="name"
                  maxLength={80}
                  placeholder={t("settings.form.fullNamePlaceholder")}
                />
              </FormControl>
              <FormDescription>
                {t("settings.form.fullNameHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*
          A fieldset, not a FormControl: the control here is a group of three
          radios, and `FormControl` would put the label's `htmlFor` on the group
          wrapper instead of a focusable input. The legend labels the group the
          way a `<label>` labels one field.
        */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <fieldset
                aria-invalid={!!roleError}
                aria-describedby={roleError ? roleErrorId : undefined}
              >
                <legend className="mb-2 text-sm font-medium text-foreground">
                  {t("settings.form.role")}
                </legend>

                <div className="grid gap-2 sm:grid-cols-3">
                  {USER_ROLES.map((role) => (
                    <label
                      key={role}
                      className="flex cursor-pointer items-center gap-2.5 rounded-control border border-border p-3 text-sm text-foreground transition-colors duration-150 ease-standard has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={role}
                        checked={field.value === role}
                        onChange={() => field.onChange(role)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        className="size-4 shrink-0 accent-primary"
                      />
                      <span>{t(`settings.form.roles.${role}`)}</span>
                    </label>
                  ))}
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {t("settings.form.roleHint")}
                </p>

                {roleError ? (
                  <p id={roleErrorId} className="mt-2 text-sm text-destructive">
                    {roleError}
                  </p>
                ) : null}
              </fieldset>
            </FormItem>
          )}
        />

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="submit"
            size="md"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting
              ? t("settings.form.submitBusy")
              : t("settings.form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
