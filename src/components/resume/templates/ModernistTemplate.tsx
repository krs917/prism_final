import { ResumeData, ResumeSectionId, ResumeCustomization } from "@/types/resume";
import { ReactNode } from "react";
import type { TemplateProps } from "../ResumePreview";

const ModernistTemplate = ({ data, sectionOrder, customization }: TemplateProps) => {
  const skills = data.skills.split(",").map(s => s.trim()).filter(Boolean);
  const awards = data.awards.split(",").map(s => s.trim()).filter(Boolean);
  const isNone = customization.accentColor === "none";
  const accent = isNone ? "#1a1a2e" : `hsl(${customization.accentColor})`;
  const accentBg = isNone ? "hsl(0 0% 95%)" : `hsl(${customization.accentColor} / 0.08)`;
  const hv = customization.headerVisible;
  const marginMap = { compact: "px-6 py-4", normal: "px-8 py-5", spacious: "px-10 py-6" };
  const bodyPad = marginMap[customization.margin];

  const sections: Record<ResumeSectionId, ReactNode> = {
    personal: null,
    summary: null,
    education: data.school ? (
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Education</h2>
        <div className="flex justify-between">
          <div>
            <p className="font-semibold">{data.school}</p>
            {data.degree && <p style={{ color: "#555" }}>{data.degree}</p>}
          </div>
          <div className="text-right text-[10px]" style={{ color: "#777" }}>
            {data.gradYear && <p>{data.gradYear}</p>}
            {data.classYear && <p>{data.classYear.charAt(0).toUpperCase() + data.classYear.slice(1)}</p>}
            {hv.gpa && data.gpa && <p>GPA: {data.gpa}</p>}
          </div>
        </div>
      </div>
    ) : null,
    experience: data.experience.length > 0 ? (
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Work Experience</h2>
        <div className="space-y-3">
          {data.experience.map(e => (
            <div key={e.id}>
              <div className="flex justify-between items-baseline">
                <p className="font-bold">{e.title}</p>
                <p className="text-[9px] shrink-0 ml-2" style={{ color: "#999" }}>{[e.startDate, e.endDate].filter(Boolean).join(" – ")}</p>
              </div>
              {e.company && <p className="font-medium text-[10px]" style={{ color: "#555" }}>{e.company}</p>}
              {e.description && <p className="mt-0.5" style={{ color: "#444" }}>{e.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,
    awards: awards.length > 0 ? (
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Awards & Certificates</h2>
        <div className="flex flex-wrap gap-1.5">
          {awards.map((a, i) => <span key={i} className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: accentBg, color: accent }}>{a}</span>)}
        </div>
      </div>
    ) : null,
    skills: skills.length > 0 ? (
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Skills</h2>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s, i) => <span key={i} className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: accentBg, color: accent }}>{s}</span>)}
        </div>
      </div>
    ) : null,
    activities: data.activities.length > 0 ? (
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Activities & Experience</h2>
        <div className="space-y-3">
          {data.activities.map(a => (
            <div key={a.id}>
              <div className="flex justify-between items-baseline">
                <p className="font-bold">{a.title}</p>
                {a.yearsInvolved && <p className="text-[9px] shrink-0 ml-2" style={{ color: "#999" }}>{a.yearsInvolved}</p>}
              </div>
              {a.organization && <p className="font-medium text-[10px]" style={{ color: "#555" }}>{a.organization}</p>}
              {a.description && <p className="mt-0.5" style={{ color: "#444" }}>{a.description}</p>}
              {a.awards && <p className="mt-0.5 italic text-[10px]" style={{ color: "#555" }}>Awards: {a.awards}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,
    athletic: data.athleticHighlights ? (
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Athletic Highlights</h2>
        <p style={{ color: "#444" }}>{data.athleticHighlights}</p>
      </div>
    ) : null,
  };

  const headerPadMap = { compact: "px-6 py-5", normal: "px-8 py-6", spacious: "px-10 py-7" };

  return (
    <div style={{ color: "#1a1a2e" }}>
      <div className={headerPadMap[customization.margin]} style={{
        background: isNone ? "white" : accent,
        borderBottom: isNone ? "1.5px solid #e5e7eb" : undefined,
      }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: isNone ? "#1a1a2e" : "white" }}>{data.name || "Your Name"}</h1>
        {data.summary && <p className="mt-1.5 leading-relaxed" style={{ color: isNone ? "#555" : "rgba(255,255,255,0.85)" }}>{data.summary}</p>}
        <div className="flex flex-wrap gap-3 mt-3 text-[10px]" style={{ color: isNone ? "#777" : "rgba(255,255,255,0.7)" }}>
          {hv.email && data.email && <span>{data.email}</span>}
          {hv.phone && data.phone && <span>{data.phone}</span>}
          {hv.city && data.city && <span>{data.city}</span>}
        </div>
      </div>
      <div className={`${bodyPad} space-y-4`}>
        {sectionOrder.filter(id => id !== "personal" && id !== "summary").map(id => (
          <div key={id}>{sections[id]}</div>
        ))}
      </div>
    </div>
  );
};

export default ModernistTemplate;
