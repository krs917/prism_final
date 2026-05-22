import { useState, useMemo } from "react";
import { ResumeData, Activity, Experience, ResumeSectionId, CustomSection, createActivity, createExperience, createCustomSection } from "@/types/resume";
import DraggableFormSection from "./DraggableFormSection";
import { FieldInput, FieldTextarea } from "./FieldInput";
import { Plus, Trash2, User, FileText, GraduationCap, Briefcase, Award, Lightbulb, Activity as ActivityIcon, Trophy, Sparkles, LayoutList, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

interface ResumeFormProps {
  data: ResumeData;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
  sectionOrder: ResumeSectionId[];
  onSectionOrderChange: (order: ResumeSectionId[]) => void;
}

const transition = { duration: 0.3, ease: [0.2, 0, 0, 1] as const };

const SECTION_ICONS: Record<ResumeSectionId, React.ReactNode> = {
  personal: <User size={20} />,
  summary: <FileText size={20} />,
  education: <GraduationCap size={20} />,
  experience: <Briefcase size={20} />,
  awards: <Award size={20} />,
  skills: <Lightbulb size={20} />,
  activities: <ActivityIcon size={20} />,
  athletic: <Trophy size={20} />,
};

const SECTION_TITLES: Record<ResumeSectionId, string> = {
  personal: "Profile",
  summary: "Summary",
  education: "Education",
  experience: "Experience",
  awards: "Awards",
  skills: "Skills",
  activities: "Activities",
  athletic: "Athletic",
};

const SECTION_SUBTITLES: Record<ResumeSectionId, string> = {
  personal: "Your name, photo, and contact info",
  summary: "A brief bio or personal statement",
  education: "Schools, GPA, honors, activities",
  experience: "Jobs, internships, informal work",
  awards: "Awards, certificates, recognition",
  skills: "Technical and soft skills",
  activities: "Clubs, robotics, scouts, music, volunteering, leadership, and more",
  athletic: "Varsity letters, sports honors",
};

const CORE_SECTIONS: ResumeSectionId[] = ["personal", "summary", "education", "experience"];
const MORE_SECTIONS: ResumeSectionId[] = ["awards", "skills", "activities", "athletic"];

function getSectionStatus(data: ResumeData, id: ResumeSectionId): boolean {
  switch (id) {
    case "personal": return !!(data.name || data.email || data.phone || data.city);
    case "summary": return !!data.summary;
    case "education": return !!(data.school || data.degree || data.gpa || data.gradYear);
    case "experience": return data.experience.length > 0 && data.experience.some(e => e.title || e.company);
    case "awards": return !!data.awards;
    case "skills": return !!data.skills;
    case "activities": return data.activities.length > 0 && data.activities.some(a => a.title || a.organization);
    case "athletic": return !!data.athleticHighlights;
    default: return false;
  }
}

function getContextualTip(data: ResumeData): string {
  if (!data.name) return "Start by adding your name and contact information.";
  if (!data.summary) return "Add a short summary to introduce yourself to reviewers.";
  if (!data.school) return "Include your school to strengthen your education section.";
  if (data.experience.length === 0) return "Add work experience — even informal jobs count!";
  if (!data.skills) return "List your skills to show what you bring to the table.";
  if (data.activities.length === 0) return "Activities and clubs show leadership and interests.";
  if (!data.awards) return "Awards and honors help you stand out from the crowd.";
  return "Looking great! Review your content and fine-tune the details.";
}

const ResumeForm = ({ data, updateField, sectionOrder, onSectionOrderChange }: ResumeFormProps) => {
  const [activeSection, setActiveSection] = useState<ResumeSectionId | string | null>(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const customSections = data.customSections || [];

  const addCustomSection = () => {
    if (!newSectionTitle.trim()) return;
    const section = createCustomSection(newSectionTitle.trim());
    updateField("customSections" as keyof ResumeData, [...customSections, section] as any);
    setNewSectionTitle("");
    setShowAddInput(false);
    setActiveSection(`custom-${section.id}`);
  };

  const removeCustomSection = (id: string) => {
    updateField("customSections" as keyof ResumeData, customSections.filter(s => s.id !== id) as any);
    if (activeSection === `custom-${id}`) setActiveSection(null);
  };

  const updateCustomSectionContent = (id: string, content: string) => {
    updateField("customSections" as keyof ResumeData, customSections.map(s => s.id === id ? { ...s, content } : s) as any);
  };

  const addActivity = () => updateField("activities", [...data.activities, createActivity()]);
  const removeActivity = (id: string) => updateField("activities", data.activities.filter(a => a.id !== id));
  const updateActivity = (id: string, field: keyof Activity, value: string) =>
    updateField("activities", data.activities.map(a => (a.id === id ? { ...a, [field]: value } : a)));

  const addExperience = () => updateField("experience", [...data.experience, createExperience()]);
  const removeExperience = (id: string) => updateField("experience", data.experience.filter(e => e.id !== id));
  const updateExperience = (id: string, field: keyof Experience, value: string) =>
    updateField("experience", data.experience.map(e => (e.id === id ? { ...e, [field]: value } : e)));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as ResumeSectionId);
      const newIndex = sectionOrder.indexOf(over.id as ResumeSectionId);
      onSectionOrderChange(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  // Progress calculation
  const filledCount = useMemo(() => {
    return [...CORE_SECTIONS, ...MORE_SECTIONS].filter(id => getSectionStatus(data, id)).length;
  }, [data]);
  const totalCount = CORE_SECTIONS.length + MORE_SECTIONS.length;
  const pct = Math.round((filledCount / totalCount) * 100);
  const tip = useMemo(() => getContextualTip(data), [data]);

  const sectionContent: Record<ResumeSectionId, React.ReactNode> = {
    personal: (
      <>
        <FieldInput label="Full Name" id="name" placeholder="Jane Smith" value={data.name} onChange={e => updateField("name", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Email" id="email" type="email" placeholder="jane@email.com" value={data.email} onChange={e => updateField("email", e.target.value)} />
          <FieldInput label="Phone" id="phone" type="tel" placeholder="(555) 123-4567" value={data.phone} onChange={e => updateField("phone", e.target.value)} />
        </div>
        <FieldInput label="City" id="city" placeholder="San Francisco, CA" value={data.city} onChange={e => updateField("city", e.target.value)} />
      </>
    ),
    summary: (
      <FieldTextarea label="Short Bio" id="summary" placeholder="A brief summary of who you are and what you're looking for…" value={data.summary} onChange={e => updateField("summary", e.target.value)} rows={3} />
    ),
    education: (
      <>
        <FieldInput label="School" id="school" placeholder="University of California" value={data.school} onChange={e => updateField("school", e.target.value)} />
        <FieldInput label="Degree" id="degree" placeholder="B.S. Computer Science" value={data.degree} onChange={e => updateField("degree", e.target.value)} />
        <div className="grid grid-cols-3 gap-3">
          <FieldInput label="GPA" id="gpa" placeholder="3.8" value={data.gpa} onChange={e => updateField("gpa", e.target.value)} />
          <FieldInput label="Grad Year" id="gradYear" placeholder="2026" value={data.gradYear} onChange={e => updateField("gradYear", e.target.value)} />
          <div>
            <label htmlFor="classYear" className="field-label">Class Year</label>
            <select id="classYear" className="field-input" value={data.classYear} onChange={e => updateField("classYear", e.target.value as ResumeData["classYear"])}>
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
    experience: (
      <>
        <AnimatePresence initial={false}>
          {data.experience.map(exp => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={transition} className="space-y-3 rounded-md border border-border bg-secondary/30 p-3 relative">
              <button type="button" onClick={() => removeExperience(exp.id)} className="absolute top-2.5 right-2.5 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" aria-label="Remove entry"><Trash2 size={13} /></button>
              <FieldInput label="Job Title" id={`exp-title-${exp.id}`} placeholder="Software Intern" value={exp.title} onChange={e => updateExperience(exp.id, "title", e.target.value)} />
              <FieldInput label="Company" id={`exp-company-${exp.id}`} placeholder="Google" value={exp.company} onChange={e => updateExperience(exp.id, "company", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <FieldInput label="Start Date" id={`exp-start-${exp.id}`} placeholder="Jun 2024" value={exp.startDate} onChange={e => updateExperience(exp.id, "startDate", e.target.value)} />
                <FieldInput label="End Date" id={`exp-end-${exp.id}`} placeholder="Present" value={exp.endDate} onChange={e => updateExperience(exp.id, "endDate", e.target.value)} />
              </div>
              <FieldTextarea label="Description" id={`exp-desc-${exp.id}`} placeholder="Describe your responsibilities…" value={exp.description} onChange={e => updateExperience(exp.id, "description", e.target.value)} rows={2} />
            </motion.div>
          ))}
        </AnimatePresence>
        <button type="button" onClick={addExperience} className="flex items-center gap-2 w-full justify-center rounded-md border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors">
          <Plus size={14} /> Add Experience
        </button>
      </>
    ),
    awards: (
      <FieldTextarea label="Awards & Certificates" id="awards" placeholder="Dean's List 2024, AWS Cloud Practitioner, Eagle Scout…" value={data.awards} onChange={e => updateField("awards", e.target.value)} rows={3} />
    ),
    skills: (
      <FieldInput label="Skills (comma-separated)" id="skills" placeholder="Python, JavaScript, Public Speaking, Leadership" value={data.skills} onChange={e => updateField("skills", e.target.value)} />
    ),
    activities: (
      <>
        <AnimatePresence initial={false}>
          {data.activities.map((activity, idx) => {
            const namePlaceholders = [
              "FIRST Robotics Team 1234",
              "Eagle Scout — Boy Scouts of America",
              "Wind Ensemble — First Chair Clarinet",
              "Junior Varsity Tennis",
            ];
            return (
            <motion.div key={activity.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={transition} className="space-y-3 rounded-md border border-border bg-secondary/30 p-3 relative">
              <button type="button" onClick={() => removeActivity(activity.id)} className="absolute top-2.5 right-2.5 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" aria-label="Remove entry"><Trash2 size={13} /></button>
              <FieldInput label="Activity or Organization Name" id={`title-${activity.id}`} placeholder={namePlaceholders[idx % namePlaceholders.length]} value={activity.title} onChange={e => updateActivity(activity.id, "title", e.target.value)} />
              <FieldInput label="Role or Position Held" id={`org-${activity.id}`} placeholder="President, Member, First Chair, etc." value={activity.organization} onChange={e => updateActivity(activity.id, "organization", e.target.value)} />
              <FieldInput label="Years Involved" id={`years-${activity.id}`} placeholder="2022–2025" value={activity.yearsInvolved} onChange={e => updateActivity(activity.id, "yearsInvolved", e.target.value)} />
              <FieldTextarea label="Description" id={`desc-${activity.id}`} placeholder="What did you do? What did you achieve?" value={activity.description} onChange={e => updateActivity(activity.id, "description", e.target.value)} rows={2} />
              <FieldInput label="Awards or Achievements (optional)" id={`awards-${activity.id}`} placeholder="Regional champion, Most Improved, etc." value={activity.awards} onChange={e => updateActivity(activity.id, "awards", e.target.value)} />
            </motion.div>
            );
          })}
        </AnimatePresence>
        <button type="button" onClick={addActivity} className="flex items-center gap-2 w-full justify-center rounded-md border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors">
          <Plus size={14} /> Add Activity
        </button>
      </>
    ),
    athletic: (
      <FieldTextarea label="Honors, varsity letters, etc." id="athleticHighlights" placeholder="Varsity Letter (Soccer), All-Conference 2024…" value={data.athleticHighlights} onChange={e => updateField("athleticHighlights", e.target.value)} rows={2} />
    ),
  };

  const renderSectionCard = (sectionId: ResumeSectionId) => {
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
          {/* Icon tile */}
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0 text-primary">
            {SECTION_ICONS[sectionId]}
          </div>

          {/* Title + subtitle */}
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold text-foreground leading-tight">
              {SECTION_TITLES[sectionId]}
            </div>
            <div className="text-[12px] text-muted-foreground leading-snug mt-0.5">
              {SECTION_SUBTITLES[sectionId]}
            </div>
          </div>

          {/* Status badge */}
          <div className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            isDone
              ? "bg-emerald-50 text-emerald-600"
              : "bg-secondary text-muted-foreground/50"
          }`}>
            {isDone ? "Done" : "Empty"}
          </div>
        </button>

        {/* Expandable form content */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
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
  // Add any sections not yet in sectionOrder
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
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
          Your Profile
        </h4>
        <div className="space-y-1.5">
          {coreInOrder.map(renderSectionCard)}
        </div>
      </div>

      {/* Optional sections */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
          More Sections
        </h4>
        <div className="space-y-1.5">
          {moreInOrder.map(renderSectionCard)}
        </div>
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
                  <button
                    type="button"
                    onClick={() => setActiveSection(isActive ? null : csKey)}
                    className={`w-full flex items-center gap-3 rounded-lg p-3 text-left transition-all ${isActive ? "bg-accent border-l-[3px] border-l-primary border border-border/60 shadow-sm" : "border border-border hover:border-border/80 hover:bg-secondary/30"}`}
                  >
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

      {/* Add Section button */}
      {showAddInput ? (
        <div className="rounded-lg border border-primary/30 bg-accent/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">New Section Title</span>
            <button type="button" onClick={() => { setShowAddInput(false); setNewSectionTitle(""); }} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"><X size={14} /></button>
          </div>
          <input
            type="text"
            autoFocus
            value={newSectionTitle}
            onChange={e => setNewSectionTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addCustomSection(); if (e.key === "Escape") { setShowAddInput(false); setNewSectionTitle(""); } }}
            placeholder="e.g. References, Certifications, Publications…"
            className="field-input"
          />
          <button
            type="button"
            onClick={addCustomSection}
            disabled={!newSectionTitle.trim()}
            className="w-full rounded-md bg-primary text-primary-foreground py-2 text-xs font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            Add Section
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddInput(true)}
          className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-border py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary hover:bg-accent/50 transition-colors"
        >
          <Plus size={16} /> Add Custom Section
        </button>
      )}
    </div>
  );
};

export default ResumeForm;
