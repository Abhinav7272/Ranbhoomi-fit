export type SlotKind = "morning" | "evening";

export type ClassSlot = {
  id: string;
  time: string;
  kind: SlotKind;
};

export type ClassGroup = {
  id: string;
  name: string;
  days: string;
  note: string;
  eitherOr: boolean;
  slots: ClassSlot[];
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  createdAt: string;
};

export type StoryBlock = {
  title: string;
  body: string;
};

export type Achievement = {
  id: string;
  title: string;
  body: string;
};

export type Coach = {
  id: string;
  name: string;
  line: string;
  photoUrl: string;
};

export type SiteData = {
  announcements: Announcement[];
  classes: ClassGroup[];
  gallery: GalleryImage[];
  highlights: GalleryImage[];
  coaches: Coach[];
  mission: StoryBlock;
  vision: StoryBlock;
  achievements: Achievement[];
};
