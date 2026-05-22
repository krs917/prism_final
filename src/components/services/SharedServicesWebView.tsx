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
import { motion } from "framer-motion";

interface Props {
  data: ServicesData;
  customization?: ResumeCustomization;
}

const SharedServicesWebView = ({ data, customization }: Props) => {
  const c = customization ?? defaultCustomization;
  const vars = getStyleVars(c);
  const accent = c.accentColor !== ACCENT_NONE ? c.accentColor : "220 91% 54%";
  const accentHsl = `hsl(${accent})`;
  const bio = data.customBio || data.summary;

  return (
    <div className="min-h-screen bg-background" style={{ ...vars, fontFamily: vars.fontFamily }}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        {data.bannerImage && (
          <div className="w-full h-48 sm:h-56">
            <img src={data.bannerImage} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, hsl(${accent} / 0.1))` }} />
          </div>
        )}
        <div
          className={`relative px-6 ${data.bannerImage ? 'pt-6' : 'pt-16'} pb-12 text-center`}
          style={!data.bannerImage ? { background: `linear-gradient(135deg, hsl(${accent} / 0.1), hsl(${accent} / 0.03))` } : undefined}
        >
          {data.profilePhoto && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`w-28 h-28 rounded-full mx-auto mb-5 border-4 overflow-hidden shadow-lg ${data.bannerImage ? '-mt-20 relative z-10' : ''}`}
              style={{ borderColor: data.bannerImage ? 'hsl(var(--background))' : `hsl(${accent} / 0.3)` }}
            >
              <img src={data.profilePhoto} alt={data.name} className="w-full h-full object-cover" />
            </motion.div>
          )}
          <h1 className="text-3xl font-bold text-foreground">{data.name || "Your Name"}</h1>
          {data.serviceTagline && (
            <p className="text-base mt-3 max-w-lg mx-auto font-medium" style={{ color: accentHsl }}>
              {data.serviceTagline}
            </p>
          )}
          {data.coverageArea && (
            <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
              <MapPin size={14} /> {data.coverageArea}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
        {/* About */}
        {bio && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-base font-bold uppercase tracking-wider mb-3" style={{ color: accentHsl }}>
              About Me
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{bio}</p>
          </motion.div>
        )}

        {/* Services */}
        {data.services.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-base font-bold uppercase tracking-wider mb-4" style={{ color: accentHsl }}>
              Services
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.services.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
                  style={{ borderLeftWidth: 4, borderLeftColor: accentHsl }}
                >
                  <h3 className="font-semibold text-foreground">{s.serviceName || "Service"}</h3>
                  {s.rate && (
                    <span
                      className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mt-1.5"
                      style={{ backgroundColor: `hsl(${accent} / 0.1)`, color: accentHsl }}
                    >
                      {s.rate} {s.rateType && `/ ${s.rateType}`}
                    </span>
                  )}
                  {s.description && (
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {s.agesOrGrades && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {s.agesOrGrades}
                      </span>
                    )}
                    {s.availability.map((a) => (
                      <span key={a} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gallery */}
        {data.galleryImages && data.galleryImages.filter(g => g.src).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="text-base font-bold uppercase tracking-wider mb-4" style={{ color: accentHsl }}>
              Photos
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {data.galleryImages.filter(g => g.src).map(g => (
                <div key={g.id} className="rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3]">
                    <img src={g.src} alt={g.caption || "Gallery"} className="w-full h-full object-cover" />
                  </div>
                  {g.caption && (
                    <p className="text-xs text-muted-foreground p-3 text-center leading-snug">{g.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Credentials */}
        {(data.cprCertified || data.yearsExperience || data.referencesAvailable || data.certifications) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-base font-bold uppercase tracking-wider mb-4" style={{ color: accentHsl }}>
              Credentials & Trust
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.cprCertified && (
                <div className="flex items-center gap-2.5 text-sm text-foreground rounded-lg border border-border p-3">
                  <Shield size={16} style={{ color: accentHsl }} /> CPR / First Aid Certified
                </div>
              )}
              {data.yearsExperience && (
                <div className="flex items-center gap-2.5 text-sm text-foreground rounded-lg border border-border p-3">
                  <Clock size={16} style={{ color: accentHsl }} /> {data.yearsExperience} years experience
                </div>
              )}
              {data.referencesAvailable && (
                <div className="flex items-center gap-2.5 text-sm text-foreground rounded-lg border border-border p-3">
                  <Star size={16} style={{ color: accentHsl }} /> References available
                </div>
              )}
              {data.certifications && (
                <div className="flex items-start gap-2.5 text-sm text-foreground rounded-lg border border-border p-3 sm:col-span-2">
                  <Award size={16} style={{ color: accentHsl }} className="mt-0.5 shrink-0" />
                  <span className="whitespace-pre-line">{data.certifications}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Testimonials */}
        {data.testimonials.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-base font-bold uppercase tracking-wider mb-4" style={{ color: accentHsl }}>
              What People Say
            </h2>
            <div className="space-y-4">
              {data.testimonials.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl p-5"
                  style={{ backgroundColor: `hsl(${accent} / 0.04)` }}
                >
                  <p className="text-base italic text-foreground leading-relaxed">"{t.quote}"</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">— {t.clientName || "Client"}</span>
                    {t.duration && <span className="text-xs text-muted-foreground">· {t.duration}</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-4 pb-8 space-y-4"
        >
          <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: accentHsl }}>
            Get in Touch
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
            {(data.contactEmail || data.email) && (
              <a href={`mailto:${data.contactEmail || data.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Mail size={14} /> {data.contactEmail || data.email}
              </a>
            )}
            {(data.contactPhone || data.phone) && (
              <span className="flex items-center gap-1.5">
                <Phone size={14} /> {data.contactPhone || data.phone}
              </span>
            )}
            {data.preferredContact && (
              <span className="flex items-center gap-1.5">
                <MessageCircle size={14} /> Prefers {data.preferredContact}
              </span>
            )}
          </div>
          {data.schedulingLink && (
            <a
              href={data.schedulingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentHsl }}
            >
              <Calendar size={15} /> Book a Time <ExternalLink size={12} />
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SharedServicesWebView;
