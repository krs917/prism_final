import type { SportType } from "@/config/sportFields";

// === Shared Profile (used by both modes) ===
export interface SharedProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  school: string;
  gpa: string;
  classYear: "freshman" | "sophomore" | "junior" | "senior" | "";
  summary: string;
}

// === Resume-specific ===
export interface Activity {
  id: string;
  title: string;
  organization: string;
  yearsInvolved: string;
  description: string;
  awards: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

// === Custom Sections ===
export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export const createCustomSection = (title: string): CustomSection => ({
  id: crypto.randomUUID(),
  title,
  content: "",
});

export interface ResumeData extends SharedProfile {
  degree: string;
  gradYear: string;
  experience: Experience[];
  awards: string;
  skills: string;
  activities: Activity[];
  athleticHighlights: string;
  customSections?: CustomSection[];
}

export type TemplateName = "scholar" | "professional" | "modernist";

export type ResumeSectionId =
  | "personal"
  | "summary"
  | "education"
  | "experience"
  | "awards"
  | "skills"
  | "activities"
  | "athletic";

export const DEFAULT_RESUME_SECTION_ORDER: ResumeSectionId[] = [
  "personal",
  "summary",
  "education",
  "experience",
  "awards",
  "skills",
  "activities",
  "athletic",
];

// === Customization Settings ===
export type FontChoice = "inter" | "serif" | "mono";
export type FontSizeChoice = "small" | "medium" | "large";
export type MarginChoice = "compact" | "normal" | "spacious";
export type LineSpacingChoice = "tight" | "normal" | "relaxed";

export interface ResumeCustomization {
  font: FontChoice;
  fontSize: FontSizeChoice;
  margin: MarginChoice;
  lineSpacing: LineSpacingChoice;
  accentColor: string; // HSL string like "220 91% 54%"
  headerVisible: {
    phone: boolean;
    email: boolean;
    city: boolean;
    gpa: boolean;
  };
  hiddenSections: ResumeSectionId[];
}

export const ACCENT_NONE = "none";

export const ACCENT_COLORS: { label: string; value: string }[] = [
  { label: "None", value: ACCENT_NONE },
  { label: "Blue", value: "220 91% 54%" },
  { label: "Teal", value: "174 100% 29%" },
  { label: "Violet", value: "262 83% 58%" },
  { label: "Rose", value: "347 77% 50%" },
  { label: "Orange", value: "24 95% 53%" },
  { label: "Emerald", value: "160 84% 39%" },
  { label: "Slate", value: "215 20% 40%" },
  { label: "Noir", value: "0 0% 9%" },
];

export const defaultCustomization: ResumeCustomization = {
  font: "inter",
  fontSize: "medium",
  margin: "normal",
  lineSpacing: "normal",
  accentColor: "220 91% 54%",
  headerVisible: {
    phone: true,
    email: true,
    city: true,
    gpa: true,
  },
  hiddenSections: [],
};

// === Upcoming Events ===
export type EventType = "league game" | "tournament" | "showcase" | "college ID camp" | "other";

export interface UpcomingEvent {
  id: string;
  eventName: string;
  date: string;
  location: string;
  eventType: EventType | "";
  note: string;
}

export const createUpcomingEvent = (): UpcomingEvent => ({
  id: crypto.randomUUID(),
  eventName: "",
  date: "",
  location: "",
  eventType: "",
  note: "",
});

// === Athletic Profile ===
export interface HighlightLink {
  id: string;
  displayText: string;
  url: string;
}

export type ClubLevel = "ECNL" | "MLS Next" | "NPL" | "USYS Regional" | "Recreational" | "Other" | "";

export const ALL_CLUB_LEVELS: ClubLevel[] = ["ECNL", "MLS Next", "NPL", "USYS Regional", "Recreational", "Other"];

export interface ClubTeamInfo {
  clubTeamName: string;
  clubLevel: ClubLevel;
  clubPosition: string;
  clubSeasonsPlayed: string;
  clubStats: Record<string, string>;
  clubCustomStatLabels?: Record<string, string>;
  clubCoachName: string;
  clubCoachEmail: string;
  clubCoachPhone: string;
}

export const defaultClubTeamInfo: ClubTeamInfo = {
  clubTeamName: "",
  clubLevel: "",
  clubPosition: "",
  clubSeasonsPlayed: "",
  clubStats: {},
  clubCoachName: "",
  clubCoachEmail: "",
  clubCoachPhone: "",
};

export type TeamType = "highSchool" | "club";

export interface Sport {
  id: string;
  sportType: SportType | "";
  customSportName: string;
  teamType: TeamType;
  teamName: string;
  position: string;
  jerseyNumber: string;
  seasonsPlayed: string;
  varsityLetters: string;
  teamCaptain: "yes" | "no" | "";
  stats: Record<string, string>;
  customStatLabels?: Record<string, string>;
  coachName: string;
  coachEmail: string;
  coachPhone: string;
  // Club-only
  clubLevel: ClubLevel;
  // Legacy (kept for migration)
  hasClubTeam: boolean;
  clubTeam: ClubTeamInfo;
  // Shared
  highlightLinks: HighlightLink[];
  hudlProfileUrl: string;
}

export const createHighlightLink = (): HighlightLink => ({
  id: crypto.randomUUID(),
  displayText: "",
  url: "",
});

// === Coach Outreach ===
export type DivisionLevel = "D1" | "D2" | "D3" | "NAIA" | "JUCO" | "";

export interface CoachOutreachEntry {
  id: string;
  coachFirstName: string;
  coachLastName: string;
  college: string;
  sportProgram: string;
  division: DivisionLevel;
  whyThisSchool: string;
}

export const createCoachOutreachEntry = (): CoachOutreachEntry => ({
  id: crypto.randomUUID(),
  coachFirstName: "",
  coachLastName: "",
  college: "",
  sportProgram: "",
  division: "",
  whyThisSchool: "",
});

export interface AthleticProfileData extends SharedProfile {
  heightFeet: string;
  heightInches: string;
  weight: string;
  sports: Sport[];
  upcomingEvents: UpcomingEvent[];
  recruitingNote: string;
  customSections?: CustomSection[];
  coachOutreach?: CoachOutreachEntry[];
}

export type AthleticTemplateName = "classic" | "bold" | "clean";

export type AthleticSectionId =
  | "personal"
  | "academics"
  | "physical"
  | "sports"
  | "highlightVideos"
  | "upcomingEvents"
  | "recruitingStatement"
  | "coachOutreach";

export const DEFAULT_ATHLETIC_SECTION_ORDER: AthleticSectionId[] = [
  "personal",
  "academics",
  "physical",
  "sports",
  "highlightVideos",
  "upcomingEvents",
  "recruitingStatement",
  "coachOutreach",
];
// === Creative Portfolio ===
export type CreativeDiscipline =
  | "Photography"
  | "Videography"
  | "Graphic Design"
  | "Illustration"
  | "Web Design"
  | "Music Production"
  | "Music"
  | "Film/Editing"
  | "Social Media Content"
  | "Other";

export const ALL_CREATIVE_DISCIPLINES: CreativeDiscipline[] = [
  "Photography", "Videography", "Graphic Design", "Illustration",
  "Web Design", "Music Production", "Music", "Film/Editing", "Social Media Content", "Other",
];

// === Music-specific types ===
export interface MusicPerformanceLink {
  id: string;
  displayText: string;
  url: string;
}

export const createMusicPerformanceLink = (): MusicPerformanceLink => ({
  id: crypto.randomUUID(),
  displayText: "",
  url: "",
});

export interface NotablePerformance {
  id: string;
  eventName: string;
  venue: string;
  date: string;
  description: string;
}

export const createNotablePerformance = (): NotablePerformance => ({
  id: crypto.randomUUID(),
  eventName: "",
  venue: "",
  date: "",
  description: "",
});

export interface MusicTeachingInfo {
  instrumentsTaught: string;
  ageGroups: string;
  rate: string;
}

export interface MusicData {
  instruments: string;
  primaryGenre: string;
  ensembleName: string;
  yearsPlaying: string;
  performanceLinks: MusicPerformanceLink[];
  notablePerformances: NotablePerformance[];
  teachesMusic: "yes" | "no" | "";
  teaching: MusicTeachingInfo;
  availableForHire: "yes" | "no" | "";
  availabilityNote: string;
}

export const defaultMusicData: MusicData = {
  instruments: "",
  primaryGenre: "",
  ensembleName: "",
  yearsPlaying: "",
  performanceLinks: [],
  notablePerformances: [],
  teachesMusic: "",
  teaching: { instrumentsTaught: "", ageGroups: "", rate: "" },
  availableForHire: "",
  availabilityNote: "",
};

export interface CreativeProject {
  id: string;
  title: string;
  discipline: CreativeDiscipline | "";
  date: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

export interface ExternalProfile {
  id: string;
  platform: string;
  displayText: string;
  url: string;
}

export const EXTERNAL_PROFILE_PLATFORMS = [
  "Adobe Portfolio", "Behance", "Instagram", "Lightroom", "YouTube/Vimeo", "Custom",
] as const;

export interface CreativePortfolioData extends SharedProfile {
  creativeBio: string;
  disciplines: CreativeDiscipline[];
  projects: CreativeProject[];
  externalProfiles: ExternalProfile[];
  skillsServices: string;
  freelanceAvailability: string;
  customSections?: CustomSection[];
  musicData?: MusicData;
}

export const createCreativeProject = (): CreativeProject => ({
  id: crypto.randomUUID(),
  title: "",
  discipline: "",
  date: "",
  description: "",
  linkText: "",
  linkUrl: "",
});

export const createExternalProfile = (platform: string = ""): ExternalProfile => ({
  id: crypto.randomUUID(),
  platform,
  displayText: "",
  url: "",
});

// === Highlights Hub ===
export interface HighlightCard {
  id: string;
  title: string;
  date: string;
  statNote: string;
  videoUrl: string;
}

export const createHighlightCard = (): HighlightCard => ({
  id: crypto.randomUUID(),
  title: "",
  date: "",
  statNote: "",
  videoUrl: "",
});

export interface HighlightsData extends SharedProfile {
  profilePhoto: string; // base64 data URL
  contactEmail: string;
  recruitingTagline: string;
  highlightCards: HighlightCard[];
  showGpa: boolean;
}

// === Services ===
export type RateType = "per hour" | "per session" | "flat fee" | "contact for rates";
export type AvailabilityOption = "Weekdays" | "Weeknights" | "Weekends" | "Summers" | "Flexible";
export type PreferredContact = "Email" | "Text" | "Call";

export const ALL_AVAILABILITY_OPTIONS: AvailabilityOption[] = ["Weekdays", "Weeknights", "Weekends", "Summers", "Flexible"];
export const ALL_RATE_TYPES: RateType[] = ["per hour", "per session", "flat fee", "contact for rates"];
export const ALL_PREFERRED_CONTACT: PreferredContact[] = ["Email", "Text", "Call"];

export interface ServiceEntry {
  id: string;
  serviceName: string;
  description: string;
  rate: string;
  rateType: RateType | "";
  agesOrGrades: string;
  availability: AvailabilityOption[];
}

export const createServiceEntry = (): ServiceEntry => ({
  id: crypto.randomUUID(),
  serviceName: "",
  description: "",
  rate: "",
  rateType: "",
  agesOrGrades: "",
  availability: [],
});

export interface ServiceTestimonial {
  id: string;
  quote: string;
  clientName: string;
  duration: string;
}

export const createServiceTestimonial = (): ServiceTestimonial => ({
  id: crypto.randomUUID(),
  quote: "",
  clientName: "",
  duration: "",
});

export interface GalleryImage {
  id: string;
  src: string;
  caption: string;
}

export const createGalleryImage = (): GalleryImage => ({
  id: crypto.randomUUID(),
  src: "",
  caption: "",
});

export interface ServicesData extends SharedProfile {
  profilePhoto: string;
  bannerImage: string;
  galleryImages: GalleryImage[];
  serviceTagline: string;
  coverageArea: string;
  customBio: string;
  services: ServiceEntry[];
  cprCertified: boolean;
  yearsExperience: string;
  referencesAvailable: boolean;
  certifications: string;
  testimonials: ServiceTestimonial[];
  contactEmail: string;
  contactPhone: string;
  preferredContact: PreferredContact | "";
  schedulingLink: string;
}



export type ServicesSectionId =
  | "personal"
  | "about"
  | "services"
  | "gallery"
  | "credentials"
  | "testimonials"
  | "contact";

export const DEFAULT_SERVICES_SECTION_ORDER: ServicesSectionId[] = [
  "personal", "about", "services", "gallery", "credentials", "testimonials", "contact",
];

export type AppMode = "landing" | "resume" | "athletic" | "creative" | "highlights" | "services";

// === Defaults ===
export const defaultSharedProfile: SharedProfile = {
  name: "",
  email: "",
  phone: "",
  city: "",
  school: "",
  gpa: "",
  classYear: "",
  summary: "",
};
export const defaultHighlightsData: HighlightsData = {
  ...defaultSharedProfile,
  profilePhoto: "",
  contactEmail: "",
  recruitingTagline: "",
  highlightCards: [],
  showGpa: true,
};

export const defaultServicesData: ServicesData = {
  ...defaultSharedProfile,
  profilePhoto: "",
  bannerImage: "",
  galleryImages: [],
  serviceTagline: "",
  coverageArea: "",
  customBio: "",
  services: [],
  cprCertified: false,
  yearsExperience: "",
  referencesAvailable: false,
  certifications: "",
  testimonials: [],
  contactEmail: "",
  contactPhone: "",
  preferredContact: "",
  schedulingLink: "",
};

export const defaultResumeData: ResumeData = {
  ...defaultSharedProfile,
  degree: "",
  gradYear: "",
  experience: [],
  awards: "",
  skills: "",
  activities: [],
  athleticHighlights: "",
};

export const defaultAthleticData: AthleticProfileData = {
  ...defaultSharedProfile,
  heightFeet: "",
  heightInches: "",
  weight: "",
  sports: [],
  upcomingEvents: [],
  recruitingNote: "",
};
export const defaultCreativeData: CreativePortfolioData = {
  ...defaultSharedProfile,
  creativeBio: "",
  disciplines: [],
  projects: [],
  externalProfiles: [],
  skillsServices: "",
  freelanceAvailability: "",
  musicData: { ...defaultMusicData },
};

// === Factories ===
export const createActivity = (): Activity => ({
  id: crypto.randomUUID(),
  title: "",
  organization: "",
  yearsInvolved: "",
  description: "",
  awards: "",
});

export const createExperience = (): Experience => ({
  id: crypto.randomUUID(),
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
});

export const createSport = (): Sport => ({
  id: crypto.randomUUID(),
  sportType: "",
  customSportName: "",
  teamType: "highSchool",
  teamName: "",
  position: "",
  jerseyNumber: "",
  seasonsPlayed: "",
  varsityLetters: "",
  teamCaptain: "",
  coachName: "",
  coachEmail: "",
  coachPhone: "",
  stats: {},
  clubLevel: "",
  hasClubTeam: false,
  clubTeam: { ...defaultClubTeamInfo },
  highlightLinks: [],
  hudlProfileUrl: "",
});
