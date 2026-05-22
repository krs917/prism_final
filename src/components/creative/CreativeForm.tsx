import { useState, useMemo } from "react";
import {
  CreativePortfolioData,
  CreativeProject,
  ExternalProfile,
  CreativeDiscipline,
  ALL_CREATIVE_DISCIPLINES,
  EXTERNAL_PROFILE_PLATFORMS,
  CustomSection,
  MusicData,
  MusicPerformanceLink,
  NotablePerformance,
  defaultMusicData,
  createCreativeProject,
  createExternalProfile,
  createCustomSection,
  createMusicPerformanceLink,
  createNotablePerformance,
} from "@/types/resume";
import { FieldInput, FieldTextarea } from "../resume/FieldInput";
import { Plus, Trash2, User, FileText, Palette, FolderOpen, Link2, Wrench, Clock, Sparkles, LayoutList, X, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

type CreativeSectionId = "personal" | "bio" | "disciplines" | "projects" | "music" | "externalProfiles" | "skills" | "freelance";

interface CreativeFormProps {
  data: CreativePortfolioData;
  updateField: <K extends keyof CreativePortfolioData>(field: K, value: CreativePortfolioData[K]) => void;
}

const transition = { duration: 0.3, ease: [0.2, 0, 0, 1] as const };

const SECTION_ICONS: Record<CreativeSectionId, React.ReactNode> = {
  personal: <User size={20} />,
  bio: <FileText size={20} />,
  disciplines: <Palette size={20} />,
  projects: <FolderOpen size={20} />,
  music: <Music size={20} />,
  externalProfiles: <Link2 size={20} />,
  skills: <Wrench size={20} />,
  freelance: <Clock size={20} />,
};

const SECTION_TITLES: Record<CreativeSectionId, string> = {
  personal: "Profile",
  bio: "Creative Bio",
  disciplines: "Disciplines",
  projects: "Projects",
  music: "Music",
  externalProfiles: "External Profiles",
  skills: "Skills & Services",
  freelance: "Freelance Availability",
};

const SECTION_SUBTITLES: Record<CreativeSectionId, string> = {
  personal: "Your name, photo, and contact info",
  bio: "Tell collaborators who you are",
  disciplines: "Photography, design, video, and more",
  projects: "Showcase your best creative work",
  music: "Instruments, performances, recordings",
  externalProfiles: "Behance, Instagram, portfolio links",
  skills: "Tools, software, and services you offer",
  freelance: "Let people know you're available",
};

const CORE_SECTIONS: CreativeSectionId[] = ["personal", "bio", "disciplines", "projects"];
const MORE_SECTIONS: CreativeSectionId[] = ["externalProfiles", "skills", "freelance"];

function getSectionStatus(data: CreativePortfolioData, id: CreativeSectionId): boolean {
  switch (id) {
    case "personal": return !!(data.name || data.email || data.phone || data.city);
    case "bio": return !!data.creativeBio;
    case "disciplines": return (data.disciplines || []).length > 0;
    case "projects": return (data.projects || []).some(p => p.title);
    case "music": {
      const m = data.musicData;
      return !!(m && (m.instruments || m.primaryGenre || m.performanceLinks.length > 0));
    }
    case "externalProfiles": return (data.externalProfiles || []).some(p => p.url);
    case "skills": return !!data.skillsServices;
    case "freelance": return !!data.freelanceAvailability;
    default: return false;
  }
}

function getContextualTip(data: CreativePortfolioData): string {
  if (!data.name) return "Start by adding your name and contact information.";
  if (!data.creativeBio) return "Write a short bio to introduce your creative work.";
  if ((data.disciplines || []).length === 0) return "Select your creative disciplines to categorize your work.";
  if (!(data.projects || []).some(p => p.title)) return "Add your first project to showcase your portfolio.";
  if (!(data.externalProfiles || []).some(p => p.url)) return "Link your Behance, Instagram, or portfolio site.";
  if (!data.skillsServices) return "List the tools and services you specialize in.";
  return "Looking great! Review your portfolio and fine-tune the details.";
}

const CreativeForm = ({ data, updateField }: CreativeFormProps) => {
  const [activeSection, setActiveSection] = useState<CreativeSectionId | string | null>(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const customSections = data.customSections || [];

  const addCustomSection = () => {
    if (!newSectionTitle.trim()) return;
    const section = createCustomSection(newSectionTitle.trim());
    updateField("customSections" as keyof CreativePortfolioData, [...customSections, section] as any);
    setNewSectionTitle("");
    setShowAddInput(false);
    setActiveSection(`custom-${section.id}`);
  };

  const removeCustomSection = (id: string) => {
    updateField("customSections" as keyof CreativePortfolioData, customSections.filter(s => s.id !== id) as any);
    if (activeSection === `custom-${id}`) setActiveSection(null);
  };

  const updateCustomSectionContent = (id: string, content: string) => {
    updateField("customSections" as keyof CreativePortfolioData, customSections.map(s => s.id === id ? { ...s, content } : s) as any);
  };

  const toggleDiscipline = (d: CreativeDiscipline) => {
    const current = data.disciplines || [];
    if (current.includes(d)) {
      updateField("disciplines", current.filter(x => x !== d));
    } else {
      updateField("disciplines", [...current, d]);
    }
  };

  const updateProject = (idx: number, updates: Partial<CreativeProject>) => {
    const updated = [...data.projects];
    updated[idx] = { ...updated[idx], ...updates };
    updateField("projects", updated);
  };

  const updateProfile = (idx: number, updates: Partial<ExternalProfile>) => {
    const updated = [...data.externalProfiles];
    updated[idx] = { ...updated[idx], ...updates };
    updateField("externalProfiles", updated);
  };

  // Music helpers
  const music = data.musicData || { ...defaultMusicData };
  const updateMusic = (updates: Partial<MusicData>) => {
    updateField("musicData" as keyof CreativePortfolioData, { ...music, ...updates } as any);
  };
  const addPerformanceLink = () => updateMusic({ performanceLinks: [...music.performanceLinks, createMusicPerformanceLink()] });
  const removePerformanceLink = (id: string) => updateMusic({ performanceLinks: music.performanceLinks.filter(l => l.id !== id) });
  const updatePerformanceLink = (id: string, updates: Partial<MusicPerformanceLink>) => updateMusic({ performanceLinks: music.performanceLinks.map(l => l.id === id ? { ...l, ...updates } : l) });
  const addNotablePerformance = () => updateMusic({ notablePerformances: [...music.notablePerformances, createNotablePerformance()] });
  const removeNotablePerformance = (id: string) => updateMusic({ notablePerformances: music.notablePerformances.filter(p => p.id !== id) });
  const updateNotablePerformance = (id: string, updates: Partial<NotablePerformance>) => updateMusic({ notablePerformances: music.notablePerformances.map(p => p.id === id ? { ...p, ...updates } : p) });

  const hasMusicDiscipline = (data.disciplines || []).includes("Music");

  // Progress
  const allSections = [...CORE_SECTIONS, ...(hasMusicDiscipline ? ["music" as CreativeSectionId] : []), ...MORE_SECTIONS];
  const filledCount = useMemo(() => allSections.filter(id => getSectionStatus(data, id)).length, [data]);
  const totalCount = allSections.length;
  const pct = Math.round((filledCount / totalCount) * 100);
  const tip = useMemo(() => getContextualTip(data), [data]);

  const sectionContent: Record<CreativeSectionId, React.ReactNode> = {
    personal: (
      <>
        <FieldInput label="Full Name" id="cr-name" placeholder="Jane Smith" value={data.name} onChange={e => updateField("name", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Email" id="cr-email" type="email" placeholder="jane@email.com" value={data.email} onChange={e => updateField("email", e.target.value)} />
          <FieldInput label="Phone" id="cr-phone" type="tel" placeholder="(555) 123-4567" value={data.phone} onChange={e => updateField("phone", e.target.value)} />
        </div>
        <FieldInput label="City" id="cr-city" placeholder="San Francisco, CA" value={data.city} onChange={e => updateField("city", e.target.value)} />
      </>
    ),
    bio: (
      <FieldTextarea label="About You" id="cr-bio" placeholder="Tell potential clients or collaborators who you are, what you do, and what drives your creative work…" value={data.creativeBio} onChange={e => updateField("creativeBio", e.target.value)} rows={4} />
    ),
    disciplines: (
      <>
        <p className="text-[11px] text-muted-foreground mb-2">Select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {ALL_CREATIVE_DISCIPLINES.map(d => {
            const active = (data.disciplines || []).includes(d);
            return (
              <button key={d} type="button" onClick={() => toggleDiscipline(d)} className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${active ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"}`}>
                {d}
              </button>
            );
          })}
        </div>
      </>
    ),
    projects: (
      <>
        <AnimatePresence initial={false}>
          {(data.projects || []).map((project, idx) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={transition} className="space-y-3 rounded-lg bg-secondary/50 p-4 relative">
              <button type="button" onClick={() => updateField("projects", data.projects.filter(p => p.id !== project.id))} className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" aria-label="Remove project"><Trash2 size={14} /></button>
              <FieldInput label="Project Title" id={`proj-title-${project.id}`} placeholder="Senior Photography Exhibit" value={project.title} onChange={e => updateProject(idx, { title: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Discipline</label>
                  <select className="field-input" value={project.discipline} onChange={e => updateProject(idx, { discipline: e.target.value as CreativeDiscipline | "" })}>
                    <option value="">Select…</option>
                    {ALL_CREATIVE_DISCIPLINES.map(d => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
                <FieldInput label="Date" id={`proj-date-${project.id}`} type="date" value={project.date} onChange={e => updateProject(idx, { date: e.target.value })} />
              </div>
              <FieldTextarea label="Description" id={`proj-desc-${project.id}`} placeholder="Brief description of the project, your role, tools used…" value={project.description} onChange={e => updateProject(idx, { description: e.target.value })} rows={2} />
              <div className="grid grid-cols-2 gap-3">
                <FieldInput label="Link Text" id={`proj-lt-${project.id}`} placeholder="View Gallery" value={project.linkText} onChange={e => updateProject(idx, { linkText: e.target.value })} />
                <FieldInput label="Link URL" id={`proj-lu-${project.id}`} placeholder="https://…" value={project.linkUrl} onChange={e => updateProject(idx, { linkUrl: e.target.value })} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => updateField("projects", [...(data.projects || []), createCreativeProject()])} className="flex items-center gap-2 w-full justify-center rounded-lg border border-dashed border-border py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors">
          <Plus size={16} /> Add Project
        </motion.button>
      </>
    ),
    externalProfiles: (
      <>
        <AnimatePresence initial={false}>
          {(data.externalProfiles || []).map((profile, idx) => (
            <motion.div key={profile.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={transition} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-end">
              <div>
                <label className="field-label">Platform</label>
                <select className="field-input" value={profile.platform} onChange={e => updateProfile(idx, { platform: e.target.value })}>
                  <option value="">Select…</option>
                  {EXTERNAL_PROFILE_PLATFORMS.map(p => (<option key={p} value={p}>{p}</option>))}
                </select>
              </div>
              <FieldInput label="Display Text" id={`ext-dt-${profile.id}`} placeholder="My Behance" value={profile.displayText} onChange={e => updateProfile(idx, { displayText: e.target.value })} />
              <FieldInput label="URL" id={`ext-url-${profile.id}`} placeholder="https://…" value={profile.url} onChange={e => updateProfile(idx, { url: e.target.value })} />
              <button type="button" onClick={() => updateField("externalProfiles", data.externalProfiles.filter(p => p.id !== profile.id))} className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors mb-0.5" aria-label="Remove"><Trash2 size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => updateField("externalProfiles", [...(data.externalProfiles || []), createExternalProfile()])} className="flex items-center gap-2 w-full justify-center rounded-lg border border-dashed border-border py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors">
          <Plus size={16} /> Add Profile Link
        </motion.button>
      </>
    ),
    skills: (
      <FieldTextarea label="Skills / Services" id="cr-skills" placeholder="Adobe Photoshop, Lightroom, Premiere Pro, drone photography, color grading, portrait retouching…" value={data.skillsServices} onChange={e => updateField("skillsServices", e.target.value)} rows={3} />
    ),
    freelance: (
      <FieldTextarea label="Availability Note (optional)" id="cr-freelance" placeholder="Available for freelance work starting Summer 2026. Open to commissions, event coverage, and editorial shoots." value={data.freelanceAvailability} onChange={e => updateField("freelanceAvailability", e.target.value)} rows={2} />
    ),
    music: (
      <div className="space-y-4">
        <FieldInput label="Instrument(s) Played" id="mu-instruments" placeholder="Piano, Guitar, Voice" value={music.instruments} onChange={e => updateMusic({ instruments: e.target.value })} />
        <FieldInput label="Primary Genre or Style" id="mu-genre" placeholder="Classical, Jazz, Singer-Songwriter, Producer/Beatmaker" value={music.primaryGenre} onChange={e => updateMusic({ primaryGenre: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Ensemble or Band Name (optional)" id="mu-ensemble" placeholder="Jazz Combo, Wind Symphony" value={music.ensembleName} onChange={e => updateMusic({ ensembleName: e.target.value })} />
          <FieldInput label="Years Playing" id="mu-years" placeholder="8" value={music.yearsPlaying} onChange={e => updateMusic({ yearsPlaying: e.target.value })} />
        </div>

        {/* Performance / Recording Links */}
        <div className="space-y-2">
          <label className="field-label">Performance & Recording Links</label>
          <AnimatePresence initial={false}>
            {music.performanceLinks.map(link => (
              <motion.div key={link.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={transition} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <FieldInput label="" id={`pl-text-${link.id}`} placeholder="My SoundCloud Demo" value={link.displayText} onChange={e => updatePerformanceLink(link.id, { displayText: e.target.value })} />
                <FieldInput label="" id={`pl-url-${link.id}`} placeholder="https://soundcloud.com/…" value={link.url} onChange={e => updatePerformanceLink(link.id, { url: e.target.value })} />
                <button type="button" onClick={() => removePerformanceLink(link.id)} className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors mb-0.5"><Trash2 size={14} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button type="button" onClick={addPerformanceLink} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"><Plus size={14} /> Add Link</button>
          <p className="text-[10px] text-muted-foreground">YouTube, SoundCloud, Spotify, Apple Music, Bandcamp</p>
        </div>

        {/* Notable Performances */}
        <div className="space-y-2">
          <label className="field-label">Notable Performances or Appearances</label>
          <AnimatePresence initial={false}>
            {music.notablePerformances.map(perf => (
              <motion.div key={perf.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={transition} className="space-y-2 rounded-md border border-border bg-secondary/30 p-3 relative">
                <button type="button" onClick={() => removeNotablePerformance(perf.id)} className="absolute top-2 right-2 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={13} /></button>
                <FieldInput label="Event Name" id={`np-name-${perf.id}`} placeholder="Spring Recital" value={perf.eventName} onChange={e => updateNotablePerformance(perf.id, { eventName: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="Venue" id={`np-venue-${perf.id}`} placeholder="Lincoln Center" value={perf.venue} onChange={e => updateNotablePerformance(perf.id, { venue: e.target.value })} />
                  <FieldInput label="Date" id={`np-date-${perf.id}`} placeholder="Mar 2025" value={perf.date} onChange={e => updateNotablePerformance(perf.id, { date: e.target.value })} />
                </div>
                <FieldInput label="Description (optional)" id={`np-desc-${perf.id}`} placeholder="Solo performance of Chopin's Ballade No. 1" value={perf.description} onChange={e => updateNotablePerformance(perf.id, { description: e.target.value })} />
              </motion.div>
            ))}
          </AnimatePresence>
          <button type="button" onClick={addNotablePerformance} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"><Plus size={14} /> Add Performance</button>
        </div>

        {/* Teaching */}
        <div className="space-y-2">
          <label className="field-label">Do you teach music?</label>
          <div className="flex gap-3">
            {(["yes", "no"] as const).map(opt => (
              <button key={opt} type="button" onClick={() => updateMusic({ teachesMusic: opt })} className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-all ${music.teachesMusic === opt ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/40"}`}>
                {opt === "yes" ? "Yes" : "No"}
              </button>
            ))}
          </div>
          <AnimatePresence initial={false}>
            {music.teachesMusic === "yes" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={transition} className="overflow-hidden space-y-3 pt-2">
                <FieldInput label="Instruments Taught" id="mu-teach-inst" placeholder="Piano, Voice" value={music.teaching.instrumentsTaught} onChange={e => updateMusic({ teaching: { ...music.teaching, instrumentsTaught: e.target.value } })} />
                <FieldInput label="Age Groups" id="mu-teach-ages" placeholder="Ages 6–18, Adults" value={music.teaching.ageGroups} onChange={e => updateMusic({ teaching: { ...music.teaching, ageGroups: e.target.value } })} />
                <FieldInput label="Rate" id="mu-teach-rate" placeholder="$50/hr or 'Contact for rates'" value={music.teaching.rate} onChange={e => updateMusic({ teaching: { ...music.teaching, rate: e.target.value } })} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Available for hire */}
        <div className="space-y-2">
          <label className="field-label">Available for hire?</label>
          <div className="flex gap-3">
            {(["yes", "no"] as const).map(opt => (
              <button key={opt} type="button" onClick={() => updateMusic({ availableForHire: opt })} className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-all ${music.availableForHire === opt ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/40"}`}>
                {opt === "yes" ? "Yes" : "No"}
              </button>
            ))}
          </div>
          <AnimatePresence initial={false}>
            {music.availableForHire === "yes" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={transition} className="overflow-hidden pt-2">
                <FieldTextarea label="Availability Note" id="mu-hire-note" placeholder="Available for gigs, session work, and studio recordings. Based in Austin, TX." value={music.availabilityNote} onChange={e => updateMusic({ availabilityNote: e.target.value })} rows={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    ),
  };

  const renderSectionCard = (sectionId: CreativeSectionId) => {
    const isActive = activeSection === sectionId;
    const isDone = getSectionStatus(data, sectionId);

    return (
      <div key={sectionId}>
        <button
          type="button"
          onClick={() => setActiveSection(isActive ? null : sectionId)}
          className={`w-full flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
            isActive
              ? "bg-accent border-l-[3px] border-l-primary border border-border/60 shadow-sm"
              : "border border-border hover:border-border/80 hover:bg-secondary/30"
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0 text-primary">
            {SECTION_ICONS[sectionId]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold text-foreground leading-tight">{SECTION_TITLES[sectionId]}</div>
            <div className="text-[12px] text-muted-foreground leading-snug mt-0.5">{SECTION_SUBTITLES[sectionId]}</div>
          </div>
          <div className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isDone ? "bg-emerald-50 text-emerald-600" : "bg-secondary text-muted-foreground/50"}`}>
            {isDone ? "Done" : "Empty"}
          </div>
        </button>
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
              <div className="pt-3 pb-1 pl-[52px] pr-1 space-y-3">
                {sectionContent[sectionId]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Portfolio Completion</span>
          <span className="text-xs font-semibold text-primary">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Contextual tip banner */}
      <div className="flex items-center gap-2.5 rounded-lg bg-foreground px-3.5 py-2.5">
        <Sparkles size={14} className="text-primary-foreground/70 shrink-0" />
        <p className="text-[12px] text-primary-foreground/80 leading-snug">{tip}</p>
      </div>

      {/* Core sections */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Your Portfolio</h4>
        <div className="space-y-1.5">
          {CORE_SECTIONS.map(renderSectionCard)}
          {hasMusicDiscipline && renderSectionCard("music")}
        </div>
      </div>

      {/* More sections */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">More Sections</h4>
        <div className="space-y-1.5">{MORE_SECTIONS.map(renderSectionCard)}</div>
      </div>

      {/* Custom sections */}
      {customSections.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Custom Sections</h4>
          <div className="space-y-1.5">
            {customSections.map(cs => {
              const csKey = `custom-${cs.id}`;
              const isActive = activeSection === csKey;
              const isDone = !!cs.content;
              return (
                <div key={cs.id}>
                  <button type="button" onClick={() => setActiveSection(isActive ? null : csKey)} className={`w-full flex items-center gap-3 rounded-lg p-3 text-left transition-all ${isActive ? "bg-accent border-l-[3px] border-l-primary border border-border/60 shadow-sm" : "border border-border hover:border-border/80 hover:bg-secondary/30"}`}>
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0 text-primary"><LayoutList size={20} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-semibold text-foreground leading-tight">{cs.title}</div>
                      <div className="text-[12px] text-muted-foreground leading-snug mt-0.5">Custom section</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isDone ? "bg-emerald-50 text-emerald-600" : "bg-secondary text-muted-foreground/50"}`}>{isDone ? "Done" : "Empty"}</div>
                      <button type="button" onClick={e => { e.stopPropagation(); removeCustomSection(cs.id); }} className="p-1 rounded text-muted-foreground/40 hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
                        <div className="pt-3 pb-1 pl-[52px] pr-1 space-y-3">
                          <FieldTextarea label="Content" id={`custom-${cs.id}`} placeholder="Add your content here…" value={cs.content} onChange={e => updateCustomSectionContent(cs.id, e.target.value)} rows={4} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Section */}
      {showAddInput ? (
        <div className="rounded-lg border border-primary/30 bg-accent/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">New Section Title</span>
            <button type="button" onClick={() => { setShowAddInput(false); setNewSectionTitle(""); }} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"><X size={14} /></button>
          </div>
          <input type="text" autoFocus value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addCustomSection(); if (e.key === "Escape") { setShowAddInput(false); setNewSectionTitle(""); } }} placeholder="e.g. References, Testimonials, Commissions…" className="field-input" />
          <button type="button" onClick={addCustomSection} disabled={!newSectionTitle.trim()} className="w-full rounded-md bg-primary text-primary-foreground py-2 text-xs font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors">Add Section</button>
        </div>
      ) : (
        <button type="button" onClick={() => setShowAddInput(true)} className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-border py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary hover:bg-accent/50 transition-colors">
          <Plus size={16} /> Add Custom Section
        </button>
      )}
    </div>
  );
};

export default CreativeForm;
