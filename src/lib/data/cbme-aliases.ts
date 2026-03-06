/**
 * Canonical ID/slug resolvers for CBME routes.
 * Keep legacy IDs/slugs working while enforcing one source of truth.
 */

const CURRICULUM_ID_ALIASES: Record<string, string> = {
  "ms-general-surgery": "ms-surgery",
  surgery: "ms-surgery",
};

const SUBJECT_SLUG_ALIASES: Record<string, string> = {
  "forensic-medicine": "forensic",
};

export function resolveCanonicalCurriculumId(id: string): string {
  return CURRICULUM_ID_ALIASES[id] ?? id;
}

export function resolveCanonicalSubjectSlug(slug: string): string {
  return SUBJECT_SLUG_ALIASES[slug] ?? slug;
}

export function getCurriculumRoute(id: string): string {
  const canonical = resolveCanonicalCurriculumId(id);

  switch (canonical) {
    case "ms-surgery":
      return "/cbme/surgery";
    case "md-general-medicine":
      return "/cbme/medicine";
    case "ms-obgy":
      return "/cbme/obgyn";
    case "md-pediatrics":
      return "/cbme/pediatrics";
    case "ms-orthopedics":
      return "/cbme/orthopedics";
    default:
      return `/cbme/${canonical}`;
  }
}
