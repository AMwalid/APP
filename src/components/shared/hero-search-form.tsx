import { Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroSearchFormProps = {
  /** Stable id so the visually hidden label points at this form's input. */
  id: string;
  /** Locale-prefixed destination, e.g. `/${locale}/teachers`. */
  action: string;
  label: string;
  placeholder: string;
  buttonLabel: string;
  /** Current `q`, so a search page can pre-fill the field it just received. */
  defaultValue?: string;
  className?: string;
};

/**
 * Shared GET search form for hero sections.
 *
 * A plain form keeps the query in the URL and the results server-rendered:
 * submitting `/en` with "math" lands on `/en/teachers?q=math`, where the page
 * reads `searchParams.q` and filters before sending HTML. No client JS and no
 * Server Action are involved, and the browser handles URL encoding.
 */
export function HeroSearchForm({
  id,
  action,
  label,
  placeholder,
  buttonLabel,
  defaultValue,
  className,
}: HeroSearchFormProps) {
  return (
    <form
      role="search"
      method="get"
      action={action}
      className={cn("w-full max-w-xl", className)}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-control border border-border bg-surface p-1.5 ps-3 transition-colors duration-150 ease-standard focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <Search
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground"
        />
        <input
          id={id}
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className={buttonVariants({ variant: "primary", size: "md" })}
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
