"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * Icon-only search control.
 *
 * The global search index does not exist yet, so this opens a placeholder
 * command palette instead of navigating. Replace the dialog body with the real
 * palette when `/search` lands; the trigger and its accessible name stay.
 */
export function SearchButton() {
  const t = useTranslations("Navigation");
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t("a11y.search")}
          className="inline-flex size-9 items-center justify-center rounded-control text-primary-hover transition-colors duration-150 ease-standard hover:bg-surface-subtle"
        >
          <Search aria-hidden className="size-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-overlay animate-overlay-in bg-foreground/30 backdrop-blur-[2px]" />

        <Dialog.Content className="fixed inset-x-4 top-24 z-modal mx-auto max-w-lg animate-sheet-in rounded-control border border-border bg-surface p-4 shadow-panel sm:top-32">
          <Dialog.Title className="text-sm font-semibold text-foreground">
            {t("search.title")}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-xs text-muted-foreground">
            {t("search.note")}
          </Dialog.Description>

          <div className="mt-3 flex items-center gap-2 rounded-control border border-border px-3">
            <Search aria-hidden className="size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder={t("search.placeholder")}
              className="h-10 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="mt-3 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-xs font-medium text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
              >
                {t("search.close")}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
