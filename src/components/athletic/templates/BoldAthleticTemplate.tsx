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

function SportMeta({ sport }: { sport: Sport }) {
  const bits: string[] = [];
  if (sport.varsityLetters) bits.push(`${sport.varsityLetters} Varsity Letter${sport.varsityLetters === "1" ? "" : "s"}`);
  if (sport.teamCaptain === "yes") bits.push("Team Captain");
  if (sport.seasonsPlayed) bits.push(sport.seasonsPlayed);
  if (bits.length === 0) return null;
  return <p className="text-[9px] shrink-0" style={{ color: "#999" }}>{bits.join(" · ")}</p>;
}

function PositionLabel({ sport }: { sport: Sport }) {
  if (!sport.position || !sport.sportType) return null;
  const config = SPORT_CONFIGS[sport.sportType as SportType];
  const pos = config?.positions?.find(p => p.value === sport.position);
  return <>{pos?.label || sport.position}</>;
}

const BoldAthleticTemplate = ({ data, customization }: { data: AthleticProfileData; customization?: ResumeCustomization }) => {
  const isNone = customization?.accentColor === "none";
  const accent = isNone ? "#1a1a2e" : (customization?.accentColor ? `hsl(${customization.accentColor})` : "hsl(220, 91%, 54%)");
  const height = data.heightFeet && data.heightInches ? `${data.heightFeet}'${data.heightInches}"` : "";
  const hv = customization?.headerVisible ?? { email: true, phone: true, city: true, gpa: true };
  const hidden = (customization?.hiddenSections as string[]) || [];

  return (
    <div className="font-sans text-[11px] leading-relaxed" style={{ color: "#1a1a2e" }}>
      {!hidden.includes("personal") && (
        <div style={{ padding: "48px 58px 24px",
          background: isNone ? "white" : accent,
          borderBottom: isNone ? "1.5px solid #e5e7eb" : undefined,
        }}>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: isNone ? "#1a1a2e" : "white" }}>{data.name || "Your Name"}</h1>
          <p className="text-xs font-semibold mt-0.5" style={{ color: isNone ? "#777" : "rgba(255,255,255,0.7)" }}>Athletic Profile</p>
          {data.summary && !hidden.includes("recruitingStatement") && <p className="mt-2 text-[11px] leading-relaxed" style={{ color: isNone ? "#555" : "rgba(255,255,255,0.85)" }}>{data.summary}</p>}
          <div className="flex flex-wrap gap-3 mt-3 text-[10px]" style={{ color: isNone ? "#777" : "rgba(255,255,255,0.7)" }}>
            {hv.email && data.email && <span>{data.email}</span>}
            {hv.phone && data.phone && <span>{data.phone}</span>}
            {hv.city && data.city && <span>{data.city}</span>}
          </div>
        </div>
      )}

      {!hidden.includes("academics") && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] border-b" style={{ padding: "12px 58px", borderColor: "#e5e7eb", background: isNone ? "#f9f9f9" : (customization?.accentColor ? `hsl(${customization.accentColor} / 0.06)` : "hsl(220, 91%, 97%)") }}>
          {data.school && <span><strong>School:</strong> {data.school}</span>}
          {data.classYear && <span><strong>Class:</strong> {data.classYear.charAt(0).toUpperCase() + data.classYear.slice(1)}</span>}
          {hv.gpa && data.gpa && <span><strong>GPA:</strong> {data.gpa}</span>}
          {!hidden.includes("physical") && height && <span><strong>Height:</strong> {height}</span>}
          {!hidden.includes("physical") && data.weight && <span><strong>Weight:</strong> {data.weight} lbs</span>}
        </div>
      )}

      <div className="space-y-4" style={{ padding: "20px 58px 48px" }}>
        {!hidden.includes("sports") && data.sports.filter(s => s.sportType || s.teamName).length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Sports</h2>
            <div className="space-y-3">
              {data.sports.filter(s => s.sportType || s.teamName).map(s => {
                const sportName = (s.sportType === "Other" && s.customSportName) ? s.customSportName : s.sportType;
                const parts: React.ReactNode[] = [];
                if (s.teamName) parts.push(s.teamName);
                if (sportName) parts.push(sportName);
                if (s.position) parts.push(<PositionLabel sport={s} />);
                return (
                  <div key={s.id}>
                    <div className="flex justify-between items-baseline">
                      <p className="font-bold">
                        {parts.reduce<React.ReactNode[]>((acc, part, i) => i === 0 ? [part] : [...acc, " — ", part], [])}
                        {s.jerseyNumber ? ` #${s.jerseyNumber}` : ""}
                      </p>
                      <SportMeta sport={s} />
                    </div>
                    {s.clubLevel && s.teamType === "club" && <p className="text-[10px]" style={{ color: "#888" }}>{s.clubLevel}</p>}
                    <StatList sport={s} />
                    {s.coachName && (
                      <p className="text-[10px] mt-1" style={{ color: "#666" }}>
                        Coach: {s.coachName}{s.coachEmail ? ` · ${s.coachEmail}` : ""}{s.coachPhone ? ` · ${s.coachPhone}` : ""}
                      </p>
                    )}
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
            <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Where to See Me Play</h2>
            <EventsTablePdf events={data.upcomingEvents} accent={accent} />
          </div>
        )}

        {!hidden.includes("recruitingStatement") && data.recruitingNote && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Recruiting Statement</h2>
            <p style={{ color: "#444" }}>{data.recruitingNote}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoldAthleticTemplate;
