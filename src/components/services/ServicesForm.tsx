import { useState, useRef } from "react";
import {
  ServicesData,
  ServiceEntry,
  ServiceTestimonial,
  GalleryImage,
  createServiceEntry,
  createServiceTestimonial,
  createGalleryImage,
  ALL_AVAILABILITY_OPTIONS,
  ALL_RATE_TYPES,
  ALL_PREFERRED_CONTACT,
  AvailabilityOption,
  RateType,
  PreferredContact,
} from "@/types/resume";
import { FieldInput, FieldTextarea } from "../resume/FieldInput";
import { Plus, Trash2, Image, ChevronDown, ChevronRight, Check, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ServicesFormProps {
  data: ServicesData;
  updateField: <K extends keyof ServicesData>(field: K, value: ServicesData[K]) => void;
}

const transition = { duration: 0.3, ease: [0.2, 0, 0, 1] as const };

const Section = ({
  title,
  subtitle,
  defaultOpen = true,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <div>
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {open ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={transition}>
            <div className="p-4 pt-0 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServicesForm = ({ data, updateField }: ServicesFormProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const galleryRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("profilePhoto", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("bannerImage", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGalleryImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField("galleryImages", data.galleryImages.map(g => g.id === id ? { ...g, src: reader.result as string } : g));
    };
    reader.readAsDataURL(file);
  };

  const updateService = (id: string, updates: Partial<ServiceEntry>) => {
    updateField("services", data.services.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const updateTestimonial = (id: string, updates: Partial<ServiceTestimonial>) => {
    updateField("testimonials", data.testimonials.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  return (
    <div className="space-y-5">
      {/* Profile Photo */}
      <Section title="Profile & Tagline" subtitle="Your photo and headline">
        <div className="flex items-center gap-4">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-20 h-20 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors flex-shrink-0"
          >
            {data.profilePhoto ? (
              <img src={data.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Image size={24} className="text-muted-foreground" />
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          <div className="flex-1 space-y-3">
            <FieldInput label="Name" value={data.name} disabled className="opacity-60" />
          </div>
        </div>
        {/* Banner Image */}
        <div>
          <label className="field-label">Banner / Cover Image (optional)</label>
          <p className="text-[10px] text-muted-foreground mb-1.5">Recommended aspect ratio: 16:9 or 3:1</p>
          <button
            onClick={() => bannerRef.current?.click()}
            className="w-full h-24 rounded-lg bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors"
          >
            {data.bannerImage ? (
              <img src={data.bannerImage} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Upload size={16} /> Upload banner image
              </div>
            )}
          </button>
          <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
          {data.bannerImage && (
            <button onClick={() => updateField("bannerImage", "")} className="text-[10px] text-destructive mt-1 hover:underline">Remove banner</button>
          )}
        </div>
        <FieldInput
          label="Service Tagline"
          placeholder="Reliable babysitter serving the Wyndmoor area"
          value={data.serviceTagline}
          onChange={e => updateField("serviceTagline", e.target.value)}
        />
        <FieldInput
          label="Location / Coverage Area"
          placeholder="Available in Wyndmoor, Chestnut Hill, and surrounding areas"
          value={data.coverageArea}
          onChange={e => updateField("coverageArea", e.target.value)}
        />
        <FieldTextarea
          label="About Me"
          placeholder="A short bio about you and your services..."
          value={data.customBio || data.summary}
          onChange={e => updateField("customBio", e.target.value)}
          rows={3}
        />
      </Section>

      {/* Photo Gallery */}
      <Section title="Photo Gallery" subtitle="Up to 3 photos of you in action (optional)" defaultOpen={false}>
        <AnimatePresence>
          {data.galleryImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={transition}
              className="rounded-lg border border-border p-3 space-y-2 relative"
            >
              <button
                onClick={() => updateField("galleryImages", data.galleryImages.filter(g => g.id !== img.id))}
                className="absolute top-2 right-2 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => galleryRefs.current[img.id]?.click()}
                className="w-full h-28 rounded-md bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors"
              >
                {img.src ? (
                  <img src={img.src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Image size={16} /> Upload photo
                  </div>
                )}
              </button>
              <input
                ref={el => { galleryRefs.current[img.id] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleGalleryImage(img.id, e)}
              />
              <FieldInput
                label="Caption (optional)"
                placeholder="Describe what's happening..."
                value={img.caption}
                onChange={e => updateField("galleryImages", data.galleryImages.map(g => g.id === img.id ? { ...g, caption: e.target.value } : g))}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {data.galleryImages.length < 3 && (
          <button
            onClick={() => updateField("galleryImages", [...data.galleryImages, createGalleryImage()])}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            <Plus size={14} /> Add Photo
          </button>
        )}
      </Section>

      {/* Services */}
      <Section title="Services" subtitle="What you offer">
        <AnimatePresence>
          {data.services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={transition}
              className="rounded-lg border border-border p-4 space-y-3 relative"
            >
              <button
                onClick={() => updateField("services", data.services.filter(s => s.id !== service.id))}
                className="absolute top-3 right-3 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <FieldInput
                label={`Service ${i + 1}`}
                placeholder="Babysitting, Math Tutoring, Dog Walking..."
                value={service.serviceName}
                onChange={e => updateService(service.id, { serviceName: e.target.value })}
              />
              <FieldTextarea
                label="Description"
                placeholder="Brief description of this service"
                value={service.description}
                onChange={e => updateService(service.id, { description: e.target.value })}
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <FieldInput
                  label="Rate"
                  placeholder="$15"
                  value={service.rate}
                  onChange={e => updateService(service.id, { rate: e.target.value })}
                />
                <div>
                  <label className="field-label">Rate Type</label>
                  <select
                    className="field-input"
                    value={service.rateType}
                    onChange={e => updateService(service.id, { rateType: e.target.value as RateType })}
                  >
                    <option value="">Select...</option>
                    {ALL_RATE_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                  </select>
                </div>
              </div>
              <FieldInput
                label="Ages or Grades Served (optional)"
                placeholder="Ages 2-10 or Grades 6-12"
                value={service.agesOrGrades}
                onChange={e => updateService(service.id, { agesOrGrades: e.target.value })}
              />
              <div>
                <label className="field-label">Availability</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ALL_AVAILABILITY_OPTIONS.map(opt => {
                    const active = service.availability.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          const next = active
                            ? service.availability.filter(a => a !== opt)
                            : [...service.availability, opt];
                          updateService(service.id, { availability: next as AvailabilityOption[] });
                        }}
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                          active
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/20"
                        }`}
                      >
                        {active && <Check size={10} />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => updateField("services", [...data.services, createServiceEntry()])}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          <Plus size={14} /> Add Service
        </button>
      </Section>

      {/* Credentials */}
      <Section title="Credentials & Trust" subtitle="Build confidence with families">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">CPR / First Aid Certified</span>
            <button
              onClick={() => updateField("cprCertified", !data.cprCertified)}
              className={`w-10 h-6 rounded-full transition-colors flex items-center ${data.cprCertified ? "bg-primary justify-end" : "bg-secondary justify-start"}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow mx-0.5" />
            </button>
          </div>
          <FieldInput
            label="Years of Experience"
            placeholder="3"
            value={data.yearsExperience}
            onChange={e => updateField("yearsExperience", e.target.value)}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">References Available</span>
            <button
              onClick={() => updateField("referencesAvailable", !data.referencesAvailable)}
              className={`w-10 h-6 rounded-full transition-colors flex items-center ${data.referencesAvailable ? "bg-primary justify-end" : "bg-secondary justify-start"}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow mx-0.5" />
            </button>
          </div>
          <FieldTextarea
            label="Certifications & Training"
            placeholder="Any relevant certifications, training, or coursework..."
            value={data.certifications}
            onChange={e => updateField("certifications", e.target.value)}
            rows={2}
          />
        </div>
      </Section>

      {/* Testimonials */}
      <Section title="Testimonials" subtitle="What families say about you">
        <AnimatePresence>
          {data.testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={transition}
              className="rounded-lg border border-border p-4 space-y-3 relative"
            >
              <button
                onClick={() => updateField("testimonials", data.testimonials.filter(x => x.id !== t.id))}
                className="absolute top-3 right-3 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <FieldTextarea
                label={`Quote ${i + 1}`}
                placeholder="She's incredibly responsible and our kids love her!"
                value={t.quote}
                onChange={e => updateTestimonial(t.id, { quote: e.target.value })}
                rows={2}
              />
              <FieldInput
                label="Client Name / Relationship"
                placeholder="The Johnson Family"
                value={t.clientName}
                onChange={e => updateTestimonial(t.id, { clientName: e.target.value })}
              />
              <FieldInput
                label="Duration (optional)"
                placeholder="2 years"
                value={t.duration}
                onChange={e => updateTestimonial(t.id, { duration: e.target.value })}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => updateField("testimonials", [...data.testimonials, createServiceTestimonial()])}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          <Plus size={14} /> Add Testimonial
        </button>
      </Section>

      {/* Contact */}
      <Section title="Contact" subtitle="How clients can reach you">
        <FieldInput
          label="Contact Email"
          placeholder="you@email.com"
          value={data.contactEmail}
          onChange={e => updateField("contactEmail", e.target.value)}
        />
        <FieldInput
          label="Phone (optional)"
          placeholder="(215) 555-1234"
          value={data.contactPhone}
          onChange={e => updateField("contactPhone", e.target.value)}
        />
        <div>
          <label className="field-label">Preferred Contact Method</label>
          <select
            className="field-input"
            value={data.preferredContact}
            onChange={e => updateField("preferredContact", e.target.value as PreferredContact)}
          >
            <option value="">Select...</option>
            {ALL_PREFERRED_CONTACT.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <FieldInput
          label="Scheduling Link (optional)"
          placeholder="https://calendly.com/yourname"
          value={data.schedulingLink}
          onChange={e => updateField("schedulingLink", e.target.value)}
        />
      </Section>
    </div>
  );
};

export default ServicesForm;
