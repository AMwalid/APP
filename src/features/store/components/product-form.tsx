"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
import { createProduct, updateProduct } from "../actions";
import { createProductSchema } from "../schemas";
import { PRODUCT_TYPES } from "../types";
import type { ProductFormValues } from "../types";

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  defaultValues?: ProductFormValues;
};

const inputClasses =
  "flex w-full rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-standard placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive";

const emptyValues: ProductFormValues = {
  title: "",
  type: "Course",
  price: "",
  description: "",
};

/** Shared create/edit form for a seller's store listing. */
export function ProductForm({
  mode,
  productId,
  defaultValues = emptyValues,
}: ProductFormProps) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const schema = useMemo(() => createProductSchema(t), [t]);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSuccess(null);

    const payload = new FormData();
    payload.set("title", values.title);
    payload.set("type", values.type);
    payload.set("price", values.price);
    payload.set("description", values.description);

    const result =
      mode === "create" && !productId
        ? await createProduct(payload)
        : await updateProduct(productId ?? "", payload);

    if (result.status === "success") {
      form.reset(values);
      setSuccess(result.message ?? t("store.form.success"));
      router.refresh();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        form.setError(field as keyof ProductFormValues, { message });
      }
    }
    setFormError(result.formError ?? null);
  });

  const { isDirty, isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form noValidate onSubmit={onSubmit} className="space-y-5">
        {success && !isDirty ? (
          <FormAlert tone="success">{success}</FormAlert>
        ) : null}
        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("store.form.title")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  maxLength={140}
                  placeholder={t("store.form.titlePlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("store.form.type")}</FormLabel>
                <FormControl>
                  <select {...field} className={inputClasses}>
                    {PRODUCT_TYPES.map((option) => (
                      <option key={option} value={option}>
                        {t(
                          option === "Course"
                            ? "store.form.typeCourse"
                            : option === "Book"
                              ? "store.form.typeBook"
                              : "store.form.typeSupply",
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("store.form.price")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    inputMode="decimal"
                    placeholder={t("store.form.pricePlaceholder")}
                    aria-describedby="store-price-hint"
                  />
                </FormControl>
                <FormDescription id="store-price-hint">
                  {t("store.form.priceHint")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("store.form.description")}</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={4}
                  maxLength={2000}
                  placeholder={t("store.form.descriptionPlaceholder")}
                  className={`${inputClasses} resize-y leading-relaxed`}
                />
              </FormControl>
              <FormDescription>
                {t("store.form.descriptionHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end border-t border-border pt-5">
          <Button type="submit" size="md" disabled={isSubmitting || !isDirty}>
            {isSubmitting
              ? t("store.form.submitBusy")
              : mode === "create"
                ? t("store.form.submitCreate")
                : t("store.form.submitUpdate")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
