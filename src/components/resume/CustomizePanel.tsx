import { useState } from "react";
import {
  ResumeCustomization,
  ResumeSectionId,
  AthleticSectionId,
  ServicesSectionId,
  FontChoice,
  FontSizeChoice,
  MarginChoice,
  LineSpacingChoice,
  ACCENT_COLORS,
  DEFAULT_RESUME_SECTION_ORDER,
  DEFAULT_ATHLETIC_SECTION_ORDER,
  DEFAULT_SERVICES_SECTION_ORDER,
} from "@/types/resume";
import { Type, Layout, Palette, PanelTop, Layers, Check } from "lucide-react";

type CustomizeSubTab = "basics" | "layout" | "colors" | "header" | "sections";

interface CustomizePanelProps {
  customization: ResumeCustomization;
  updateCustomization: <K extends keyof ResumeCustomization>(key: K, value: ResumeCustomization[K]) => void;
  sectionOrder: ResumeSectionId[];
  mode: "resume" | "athletic" | "creative" | "highlights" | "services";
  athleticSectionOrder?: AthleticSectionId[];
}

const RESUME_SECTION_LABELS: Record<ResumeSectionId, string> = {
  personal: "Personal Info",
  summary: "Profile / Summary",
  education: "Education",
  experience: "Work Experience",
  awards: "Awards & Certificates",
  skills: "Skills",
  activities: "Activities",
  athletic: "Athletic Highlights",
};

const ATHLETIC_SECTION_LABELS: Record<AthleticSectionId, string> = {
  personal: "Personal Info",
  academics: "Academics",
  physical: "Physical",
  sports: "Sports & Teams",
  highlightVideos: "Highlight Videos",
  upcomingEvents: "Where to See Me Play",
  recruitingStatement: "Recruiting Statement",
  coachOutreach: "Coach Outreach",
};

type CreativeSectionId = "personal" | "bio" | "disciplines" | "projects" | "music" | "externalProfiles" | "skills" | "freelance";

const CREATIVE_SECTION_LABELS: Record<CreativeSectionId, string> = {
  personal: "Personal Info",
  bio: "Creative Bio",
  disciplines: "Disciplines",
  projects: "Projects",
  music: "Music",
  externalProfiles: "External Profiles",
  skills: "Skills & Services",
  freelance: "Freelance Availability",
};

const DEFAULT_CREATIVE_SECTION_ORDER: CreativeSectionId[] = [
  "personal", "bio", "disciplines", "projects", "music", "externalProfiles", "skills", "freelance",
];

const SUB_TABS: { id: CustomizeSubTab; label: string; icon: React.ReactNode }[] = [
  { id: "basics", label: "Basics", icon: <Type size={13} /> },
  { id: "layout", label: "Layout", icon: <Layout size={13} /> },
  { id: "colors", label: "Colors", icon: <Palette size={13} /> },
  { id: "header", label: "Header", icon: <PanelTop size={13} /> },
  { id: "sections", label: "Sections", icon: <Layers size={13} /> },
];

// ── Small reusable components ──

const ToggleGroup = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div className="flex rounded-md bg-secondary p-0.5 gap-0.5">
    {options.map(opt => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`flex-1 rounded px-2.5 py-1.5 text-xs font-medium transition-all text-center ${
          value === opt.value
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-medium text-muted-foreground mb-1.5">{children}</label>
);

const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center justify-between py-2 cursor-pointer group">
    <span className="text-sm text-foreground">{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-border"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background shadow-sm transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  </label>
);

// ── Sub-panels ──

const BasicsPanel = ({ customization, updateCustomization }: CustomizePanelProps) => (
  <div className="space-y-5">
    <div>
      <FieldLabel>Font</FieldLabel>
      <ToggleGroup<FontChoice>
        options={[
          { value: "inter", label: "Sans-serif" },
          { value: "serif", label: "Serif" },
          { value: "mono", label: "Mono" },
        ]}
        value={customization.font}
        onChange={v => updateCustomization("font", v)}
      />
    </div>
    <div>
      <FieldLabel>Font Size</FieldLabel>
      <ToggleGroup<FontSizeChoice>
        options={[
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ]}
        value={customization.fontSize}
        onChange={v => updateCustomization("fontSize", v)}
      />
    </div>
    <div>
      <FieldLabel>Page Format</FieldLabel>
      <div className="rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground font-medium">
        US Letter (8.5" × 11")
      </div>
    </div>
  </div>
);

const LayoutPanel = ({ customization, updateCustomization }: CustomizePanelProps) => (
  <div className="space-y-5">
    <div>
      <FieldLabel>Margins</FieldLabel>
      <ToggleGroup<MarginChoice>
        options={[
          { value: "compact", label: "Compact" },
          { value: "normal", label: "Normal" },
          { value: "spacious", label: "Spacious" },
        ]}
        value={customization.margin}
        onChange={v => updateCustomization("margin", v)}
      />
    </div>
    <div>
      <FieldLabel>Line Spacing</FieldLabel>
      <ToggleGroup<LineSpacingChoice>
        options={[
          { value: "tight", label: "Tight" },
          { value: "normal", label: "Normal" },
          { value: "relaxed", label: "Relaxed" },
        ]}
        value={customization.lineSpacing}
        onChange={v => updateCustomization("lineSpacing", v)}
      />
    </div>
  </div>
);

const ColorsPanel = ({ customization, updateCustomization }: CustomizePanelProps) => (
  <div>
    <FieldLabel>Accent Color</FieldLabel>
    <div className="grid grid-cols-4 gap-2">
      {ACCENT_COLORS.map(c => {
        const isActive = customization.accentColor === c.value;
        const isNone = c.value === "none";
        return (
          <button
            key={c.value}
            onClick={() => updateCustomization("accentColor", c.value)}
            className={`relative flex flex-col items-center gap-1.5 rounded-lg p-2.5 border transition-all ${
              isActive ? "border-primary bg-accent" : "border-border hover:border-primary/30"
            }`}
          >
            <span
              className="w-7 h-7 rounded-full"
              style={{
                background: isNone ? "white" : `hsl(${c.value})`,
                border: isNone ? "1.5px solid #d1d5db" : "1px solid hsl(var(--border) / 0.5)",
              }}
            />
            {isActive && (
              <span className="absolute top-1 right-1">
                <Check size={10} className="text-primary" />
              </span>
            )}
            <span className="text-[10px] font-medium text-muted-foreground">{c.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const HeaderPanel = ({ customization, updateCustomization, mode }: CustomizePanelProps) => {
  const update = (field: keyof ResumeCustomization["headerVisible"], val: boolean) => {
    updateCustomization("headerVisible", { ...customization.headerVisible, [field]: val });
  };
  const modeLabel = mode === "resume" ? "resume" : mode === "athletic" ? "athletic profile" : "creative portfolio";
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3">Choose which fields appear in your {modeLabel} header.</p>
      <div className="divide-y divide-border">
        <ToggleSwitch label="Email" checked={customization.headerVisible.email} onChange={v => update("email", v)} />
        <ToggleSwitch label="Phone" checked={customization.headerVisible.phone} onChange={v => update("phone", v)} />
        <ToggleSwitch label="City / Location" checked={customization.headerVisible.city} onChange={v => update("city", v)} />
        <ToggleSwitch label="GPA" checked={customization.headerVisible.gpa} onChange={v => update("gpa", v)} />
      </div>
    </div>
  );
};

const SectionsPanel = ({ customization, updateCustomization, sectionOrder, mode, athleticSectionOrder }: CustomizePanelProps) => {
  const hidden = customization.hiddenSections as string[];

  const toggle = (id: string) => {
    if (id === "personal") return;
    const next = hidden.includes(id)
      ? hidden.filter(h => h !== id)
      : [...hidden, id];
    updateCustomization("hiddenSections", next as ResumeSectionId[]);
  };

  if (mode === "athletic") {
    const allSections = (athleticSectionOrder && athleticSectionOrder.length > 0)
      ? athleticSectionOrder
      : DEFAULT_ATHLETIC_SECTION_ORDER;
    return (
      <div>
        <p className="text-xs text-muted-foreground mb-3">Toggle sections on or off in the preview & PDF.</p>
        <div className="divide-y divide-border">
          {allSections.map(id => (
            <ToggleSwitch
              key={id}
              label={ATHLETIC_SECTION_LABELS[id]}
              checked={!hidden.includes(id)}
              onChange={() => toggle(id)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (mode === "creative") {
    return (
      <div>
        <p className="text-xs text-muted-foreground mb-3">Toggle sections on or off in the preview & PDF.</p>
        <div className="divide-y divide-border">
          {DEFAULT_CREATIVE_SECTION_ORDER.map(id => (
            <ToggleSwitch
              key={id}
              label={CREATIVE_SECTION_LABELS[id]}
              checked={!hidden.includes(id)}
              onChange={() => toggle(id)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (mode === "services") {
    const SERVICES_SECTION_LABELS: Record<ServicesSectionId, string> = {
      personal: "Profile & Photo",
      about: "About Me",
      services: "Services",
      gallery: "Photo Gallery",
      credentials: "Credentials & Trust",
      testimonials: "Testimonials",
      contact: "Contact",
    };
    return (
      <div>
        <p className="text-xs text-muted-foreground mb-3">Toggle sections on or off in the preview & PDF.</p>
        <div className="divide-y divide-border">
          {DEFAULT_SERVICES_SECTION_ORDER.map(id => (
            <ToggleSwitch
              key={id}
              label={SERVICES_SECTION_LABELS[id]}
              checked={!hidden.includes(id)}
              onChange={() => toggle(id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Resume mode
  const allSections = sectionOrder.length > 0 ? sectionOrder : DEFAULT_RESUME_SECTION_ORDER;
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3">Toggle sections on or off in the preview & PDF.</p>
      <div className="divide-y divide-border">
        {allSections.map(id => (
          <ToggleSwitch
            key={id}
            label={RESUME_SECTION_LABELS[id]}
            checked={!hidden.includes(id)}
            onChange={() => toggle(id)}
          />
        ))}
      </div>
    </div>
  );
};

// ── Main Component ──

const CustomizePanel = (props: CustomizePanelProps) => {
  const [subTab, setSubTab] = useState<CustomizeSubTab>("basics");

  const panels: Record<CustomizeSubTab, React.ReactNode> = {
    basics: <BasicsPanel {...props} />,
    layout: <LayoutPanel {...props} />,
    colors: <ColorsPanel {...props} />,
    header: <HeaderPanel {...props} />,
    sections: <SectionsPanel {...props} />,
  };

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {SUB_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex items-center gap-1 shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
              subTab === tab.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div>{panels[subTab]}</div>
    </div>
  );
};

export default CustomizePanel;
