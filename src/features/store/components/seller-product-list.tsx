"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import { deleteProduct } from "../actions";
import type { Product } from "../types";
import { ProductForm } from "./product-form";

type SellerProductListProps = {
  products: readonly Product[];
  locale: string;
};

/** The signed-in seller's listings, with inline edit and confirmed delete. */
export function SellerProductList({ products, locale }: SellerProductListProps) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirmDelete() {
    if (!pendingDelete) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProduct(pendingDelete.id);

      if (result.status === "success") {
        setDeleteError(null);
        setPendingDelete(null);
        router.refresh();
        return;
      }

      setDeleteError(result.formError ?? t("store.list.deleteError"));
    });
  }

  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-surface-muted p-10 text-center text-sm text-muted-foreground">
        {t("store.list.empty")}
      </p>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-xl border border-border bg-background p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  {product.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t(
                    product.type === "Course"
                      ? "store.form.typeCourse"
                      : product.type === "Book"
                        ? "store.form.typeBook"
                        : "store.form.typeSupply",
                  )}
                  {" · "}
                  <span className="font-medium text-primary-deep">
                    {formatPrice(product.price, locale)}
                  </span>
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEditingId((current) =>
                      current === product.id ? null : product.id,
                    )
                  }
                >
                  {editingId === product.id
                    ? t("store.list.cancelEdit")
                    : t("store.list.edit")}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setDeleteError(null);
                    setPendingDelete(product);
                  }}
                >
                  {t("store.list.delete")}
                </Button>
              </div>
            </div>

            {editingId === product.id ? (
              <div className="mt-5 border-t border-border pt-5">
                <ProductForm
                  mode="edit"
                  productId={product.id}
                  defaultValues={{
                    title: product.title,
                    type: product.type,
                    price: String(product.price),
                    description: product.description,
                  }}
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteError(null);
            setPendingDelete(null);
          }
        }}
      >
        <DialogContent closeLabel={t("store.list.close")}>
          <DialogHeader>
            <DialogTitle>{t("store.list.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("store.list.deleteBody", { title: pendingDelete?.title ?? "" })}
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <p role="alert" className="text-sm text-destructive-deep">
              {deleteError}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDelete(null)}
              disabled={isPending}
            >
              {t("store.list.cancelDelete")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isPending}
            >
              {isPending
                ? t("store.list.deleteBusy")
                : t("store.list.confirmDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
