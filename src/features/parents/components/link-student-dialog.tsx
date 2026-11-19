"use client";

import { Link2, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FormEvent, useState, useTransition } from "react";
import { FormAlert } from "@/components/shared/form-alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { linkStudentToChild, searchStudentsByEmail } from "../actions";
import type { Child, StudentOption } from "../types";

/**
 * "Link to Student Account" on a child card (PAR-04).
 *
 * No debounce: the teacher's student search uses explicit submit for the same
 * reason — an email lookup is a deliberate action, and firing a query on every
 * keystroke would send a Server Action per character. Search and link have
 * separate pending states so a slow search cannot freeze the confirm button,
 * and a new search clears any selection from the previous result set.
 *
 * The RPC only returns id and email, which is exactly what the radio list
 * renders. There is no name to show here by design.
 */
export function LinkStudentDialog({ child }: { child: Child }) {
  const t = useTranslations("Dashboard");
  const [open, setOpen] = useState(false);
  const [needle, setNeedle] = useState("");
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searching, startSearch] = useTransition();
  const [linking, startLink] = useTransition();

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setNeedle("");
      setStudents([]);
      setSelectedId(null);
      setSearched(false);
      setError(null);
    }
    setOpen(nextOpen);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSelectedId(null);

    startSearch(async () => {
      const result = await searchStudentsByEmail(needle);

      if (result.status === "error") {
        setError(result.formError);
        setStudents([]);
        setSearched(false);
        return;
      }

      setStudents(result.students);
      setSearched(true);
    });
  }

  function handleLink() {
    if (!selectedId) {
      return;
    }

    setError(null);

    startLink(async () => {
      const result = await linkStudentToChild(child.id, selectedId);

      if (result.status === "error") {
        setError(result.formError);
        return;
      }

      handleClose(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="w-full"
        >
          <Link2 aria-hidden className="size-4" />
          {t("children.link.trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent closeLabel={t("children.link.close")}>
        <DialogHeader>
          <DialogTitle>{t("children.link.title", { name: child.name })}</DialogTitle>
          <DialogDescription>
            {t("children.link.description")}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSearch} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label htmlFor={`student-email-${child.id}`} className="text-sm font-medium text-foreground">
              {t("children.link.searchLabel")}
            </label>
            <div className="flex gap-2">
              <Input
                id={`student-email-${child.id}`}
                type="email"
                dir="ltr"
                value={needle}
                onChange={(event) => setNeedle(event.target.value)}
                placeholder={t("children.link.searchPlaceholder")}
                autoComplete="off"
              />
              <Button type="submit" variant="outline" size="md" disabled={searching}>
                <Search aria-hidden className="size-4" />
                {searching ? t("children.link.searching") : t("children.link.searchButton")}
              </Button>
            </div>
          </div>

          {searched && students.length === 0 ? (
            <p className="rounded-control bg-surface-muted p-3 text-sm text-muted-foreground">
              {t("children.link.noResults")}
            </p>
          ) : null}

          {students.length > 0 ? (
            <div role="radiogroup" aria-label={t("children.link.resultsLabel")} className="space-y-2">
              {students.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  role="radio"
                  aria-checked={selectedId === student.id}
                  onClick={() => setSelectedId(student.id)}
                  dir="ltr"
                  className={`flex w-full items-center justify-between gap-3 rounded-control border px-3 py-2.5 text-start text-sm transition-colors duration-150 ease-standard ${
                    selectedId === student.id
                      ? "border-primary bg-primary-soft text-primary-deep"
                      : "border-border bg-background text-foreground hover:bg-surface-muted"
                  }`}
                >
                  <span className="truncate">{student.email}</span>
                  <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-current opacity-0 data-[selected=true]:opacity-100" data-selected={selectedId === student.id} />
                </button>
              ))}
            </div>
          ) : null}

          {error ? <FormAlert tone="error">{error}</FormAlert> : null}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="md" onClick={() => handleClose(false)}>
              {t("children.link.cancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={!selectedId || linking}
              onClick={handleLink}
            >
              {linking ? t("children.link.linking") : t("children.link.linkButton")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
