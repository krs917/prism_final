import { CreativePortfolioData, ResumeCustomization, defaultCustomization } from "@/types/resume";
import { ExternalLink, Globe, Camera, Film, Palette, Music, Monitor, Instagram, Video, Share2 } from "lucide-react";
import { getStyleVars } from "@/lib/customizationStyles";
import { AnimatePresence, motion } from "framer-motion";

interface CreativePreviewProps {
  data: CreativePortfolioData;
  customization?: ResumeCustomization;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  "Adobe Portfolio": <Globe size={14} />,
  "Behance": <Palette size={14} />,
  "Instagram": <Instagram size={14} />,
  "Lightroom": <Camera size={14} />,
  "YouTube/Vimeo": <Video size={14} />,
  "Custom": <ExternalLink size={14} />,
};

const DISCIPLINE_ICONS: Record<string, React.ReactNode> = {
  "Photography": <Camera size={12} />,
  "Videography": <Film size={12} />,
  "Graphic Design": <Palette size={12} />,
  "Illustration": <Palette size={12} />,
  "Web Design": <Monitor size={12} />,
  "Music Production": <Music size={12} />,
  "Music": <Music size={12} />,
  "Film/Editing": <Film size={12} />,
  "Social Media Content": <Share2 size={12} />,
};

const sortedProjects = (data: CreativePortfolioData) =>
  [...(data.projects || [])].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

const CreativePreview = ({ data, customization }: CreativePreviewProps) => {
  const cust = customization || defaultCustomization;
  const vars = getStyleVars(cust);
  const isNone = cust.accentColor === "none";
  const accent = isNone ? "#1a1a2e" : `hsl(${cust.accentColor})`;
  const accentBg = isNone ? "transparent" : `hsl(${cust.accentColor} / 0.10)`;
  const hv = cust.headerVisible;
  const hidden = (cust.hiddenSections as string[]) || [];
  const projects = sortedProjects(data);
  const hasContent = data.name || data.creativeBio || projects.length > 0 || (data.disciplines || []).length > 0;

  if (!hasContent) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">Start filling in your creative portfolio to see a preview here.</p>
      </div>
    );
  }

  return (
    <div
      id="resume-preview"
      className="w-full max-w-[210mm] bg-card print-only overflow-visible rounded-lg border border-border"
      style={{
        minHeight: "280mm",
        boxShadow: "var(--preview-shadow)",
        fontFamily: vars.fontFamily,
        fontSize: vars.fontSize,
        lineHeight: vars.lineHeight,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={cust.font + cust.fontSize + cust.accentColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {/* Header */}
          <div style={{ padding: "48px 58px 24px" }} className="border-b border-border">
            {data.name && (
              <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: "#1a1a2e" }}>{data.name}</h1>
            )}
            <div className="flex items-center gap-3 text-[10px]" style={{ color: "#666" }}>
              {hv.city && data.city && <span>{data.city}</span>}
              {hv.email && data.email && <span>{data.email}</span>}
              {hv.phone && data.phone && <span>{data.phone}</span>}
            </div>

            {!hidden.includes("disciplines") && (data.disciplines || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {data.disciplines.map(d => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ background: accentBg, color: accent }}
                  >
                    {DISCIPLINE_ICONS[d]} {d}
                  </span>
                ))}
              </div>
            )}

            {!hidden.includes("bio") && data.creativeBio && (
              <p className="text-sm leading-relaxed max-w-lg mt-3" style={{ color: "#666" }}>{data.creativeBio}</p>
            )}
          </div>

          {/* Projects */}
          {!hidden.includes("projects") && projects.length > 0 && (
            <div style={{ padding: "24px 58px" }} className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#999" }}>Projects</h2>
              <div className="grid gap-3">
                {projects.map(project => (
                  <div key={project.id} className="rounded-lg border border-border p-4 space-y-2" style={{ background: "#fafafa" }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{project.title || "Untitled Project"}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {project.discipline && (
                            <span className="text-[10px] font-medium rounded-full px-2 py-0.5" style={{ background: accentBg, color: accent }}>{project.discipline}</span>
                          )}
                          {project.date && (
                            <span className="text-[10px]" style={{ color: "#999" }}>
                              {new Date(project.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {project.description && (
                      <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{project.description}</p>
                    )}
                    {project.linkUrl && (
                      <a href={project.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: accent }}>
                        <ExternalLink size={11} /> {project.linkText || "View Project"}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Music */}
          {!hidden.includes("music") && data.musicData && (data.disciplines || []).includes("Music") && (data.musicData.instruments || data.musicData.primaryGenre || data.musicData.performanceLinks.length > 0) && (
            <div style={{ padding: "24px 58px" }} className="space-y-3 border-t border-border">
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#999" }}>Music</h2>
              <div className="space-y-1.5 text-xs" style={{ color: "#1a1a2e" }}>
                {data.musicData.instruments && <p><span className="font-medium">Instruments:</span> {data.musicData.instruments}</p>}
                {data.musicData.primaryGenre && <p><span className="font-medium">Genre:</span> {data.musicData.primaryGenre}</p>}
                {data.musicData.ensembleName && <p><span className="font-medium">Ensemble:</span> {data.musicData.ensembleName}</p>}
                {data.musicData.yearsPlaying && <p><span className="font-medium">Years Playing:</span> {data.musicData.yearsPlaying}</p>}
              </div>
              {data.musicData.performanceLinks.filter(l => l.url).length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#999" }}>Listen & Watch</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.musicData.performanceLinks.filter(l => l.url).map(link => (
                      <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: accent }}>
                        <ExternalLink size={10} /> {link.displayText || "Link"}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {data.musicData.notablePerformances.filter(p => p.eventName).length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#999" }}>Notable Performances</p>
                  {data.musicData.notablePerformances.filter(p => p.eventName).map(perf => (
                    <div key={perf.id} className="text-xs" style={{ color: "#1a1a2e" }}>
                      <span className="font-medium">{perf.eventName}</span>
                      {perf.venue && <span style={{ color: "#666" }}> — {perf.venue}</span>}
                      {perf.date && <span style={{ color: "#666" }}> ({perf.date})</span>}
                      {perf.description && <p className="ml-2" style={{ color: "#666" }}>{perf.description}</p>}
                    </div>
                  ))}
                </div>
              )}
              {(data.musicData.teachesMusic === "yes" || data.musicData.availableForHire === "yes") && (
                <div className="rounded-md border border-border px-3 py-2 text-xs space-y-1" style={{ background: "#f9f9f9" }}>
                  {data.musicData.teachesMusic === "yes" && (
                    <p><span className="font-medium">Teaching:</span> {data.musicData.teaching.instrumentsTaught || "Available"}{data.musicData.teaching.ageGroups ? ` · ${data.musicData.teaching.ageGroups}` : ""}{data.musicData.teaching.rate ? ` · ${data.musicData.teaching.rate}` : ""}</p>
                  )}
                  {data.musicData.availableForHire === "yes" && (
                    <p><span className="font-medium">Available for hire</span>{data.musicData.availabilityNote ? ` — ${data.musicData.availabilityNote}` : ""}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          {!hidden.includes("skills") && data.skillsServices && (
            <div style={{ padding: "16px 58px" }} className="border-t border-border">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999" }}>Skills & Services</h2>
              <p className="text-xs leading-relaxed" style={{ color: "#1a1a2e" }}>{data.skillsServices}</p>
            </div>
          )}

          {/* Freelance */}
          {!hidden.includes("freelance") && data.freelanceAvailability && (
            <div style={{ padding: "16px 58px" }} className="border-t border-border">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999" }}>Availability</h2>
              <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{data.freelanceAvailability}</p>
            </div>
          )}

          {/* External Profiles */}
          {!hidden.includes("externalProfiles") && (data.externalProfiles || []).filter(p => p.url).length > 0 && (
            <div style={{ padding: "20px 58px" }} className="border-t border-border">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#999" }}>Find Me Online</h2>
              <div className="flex flex-wrap gap-2">
                {data.externalProfiles.filter(p => p.url).map(profile => (
                  <a
                    key={profile.id}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{ color: "#1a1a2e" }}
                  >
                    {PLATFORM_ICONS[profile.platform] || <ExternalLink size={14} />}
                    {profile.displayText || profile.platform || "Link"}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Contact footer */}
          {(data.email || data.phone) && (
            <div style={{ padding: "16px 58px" }} className="border-t border-border">
              <div className="flex items-center gap-4 text-[11px]" style={{ color: "#999" }}>
                {hv.email && data.email && <span>{data.email}</span>}
                {hv.phone && data.phone && <span>{data.phone}</span>}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CreativePreview;
