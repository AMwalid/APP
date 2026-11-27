import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Product, ProductRow, PublicProduct } from "./types";

function asPublicProduct(row: {
  id: unknown;
  title: unknown;
  description: unknown;
  price: unknown;
  type: unknown;
  created_at: unknown;
  seller_name: unknown;
}): PublicProduct {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    price: Number(row.price),
    type: String(row.type),
    createdAt: String(row.created_at),
    sellerName: String(row.seller_name),
  };
}

function asSellerProduct(row: ProductRow): Product {
  return {
    id: row.id,
    sellerId: row.seller_id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    type: row.type,
    createdAt: row.created_at,
  };
}

/** Public storefront rows, filtered by title through a bounded RPC. */
export async function getPublicProducts(needle: string): Promise<PublicProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_public_products", {
    needle,
  });

  if (error) {
    throw new Error(
      "[store] getPublicProducts failed: " + (error.code ?? error.message),
    );
  }

  return Array.isArray(data) ? data.map((row) => asPublicProduct(row)) : [];
}

/** The signed-in seller's own listings, newest first. */
export async function getSellerProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, seller_id, title, description, price, type, created_at")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      "[store] getSellerProducts failed: " + (error.code ?? error.message),
    );
  }

  return (data ?? []).map((row) => asSellerProduct(row as ProductRow));
}
