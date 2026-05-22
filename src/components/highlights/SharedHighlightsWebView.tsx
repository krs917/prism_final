import { HighlightsData, AthleticProfileData, ResumeCustomization, defaultCustomization, ACCENT_NONE } from "@/types/resume";
import { getStyleVars } from "@/lib/customizationStyles";
import { Mail, ExternalLink, Play } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  data: HighlightsData;
  athleticData: AthleticProfileData;
  customization?: ResumeCustomization;
}

function parseVideoUrl(url: string): { type: "youtube" | "vimeo" | "hudl" | "unknown"; embedUrl: string } {
  if (!url) return { type: "unknown", embedUrl: "" };
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}` };
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  if (url.includes("hudl.com")) return { type: "hudl", embedUrl: url };
  return { type: "unknown", embedUrl: url };
}

function VideoEmbed({ url }: { url: string }) {
  const parsed = parseVideoUrl(url);
  if (parsed.type === "youtube" || parsed.type === "vimeo") {
    return (
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={parsed.embedUrl}
          className="absolute inset-0 w-full h-full rounded-t-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Highlight video"
        />
      </div>
    );
  }
  if (parsed.type === "hudl") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full rounded-t-xl overflow-hidden group"
        style={{ paddingBottom: "56.25%" }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/80">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={28} className="text-primary-foreground ml-0.5" fill="currentColor" />
          </div>
        </div>
        <span className="absolute bottom-3 left-3 text-xs font-medium text-foreground/80 bg-background/80 px-2 py-1 rounded">
          Watch on Hudl <ExternalLink size={10} className="inline ml-1" />
        </span>
      </a>
    );
  }
  return null;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as const },
};

const SharedHighlightsWebView = ({ data, athleticData, customization }: Props) => {
  const cust = customization || defaultCustomization;
  const vars = getStyleVars(cust);
  const hasAccent = cust.accentColor !== ACCENT_NONE;
  const accentHsl = hasAccent ? `hsl(${cust.accentColor})` : undefined;

  const firstSport = athleticData.sports?.[0];
  const sportName = firstSport?.sportType === "Other" ? firstSport?.customSportName : firstSport?.sportType || "";
  const position = firstSport?.position || "";
  const jersey = firstSport?.jerseyNumber || "";
  const hsTeam = athleticData.sports?.find((s) => s.teamType === "highSchool");
  const clubTeam = athleticData.sports?.find((s) => s.teamType === "club");

  const gradYearMap: Record<string, string> = {
    freshman: "2029", sophomore: "2028", junior: "2027", senior: "2026",
  };
  const gradYear = data.classYear ? gradYearMap[data.classYear] || "" : "";

  const pillItems = [sportName, position, jersey ? `#${jersey}` : ""].filter(Boolean);
  const infoItems = [
    gradYear ? `Class of ${gradYear}` : "",
    hsTeam?.teamName || data.school || "",
    clubTeam?.teamName || "",
  ].filter(Boolean);

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: vars.fontFamily,
        background: hasAccent ? `hsl(${cust.accentColor} / 0.05)` : "hsl(var(--background))",
      }}
    >
      {/* Hero */}
      <motion.div {...fadeUp} className="flex flex-col items-center pt-16 pb-10 px-6">
        {data.profilePhoto && (
          <div
            className="w-32 h-32 rounded-full overflow-hidden border-4 mb-6 shadow-lg"
            style={{ borderColor: accentHsl || "hsl(var(--border))" }}
          >
            <img src={data.profilePhoto} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}
        {data.name && (
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">{data.name}</h1>
        )}
        {pillItems.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            {pillItems.map((item, i) => (
              <span
                key={i}
                className="text-sm font-medium px-4 py-1.5 rounded-full"
                style={{
                  backgroundColor: accentHsl ? `hsl(${cust.accentColor} / 0.15)` : "hsl(var(--secondary))",
                  color: accentHsl || "hsl(var(--foreground))",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}
        {infoItems.length > 0 && (
          <p className="text-base text-muted-foreground mt-3">{infoItems.join(" · ")}</p>
        )}
        {data.showGpa && data.gpa && (
          <p className="text-sm text-muted-foreground mt-1">GPA: {data.gpa}</p>
        )}
        {data.recruitingTagline && (
          <p
            className="text-lg font-medium mt-5 italic text-center max-w-lg"
            style={{ color: accentHsl || "hsl(var(--foreground))" }}
          >
            "{data.recruitingTagline}"
          </p>
        )}
        {data.contactEmail && (
          <a
            href={`mailto:${data.contactEmail}`}
            className="flex items-center gap-2 text-sm mt-4 hover:underline"
            style={{ color: accentHsl || "hsl(var(--primary))" }}
          >
            <Mail size={14} /> {data.contactEmail}
          </a>
        )}
      </motion.div>

      {/* Highlights Grid */}
      {data.highlightCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto px-6 pb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.highlightCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-xl border border-border bg-card overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {card.videoUrl && <VideoEmbed url={card.videoUrl} />}
                <div className="p-5">
                  {card.title && (
                    <h3 className="font-bold text-foreground text-lg">{card.title}</h3>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    {card.date && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(card.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {card.date && card.statNote && <span className="text-muted-foreground">·</span>}
                    {card.statNote && (
                      <span className="text-sm font-semibold" style={{ color: accentHsl || "hsl(var(--foreground))" }}>
                        {card.statNote}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Built with{" "}
          <span className="font-semibold tracking-wider" style={{ color: accentHsl || "hsl(var(--foreground))" }}>
            PRISM
          </span>
        </p>
      </footer>
    </div>
  );
};

export default SharedHighlightsWebView;
