import { AthleticProfileData, Sport } from "@/types/resume";
import { SportType, SPORT_CONFIGS, getStatFields } from "@/config/sportFields";
import { Trophy, Mail, Phone, MapPin, GraduationCap, Ruler, Weight, Video, ExternalLink, Calendar } from "lucide-react";
import { EventsTableWeb } from "./UpcomingEventsTable";

function PositionLabel({ sport }: { sport: Sport }) {
  if (!sport.position || !sport.sportType) return null;
  const config = SPORT_CONFIGS[sport.sportType as SportType];
  const pos = config?.positions?.find(p => p.value === sport.position);
  return <>{pos?.label || sport.position}</>;
}

function StatGrid({ sport }: { sport: Sport }) {
  if (!sport.sportType) return null;
  const fields = getStatFields(sport.sportType as SportType, sport.position);
  const filled = fields.filter(f => sport.stats[f.key]);
  if (filled.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
      {filled.map(f => {
        const label = sport.sportType === "Other" && sport.customStatLabels?.[f.key]
          ? sport.customStatLabels[f.key] : f.label;
        return (
          <div key={f.key} className="rounded-lg bg-card border border-border p-3 text-center">
            <p className="text-lg font-bold text-foreground">{sport.stats[f.key]}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        );
      })}
    </div>
  );
}

const SharedAthleticWebView = ({ data }: { data: AthleticProfileData }) => {
  const height = data.heightFeet && data.heightInches ? `${data.heightFeet}'${data.heightInches}"` : "";
  const classLabel = data.classYear ? data.classYear.charAt(0).toUpperCase() + data.classYear.slice(1) : "";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground px-6 py-10 sm:py-14">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{data.name || "Student Athlete"}</h1>
          <p className="text-sm opacity-80 mt-1">Athletic Recruiting Profile</p>

          {/* Quick info pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {data.school && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
                <GraduationCap size={12} /> {data.school}
              </span>
            )}
            {classLabel && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
                {classLabel}
              </span>
            )}
            {data.gpa && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
                GPA: {data.gpa}
              </span>
            )}
            {height && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
                <Ruler size={12} /> {height}
              </span>
            )}
            {data.weight && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
                {data.weight} lbs
              </span>
            )}
          </div>

          {/* Contact */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs opacity-80">
            {data.email && <span className="inline-flex items-center gap-1"><Mail size={12} /> {data.email}</span>}
            {data.phone && <span className="inline-flex items-center gap-1"><Phone size={12} /> {data.phone}</span>}
            {data.city && <span className="inline-flex items-center gap-1"><MapPin size={12} /> {data.city}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Summary */}
        {data.summary && (
          <div>
            <p className="text-base text-muted-foreground leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Sports */}
        {data.sports.map(sport => {
          const meta: string[] = [];
          if (sport.varsityLetters) meta.push(`${sport.varsityLetters} Varsity Letter${sport.varsityLetters === "1" ? "" : "s"}`);
          if (sport.teamCaptain === "yes") meta.push("Team Captain");
          if (sport.seasonsPlayed) meta.push(sport.seasonsPlayed);
          const links = (sport.highlightLinks || []).filter(l => l.url && l.displayText);

          return (
            <div key={sport.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-primary" />
                    <h2 className="text-lg font-bold text-foreground">
                      {(sport.sportType === "Other" && sport.customSportName) ? sport.customSportName : (sport.sportType || "Sport")}
                      {sport.position ? <span className="font-normal text-muted-foreground"> — <PositionLabel sport={sport} /></span> : ""}
                    </h2>
                  </div>
                  {sport.jerseyNumber && <p className="text-sm text-muted-foreground mt-0.5">#{sport.jerseyNumber}</p>}
                </div>
              </div>

              {meta.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {meta.map((m, i) => (
                    <span key={i} className="rounded-full bg-accent text-accent-foreground px-2.5 py-0.5 text-xs font-medium">{m}</span>
                  ))}
                </div>
              )}

              <StatGrid sport={sport} />

              {/* Coach */}
              {sport.coachName && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Coach</p>
                  <p className="text-sm font-medium text-foreground">{sport.coachName}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                    {sport.coachEmail && <span className="inline-flex items-center gap-1"><Mail size={11} /> {sport.coachEmail}</span>}
                    {sport.coachPhone && <span className="inline-flex items-center gap-1"><Phone size={11} /> {sport.coachPhone}</span>}
                  </div>
                </div>
              )}

              {/* Videos */}
              {(links.length > 0 || sport.hudlProfileUrl) && (
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Highlights</p>
                  {links.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Video size={14} />
                      {link.displayText}
                    </a>
                  ))}
                  {sport.hudlProfileUrl && (
                    <a href={sport.hudlProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <ExternalLink size={14} />
                      Hudl Profile
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Where to See Me Play */}
        {(data.upcomingEvents || []).length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Where to See Me Play</h2>
            </div>
            <EventsTableWeb events={data.upcomingEvents} />
          </div>
        )}

        {/* Recruiting Statement */}
        {data.recruitingNote && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Recruiting Statement</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{data.recruitingNote}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedAthleticWebView;
