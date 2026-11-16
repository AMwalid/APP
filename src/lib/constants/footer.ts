/**
 * Footer link structure, in the same shape as `navigation.ts`: ids, label keys
 * resolved against the `Footer` namespace, and locale-less hrefs that
 * `@/lib/i18n/navigation` prefixes with the active locale.
 *
 * Pricing points at `/prices` rather than `/pricing` because the header
 * already sends "Our Prices" there; two routes for one page would split the
 * link equity and confuse the active state.
 */

export type FooterLink = {
  id: string;
  labelKey: string;
  href: string;
};

export type FooterColumn = {
  id: "product" | "company" | "legal";
  headingKey: string;
  links: readonly FooterLink[];
};

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    id: "product",
    headingKey: "columns.product",
    links: [
      { id: "features", labelKey: "links.features", href: "/features" },
      { id: "pricing", labelKey: "links.pricing", href: "/prices" },
      { id: "store", labelKey: "links.store", href: "/store" },
    ],
  },
  {
    id: "company",
    headingKey: "columns.company",
    links: [
      { id: "about", labelKey: "links.about", href: "/about" },
      { id: "contact", labelKey: "links.contact", href: "/contact" },
      { id: "careers", labelKey: "links.careers", href: "/careers" },
    ],
  },
  {
    id: "legal",
    headingKey: "columns.legal",
    links: [
      { id: "privacy", labelKey: "links.privacy", href: "/privacy" },
      { id: "terms", labelKey: "links.terms", href: "/terms" },
    ],
  },
];
