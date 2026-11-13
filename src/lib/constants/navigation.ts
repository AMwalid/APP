/**
 * Single source of truth for the site navigation.
 *
 * Labels are translation keys resolved against the `Navigation` namespace
 * (`src/messages/<locale>.json`). Hrefs are locale-less; `@/lib/i18n/navigation`
 * adds the active locale prefix.
 *
 * The structure is a product contract inherited from the prototype. Do not
 * rename, reorder or remove items without a product decision.
 */

export type NavChild = {
  id: string;
  labelKey: string;
  href: string;
};

export type NavItem = {
  id: string;
  labelKey: string;
  href: string;
  children?: readonly NavChild[];
};

export type NavActionVariant = "ghost" | "primary" | "outline";

export type NavAction = {
  id: string;
  labelKey: string;
  href: string;
  variant: NavActionVariant;
};

export const NAV_ITEMS: readonly NavItem[] = [
  {
    id: "parents",
    labelKey: "items.parents.label",
    href: "/parents",
    children: [
      {
        id: "find-schools",
        labelKey: "items.parents.findSchools",
        href: "/find-resources?tab=schools",
      },
      {
        id: "find-teachers",
        labelKey: "items.parents.findTeachers",
        href: "/find-resources?tab=teachers",
      },
      {
        id: "track-kid",
        labelKey: "items.parents.trackKid",
        href: "/parents/track-kid",
      },
      {
        id: "my-courses",
        labelKey: "items.parents.myCourses",
        href: "/parents/my-courses",
      },
    ],
  },
  {
    id: "students",
    labelKey: "items.students.label",
    href: "/students",
    children: [
      {
        id: "find-schools",
        labelKey: "items.students.findSchools",
        href: "/find-resources?tab=schools",
      },
      {
        id: "find-teachers",
        labelKey: "items.students.findTeachers",
        href: "/find-resources?tab=teachers",
      },
      {
        id: "track-progress",
        labelKey: "items.students.trackProgress",
        href: "/students/track-progress",
      },
      {
        id: "my-courses",
        labelKey: "items.students.myCourses",
        href: "/students/my-courses",
      },
    ],
  },
  {
    id: "teachers",
    labelKey: "items.teachers.label",
    href: "/teachers",
    children: [
      {
        id: "profile",
        labelKey: "items.teachers.profile",
        href: "/teachers/profile",
      },
      {
        id: "classes",
        labelKey: "items.teachers.classes",
        href: "/teachers/classes",
      },
    ],
  },
  {
    id: "institutions",
    labelKey: "items.institutions.label",
    href: "/institutions",
    children: [
      {
        id: "profile",
        labelKey: "items.institutions.profile",
        href: "/institutions/profile",
      },
      {
        id: "dashboard",
        labelKey: "items.institutions.dashboard",
        href: "/institutions/dashboard",
      },
    ],
  },
  {
    id: "store",
    labelKey: "items.store.label",
    href: "/store",
  },
  {
    id: "about",
    labelKey: "items.about.label",
    href: "/about",
    children: [
      {
        id: "about-us",
        labelKey: "items.about.aboutUs",
        href: "/about",
      },
      {
        id: "contact",
        labelKey: "items.about.contact",
        href: "/contact",
      },
      {
        id: "guide",
        labelKey: "items.about.guide",
        href: "/user-guide",
      },
      {
        id: "prices",
        labelKey: "items.about.prices",
        href: "/prices",
      },
      {
        id: "invest",
        labelKey: "items.about.invest",
        href: "/invest",
      },
    ],
  },
];

export type NavUtilityLink = {
  id: string;
  labelKey: string;
  href: string;
};

/**
 * Quick links in the dark utility bar above the main navigation.
 * They sit on the start edge, so they mirror with the document direction.
 */
export const NAV_TOP_LINKS: readonly NavUtilityLink[] = [
  { id: "contact", labelKey: "topBar.contact", href: "/contact" },
  { id: "about", labelKey: "topBar.about", href: "/about" },
  { id: "help", labelKey: "topBar.help", href: "/help" },
];

/** Login lives in the utility bar, away from the primary calls to action. */
export const NAV_LOGIN: NavAction = {
  id: "login",
  labelKey: "actions.login",
  href: "/login",
  variant: "ghost",
};

/** Primary calls to action in the main bar, in display order. */
export const NAV_CTAS: readonly NavAction[] = [
  {
    id: "signup",
    labelKey: "actions.signup",
    href: "/signup",
    variant: "primary",
  },
  {
    id: "book-demo",
    labelKey: "actions.bookDemo",
    href: "/book-demo",
    variant: "outline",
  },
];

/** Every account action, in order. The mobile sheet renders all of them. */
export const NAV_ACTIONS: readonly NavAction[] = [NAV_LOGIN, ...NAV_CTAS];

/**
 * Rows shown in a dropdown: the section landing page first, then its children.
 * The landing row is dropped when a child already points at the same href
 * (e.g. About → About Us).
 */
export function getMenuEntries(item: NavItem): readonly NavChild[] {
  const landing: NavChild = {
    id: `${item.id}-landing`,
    labelKey: item.labelKey,
    href: item.href,
  };

  const children = item.children ?? [];

  return [
    landing,
    ...children.filter((child) => child.href.split("?")[0] !== item.href),
  ];
}

/** True when `href` is the current page or an ancestor of it. */
export function isActiveHref(pathname: string, href: string): boolean {
  const target = href.split("?")[0];

  return pathname === target || pathname.startsWith(`${target}/`);
}

/**
 * True when a dropdown row is the current page.
 *
 * Rows that point at a query variant (`/find-resources?tab=schools`) can't be
 * told apart from the pathname alone, so they are never marked active. Wire
 * them to the search params once `/find-resources` exists.
 */
export function isActiveMenuEntry(pathname: string, href: string): boolean {
  return !href.includes("?") && pathname === href;
}

/** True when the item or any of its children is the current page. */
export function isActiveItem(pathname: string, item: NavItem): boolean {
  if (isActiveHref(pathname, item.href)) {
    return true;
  }

  return (item.children ?? []).some((child) => isActiveHref(pathname, child.href));
}
