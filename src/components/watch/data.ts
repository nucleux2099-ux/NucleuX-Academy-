export const videoData = {
  id: "esophageal-surgery",
  title: "Esophageal Surgery: Operative Techniques",
  instructor: {
    name: "Dr. Rajesh Sharma",
    title: "Professor of Surgery",
    institution: "AIIMS Delhi",
    avatar: "RS",
  },
  description: "A comprehensive lecture covering surgical approaches for esophageal diseases including Ivor Lewis, transhiatal, and McKeown procedures.",
  duration: "45:32",
  views: 12580,
  rating: 4.9,
  totalRatings: 342,
  publishedAt: "Jan 15, 2026",
  category: "Surgery",
  topic: "Esophageal Surgery",
  difficulty: "Advanced",
  progress: 0,
  isBookmarked: false,
  thumbnail: "/api/placeholder/800/450",
  chapters: [
    { id: "intro", title: "Introduction", timestamp: "0:00", duration: "3:45" },
    { id: "anatomy", title: "Surgical Anatomy", timestamp: "3:45", duration: "8:20" },
    { id: "ivor-lewis", title: "Ivor Lewis Esophagectomy", timestamp: "12:05", duration: "12:15" },
    { id: "transhiatal", title: "Transhiatal Approach", timestamp: "24:20", duration: "10:30" },
    { id: "mie", title: "Minimally Invasive Esophagectomy", timestamp: "34:50", duration: "7:12" },
    { id: "complications", title: "Complications & Management", timestamp: "42:02", duration: "3:30" },
  ],
  relatedVideos: [
    { id: "gastric-surgery", title: "Gastric Cancer Surgery", instructor: "Dr. Meena Patel", duration: "38:15", thumbnail: "" },
    { id: "lap-fundoplication", title: "Laparoscopic Fundoplication", instructor: "Dr. Amit Kumar", duration: "32:40", thumbnail: "" },
    { id: "bariatric", title: "Bariatric Surgery Basics", instructor: "Dr. Priya Singh", duration: "42:00", thumbnail: "" },
  ],
  resources: [
    { type: "pdf", title: "Lecture Slides", size: "4.2 MB" },
    { type: "pdf", title: "Operative Diagrams", size: "2.8 MB" },
    { type: "link", title: "Reference Article", size: "" },
  ],
};

export interface TimestampNote {
  id: string;
  timestamp: number;
  text: string;
  createdAt: Date;
}
