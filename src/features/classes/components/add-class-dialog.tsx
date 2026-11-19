"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClassDialog } from "./class-dialog";

/**
 * "Create class" trigger and dialog shell.
 *
 * A thin wrapper around `ClassDialog`: the page only ever creates, so the mode
 * and the dialog's open state live here and the page stays a server component.
 * The card menu opens the same dialog in edit mode with its own state.
 */
export function AddClassDialog() {
  const t = useTranslations("Dashboard");
  const [open, setOpen] = useState(false);

  return (
    <ClassDialog
      mode="create"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button type="button" variant="primary" size="sm" className="shrink-0">
          <Plus aria-hidden className="size-4" />
          {t("classes.addClass")}
        </Button>
      }
    />
  );
}
