export interface RoadmapLink {
  subject: string;
  topic: string;
  nmcCode?: string;
  reason: string;
  exists: boolean;
}

export interface TopicRoadmap {
  level: "UG" | "PG" | "SS";
  foundations: RoadmapLink[];
  clinical: RoadmapLink[];
  extensions: RoadmapLink[];
  objectives: string[];
  nextTopics: string[];
  prevTopics: string[];
  integration: string;
}
