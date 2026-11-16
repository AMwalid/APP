import { HeroContent } from "./hero-content";
import { HeroVisual } from "./hero-visual";

/**
 * Homepage hero.
 *
 * Two columns from `lg` up: copy on the start side, visual on the end side.
 * The DOM order is copy → visual, so the layout mirrors in RTL without any
 * `order-*` or direction override, and the stacked mobile layout needs no
 * extra rules either. Height is content-driven on purpose, so the next section
 * peeks above the fold and invites a scroll.
 */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="container-page py-16 lg:py-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <HeroContent />
        <HeroVisual />
      </div>
    </section>
  );
}
