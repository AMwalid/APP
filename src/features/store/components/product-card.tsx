import { BookOpen, Package, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { PublicProduct } from "../types";

type ProductCardProps = {
  product: PublicProduct;
  locale: string;
  labels: {
    type: (type: string) => string;
    soldBy: string;
  };
};

function TypeIcon({ type }: { type: string }) {
  if (type === "Course") {
    return <BookOpen className="size-5" aria-hidden="true" />;
  }
  if (type === "Book") {
    return <Tag className="size-5" aria-hidden="true" />;
  }
  return <Package className="size-5" aria-hidden="true" />;
}

/** One public storefront listing. Detail pages and checkout are out of scope. */
export function ProductCard({ product, locale, labels }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <TypeIcon type={product.type} />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{product.title}</h3>
          <p className="text-sm text-muted-foreground">
            {labels.type(product.type)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
        <p className="text-lg font-semibold text-primary-deep">
          {formatPrice(product.price, locale)}
        </p>
        <p className="text-xs text-muted-foreground">
          {labels.soldBy} <span className="font-medium">{product.sellerName}</span>
        </p>
      </div>
    </article>
  );
}
