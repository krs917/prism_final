import { CreativePortfolioData, MusicData } from "@/types/resume";
import { ExternalLink, Globe, Camera, Film, Palette, Music, Monitor, Video, Share2, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  data: CreativePortfolioData;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  "Adobe Portfolio": <Globe size={16} />,
  "Behance": <Palette size={16} />,
  "Instagram": <Camera size={16} />,
  "Lightroom": <Camera size={16} />,
  "YouTube/Vimeo": <Video size={16} />,
  "Custom": <ExternalLink size={16} />,
};

const DISCIPLINE_ICONS: Record<string, React.ReactNode> = {
  "Photography": <Camera size={13} />,
  "Videography": <Film size={13} />,
  "Graphic Design": <Palette size={13} />,
  "Illustration": <Palette size={13} />,
  "Web Design": <Monitor size={13} />,
  "Music Production": <Music size={13} />,
  "Music": <Music size={13} />,
  "Film/Editing": <Film size={13} />,
  "Social Media Content": <Share2 size={13} />,
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as const },
};

const SharedCreativeWebView = ({ data }: Props) => {
  const projects = [...(data.projects || [])].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <motion.section {...fadeUp} className="max-w-3xl mx-auto px-6 pt-16 pb-10">
        {data.name && (
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">{data.name}</h1>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
          {data.city && <span className="flex items-center gap-1"><MapPin size={13} /> {data.city}</span>}
          {data.email && <span className="flex items-center gap-1"><Mail size={13} /> {data.email}</span>}
          {data.phone && <span className="flex items-center gap-1"><Phone size={13} /> {data.phone}</span>}
        </div>

        {(data.disciplines || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {data.disciplines.map(d => (
              <span key={d} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium">
                {DISCIPLINE_ICONS[d]} {d}
              </span>
            ))}
          </div>
        )}

        {data.creativeBio && (
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{data.creativeBio}</p>
        )}
      </motion.section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-10">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">Selected Work</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-xl border border-border bg-card p-5 space-y-3 hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="text-base font-semibold text-foreground">{project.title || "Untitled"}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {project.discipline && (
                      <span className="text-[11px] font-medium text-primary bg-primary/10 rounded-full px-2.5 py-0.5">{project.discipline}</span>
                    )}
                    {project.date && (
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(project.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                )}
                {project.linkUrl && (
                  <a href={project.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    <ExternalLink size={13} /> {project.linkText || "View Project"}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Music */}
      {data.musicData && (data.disciplines || []).includes("Music") && (data.musicData.instruments || data.musicData.primaryGenre || data.musicData.performanceLinks.length > 0) && (
        <section className="max-w-3xl mx-auto px-6 pb-10">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Music</h2>
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {data.musicData.instruments && <div><span className="font-medium text-foreground">Instruments:</span> <span className="text-muted-foreground">{data.musicData.instruments}</span></div>}
              {data.musicData.primaryGenre && <div><span className="font-medium text-foreground">Genre:</span> <span className="text-muted-foreground">{data.musicData.primaryGenre}</span></div>}
              {data.musicData.ensembleName && <div><span className="font-medium text-foreground">Ensemble:</span> <span className="text-muted-foreground">{data.musicData.ensembleName}</span></div>}
              {data.musicData.yearsPlaying && <div><span className="font-medium text-foreground">Years Playing:</span> <span className="text-muted-foreground">{data.musicData.yearsPlaying}</span></div>}
            </div>

            {data.musicData.performanceLinks.filter(l => l.url).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Listen & Watch</p>
                <div className="flex flex-wrap gap-2">
                  {data.musicData.performanceLinks.filter(l => l.url).map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-all">
                      <ExternalLink size={13} /> {link.displayText || "Link"}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {data.musicData.notablePerformances.filter(p => p.eventName).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notable Performances</p>
                <div className="space-y-2">
                  {data.musicData.notablePerformances.filter(p => p.eventName).map(perf => (
                    <div key={perf.id} className="text-sm">
                      <span className="font-medium text-foreground">{perf.eventName}</span>
                      {perf.venue && <span className="text-muted-foreground"> — {perf.venue}</span>}
                      {perf.date && <span className="text-muted-foreground"> ({perf.date})</span>}
                      {perf.description && <p className="text-sm text-muted-foreground mt-0.5">{perf.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(data.musicData.teachesMusic === "yes" || data.musicData.availableForHire === "yes") && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-sm">
                {data.musicData.teachesMusic === "yes" && (
                  <p><span className="font-medium text-foreground">Teaching:</span> <span className="text-muted-foreground">{data.musicData.teaching.instrumentsTaught || "Available"}{data.musicData.teaching.ageGroups ? ` · ${data.musicData.teaching.ageGroups}` : ""}{data.musicData.teaching.rate ? ` · ${data.musicData.teaching.rate}` : ""}</span></p>
                )}
                {data.musicData.availableForHire === "yes" && (
                  <p><span className="font-medium text-foreground">Available for hire</span>{data.musicData.availabilityNote ? <span className="text-muted-foreground"> — {data.musicData.availabilityNote}</span> : ""}</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skillsServices && (
        <section className="max-w-3xl mx-auto px-6 pb-10">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Skills & Services</h2>
          <p className="text-sm text-foreground leading-relaxed">{data.skillsServices}</p>
        </section>
      )}

      {/* Freelance */}
      {data.freelanceAvailability && (
        <section className="max-w-3xl mx-auto px-6 pb-10">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <h2 className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Available for Work</h2>
            <p className="text-sm text-foreground leading-relaxed">{data.freelanceAvailability}</p>
          </div>
        </section>
      )}

      {/* External profiles */}
      {(data.externalProfiles || []).filter(p => p.url).length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Find Me Online</h2>
          <div className="flex flex-wrap gap-3">
            {data.externalProfiles.filter(p => p.url).map(profile => (
              <a
                key={profile.id}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary hover:shadow-sm transition-all"
              >
                {PLATFORM_ICONS[profile.platform] || <ExternalLink size={16} />}
                {profile.displayText || profile.platform || "Link"}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SharedCreativeWebView;
