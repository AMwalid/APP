import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { TeacherMessageState } from "../types";

type MessageTeacherButtonProps = {
  teacherId: string;
  teacherName: string;
  state: TeacherMessageState;
};

/** Public-profile CTA for starting a parent/teacher conversation. */
export async function MessageTeacherButton({
  teacherId,
  teacherName,
  state,
}: MessageTeacherButtonProps) {
  const t = await getTranslations("Marketing.publicTeacherProfile");
  const classes = cn(buttonVariants({ size: "md" }), "mt-5 w-full");
  const inboxHref = `/dashboard/messages?peer=${teacherId}&name=${encodeURIComponent(teacherName)}`;

  if (state === "guest") {
    return (
      <Link href={`/login?next=/teachers/${teacherId}`} className={classes}>
        {t("signInToMessage")}
      </Link>
    );
  }

  if (state === "eligible") {
    return (
      <Link href={inboxHref} className={classes}>
        {t("messageTeacher")}
      </Link>
    );
  }

  const label =
    state === "self" ? t("messageSelf") : t("messageUnavailable");

  return (
    <button type="button" disabled className={classes}>
      {label}
    </button>
  );
}
