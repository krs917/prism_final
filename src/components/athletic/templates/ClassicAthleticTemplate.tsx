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
  return <p className="text-[10px] mt-0.5" style={{ color: "#666" }}>{bits.join(" · ")}</p>;
}

function PositionLabel({ sport }: { sport: Sport }) {
  if (!sport.position || !sport.sportType) return null;
  const config = SPORT_CONFIGS[sport.sportType as SportType];
  const pos = config?.positions?.find(p => p.value === sport.position);
  return <>{pos?.label || sport.position}</>;
}

function SportCoach({ sport }: { sport: Sport }) {
  if (!sport.coachName) return null;
  return (
    <div className="mt-1 text-[10px]" style={{ color: "#666" }}>
      <span className="font-medium">Coach:</span> {sport.coachName}
      {sport.coachEmail && <> · {sport.coachEmail}</>}
      {sport.coachPhone && <> · {sport.coachPhone}</>}
    </div>
  );
}

function SportLinks({ sport, color }: { sport: Sport; color: string }) {
  const links = (sport.highlightLinks || []).filter(l => l.url && l.displayText);
  const hudl = sport.hudlProfileUrl;
  if (links.length === 0 && !hudl) return null;
  return (
    <div className="mt-1 space-y-0.5">
      {links.map(link => (
        <p key={link.id} className="text-[10px]" style={{ color }}>{link.displayText}</p>
      ))}
      {hudl && <p className="text-[10px] break-all" style={{ color }}>{hudl}</p>}
    </div>
  );
}

const ClassicAthleticTemplate = ({ data, customization }: { data: AthleticProfileData; customization?: ResumeCustomization }) => {
  const isNone = customization?.accentColor === "none";
  const accent = isNone ? "#1a1a2e" : (customization?.accentColor ? `hsl(${customization.accentColor})` : "hsl(220, 91%, 54%)");
  const height = data.heightFeet && data.heightInches ? `${data.heightFeet}'${data.heightInches}"` : data.heightFeet ? `${data.heightFeet}'` : "";
  const hv = customization?.headerVisible ?? { email: true, phone: true, city: true, gpa: true };
  const hidden = (customization?.hiddenSections as string[]) || [];

  return (
    <div className="font-serif text-[11px] leading-relaxed" style={{ color: "#1a1a2e", padding: "48px 58px" }}>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{data.name || "Your Name"}</h1>
        <p className="text-xs mt-1 font-medium" style={{ color: accent }}>Athletic Profile</p>
        <div className="flex items-center justify-center gap-3 mt-1.5 text-[10px]" style={{ color: "#666" }}>
          {hv.email && data.email && <span>{data.email}</span>}
          {hv.phone && data.phone && <><span>·</span><span>{data.phone}</span></>}
          {hv.city && data.city && <><span>·</span><span>{data.city}</span></>}
        </div>
      </div>
      <hr className="border-t mb-4" style={{ borderColor: "#1a1a2e" }} />

      {!hidden.includes("academics") && (
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-[10px]">
          {data.school && <span><strong>School:</strong> {data.school}</span>}
          {data.classYear && <span><strong>Class:</strong> {data.classYear.charAt(0).toUpperCase() + data.classYear.slice(1)}</span>}
          {hv.gpa && data.gpa && <span><strong>GPA:</strong> {data.gpa}</span>}
        </div>
      )}

      {!hidden.includes("physical") && (height || data.weight) && (
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-[10px]">
          {height && <span><strong>Height:</strong> {height}</span>}
          {data.weight && <span><strong>Weight:</strong> {data.weight} lbs</span>}
        </div>
      )}

      {!hidden.includes("recruitingStatement") && data.summary && (
        <div className="mb-4">
          <p className="italic" style={{ color: "#444" }}>{data.summary}</p>
        </div>
      )}

      {!hidden.includes("sports") && data.sports.filter(s => s.sportType || s.teamName).length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2">Sports</h2>
          <div className="space-y-3">
            {data.sports.filter(s => s.sportType || s.teamName).map(s => {
              const sportName = (s.sportType === "Other" && s.customSportName) ? s.customSportName : s.sportType;
              const parts: React.ReactNode[] = [];
              if (s.teamName) parts.push(s.teamName);
              if (sportName) parts.push(sportName);
              if (s.position) parts.push(<PositionLabel sport={s} />);
              return (
                <div key={s.id}>
                  <p className="font-semibold">
                    {parts.reduce<React.ReactNode[]>((acc, part, i) => i === 0 ? [part] : [...acc, " — ", part], [])}
                    {s.jerseyNumber ? ` #${s.jerseyNumber}` : ""}
                  </p>
                  {s.clubLevel && s.teamType === "club" && <p className="text-[10px]" style={{ color: "#888" }}>{s.clubLevel}</p>}
                  <SportMeta sport={s} />
                  <StatList sport={s} />
                  <SportCoach sport={s} />
                  <SportLinks sport={s} color={accent} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!hidden.includes("upcomingEvents") && (data.upcomingEvents || []).length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2">Where to See Me Play</h2>
          <EventsTablePdf events={data.upcomingEvents} accent={accent} />
        </div>
      )}

      {!hidden.includes("recruitingStatement") && data.recruitingNote && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2">Recruiting Statement</h2>
          <p style={{ color: "#444" }}>{data.recruitingNote}</p>
        </div>
      )}
    </div>
  );
};

export default ClassicAthleticTemplate;
