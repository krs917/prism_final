import { ResumeData, ResumeSectionId, ResumeCustomization } from "@/types/resume";
import { ReactNode } from "react";
import type { TemplateProps } from "../ResumePreview";

const ProfessionalTemplate = ({ data, sectionOrder, customization }: TemplateProps) => {
  const skills = data.skills.split(",").map(s => s.trim()).filter(Boolean);
  const awards = data.awards.split(",").map(s => s.trim()).filter(Boolean);
  const isNone = customization.accentColor === "none";
  const accent = isNone ? "#1a1a2e" : `hsl(${customization.accentColor})`;
  const accentLight = isNone ? "#f5f5f5" : `hsl(${customization.accentColor} / 0.04)`;
  const hv = customization.headerVisible;

  const sidebarIds: ResumeSectionId[] = ["personal", "education", "skills", "awards"];
  const mainIds = sectionOrder.filter(id => !sidebarIds.includes(id));

  const sidebarSections: Record<string, ReactNode> = {
    education: data.school ? (
      <div className="space-y-1.5">
        <h3 className="text-[9px] font-bold uppercase tracking-widest opacity-70">Education</h3>
        <p className="font-semibold text-[10px]">{data.school}</p>
        {data.degree && <p className="text-[10px] opacity-90">{data.degree}</p>}
        {data.gradYear && <p className="text-[10px] opacity-80">Class of {data.gradYear}</p>}
        {data.classYear && <p className="text-[10px] opacity-80">{data.classYear.charAt(0).toUpperCase() + data.classYear.slice(1)}</p>}
        {hv.gpa && data.gpa && <p className="text-[10px] opacity-80">GPA: {data.gpa}</p>}
      </div>
    ) : null,
    skills: skills.length > 0 ? (
      <div className="space-y-1.5">
        <h3 className="text-[9px] font-bold uppercase tracking-widest opacity-70">Skills</h3>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill, i) => (
            <span key={i} className="inline-block px-2 py-0.5 rounded-sm text-[9px] font-medium" style={{ background: isNone ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.15)" }}>{skill}</span>
          ))}
        </div>
      </div>
    ) : null,
    awards: awards.length > 0 ? (
      <div className="space-y-1.5">
        <h3 className="text-[9px] font-bold uppercase tracking-widest opacity-70">Awards</h3>
        <ul className="space-y-1">{awards.map((a, i) => <li key={i} className="text-[10px] opacity-90">• {a}</li>)}</ul>
      </div>
    ) : null,
  };

  const mainSections: Record<string, ReactNode> = {
    summary: data.summary ? (
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: accent }}>Summary</h2>
        <p style={{ color: "#444" }}>{data.summary}</p>
      </div>
    ) : null,
    experience: data.experience.length > 0 ? (
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Work Experience</h2>
        <div className="space-y-3">
          {data.experience.map(e => (
            <div key={e.id}>
              <div className="flex justify-between items-baseline">
                <p className="font-semibold">{e.title}</p>
                <p className="text-[9px] shrink-0 ml-2" style={{ color: "#999" }}>{[e.startDate, e.endDate].filter(Boolean).join(" – ")}</p>
              </div>
              {e.company && <p className="text-[10px]" style={{ color: accent }}>{e.company}</p>}
              {e.description && <p className="mt-0.5" style={{ color: "#444" }}>{e.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,
    activities: data.activities.length > 0 ? (
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Activities & Experience</h2>
        <div className="space-y-3">
          {data.activities.map(a => (
            <div key={a.id}>
              <div className="flex justify-between items-baseline">
                <p className="font-semibold">{a.title}</p>
                {a.yearsInvolved && <p className="text-[9px] shrink-0 ml-2" style={{ color: "#999" }}>{a.yearsInvolved}</p>}
              </div>
              {a.organization && <p className="text-[10px]" style={{ color: accent }}>{a.organization}</p>}
              {a.description && <p className="mt-0.5" style={{ color: "#444" }}>{a.description}</p>}
              {a.awards && <p className="mt-0.5 italic text-[10px]" style={{ color: "#555" }}>Awards: {a.awards}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,
    athletic: data.athleticHighlights ? (
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: accent }}>Athletic Highlights</h2>
        <p style={{ color: "#444" }}>{data.athleticHighlights}</p>
      </div>
    ) : null,
  };

  const sidebarOrder = sectionOrder.filter(id => sidebarIds.includes(id) && id !== "personal");
  const sidebarPadMap = { compact: "p-5", normal: "p-6", spacious: "p-7" };
  const mainPadMap = { compact: "p-5", normal: "p-6", spacious: "p-7" };

  const sidebarBg = isNone ? "#f5f5f5" : accent;
  const sidebarText = isNone ? "#1a1a2e" : "rgba(255,255,255,0.8)";
  const sidebarHeading = isNone ? "#1a1a2e" : "white";
  const skillBg = isNone ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.15)";

  return (
    <div className="flex min-h-full" style={{ color: "#1a1a2e" }}>
      <div className={`w-[35%] ${sidebarPadMap[customization.margin]} space-y-5`} style={{
        background: sidebarBg,
        color: accentLight,
        borderRight: isNone ? "1.5px solid #e5e7eb" : undefined,
      }}>
        <div><h1 className="text-lg font-bold leading-tight" style={{ color: sidebarHeading }}>{data.name || "Your Name"}</h1></div>
        <div className="space-y-1.5" style={{ color: sidebarText }}>
          <h3 className="text-[9px] font-bold uppercase tracking-widest opacity-70">Contact</h3>
          {hv.email && data.email && <p className="text-[10px]">{data.email}</p>}
          {hv.phone && data.phone && <p className="text-[10px]">{data.phone}</p>}
          {hv.city && data.city && <p className="text-[10px]">{data.city}</p>}
        </div>
        <div style={{ color: sidebarText }}>
          {sidebarOrder.map(id => <div key={id}>{sidebarSections[id]}</div>)}
        </div>
      </div>

      <div className={`flex-1 ${mainPadMap[customization.margin]} space-y-4`}>
        {mainIds.map(id => <div key={id}>{mainSections[id]}</div>)}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
