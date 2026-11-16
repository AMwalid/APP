/**
 * Decorative placeholder for the hero image.
 *
 * There is no final artwork yet, so the box reserves the eventual image's
 * space with a soft brand surface and two rotated squares. It is hidden from
 * assistive technology and its offsets are logical (`start`/`end`), so the
 * shapes mirror in RTL.
 */
export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-control border border-border bg-primary-soft"
    >
      <div className="absolute -end-10 -top-10 size-48 rotate-12 rounded-[2rem] bg-primary/10" />
      <div className="absolute -start-8 -bottom-12 size-40 -rotate-12 rounded-[1.5rem] bg-primary/15" />
    </div>
  );
}
