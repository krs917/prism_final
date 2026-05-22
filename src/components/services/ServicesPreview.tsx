import {
  ServicesData,
  ResumeCustomization,
  defaultCustomization,
  ACCENT_NONE,
} from "@/types/resume";
import { getStyleVars } from "@/lib/customizationStyles";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Star,
  Calendar,
  ExternalLink,
  MessageCircle,
  Award,
} from "lucide-react";

interface Props {
  data: ServicesData;
  customization?: ResumeCustomization;
}

const ServicesPreview = ({ data, customization }: Props) => {
  const c = customization ?? defaultCustomization;
  const vars = getStyleVars(c);
  const accent = c.accentColor !== ACCENT_NONE ? c.accentColor : "220 91% 54%";
  const accentHsl = `hsl(${accent})`;
  const hidden = (c.hiddenSections as string[]) || [];
  const bio = data.customBio || data.summary;

  return (
    <div
      className="bg-background rounded-xl shadow-lg overflow-hidden"
      style={{ ...vars, fontFamily: vars.fontFamily }}
    >
      {/* Hero */}
      {!hidden.includes("personal") && (
        <div className="relative overflow-hidden">
          {data.bannerImage && (
            <div className="w-full h-32">
              <img src={data.bannerImage} alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 h-32" style={{ background: `linear-gradient(to bottom, transparent 40%, hsl(${accent} / 0.08))` }} />
            </div>
          )}
          <div
            className={`relative px-8 ${data.bannerImage ? 'pt-4' : 'pt-10'} pb-8 text-center`}
            style={!data.bannerImage ? { background: `linear-gradient(135deg, hsl(${accent} / 0.08), hsl(${accent} / 0.03))` } : undefined}
          >
            {data.profilePhoto && (
              <div
                className={`w-24 h-24 rounded-full mx-auto mb-4 border-4 overflow-hidden ${data.bannerImage ? '-mt-14 relative z-10 shadow-lg' : ''}`}
                style={{ borderColor: data.bannerImage ? 'hsl(var(--background))' : `hsl(${accent} / 0.3)` }}
              >
                <img src={data.profilePhoto} alt={data.name} className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-foreground">{data.name || "Your Name"}</h1>
            {data.serviceTagline && (
              <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: accentHsl }}>
                {data.serviceTagline}
              </p>
            )}
            {data.coverageArea && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <MapPin size={12} /> {data.coverageArea}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="px-8 py-6 space-y-8">
        {/* About */}
        {!hidden.includes("about") && bio && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentHsl }}>
              About Me
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{bio}</p>
          </div>
        )}

        {/* Services */}
        {!hidden.includes("services") && data.services.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: accentHsl }}>
              Services
            </h2>
            <div className="grid gap-3">
              {data.services.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-border p-4"
                  style={{ borderLeftWidth: 3, borderLeftColor: accentHsl }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{s.serviceName || "Service"}</h3>
                    {s.rate && (
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: `hsl(${accent} / 0.1)`, color: accentHsl }}
                      >
                        {s.rate} {s.rateType && `/ ${s.rateType}`}
                      </span>
                    )}
                  </div>
                  {s.description && (
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {s.agesOrGrades && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {s.agesOrGrades}
                      </span>
                    )}
                    {s.availability.map((a) => (
                      <span
                        key={a}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {!hidden.includes("gallery") && data.galleryImages && data.galleryImages.filter(g => g.src).length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentHsl }}>
              Photos
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {data.galleryImages.filter(g => g.src).map(g => (
                <div key={g.id} className="rounded-lg overflow-hidden border border-border">
                  <div className="aspect-[4/3]">
                    <img src={g.src} alt={g.caption || "Gallery"} className="w-full h-full object-cover" />
                  </div>
                  {g.caption && (
                    <p className="text-[10px] text-muted-foreground p-2 text-center leading-tight">{g.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credentials */}
        {!hidden.includes("credentials") && (data.cprCertified || data.yearsExperience || data.referencesAvailable || data.certifications) && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentHsl }}>
              Credentials & Trust
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.cprCertified && (
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <Shield size={14} style={{ color: accentHsl }} /> CPR / First Aid Certified
                </div>
              )}
              {data.yearsExperience && (
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <Clock size={14} style={{ color: accentHsl }} /> {data.yearsExperience} years experience
                </div>
              )}
              {data.referencesAvailable && (
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <Star size={14} style={{ color: accentHsl }} /> References available
                </div>
              )}
              {data.certifications && (
                <div className="col-span-2 flex items-start gap-2 text-xs text-foreground">
                  <Award size={14} style={{ color: accentHsl }} className="mt-0.5 shrink-0" />
                  <span className="whitespace-pre-line">{data.certifications}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {!hidden.includes("testimonials") && data.testimonials.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: accentHsl }}>
              What People Say
            </h2>
            <div className="space-y-3">
              {data.testimonials.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg p-4"
                  style={{ backgroundColor: `hsl(${accent} / 0.04)` }}
                >
                  <p className="text-sm italic text-foreground leading-relaxed">"{t.quote}"</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">— {t.clientName || "Client"}</span>
                    {t.duration && (
                      <span className="text-[10px] text-muted-foreground">· {t.duration}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        {!hidden.includes("contact") && (
          <div className="text-center pt-2 pb-4 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: accentHsl }}>
              Get in Touch
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              {(data.contactEmail || data.email) && (
                <span className="flex items-center gap-1">
                  <Mail size={12} /> {data.contactEmail || data.email}
                </span>
              )}
              {(data.contactPhone || data.phone) && (
                <span className="flex items-center gap-1">
                  <Phone size={12} /> {data.contactPhone || data.phone}
                </span>
              )}
              {data.preferredContact && (
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} /> Prefers {data.preferredContact}
                </span>
              )}
            </div>
            {data.schedulingLink && (
              <a
                href={data.schedulingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentHsl }}
              >
                <Calendar size={13} /> Book a Time <ExternalLink size={11} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPreview;
