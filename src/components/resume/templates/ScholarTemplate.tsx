import { ResumeData, ResumeSectionId, ResumeCustomization } from "@/types/resume";
import { ReactNode } from "react";
import type { TemplateProps } from "../ResumePreview";

const ScholarTemplate = ({ data, sectionOrder, customization }: TemplateProps) => {
  const skills = data.skills.split(",").map(s => s.trim()).filter(Boolean);
  const awards = data.awards.split(",").map(s => s.trim()).filter(Boolean);
  const accent = `hsl(${customization.accentColor})`;
  const hv = customization.headerVisible;
  const marginMap = { compact: "p-6", normal: "p-8", spacious: "p-10" };
  const pad = marginMap[customization.margin];

  const sections: Record<ResumeSectionId, ReactNode> = {
    personal: null,
    summary: data.summary ? (
      <div className="mb-4">
        <p className="italic" style={{ color: "#444" }}>{data.summary}</p>
      </div>
    ) : null,
    education: data.school ? (
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Education</h2>
        <div className="flex justify-between">
          <div>
            <p className="font-semibold">{data.school}</p>
            {data.degree && <p>{data.degree}</p>}
          </div>
          <div className="text-right text-[10px]" style={{ color: "#666" }}>
            {data.gradYear && <p>Class of {data.gradYear}</p>}
            {data.classYear && <p>{data.classYear.charAt(0).toUpperCase() + data.classYear.slice(1)}</p>}
            {hv.gpa && data.gpa && <p>GPA: {data.gpa}</p>}
          </div>
        </div>
      </div>
    ) : null,
    experience: data.experience.length > 0 ? (
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Work Experience</h2>
        <div className="space-y-3">
          {data.experience.map(e => (
            <div key={e.id}>
              <div className="flex justify-between">
                <p className="font-semibold">{e.title}{e.company ? `, ${e.company}` : ""}</p>
                <p className="text-[10px]" style={{ color: "#666" }}>{[e.startDate, e.endDate].filter(Boolean).join(" – ")}</p>
              </div>
              {e.description && <p className="mt-0.5" style={{ color: "#444" }}>{e.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,
    awards: awards.length > 0 ? (
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Awards & Certificates</h2>
        <p>{awards.join(" · ")}</p>
      </div>
    ) : null,
    skills: skills.length > 0 ? (
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Skills</h2>
        <p>{skills.join(" · ")}</p>
      </div>
    ) : null,
    activities: data.activities.length > 0 ? (
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Activities & Experience</h2>
        <div className="space-y-3">
          {data.activities.map(a => (
            <div key={a.id}>
              <div className="flex justify-between">
                <p className="font-semibold">{a.title}{a.organization ? `, ${a.organization}` : ""}</p>
                {a.yearsInvolved && <p className="text-[10px]" style={{ color: "#666" }}>{a.yearsInvolved}</p>}
              </div>
              {a.description && <p className="mt-0.5" style={{ color: "#444" }}>{a.description}</p>}
              {a.awards && <p className="mt-0.5 italic text-[10px]" style={{ color: "#555" }}>Awards: {a.awards}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,
    athletic: data.athleticHighlights ? (
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Athletic Highlights</h2>
        <p style={{ color: "#444" }}>{data.athleticHighlights}</p>
      </div>
    ) : null,
  };

  return (
    <div className={pad} style={{ color: "#1a1a2e" }}>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{data.name || "Your Name"}</h1>
        <div className="flex items-center justify-center gap-3 mt-1.5 text-[10px]" style={{ color: "#666" }}>
          {hv.email && data.email && <span>{data.email}</span>}
          {hv.phone && data.phone && <><span>·</span><span>{data.phone}</span></>}
          {hv.city && data.city && <><span>·</span><span>{data.city}</span></>}
        </div>
      </div>
      <hr className="border-t mb-4" style={{ borderColor: accent }} />

      {sectionOrder.filter(id => id !== "personal").map(id => (
        <div key={id}>{sections[id]}</div>
      ))}
    </div>
  );
};

export default ScholarTemplate;
