import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Building,
  Clock,
  GraduationCap,
  Heart,
  Lightbulb,
  School,
  Search,
  ShoppingBag,
  Star,
  Target,
  UserCheck,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICONS = {
  book: BookOpen,
  building: Building,
  clock: Clock,
  graduation: GraduationCap,
  heart: Heart,
  lightbulb: Lightbulb,
  school: School,
  search: Search,
  shopping: ShoppingBag,
  star: Star,
  target: Target,
  userCheck: UserCheck,
  users: Users,
} as const;

export type MarketingIconName = keyof typeof ICONS;

function Glyph({
  name,
  className,
}: {
  name: MarketingIconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" className={className} />;
}

export type MarketingStat = {
  id: string;
  value: string;
  label: string;
  icon: MarketingIconName;
};

export type MarketingValueProp = {
  id: string;
  title: string;
  description: string;
  content: string;
  icon: MarketingIconName;
  features: readonly string[];
};

export type MarketingTestimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
};

export type MarketingFeature = {
  id: string;
  title: string;
  description: string;
  icon: MarketingIconName;
  items: readonly string[];
};

export type MarketingPillar = {
  id: string;
  title: string;
  description: string;
  icon: MarketingIconName;
};

export type MarketingTeamMember = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
};

/** Centred icon + value + label cards, lifted from the prototype's stat band. */
export function MarketingStatBand({ items }: { items: readonly MarketingStat[] }) {
  return (
    <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-border bg-surface p-6 shadow-header"
        >
          <Glyph name={item.icon} className="mx-auto mb-2 h-6 w-6 text-primary" />
          <p className="mb-2 text-3xl font-bold text-primary">{item.value}</p>
          <p className="text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

/** Three bordered icon cards with a dot-list of included capabilities. */
export function MarketingValueCards({
  items,
}: {
  items: readonly MarketingValueProp[];
}) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border-2 border-border p-6 transition-colors duration-150 hover:border-primary"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
            <Glyph name={item.icon} className="h-6 w-6 text-primary-deep" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
          <p className="mt-1 text-base text-muted-foreground">
            {item.description}
          </p>
          <p className="mt-4 leading-relaxed text-foreground-secondary">
            {item.content}
          </p>
          {item.features.length ? (
            <ul className="mt-4 space-y-2">
              {item.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                  />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}

/** Prototype-style quotes on a soft gradient, with a ruled author footer. */
export function MarketingTestimonials({
  title,
  items,
}: {
  title: string;
  items: readonly MarketingTestimonial[];
}) {
  return (
    <section aria-labelledby="testimonials-title">
      <h2
        id="testimonials-title"
        className="mb-10 text-center text-3xl font-bold text-primary-deep"
      >
        {title}
      </h2>
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        {items.map((item) => (
          <figure
            key={item.id}
            className="h-full rounded-xl bg-gradient-to-br from-primary-soft to-surface p-6"
          >
            <blockquote className="text-lg leading-relaxed text-foreground-secondary">
              “{item.quote}”
            </blockquote>
            <figcaption className="mt-4 border-t border-border pt-4">
              <p className="font-semibold text-primary-deep">{item.author}</p>
              <p className="text-sm text-muted-foreground">{item.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/**
 * Two-column capability cards with bullet lists.
 *
 * The trailing control is deliberately a styled `<span>`: it reproduces the
 * prototype's full-width button without pretending to be a working link.
 * Wire it to a real route in a later pass.
 */
export function MarketingFeatureGrid({
  title,
  items,
  actionLabel,
}: {
  title: string;
  items: readonly MarketingFeature[];
  actionLabel: string;
}) {
  return (
    <section aria-labelledby="features-title">
      <h2
        id="features-title"
        className="mb-10 text-center text-3xl font-bold text-primary-deep"
      >
        {title}
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-border p-6 transition-shadow duration-150 hover:shadow-panel"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                <Glyph name={item.icon} className="h-5 w-5 text-primary-deep" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {item.title}
              </h3>
            </div>
            <p className="mt-3 text-muted-foreground">{item.description}</p>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-muted-foreground">
              {item.items.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
            <span
              className={cn(buttonVariants({ size: "md" }), "mt-6 w-full cursor-default")}
            >
              {actionLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

/** A prose block: tinted for "Who we are", plain for the origin story. */
export function MarketingProsePanel({
  title,
  paragraphs,
  tone = "plain",
}: {
  title: string;
  paragraphs: readonly string[];
  tone?: "soft" | "plain";
}) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold text-foreground">{title}</h2>
      <div
        className={cn(
          "rounded-xl p-6 leading-relaxed text-foreground-secondary",
          tone === "soft"
            ? "bg-gradient-to-r from-primary-soft to-surface shadow-header"
            : "border border-border bg-surface shadow-header",
        )}
      >
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={cn(index > 0 && "mt-4")}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

/** Paired tinted cards — the prototype's Mission / Vision block. */
export function MarketingPillars({
  items,
}: {
  items: readonly { id: string; title: string; body: string; icon: MarketingIconName }[];
}) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="rounded-xl bg-primary-soft p-6 shadow-header">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Glyph name={item.icon} className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">{item.title}</h2>
          </div>
          <p className="leading-relaxed text-foreground-secondary">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

/** Four centred icon cards — "Why choose IBNI?". */
export function MarketingIconGrid({
  title,
  items,
}: {
  title: string;
  items: readonly MarketingPillar[];
}) {
  return (
    <section aria-labelledby="why-title">
      <h2 id="why-title" className="mb-6 text-2xl font-semibold text-foreground">
        {title}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl p-6 text-center shadow-header">
            <div className="mx-auto mb-4 w-fit rounded-full bg-primary-soft p-3">
              <Glyph name={item.icon} className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-medium text-foreground">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Prototype team cards; photos are served from public/images/team. */
export function MarketingTeamGrid({
  title,
  items,
}: {
  title: string;
  items: readonly MarketingTeamMember[];
}) {
  return (
    <section aria-labelledby="team-title">
      <h2 id="team-title" className="mb-6 text-2xl font-semibold text-foreground">
        {title}
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((member) => (
          <article
            key={member.id}
            className="overflow-hidden rounded-xl border border-border bg-surface shadow-header"
          >
            <div className="flex h-64 items-center justify-center bg-surface">
              <Image
                src={member.image}
                alt={member.name}
                width={400}
                height={400}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="mb-2 text-sm text-muted-foreground">{member.role}</p>
              <p className="text-sm leading-relaxed text-foreground-secondary">
                “{member.quote}”
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
