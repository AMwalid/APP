"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition, type FormEvent } from "react";
import { FormAlert } from "@/components/shared/form-alert";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { enrollStudent, searchStudents } from "../actions";
import type { StudentOption } from "../types";

/**
 * Body of the Add Student dialog: search, pick, enroll.
 *
 * Two separate transitions keep the two busy states honest. Search is a
 * read-only Server Action over the bounded directory RPC; enroll is a write
 * that goes through the enrollment RLS policy. Neither can start while the
 * other is pending.
 *
 * Search is deliberately a button rather than a debounced effect: the RPC has
 * a two-character minimum, and an explicit submit is easier to test, easier
 * to translate, and does not fire a request for every keystroke. Changing the
 * query clears the old results so a stale selection can never be enrolled.
 */
export function StudentSearch({
  classId,
  onDone,
}: {
  classId: string;
  onDone: () => void;
}) {
  const t = useTranslations("Dashboard");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StudentOption[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSearching, startSearch] = useTransition();
  const [isEnrolling, startEnroll] = useTransition();

  const canSearch = query.trim().length >= 2;

  function changeQuery(value: string) {
    setQuery(value);
    setResults([]);
    setSearched(false);
    setSelectedId(null);
    setFormError(null);
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSearch) {
      return;
    }

    startSearch(async () => {
      const found = await searchStudents(query);
      setResults(found);
      setSearched(true);
      setSelectedId(null);
    });
  }

  function onEnroll() {
    if (!selectedId) {
      return;
    }

    setFormError(null);

    startEnroll(async () => {
      const result = await enrollStudent(classId, selectedId);

      if (result.status === "success") {
        onDone();
        return;
      }

      setFormError(result.formError ?? t("classDetails.errors.enrollFailed"));
    });
  }

  return (
    <div className="mt-5">
      <form onSubmit={onSearch} className="space-y-2">
        <label
          htmlFor="student-search-query"
          className="text-sm font-medium text-foreground"
        >
          {t("classDetails.add.query.label")}
        </label>
        <div className="flex gap-2">
          <Input
            id="student-search-query"
            autoFocus
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder={t("classDetails.add.query.placeholder")}
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="outline"
            size="md"
            disabled={!canSearch || isSearching || isEnrolling}
            aria-label={t("classDetails.add.search")}
          >
            <Search aria-hidden className="size-4" />
            {isSearching
              ? t("classDetails.add.searching")
              : t("classDetails.add.search")}
          </Button>
        </div>
        {!canSearch ? (
          <p className="text-xs text-muted-foreground">
            {t("classDetails.add.query.hint")}
          </p>
        ) : null}
      </form>

      {searched ? (
        <div className="mt-5 space-y-2">
          <p className="text-sm font-medium text-foreground">
            {t("classDetails.add.results")}
          </p>
          {results.length === 0 ? (
            <p className="rounded-control bg-surface-muted p-3 text-sm text-muted-foreground">
              {t("classDetails.add.noResults")}
            </p>
          ) : (
            <div role="radiogroup" aria-label={t("classDetails.add.results")} className="space-y-2">
              {results.map((student) => {
                const selected = selectedId === student.id;

                return (
                  <label
                    key={student.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-control border p-3 text-sm transition-colors duration-150 ease-standard",
                      selected
                        ? "border-primary bg-primary-soft"
                        : "border-border hover:bg-surface-subtle",
                    )}
                  >
                    <input
                      type="radio"
                      name="studentId"
                      value={student.id}
                      checked={selected}
                      onChange={() => {
                        setSelectedId(student.id);
                        setFormError(null);
                      }}
                      className="size-4 shrink-0"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground">
                        {student.fullName ?? student.email}
                      </span>
                      {student.fullName ? (
                        <span dir="ltr" className="block truncate text-xs text-muted-foreground">
                          {student.email}
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {formError ? (
        <div className="mt-4">
          <FormAlert tone="error">{formError}</FormAlert>
        </div>
      ) : null}

      <DialogFooter className="mt-5">
        <Button type="button" variant="outline" size="md" onClick={onDone}>
          {t("classDetails.add.cancel")}
        </Button>
        <Button
          type="button"
          size="md"
          disabled={!selectedId || isEnrolling || isSearching}
          onClick={onEnroll}
        >
          {isEnrolling
            ? t("classDetails.add.submitting")
            : t("classDetails.add.submit")}
        </Button>
      </DialogFooter>
    </div>
  );
}
