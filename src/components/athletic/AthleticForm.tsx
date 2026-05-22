import { useState, useMemo } from "react";
import { AthleticProfileData, Sport, HighlightLink, UpcomingEvent, AthleticSectionId, TeamType, ALL_CLUB_LEVELS, CustomSection, CoachOutreachEntry, DivisionLevel, createSport, createHighlightLink, createUpcomingEvent, createCustomSection, createCoachOutreachEntry } from "@/types/resume";
import { SportType, ALL_SPORTS, SPORT_CONFIGS } from "@/config/sportFields";
import { FieldInput, FieldTextarea } from "../resume/FieldInput";
import SportStatFields from "./SportStatFields";
import { Plus, Trash2, User, GraduationCap, Ruler, Trophy, Video, CalendarDays, MessageSquare, Sparkles, LayoutList, X, Mail, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface AthleticFormProps {
  data: AthleticProfileData;
  updateField: <K extends keyof AthleticProfileData>(field: K, value: AthleticProfileData[K]) => void;
  sectionOrder: AthleticSectionId[];
  onSectionOrderChange: (order: AthleticSectionId[]) => void;
}

const transition = { duration: 0.3, ease: [0.2, 0, 0, 1] as const };

const SECTION_ICONS: Record<AthleticSectionId, React.ReactNode> = {
  personal: <User size={20} />,
  academics: <GraduationCap size={20} />,
  physical: <Ruler size={20} />,
  sports: <Trophy size={20} />,
  highlightVideos: <Video size={20} />,
  upcomingEvents: <CalendarDays size={20} />,
  recruitingStatement: <MessageSquare size={20} />,
  coachOutreach: <Mail size={20} />,
};

const SECTION_TITLES: Record<AthleticSectionId, string> = {
  personal: "Profile",
  academics: "Academics",
  physical: "Physical",
  sports: "Sports & Teams",
  highlightVideos: "Highlight Videos",
  upcomingEvents: "Where to See Me Play",
  recruitingStatement: "Recruiting Statement",
  coachOutreach: "Coach Outreach",
};

const SECTION_SUBTITLES: Record<AthleticSectionId, string> = {
  personal: "Your name, photo, and contact info",
  academics: "School, GPA, and class year",
  physical: "Height, weight, and measurements",
  sports: "Teams, positions, stats, and coaches",
  highlightVideos: "Game film and highlight links",
  upcomingEvents: "Upcoming games, showcases, camps",
  recruitingStatement: "Bio and personal statement",
  coachOutreach: "Email templates for contacting college coaches",
};

const CORE_SECTIONS: AthleticSectionId[] = ["personal", "academics", "physical", "sports"];
const MORE_SECTIONS: AthleticSectionId[] = ["highlightVideos", "upcomingEvents", "recruitingStatement", "coachOutreach"];

function getSectionStatus(data: AthleticProfileData, id: AthleticSectionId): boolean {
  switch (id) {
    case "personal": return !!(data.name || data.email || data.phone || data.city);
    case "academics": return !!(data.school || data.gpa || data.classYear);
    case "physical": return !!(data.heightFeet || data.weight);
    case "sports": return data.sports.length > 0 && data.sports.some(s => s.sportType || s.teamName);
    case "highlightVideos": return data.sports.some(s => (s.highlightLinks || []).some(l => l.url));
    case "upcomingEvents": return (data.upcomingEvents || []).some(e => e.eventName);
    case "recruitingStatement": return !!(data.summary || data.recruitingNote);
    case "coachOutreach": return (data.coachOutreach || []).some(e => e.college);
    default: return false;
  }
}

function getContextualTip(data: AthleticProfileData): string {
  if (!data.name) return "Start by adding your name and contact information.";
  if (!data.school) return "Add your school and academic info for coaches.";
  if (!data.heightFeet) return "Include your physical measurements for recruiting.";
  if (data.sports.length === 0) return "Add your sport and team details to get started.";
  if (!data.sports.some(s => (s.highlightLinks || []).some(l => l.url))) return "Add highlight video links to showcase your talent.";
  if (!(data.upcomingEvents || []).some(e => e.eventName)) return "Let coaches know where they can see you play.";
  if (!data.recruitingNote) return "Write a short recruiting statement for coaches.";
  return "Looking great! Review your profile and fine-tune the details.";
}

// === Coach Outreach Section ===
function generateOutreachEmail(entry: CoachOutreachEntry, data: AthleticProfileData): { subject: string; body: string } {
  const gradYear = data.classYear ? data.classYear.charAt(0).toUpperCase() + data.classYear.slice(1) : "[Grad Year]";
  const firstSport = data.sports[0];
  const sportName = firstSport?.sportType || "[Sport]";
  const position = firstSport?.position || "[Position]";
  const teamName = firstSport?.teamName || "[High School Team]";
  const clubSport = data.sports.find(s => s.teamType === "club");
  const clubTeamName = clubSport?.teamName || "[Club Team]";
  const clubLevel = clubSport?.clubLevel || "[Club Level]";
  const varsityLetters = firstSport?.varsityLetters || "";
  const isCaptain = firstSport?.teamCaptain === "yes";

  const statEntries = firstSport ? Object.entries(firstSport.stats).filter(([, v]) => v) : [];
  const keyStat1 = statEntries[0] ? `${statEntries[0][0]}: ${statEntries[0][1]}` : "[Key stat 1]";
  const keyStat2 = statEntries[1] ? `${statEntries[1][0]}: ${statEntries[1][1]}` : "[Key stat 2]";

  const subject = `${gradYear} ${position} ${data.name || "[Name]"} — Interested in ${entry.college || "[School]"} ${sportName} Program`;

  const body = `Dear Coach ${entry.coachLastName || "[Last Name]"},

My name is ${data.name || "[Name]"} and I am a ${gradYear} ${position} at ${data.school || "[High School]"} graduating in ${data.classYear ? "20" + (data.classYear === "freshman" ? "28" : data.classYear === "sophomore" ? "27" : data.classYear === "junior" ? "26" : "25") : "[Grad Year]"}. I am writing to express my interest in ${entry.college || "[College]"}'s ${entry.sportProgram || sportName} program.

${entry.whyThisSchool || "[Why this school sentence]"}

Academically I carry a ${data.gpa || "[GPA]"} GPA and am committed to competing at the collegiate level while maintaining strong academic standing.

Athletically I have ${varsityLetters || "[X]"} years of varsity experience and serve as ${isCaptain ? "Team Captain" : "a key contributor"} for ${teamName} and ${clubTeamName} at the ${clubLevel} level. ${keyStat1} and ${keyStat2}.

I would love the opportunity to learn more about your program and share more about my background. Please find my athletic profile and highlight reel at the link below.

[Shareable athletic profile link]
[Shareable highlights link]

I look forward to hearing from you. Thank you for your time and consideration.

Sincerely,
${data.name || "[Name]"}
${data.email || "[Email]"}${data.phone ? " | " + data.phone : ""}`;

  return { subject, body };
}

function CoachOutreachSection({
  data,
  updateField,
  editingId,
  setEditingId,
  copiedField,
  setCopiedField,
}: {
  data: AthleticProfileData;
  updateField: <K extends keyof AthleticProfileData>(field: K, value: AthleticProfileData[K]) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  copiedField: string | null;
  setCopiedField: (id: string | null) => void;
}) {
  const entries = data.coachOutreach || [];
  const firstSport = data.sports[0];
  const defaultSportProgram = firstSport?.sportType || "";

  const activeEntry = editingId ? entries.find(e => e.id === editingId) : null;

  const addEntry = () => {
    const entry = createCoachOutreachEntry();
    entry.sportProgram = defaultSportProgram;
    const updated = [...entries, entry];
    updateField("coachOutreach" as keyof AthleticProfileData, updated as any);
    setEditingId(entry.id);
  };

  const updateEntry = (id: string, updates: Partial<CoachOutreachEntry>) => {
    updateField("coachOutreach" as keyof AthleticProfileData, entries.map(e => e.id === id ? { ...e, ...updates } : e) as any);
  };

  const removeEntry = (id: string) => {
    updateField("coachOutreach" as keyof AthleticProfileData, entries.filter(e => e.id !== id) as any);
    if (editingId === id) setEditingId(null);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <div className="space-y-3">
      {/* Saved entries list */}
      {entries.length > 0 && (
        <div className="space-y-1.5">
          {entries.map(entry => {
            const { subject, body } = generateOutreachEmail(entry, data);
            const isEditing = editingId === entry.id;
            return (
              <div key={entry.id} className={`rounded-md border p-2.5 transition-all ${isEditing ? "border-primary bg-accent/50" : "border-border hover:border-border/80"}`}>
                <div className="flex items-center justify-between gap-2">
                  <button type="button" onClick={() => setEditingId(isEditing ? null : entry.id)} className="flex-1 text-left min-w-0">
                    <div className="text-[13px] font-semibold text-foreground truncate">
                      {entry.coachFirstName || entry.coachLastName ? `Coach ${entry.coachFirstName} ${entry.coachLastName}`.trim() : "New Entry"}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {entry.college || "No school set"}{entry.division ? ` · ${entry.division}` : ""}
                    </div>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => handleCopy(body, `body-${entry.id}`)} className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-accent transition-colors" title="Copy email">
                      {copiedField === `body-${entry.id}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                    <button type="button" onClick={() => removeEntry(entry.id)} className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active editing form */}
      {activeEntry && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 rounded-md border border-primary/30 bg-accent/30 p-3">
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Coach First Name" id={`co-fname-${activeEntry.id}`} placeholder="John" value={activeEntry.coachFirstName} onChange={e => updateEntry(activeEntry.id, { coachFirstName: e.target.value })} />
            <FieldInput label="Coach Last Name" id={`co-lname-${activeEntry.id}`} placeholder="Smith" value={activeEntry.coachLastName} onChange={e => updateEntry(activeEntry.id, { coachLastName: e.target.value })} />
          </div>
          <FieldInput label="College or University" id={`co-college-${activeEntry.id}`} placeholder="University of Virginia" value={activeEntry.college} onChange={e => updateEntry(activeEntry.id, { college: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Sport Program" id={`co-sport-${activeEntry.id}`} placeholder="Women's Soccer" value={activeEntry.sportProgram} onChange={e => updateEntry(activeEntry.id, { sportProgram: e.target.value })} />
            <div>
              <label className="field-label">Division Level</label>
              <select className="field-input" value={activeEntry.division} onChange={e => updateEntry(activeEntry.id, { division: e.target.value as DivisionLevel })}>
                <option value="">Select…</option>
                <option value="D1">D1</option>
                <option value="D2">D2</option>
                <option value="D3">D3</option>
                <option value="NAIA">NAIA</option>
                <option value="JUCO">JUCO</option>
              </select>
            </div>
          </div>
          <FieldTextarea label="Why this school?" id={`co-why-${activeEntry.id}`} placeholder="I have been following your program and admire your commitment to developing student athletes both on and off the field" value={activeEntry.whyThisSchool} onChange={e => updateEntry(activeEntry.id, { whyThisSchool: e.target.value })} rows={2} />

          {/* Generated email preview */}
          {(() => {
            const { subject, body } = generateOutreachEmail(activeEntry, data);
            return (
              <div className="space-y-2 mt-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Generated Email</div>
                <div className="rounded-md border border-border bg-background p-3 space-y-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Subject</span>
                    <p className="text-[12px] text-foreground font-medium leading-snug mt-0.5">{subject}</p>
                  </div>
                  <div className="border-t border-border pt-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Body</span>
                    <p className="text-[12px] text-foreground/80 leading-relaxed mt-0.5 whitespace-pre-line">{body}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleCopy(body, `fullbody-${activeEntry.id}`)} className="flex items-center gap-1.5 flex-1 justify-center rounded-md bg-primary text-primary-foreground py-2 text-xs font-medium hover:bg-primary/90 transition-colors">
                    {copiedField === `fullbody-${activeEntry.id}` ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Email</>}
                  </button>
                  <button type="button" onClick={() => handleCopy(subject, `subj-${activeEntry.id}`)} className="flex items-center gap-1.5 flex-1 justify-center rounded-md bg-secondary text-secondary-foreground py-2 text-xs font-medium hover:bg-secondary/80 transition-colors">
                    {copiedField === `subj-${activeEntry.id}` ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Subject Line</>}
                  </button>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      <button type="button" onClick={addEntry} className="flex items-center gap-2 w-full justify-center rounded-md border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors">
        <Plus size={14} /> Add School
      </button>
    </div>
  );
}

const AthleticForm = ({ data, updateField, sectionOrder, onSectionOrderChange }: AthleticFormProps) => {
  const [activeSection, setActiveSection] = useState<AthleticSectionId | string | null>(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingOutreachId, setEditingOutreachId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const customSections = data.customSections || [];

  const addCustomSection = () => {
    if (!newSectionTitle.trim()) return;
    const section = createCustomSection(newSectionTitle.trim());
    updateField("customSections" as keyof AthleticProfileData, [...customSections, section] as any);
    setNewSectionTitle("");
    setShowAddInput(false);
    setActiveSection(`custom-${section.id}`);
  };

  const removeCustomSection = (id: string) => {
    updateField("customSections" as keyof AthleticProfileData, customSections.filter(s => s.id !== id) as any);
    if (activeSection === `custom-${id}`) setActiveSection(null);
  };

  const updateCustomSectionContent = (id: string, content: string) => {
    updateField("customSections" as keyof AthleticProfileData, customSections.map(s => s.id === id ? { ...s, content } : s) as any);
  };

  const updateSports = (newSports: Sport[]) => updateField("sports", newSports);
  const addSport = () => updateSports([...data.sports, createSport()]);
  const removeSport = (id: string) => updateSports(data.sports.filter(s => s.id !== id));

  const updateSport = (id: string, updates: Partial<Sport>) => {
    updateSports(data.sports.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleSportTypeChange = (id: string, newType: SportType | "") => {
    updateSport(id, { sportType: newType, position: "", stats: {}, customStatLabels: {}, customSportName: "" });
  };

  const handlePositionChange = (id: string, newPos: string) => {
    updateSport(id, { position: newPos, stats: {} });
  };

  // Progress calculation
  const allSections = [...CORE_SECTIONS, ...MORE_SECTIONS];
  const filledCount = useMemo(() => allSections.filter(id => getSectionStatus(data, id)).length, [data]);
  const totalCount = allSections.length;
  const pct = Math.round((filledCount / totalCount) * 100);
  const tip = useMemo(() => getContextualTip(data), [data]);

  const sectionContent: Record<AthleticSectionId, React.ReactNode> = {
    personal: (
      <>
        <FieldInput label="Full Name" id="ath-name" placeholder="Jane Smith" value={data.name} onChange={e => updateField("name", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Email" id="ath-email" type="email" placeholder="jane@email.com" value={data.email} onChange={e => updateField("email", e.target.value)} />
          <FieldInput label="Phone" id="ath-phone" type="tel" placeholder="(555) 123-4567" value={data.phone} onChange={e => updateField("phone", e.target.value)} />
        </div>
        <FieldInput label="City" id="ath-city" placeholder="San Francisco, CA" value={data.city} onChange={e => updateField("city", e.target.value)} />
      </>
    ),
    academics: (
      <>
        <FieldInput label="School" id="ath-school" placeholder="Lincoln High School" value={data.school} onChange={e => updateField("school", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="GPA" id="ath-gpa" placeholder="3.8" value={data.gpa} onChange={e => updateField("gpa", e.target.value)} />
          <div>
            <label htmlFor="ath-classYear" className="field-label">Class Year</label>
            <select id="ath-classYear" className="field-input" value={data.classYear} onChange={e => updateField("classYear", e.target.value as AthleticProfileData["classYear"])}>
              <option value="">Select…</option>
              <option value="freshman">Freshman</option>
              <option value="sophomore">Sophomore</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>
      </>
    ),
    physical: (
      <div className="grid grid-cols-3 gap-3">
        <FieldInput label="Height (ft)" id="ath-hft" placeholder="5" value={data.heightFeet} onChange={e => updateField("heightFeet", e.target.value)} />
        <FieldInput label="Height (in)" id="ath-hin" placeholder="11" value={data.heightInches} onChange={e => updateField("heightInches", e.target.value)} />
        <FieldInput label="Weight (lbs)" id="ath-weight" placeholder="175" value={data.weight} onChange={e => updateField("weight", e.target.value)} />
      </div>
    ),
    sports: (
      <>
        <AnimatePresence initial={false}>
          {data.sports.map(sport => {
            const config = sport.sportType ? SPORT_CONFIGS[sport.sportType as SportType] : null;
            const isClub = sport.teamType === "club";
            const coachLabel = isClub ? "Club Coach" : "HS Coach";
            return (
              <motion.div key={sport.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={transition} className="space-y-3 rounded-md border border-border bg-secondary/30 p-3 relative">
                <button type="button" onClick={() => removeSport(sport.id)} className="absolute top-2.5 right-2.5 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" aria-label="Remove team"><Trash2 size={13} /></button>
                <div>
                  <label className="field-label">Team Type</label>
                  <div className="flex rounded-md border border-border overflow-hidden">
                    {(["highSchool", "club"] as TeamType[]).map(t => (
                      <button key={t} type="button" onClick={() => updateSport(sport.id, { teamType: t })} className={`flex-1 py-1.5 text-xs font-medium transition-colors ${sport.teamType === t ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>
                        {t === "highSchool" ? "High School Team" : "Club / Travel Team"}
                      </button>
                    ))}
                  </div>
                </div>
                <FieldInput label="Team Name" id={`sport-team-${sport.id}`} placeholder={isClub ? "FC United Academy" : "Lincoln High Varsity"} value={sport.teamName || ""} onChange={e => updateSport(sport.id, { teamName: e.target.value })} />
                <div>
                  <label className="field-label">Sport</label>
                  <select className="field-input" value={sport.sportType} onChange={e => handleSportTypeChange(sport.id, e.target.value as SportType | "")}>
                    <option value="">Select a sport…</option>
                    {ALL_SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {sport.sportType === "Other" && (
                  <FieldInput label="Sport Name" id={`sport-custom-name-${sport.id}`} placeholder="e.g. Fencing, Rowing, Water Polo" value={sport.customSportName} onChange={e => updateSport(sport.id, { customSportName: e.target.value })} />
                )}
                {isClub && (
                  <div>
                    <label className="field-label">Club Level</label>
                    <select className="field-input" value={sport.clubLevel || ""} onChange={e => updateSport(sport.id, { clubLevel: e.target.value as any })}>
                      <option value="">Select…</option>
                      {ALL_CLUB_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                )}
                {config?.positions && (
                  <div>
                    <label className="field-label">{config.positionLabel || "Position"}</label>
                    <select className="field-input" value={sport.position} onChange={e => handlePositionChange(sport.id, e.target.value)}>
                      <option value="">Select…</option>
                      {config.positions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="Jersey #" id={`sport-num-${sport.id}`} placeholder="23" value={sport.jerseyNumber} onChange={e => updateSport(sport.id, { jerseyNumber: e.target.value })} />
                  <FieldInput label="Seasons / Years Played" id={`sport-seasons-${sport.id}`} placeholder="2022–2025" value={sport.seasonsPlayed} onChange={e => updateSport(sport.id, { seasonsPlayed: e.target.value })} />
                </div>
                {!isClub && (
                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput label="Varsity Letters" id={`sport-varsity-${sport.id}`} placeholder="3" value={sport.varsityLetters} onChange={e => updateSport(sport.id, { varsityLetters: e.target.value })} />
                    <div>
                      <label className="field-label">Team Captain?</label>
                      <select className="field-input" value={sport.teamCaptain} onChange={e => updateSport(sport.id, { teamCaptain: e.target.value as "yes" | "no" | "" })}>
                        <option value="">Select…</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                )}
                {sport.sportType && (
                  <div>
                    <p className="field-label font-semibold text-foreground mb-2">Stats</p>
                    <SportStatFields sport={sport} onStatChange={(key, value) => updateSport(sport.id, { stats: { ...sport.stats, [key]: value } })} onCustomLabelChange={(key, label) => updateSport(sport.id, { customStatLabels: { ...(sport.customStatLabels || {}), [key]: label } })} />
                  </div>
                )}
                <FieldInput label={`${coachLabel} Name`} id={`sport-coach-${sport.id}`} placeholder="Coach Johnson" value={sport.coachName} onChange={e => updateSport(sport.id, { coachName: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label={`${coachLabel} Email`} id={`sport-coachEmail-${sport.id}`} type="email" placeholder="coach@school.edu" value={sport.coachEmail} onChange={e => updateSport(sport.id, { coachEmail: e.target.value })} />
                  <FieldInput label={`${coachLabel} Phone`} id={`sport-coachPhone-${sport.id}`} type="tel" placeholder="(555) 987-6543" value={sport.coachPhone} onChange={e => updateSport(sport.id, { coachPhone: e.target.value })} />
                </div>
                <FieldInput label="Hudl Profile URL" id={`sport-hudl-${sport.id}`} placeholder="https://www.hudl.com/profile/..." value={sport.hudlProfileUrl} onChange={e => updateSport(sport.id, { hudlProfileUrl: e.target.value })} />
              </motion.div>
            );
          })}
        </AnimatePresence>
        <button type="button" onClick={addSport} className="flex items-center gap-2 w-full justify-center rounded-md border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors">
          <Plus size={14} /> Add Another Team
        </button>
      </>
    ),
    highlightVideos: (
      <>
        <AnimatePresence initial={false}>
          {data.sports.flatMap(sport =>
            (sport.highlightLinks || []).map((link, li) => (
              <motion.div key={link.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={transition} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <FieldInput label="Display Text" id={`hl-text-${sport.id}-${li}`} placeholder="Game Highlights, Mar 2026" value={link.displayText} onChange={e => { const updated = [...sport.highlightLinks]; updated[li] = { ...updated[li], displayText: e.target.value }; updateSport(sport.id, { highlightLinks: updated }); }} />
                <FieldInput label="URL" id={`hl-url-${sport.id}-${li}`} placeholder="https://youtube.com/watch?v=..." value={link.url} onChange={e => { const updated = [...sport.highlightLinks]; updated[li] = { ...updated[li], url: e.target.value }; updateSport(sport.id, { highlightLinks: updated }); }} />
                <button type="button" onClick={() => { const updated = sport.highlightLinks.filter((_, idx) => idx !== li); updateSport(sport.id, { highlightLinks: updated }); }} className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors mb-0.5" aria-label="Remove link"><Trash2 size={14} /></button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {data.sports.length > 0 ? (
          <button type="button" onClick={() => { const firstSport = data.sports[0]; updateSport(firstSport.id, { highlightLinks: [...(firstSport.highlightLinks || []), createHighlightLink()] }); }} className="flex items-center gap-2 w-full justify-center rounded-md border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors">
            <Plus size={14} /> Add Highlight Link
          </button>
        ) : (
          <p className="text-xs text-muted-foreground">Add a sport first to attach highlight videos.</p>
        )}
      </>
    ),
    upcomingEvents: (
      <>
        <AnimatePresence initial={false}>
          {(data.upcomingEvents || []).map((evt, idx) => (
            <motion.div key={evt.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={transition} className="space-y-3 rounded-md border border-border bg-secondary/30 p-3 relative">
              <button type="button" onClick={() => updateField("upcomingEvents", (data.upcomingEvents || []).filter(e => e.id !== evt.id))} className="absolute top-2.5 right-2.5 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" aria-label="Remove event"><Trash2 size={13} /></button>
              <FieldInput label="Event Name" id={`evt-name-${evt.id}`} placeholder="ECNL National Showcase" value={evt.eventName} onChange={e => { const updated = [...(data.upcomingEvents || [])]; updated[idx] = { ...updated[idx], eventName: e.target.value }; updateField("upcomingEvents", updated); }} />
              <div className="grid grid-cols-2 gap-3">
                <FieldInput label="Date" id={`evt-date-${evt.id}`} type="date" value={evt.date} onChange={e => { const updated = [...(data.upcomingEvents || [])]; updated[idx] = { ...updated[idx], date: e.target.value }; updateField("upcomingEvents", updated); }} />
                <FieldInput label="Location" id={`evt-loc-${evt.id}`} placeholder="Richmond, VA" value={evt.location} onChange={e => { const updated = [...(data.upcomingEvents || [])]; updated[idx] = { ...updated[idx], location: e.target.value }; updateField("upcomingEvents", updated); }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Event Type</label>
                  <select className="field-input" value={evt.eventType} onChange={e => { const updated = [...(data.upcomingEvents || [])]; updated[idx] = { ...updated[idx], eventType: e.target.value as UpcomingEvent["eventType"] }; updateField("upcomingEvents", updated); }}>
                    <option value="">Select…</option>
                    <option value="league game">League Game</option>
                    <option value="tournament">Tournament</option>
                    <option value="showcase">Showcase</option>
                    <option value="college ID camp">College ID Camp</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <FieldInput label="Note (optional)" id={`evt-note-${evt.id}`} placeholder="Pool play starts at 9am" value={evt.note} onChange={e => { const updated = [...(data.upcomingEvents || [])]; updated[idx] = { ...updated[idx], note: e.target.value }; updateField("upcomingEvents", updated); }} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button type="button" onClick={() => updateField("upcomingEvents", [...(data.upcomingEvents || []), createUpcomingEvent()])} className="flex items-center gap-2 w-full justify-center rounded-md border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors">
          <Plus size={14} /> Add Event
        </button>
      </>
    ),
    recruitingStatement: (
      <>
        <FieldTextarea label="Short Bio" id="ath-summary" placeholder="A brief summary about yourself…" value={data.summary} onChange={e => updateField("summary", e.target.value)} rows={3} />
        <FieldTextarea label="Personal Statement" id="ath-recruiting" placeholder="What coaches should know about you, your goals, and what you bring to a program…" value={data.recruitingNote} onChange={e => updateField("recruitingNote", e.target.value)} rows={4} />
      </>
    ),
    coachOutreach: <CoachOutreachSection data={data} updateField={updateField} editingId={editingOutreachId} setEditingId={setEditingOutreachId} copiedField={copiedField} setCopiedField={setCopiedField} />,
  };

  const renderSectionCard = (sectionId: AthleticSectionId) => {
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

  const coreInOrder = sectionOrder.filter(id => CORE_SECTIONS.includes(id));
  const moreInOrder = sectionOrder.filter(id => MORE_SECTIONS.includes(id));
  CORE_SECTIONS.forEach(id => { if (!coreInOrder.includes(id)) coreInOrder.push(id); });
  MORE_SECTIONS.forEach(id => { if (!moreInOrder.includes(id)) moreInOrder.push(id); });

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Profile Completion</span>
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
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Your Profile</h4>
        <div className="space-y-1.5">{coreInOrder.map(renderSectionCard)}</div>
      </div>

      {/* More sections */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">More Sections</h4>
        <div className="space-y-1.5">{moreInOrder.map(renderSectionCard)}</div>
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
          <input type="text" autoFocus value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addCustomSection(); if (e.key === "Escape") { setShowAddInput(false); setNewSectionTitle(""); } }} placeholder="e.g. References, Achievements, Notes…" className="field-input" />
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

export default AthleticForm;
