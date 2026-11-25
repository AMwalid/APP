import { getTranslations } from "next-intl/server";
import { getSellerProducts } from "../queries";
import { ProductForm } from "./product-form";
import { SellerProductList } from "./seller-product-list";

/** Composition for `/dashboard/store`. */
export async function StoreDashboardView({ locale }: { locale: string }) {
  const t = await getTranslations("Dashboard");
  const products = await getSellerProducts();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("store.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("store.subtitle")}
        </p>
      </header>

      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          {t("store.createTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("store.createSubtitle")}
        </p>
        <div className="mt-6">
          <ProductForm mode="create" />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("store.list.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("store.list.subtitle")}
          </p>
        </div>
        <SellerProductList products={products} locale={locale} />
      </section>
    </div>
  );
}
