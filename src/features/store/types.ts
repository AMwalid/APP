/**
 * Types for the public store and the seller-managed listings (MKT-01).
 *
 * The Supabase CLI is not wired into this checkout yet, so row shapes are
 * written from `20261125000000_create_store_products.sql` and must stay in sync
 * with it until generated types are available.
 */

export const PRODUCT_TYPES = ["Course", "Book", "Supply"] as const;

export type PublicProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  createdAt: string;
  sellerName: string;
};

export type Product = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  type: string;
  createdAt: string;
};

export type ProductRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number | string;
  type: string;
  created_at: string;
};

/** Price stays a string in the form so decimal input is not rounded by JS. */
export type ProductFormValues = {
  title: string;
  type: string;
  price: string;
  description: string;
};

export type ProductField = keyof ProductFormValues;

export type ProductResult =
  | { status: "success"; message?: string }
  | {
      status: "error";
      fieldErrors?: Partial<Record<ProductField, string>>;
      formError?: string;
    };
