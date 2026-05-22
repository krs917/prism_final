import { AthleticProfileData, ResumeCustomization, Sport } from "@/types/resume";
import { SportType, SPORT_CONFIGS, getStatFields } from "@/config/sportFields";
import { EventsTablePdf } from "../UpcomingEventsTable";

function StatList({ sport }: { sport: Sport }) {
  if (!sport.sportType) return null;
  const fields = getStatFields(sport.sportType as SportType, sport.position);
  const filled = fields.filter(f => sport.stats[f.key]);
  if (filled.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
      {filled.map(f => {
        const label = sport.sportType === "Other" && sport.customStatLabels?.[f.key]
          ? sport.customStatLabels[f.key] : f.label;
        return <span key={f.key} style={{ color: "#444" }}>{label}: <strong>{sport.stats[f.key]}</strong></span>;
      })}
    </div>
  );
}

function PositionLabel({ sport }: { sport: Sport }) {
  if (!sport.position || !sport.sportType) return null;
  const config = SPORT_CONFIGS[sport.sportType as SportType];
  const pos = config?.positions?.find(p => p.value === sport.position);
  return <>{pos?.label || sport.position}</>;
}

const CleanAthleticTemplate = ({ data, customization }: { data: AthleticProfileData; customization?: ResumeCustomization }) => {
  const isNone = customization?.accentColor === "none";
  const accent = isNone ? "#1a1a2e" : (customization?.accentColor ? `hsl(${customization.accentColor})` : "hsl(220, 91%, 54%)");
  const accentLight = isNone ? "#f9f9f9" : (customization?.accentColor ? `hsl(${customization.accentColor} / 0.06)` : "hsl(220, 91%, 97%)");
  const height = data.heightFeet && data.heightInches ? `${data.heightFeet}'${data.heightInches}"` : "";
  const hv = customization?.headerVisible ?? { email: true, phone: true, city: true, gpa: true };
  const hidden = (customization?.hiddenSections as string[]) || [];

  return (
    <div className="flex min-h-full font-sans text-[11px] leading-relaxed" style={{ color: "#1a1a2e" }}>
      <div className="w-[35%] space-y-5" style={{ padding: "48px 24px 48px 58px",
        background: isNone ? "#f5f5f5" : accent,
        color: isNone ? "#1a1a2e" : "rgba(255,255,255,0.9)",
        borderRight: isNone ? "1.5px solid #e5e7eb" : undefined,
      }}>
        <div>
          <h1 className="text-lg font-bold leading-tight" style={{ color: isNone ? "#1a1a2e" : "white" }}>{data.name || "Your Name"}</h1>
          <p className="text-[10px] mt-0.5 opacity-70" style={isNone ? { color: "#777" } : undefined}>Athletic Profile</p>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[9px] font-bold uppercase tracking-widest opacity-70">Contact</h3>
          {hv.email && data.email && <p className="text-[10px]">{data.email}</p>}
          {hv.phone && data.phone && <p className="text-[10px]">{data.phone}</p>}
          {hv.city && data.city && <p className="text-[10px]">{data.city}</p>}
        </div>

        {!hidden.includes("academics") && (
          <div className="space-y-1.5">
            <h3 className="text-[9px] font-bold uppercase tracking-widest opacity-70">Academics</h3>
            {data.school && <p className="text-[10px] font-semibold">{data.school}</p>}
            {data.classYear && <p className="text-[10px] opacity-90">{data.classYear.charAt(0).toUpperCase() + data.classYear.slice(1)}</p>}
            {hv.gpa && data.gpa && <p className="text-[10px] opacity-80">GPA: {data.gpa}</p>}
          </div>
        )}

        {!hidden.includes("physical") && (height || data.weight) && (
          <div className="space-y-1.5">
            <h3 className="text-[9px] font-bold uppercase tracking-widest opacity-70">Physical</h3>
            {height && <p className="text-[10px]">{height}</p>}
            {data.weight && <p className="text-[10px]">{data.weight} lbs</p>}
          </div>
        )}

        {data.sports.some(s => s.coachName) && (
          <div className="space-y-1.5">
            <h3 className="text-[9px] font-bold uppercase tracking-widest opacity-70">Coaches</h3>
            {data.sports.filter(s => s.coachName).map(s => (
              <div key={s.id} className="text-[10px]">
                <p className="font-semibold">{s.coachName} <span className="opacity-70">({s.sportType})</span></p>
                {s.coachEmail && <p className="opacity-90">{s.coachEmail}</p>}
                {s.coachPhone && <p className="opacity-80">{s.coachPhone}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4" style={{ padding: "48px 58px 48px 24px" }}>
        {!hidden.includes("recruitingStatement") && data.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: accent }}>About</h2>
            <p style={{ color: "#444" }}>{data.summary}</p>
          </div>
        )}

        {!hidden.includes("sports") && data.sports.filter(s => s.sportType || s.teamName).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Sports</h2>
            <div className="space-y-3">
              {data.sports.filter(s => s.sportType || s.teamName).map(s => {
                const sportName = (s.sportType === "Other" && s.customSportName) ? s.customSportName : s.sportType;
                const parts: React.ReactNode[] = [];
                if (s.teamName) parts.push(s.teamName);
                if (sportName) parts.push(sportName);
                if (s.position) parts.push(<PositionLabel sport={s} />);
                const meta: string[] = [];
                if (s.varsityLetters) meta.push(`${s.varsityLetters} Varsity Letter${s.varsityLetters === "1" ? "" : "s"}`);
                if (s.teamCaptain === "yes") meta.push("Captain");
                if (s.seasonsPlayed) meta.push(s.seasonsPlayed);

                return (
                  <div key={s.id}>
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold">
                        {parts.reduce<React.ReactNode[]>((acc, part, i) => i === 0 ? [part] : [...acc, " — ", part], [])}
                        {s.jerseyNumber ? ` #${s.jerseyNumber}` : ""}
                      </p>
                      {meta.length > 0 && <p className="text-[9px] shrink-0 ml-2" style={{ color: "#999" }}>{meta.join(" · ")}</p>}
                    </div>
                    {s.clubLevel && s.teamType === "club" && <p className="text-[10px]" style={{ color: "#888" }}>{s.clubLevel}</p>}
                    <StatList sport={s} />
                    {(s.highlightLinks || []).filter(l => l.url && l.displayText).map(link => (
                      <p key={link.id} className="text-[10px] mt-0.5" style={{ color: accent }}>{link.displayText}</p>
                    ))}
                    {s.hudlProfileUrl && <p className="text-[10px] break-all mt-0.5" style={{ color: accent }}>{s.hudlProfileUrl}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!hidden.includes("upcomingEvents") && (data.upcomingEvents || []).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Where to See Me Play</h2>
            <EventsTablePdf events={data.upcomingEvents} accent={accent} />
          </div>
        )}

        {!hidden.includes("recruitingStatement") && data.recruitingNote && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Recruiting Statement</h2>
            <p style={{ color: "#444" }}>{data.recruitingNote}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanAthleticTemplate;
