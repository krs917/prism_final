import { HighlightsData, AthleticProfileData, ResumeCustomization, defaultCustomization, ACCENT_NONE } from "@/types/resume";
import { getStyleVars } from "@/lib/customizationStyles";
import { Mail, ExternalLink, Play } from "lucide-react";

interface Props {
  data: HighlightsData;
  athleticData: AthleticProfileData;
  customization?: ResumeCustomization;
}

type Platform = "youtube" | "vimeo" | "hudl" | "trace" | "veo" | "unknown";

function detectPlatform(url: string): { platform: Platform; embedUrl: string; label: string } {
  if (!url) return { platform: "unknown", embedUrl: "", label: "" };

  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return { platform: "youtube", embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`, label: "YouTube" };

  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) return { platform: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`, label: "Vimeo" };

  if (url.includes("hudl.com")) return { platform: "hudl", embedUrl: url, label: "Hudl" };
  if (url.includes("trace.com")) return { platform: "trace", embedUrl: url, label: "Trace" };
  if (url.includes("veo.co")) return { platform: "veo", embedUrl: url, label: "Veo" };

  return { platform: "unknown", embedUrl: url, label: "Video" };
}

function HighlightCard({
  card,
  accentHsl,
  accentColor,
}: {
  card: { id: string; title: string; date: string; statNote: string; videoUrl: string };
  accentHsl?: string;
  accentColor?: string;
}) {
  const { platform, embedUrl, label } = detectPlatform(card.videoUrl);

  // YouTube gets an embedded player
  if (platform === "youtube") {
    return (
      <div className="rounded-xl overflow-hidden shadow-lg border border-border bg-card">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={card.title || "Highlight video"}
          />
        </div>
        <div className="p-4">
          {card.title && <h3 className="font-bold text-foreground text-base">{card.title}</h3>}
          <div className="flex items-center gap-2 mt-1.5">
            {card.date && (
              <span className="text-xs text-muted-foreground">
                {new Date(card.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {card.statNote && (
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: accentHsl ? `hsl(${accentColor} / 0.15)` : "hsl(170 60% 45% / 0.15)",
                  color: accentHsl || "hsl(170 60% 40%)",
                }}
              >
                {card.statNote}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // All other platforms: premium dark media card
  const linkUrl = platform === "unknown" && card.videoUrl ? card.videoUrl : embedUrl;

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden shadow-lg group cursor-pointer"
      style={{ aspectRatio: "16 / 9" }}
    >
      <div
        className="relative w-full h-full"
        style={{
          background: "linear-gradient(135deg, hsl(220 30% 12%), hsl(220 20% 18%), hsl(220 25% 14%))",
        }}
      >
        {/* Subtle film-grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
          }}
        />

        {/* Platform badge — top right */}
        {label && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold tracking-wide uppercase"
            style={{ color: "hsl(0 0% 100% / 0.6)" }}
          >
            {label} <ExternalLink size={11} />
          </div>
        )}

        {/* Centered play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-xl"
            style={{
              backgroundColor: accentHsl || "hsl(0 0% 100% / 0.15)",
              backdropFilter: "blur(8px)",
              border: "2px solid hsl(0 0% 100% / 0.2)",
            }}
          >
            <Play size={26} className="ml-1" fill="white" color="white" />
          </div>
        </div>

        {/* Bottom text overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ background: "linear-gradient(transparent, hsl(220 30% 8% / 0.85))" }}
        >
          {card.title && (
            <h3 className="font-bold text-lg leading-tight" style={{ color: "hsl(0 0% 100%)" }}>
              {card.title}
            </h3>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            {card.date && (
              <span className="text-xs" style={{ color: "hsl(0 0% 100% / 0.55)" }}>
                {new Date(card.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {card.statNote && (
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: accentHsl ? `hsl(${accentColor} / 0.25)` : "hsl(170 60% 45% / 0.2)",
                  color: accentHsl || "hsl(170 60% 65%)",
                }}
              >
                {card.statNote}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

const HighlightsPreview = ({ data, athleticData, customization }: Props) => {
  const cust = customization || defaultCustomization;
  const vars = getStyleVars(cust);
  const hasAccent = cust.accentColor !== ACCENT_NONE;
  const accentHsl = hasAccent ? `hsl(${cust.accentColor})` : undefined;
  const accentBg = hasAccent ? `hsl(${cust.accentColor} / 0.08)` : undefined;

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
        fontSize: vars.fontSize,
        lineHeight: vars.lineHeight,
        background: accentBg || "hsl(var(--background))",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-8 px-6">
        {data.profilePhoto && (
          <div
            className="w-28 h-28 rounded-full overflow-hidden border-4 mb-5"
            style={{ borderColor: accentHsl || "hsl(var(--border))" }}
          >
            <img src={data.profilePhoto} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}
        {data.name && (
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{data.name}</h1>
        )}
        {pillItems.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            {pillItems.map((item, i) => (
              <span
                key={i}
                className="text-xs font-medium px-3 py-1 rounded-full"
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
          <p className="text-sm text-muted-foreground mt-2">{infoItems.join(" · ")}</p>
        )}
        {data.showGpa && data.gpa && (
          <p className="text-sm text-muted-foreground mt-1">GPA: {data.gpa}</p>
        )}
        {data.recruitingTagline && (
          <p
            className="text-sm font-medium mt-4 italic text-center max-w-md"
            style={{ color: accentHsl || "hsl(var(--foreground))" }}
          >
            "{data.recruitingTagline}"
          </p>
        )}
        {data.contactEmail && (
          <a
            href={`mailto:${data.contactEmail}`}
            className="flex items-center gap-1.5 text-xs mt-3 hover:underline"
            style={{ color: accentHsl || "hsl(var(--primary))" }}
          >
            <Mail size={12} /> {data.contactEmail}
          </a>
        )}
      </div>

      {/* Highlight Cards Grid */}
      {data.highlightCards.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.highlightCards.map((card) => (
              <HighlightCard
                key={card.id}
                card={card}
                accentHsl={accentHsl}
                accentColor={cust.accentColor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {data.highlightCards.length === 0 && (
        <div className="max-w-md mx-auto px-6 pb-12 text-center">
          <div className="rounded-xl border border-dashed border-border p-8">
            <p className="text-sm text-muted-foreground">Add highlight cards to showcase your game film</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightsPreview;