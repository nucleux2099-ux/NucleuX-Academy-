export interface AlliedLink {
  subject: string;
  topic: string;
  nmcCode?: string;
  relationship: "prerequisite" | "parallel" | "extension";
  label: string;
}

export interface TopicRoadmap {
  foundations: AlliedLink[];
  clinical: AlliedLink[];
  extensions: AlliedLink[];
  nextTopics: string[];
  prevTopics: string[];
}

export const SURGERY_ALLIED_MAP: Record<string, TopicRoadmap> = {};
