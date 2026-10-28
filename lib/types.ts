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

export type EventCategory = {
  id: string;
  label: string;
};

export type EventPerk = {
  id: string;
  label: string;
};

export type EventFormField = {
  id: string;
  label: string;
  type: "text" | "select";
  options: string[];
  required: boolean;
};

export type SiteEvent = {
  id: string;
  title: string;
  slogan: string;
  date: string;
  time: string;
  venue: string;
  bannerUrl: string;
  categories: EventCategory[];
  perks: EventPerk[];
  formFields: EventFormField[];
  merchNote: string;
  ctaLabel: string;
  registrationOpen: boolean;
  published: boolean;
  featured: boolean;
  createdAt: string;
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
  joinEmail: string;
  events: SiteEvent[];
};
