import { ServicesData } from "@/types/resume";
import { useRef } from "react";
import { X, Printer, Mail, Phone, MapPin, Shield, Clock, Star } from "lucide-react";

interface Props {
  data: ServicesData;
  onClose: () => void;
}

const ServicesFlyerModal = ({ data, onClose }: Props) => {
  const flyerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const el = flyerRef.current;
    if (!el) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Flyer</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@page { size: letter; margin: 0; }
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;width:8.5in;height:11in;position:relative;overflow:hidden;background:#fff;}
</style></head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.print(); w.close(); }, 400);
  };

  const contact = data.contactEmail || data.email;
  const phone = data.contactPhone || data.phone;
  const services = data.services.filter(s => s.serviceName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Print Flyer Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity"
            >
              <Printer size={13} /> Print
            </button>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Flyer preview (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30 flex justify-center">
          <div
            ref={flyerRef}
            className="bg-white shadow-lg"
            style={{ width: "5.5in", minHeight: "7.1in", aspectRatio: "8.5/11" }}
          >
            {/* Actual flyer content — inline styles for print portability */}
            <div style={{
              width: "100%",
              height: "100%",
              padding: "0.6in 0.65in",
              fontFamily: "'Inter', sans-serif",
              color: "#1a1a2e",
              display: "flex",
              flexDirection: "column",
              gap: "0px",
            }}>
              {/* Top band with photo + name */}
              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                {data.profilePhoto && (
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%", overflow: "hidden",
                    margin: "0 auto 10px", border: "3px solid #0d9488",
                  }}>
                    <img src={data.profilePhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "#0f172a" }}>
                  {data.name || "Your Name"}
                </div>
                {data.serviceTagline && (
                  <div style={{ fontSize: 11, color: "#0d9488", marginTop: 4, fontWeight: 500 }}>
                    {data.serviceTagline}
                  </div>
                )}
                {data.coverageArea && (
                  <div style={{ fontSize: 9, color: "#64748b", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                    <span>📍</span> {data.coverageArea}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #0d9488, transparent)", margin: "0 auto 16px", width: "60%" }} />

              {/* Services grid */}
              {services.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0d9488", marginBottom: 10 }}>
                    Services & Rates
                  </div>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: services.length === 1 ? "1fr" : "1fr 1fr",
                    gap: 8,
                  }}>
                    {services.map(s => (
                      <div key={s.id} style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: "10px 12px",
                        borderLeft: "3px solid #0d9488",
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{s.serviceName}</div>
                        {s.rate && (
                          <div style={{ fontSize: 9, color: "#0d9488", fontWeight: 600, marginTop: 2 }}>
                            {s.rate}{s.rateType ? ` / ${s.rateType}` : ""}
                          </div>
                        )}
                        {s.description && (
                          <div style={{ fontSize: 8.5, color: "#64748b", marginTop: 3, lineHeight: 1.4 }}>
                            {s.description.length > 80 ? s.description.slice(0, 80) + "…" : s.description}
                          </div>
                        )}
                        {s.agesOrGrades && (
                          <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 3 }}>{s.agesOrGrades}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Credentials row */}
              {(data.cprCertified || data.yearsExperience || data.referencesAvailable) && (
                <div style={{
                  display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16,
                  padding: "8px 12px", background: "#f0fdfa", borderRadius: 8,
                }}>
                  {data.cprCertified && (
                    <div style={{ fontSize: 9, color: "#0f172a", display: "flex", alignItems: "center", gap: 4 }}>
                      <span>🛡️</span> CPR / First Aid
                    </div>
                  )}
                  {data.yearsExperience && (
                    <div style={{ fontSize: 9, color: "#0f172a", display: "flex", alignItems: "center", gap: 4 }}>
                      <span>⏱️</span> {data.yearsExperience} yrs exp.
                    </div>
                  )}
                  {data.referencesAvailable && (
                    <div style={{ fontSize: 9, color: "#0f172a", display: "flex", alignItems: "center", gap: 4 }}>
                      <span>⭐</span> References available
                    </div>
                  )}
                </div>
              )}

              {/* Testimonial (first one) */}
              {data.testimonials.length > 0 && data.testimonials[0].quote && (
                <div style={{
                  background: "#f8fafc", borderRadius: 8, padding: "10px 14px",
                  marginBottom: 16, borderLeft: "3px solid #0d9488",
                }}>
                  <div style={{ fontSize: 9.5, fontStyle: "italic", color: "#334155", lineHeight: 1.5 }}>
                    "{data.testimonials[0].quote.length > 120 ? data.testimonials[0].quote.slice(0, 120) + "…" : data.testimonials[0].quote}"
                  </div>
                  {data.testimonials[0].clientName && (
                    <div style={{ fontSize: 8.5, color: "#64748b", marginTop: 4, fontWeight: 600 }}>
                      — {data.testimonials[0].clientName}
                    </div>
                  )}
                </div>
              )}

              {/* Spacer to push contact to bottom */}
              <div style={{ flex: 1 }} />

              {/* Contact bar */}
              <div style={{
                background: "#0f172a", borderRadius: 10, padding: "14px 18px",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 20, flexWrap: "wrap",
              }}>
                {contact && (
                  <div style={{ fontSize: 10, color: "#fff", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>✉️</span> {contact}
                  </div>
                )}
                {phone && (
                  <div style={{ fontSize: 10, color: "#fff", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>📞</span> {phone}
                  </div>
                )}
                {!contact && !phone && (
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>Add contact info in the builder</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesFlyerModal;
