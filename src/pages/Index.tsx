import { useAppData } from "@/hooks/useResumeData";

import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import TemplateSwitcher from "@/components/resume/TemplateSwitcher";
import CustomizePanel from "@/components/resume/CustomizePanel";
import AthleticForm from "@/components/athletic/AthleticForm";
import AthleticPreview from "@/components/athletic/AthleticPreview";
import AthleticTemplateSwitcher from "@/components/athletic/AthleticTemplateSwitcher";
import SharedAthleticWebView from "@/components/athletic/SharedAthleticWebView";
import CreativeForm from "@/components/creative/CreativeForm";
import CreativePreview from "@/components/creative/CreativePreview";
import SharedCreativeWebView from "@/components/creative/SharedCreativeWebView";
import HighlightsForm from "@/components/highlights/HighlightsForm";
import HighlightsPreview from "@/components/highlights/HighlightsPreview";
import SharedHighlightsWebView from "@/components/highlights/SharedHighlightsWebView";
import ServicesForm from "@/components/services/ServicesForm";
import ServicesPreview from "@/components/services/ServicesPreview";
import SharedServicesWebView from "@/components/services/SharedServicesWebView";
import ServicesFlyerModal from "@/components/services/ServicesFlyerModal";
import {
  Download,
  FileText,
  Eye,
  Share2,
  ArrowLeft,
  Trophy,
  GraduationCap,
  LayoutDashboard,
  PenLine,
  Paintbrush,
  Sparkles,
  Home,
  BookOpen,
  Medal,
  Aperture,
  Video,
  Handshake,
  Printer,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  ResumeData,
  AthleticProfileData,
  CreativePortfolioData,
  HighlightsData,
  ServicesData,
  TemplateName,
  AthleticTemplateName,
  ResumeSectionId,
  ResumeCustomization,
  defaultResumeData,
  defaultAthleticData,
  defaultCreativeData,
  defaultHighlightsData,
  defaultServicesData,
  defaultCustomization,
} from "@/types/resume";
import { toast } from "sonner";
import { motion } from "framer-motion";

type EditorTab = "overview" | "content" | "customize" | "tips";

// ── Share encoding ──
function encodeToUrl(
  data: ResumeData | AthleticProfileData | CreativePortfolioData | HighlightsData | ServicesData,
  template: string,
  type: "resume" | "athletic" | "creative" | "highlights" | "services",
  sectionOrder?: ResumeSectionId[],
  customization?: ResumeCustomization,
  athleticData?: AthleticProfileData,
): string {
  const payload = JSON.stringify({ d: data, t: template, type, so: sectionOrder, c: customization, ad: athleticData });
  const encoded = btoa(unescape(encodeURIComponent(payload)));
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("r", encoded);
  return url.toString();
}

function decodeFromUrl(): {
  data: any;
  template: string;
  type: "resume" | "athletic" | "creative" | "highlights" | "services";
  sectionOrder?: ResumeSectionId[];
  customization?: ResumeCustomization;
  athleticData?: AthleticProfileData;
} | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("r");
    if (!encoded) return null;
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json);
    const type =
      parsed.type === "athletic"
        ? "athletic"
        : parsed.type === "creative"
          ? "creative"
          : parsed.type === "highlights"
            ? "highlights"
            : parsed.type === "services"
              ? "services"
              : "resume";
    const fallback =
      type === "athletic"
        ? defaultAthleticData
        : type === "creative"
          ? defaultCreativeData
          : type === "highlights"
            ? defaultHighlightsData
            : type === "services"
              ? defaultServicesData
              : defaultResumeData;
    return {
      data: { ...fallback, ...parsed.d },
      template: parsed.t || "scholar",
      type,
      sectionOrder: parsed.so,
      customization: parsed.c ? { ...defaultCustomization, ...parsed.c } : undefined,
      athleticData: parsed.ad ? { ...defaultAthleticData, ...parsed.ad } : undefined,
    };
  } catch {
    return null;
  }
}

// ── Landing Screen ──
type LandingMode = "resume" | "athletic" | "creative" | "highlights" | "services";

function computeProgress(data: Record<string, any>): number {
  const entries = Object.entries(data);
  if (entries.length === 0) return 0;
  const filled = entries.filter(([, v]) => {
    if (v == null) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return Object.values(v).some(Boolean);
    if (typeof v === "string") return v.trim().length > 0;
    return Boolean(v);
  }).length;
  return Math.round((filled / entries.length) * 100);
}

const LandingScreen = ({
  onChoose,
  progress,
}: {
  onChoose: (mode: LandingMode) => void;
  progress: Record<LandingMode, number>;
}) => (
  <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
    {/* Animated gradient background */}
    <div
      className="absolute inset-0 animate-[gradientFlow_14s_ease_infinite]"
      style={{
        background: "linear-gradient(135deg, #0f1f40 0%, #0f6e56 25%, #534AB7 50%, #0f1f40 75%, #0f6e56 100%)",
        backgroundSize: "400% 400%",
      }}
    />
    <div className="relative z-10 max-w-3xl w-full space-y-10">
      <div className="text-center space-y-1">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[0.3em] uppercase text-white">PRISM</h1>
        <p className="text-sm text-white/50 font-light tracking-wide">One profile. Endless opportunities.</p>
        <h2 className="text-lg font-medium text-white/90 mt-[48px]">What would you like to build?</h2>
        <p className="text-sm text-white/60 max-w-md mx-auto">
          Choose the tool that fits where you are right now.
        </p>
      </div>
      {(() => {
        const renderCard = (card: { mode: LandingMode; icon: any; title: string; desc: string }) => {
          const pct = progress[card.mode] ?? 0;
          const status = pct === 0 ? "Not started" : pct < 100 ? `${pct}% complete` : "Complete";
          const cta = pct === 0 ? "Start" : "Continue";
          return (
            <motion.button
              key={card.mode}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChoose(card.mode)}
              className="group relative rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 text-left transition-all duration-300 hover:bg-white/15 hover:border-white/40 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.35),0_0_60px_-15px_rgba(83,74,183,0.5)] h-[180px] flex flex-col overflow-hidden"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.18), transparent 60%)" }}
              />
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold text-white/90 group-hover:bg-white/25 transition-colors">
                {cta}
              </div>
              <div className="w-11 h-11 rounded-md bg-white/15 flex items-center justify-center mb-3 flex-shrink-0 group-hover:bg-white/25 transition-colors">
                <card.icon size={24} className="text-white/80" />
              </div>
              <h2 className="text-sm font-semibold text-white mb-1">{card.title}</h2>
              <p className="text-xs text-white/60 leading-relaxed">{card.desc}</p>
              <div className="mt-auto pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-white/60">
                  <span className="uppercase tracking-wider">{status}</span>
                  {pct > 0 && <span className="font-mono text-white/70">{pct}%</span>}
                </div>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-300 to-violet-300 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </motion.button>
          );
        };
        return (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {[
                { mode: "resume" as const, icon: BookOpen, title: "Resume", desc: "Education, work experience, skills, and activities." },
                { mode: "athletic" as const, icon: Medal, title: "Athletic Profile", desc: "Sports, stats, highlight videos, and recruiting info." },
                { mode: "creative" as const, icon: Aperture, title: "Creative", desc: "Photo/videography, music, graphic design, and more." },
              ].map(renderCard)}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 max-w-[27.5rem] mx-auto">
              {[
                { mode: "highlights" as const, icon: Video, title: "Highlights", desc: "Your game film, organized and shareable." },
                { mode: "services" as const, icon: Handshake, title: "Services", desc: "Babysitting, tutoring, pet care, and local services." },
              ].map(renderCard)}
            </div>
          </>
        );
      })()}
    </div>
  </div>
);

// ── Mode Toggle ──
const ModeToggle = ({
  mode,
  setMode,
  goHome,
}: {
  mode: "resume" | "athletic" | "creative" | "highlights" | "services";
  setMode: (m: "resume" | "athletic" | "creative" | "highlights" | "services") => void;
  goHome: () => void;
}) => (
  <div className="flex items-center gap-2">
    <button
      onClick={goHome}
      className="flex items-center gap-2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      aria-label="Back to home"
    >
      <Home size={18} />
      <span className="text-lg font-black tracking-widest uppercase">Prism</span>
    </button>
    <div className="flex rounded-md bg-secondary p-0.5 gap-0.5">
      {[
        { id: "resume" as const, icon: GraduationCap, label: "Resume" },
        { id: "athletic" as const, icon: Trophy, label: "Athletic" },
        { id: "creative" as const, icon: Paintbrush, label: "Creative" },
        { id: "highlights" as const, icon: Video, label: "Highlights" },
        { id: "services" as const, icon: Handshake, label: "Services" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setMode(tab.id)}
          className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-all ${mode === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <tab.icon size={14} /> {tab.label}
        </button>
      ))}
    </div>
  </div>
);

const ActionBtn = ({
  onClick,
  icon,
  label,
  primary = false,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  primary?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all active:scale-[0.98] ${primary ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
  >
    {icon}
    {label && <span>{label}</span>}
  </button>
);

// ── Top Tabs ──
const TOP_TABS: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={15} /> },
  { id: "content", label: "Content", icon: <PenLine size={15} /> },
  { id: "customize", label: "Customize", icon: <Paintbrush size={15} /> },
  { id: "tips", label: "AI Tips", icon: <Sparkles size={15} /> },
];

const TabNav = ({ tab, setTab }: { tab: EditorTab; setTab: (t: EditorTab) => void }) => (
  <div className="flex border-b border-border">
    {TOP_TABS.map((t) => (
      <button
        key={t.id}
        onClick={() => setTab(t.id)}
        className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
          tab === t.id
            ? "border-primary text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
        }`}
      >
        {t.icon}
        {t.label}
      </button>
    ))}
  </div>
);

// ── Overview Panel ──
const OverviewPanel = ({ app }: { app: ReturnType<typeof useAppData> }) => {
  const isResume = app.mode === "resume";
  const data = isResume ? app.resumeData : app.mode === "athletic" ? app.athleticData : app.creativeData;
  const filledFields = Object.entries(data).filter(([, v]) => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return Object.values(v).some(Boolean);
    return Boolean(v);
  }).length;
  const totalFields = Object.keys(data).length;
  const pct = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="space-y-5">
      {isResume ? (
        <TemplateSwitcher template={app.resumeTemplate} setTemplate={app.setResumeTemplate} />
      ) : app.mode === "athletic" ? (
        <AthleticTemplateSwitcher template={app.athleticTemplate} setTemplate={app.setAthleticTemplate} />
      ) : null}

      <div className="rounded-lg border border-border p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Completion</span>
          <span className="text-xs font-semibold text-primary">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[11px] text-muted-foreground">
          {pct < 30
            ? "Start filling in your information to build your document."
            : pct < 70
              ? "Good progress! Keep adding details to make it stand out."
              : "Looking great! Review your content and customize the design."}
        </p>
      </div>

      <div className="rounded-lg border border-border p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Quick Tips</h3>
        <ul className="space-y-2.5 text-[13px] text-muted-foreground leading-relaxed">
          <li className="flex gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>
              Use the <strong className="text-foreground">Content</strong> tab to add your information
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>
              Use <strong className="text-foreground">Customize</strong> to adjust fonts, colors, and layout
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Drag sections to reorder them in your document</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Share your link directly with coaches, employers, or clients</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// ── AI Tips Panel (placeholder) ──
const AiTipsPanel = () => (
  <div className="rounded-lg border border-border p-6 text-center space-y-3">
    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mx-auto">
      <Sparkles size={18} className="text-primary" />
    </div>
    <h3 className="text-sm font-semibold text-foreground">AI Tips — Coming Soon</h3>
    <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
      Get smart suggestions to improve your content, fix grammar, and tailor it for specific opportunities.
    </p>
  </div>
);

// ── Main Page ──
const Index = () => {
  const app = useAppData();
  const [showPreview, setShowPreview] = useState(false);
  const [editorTab, setEditorTab] = useState<EditorTab>("content");
  const [showFlyer, setShowFlyer] = useState(false);

  const shared = useMemo(() => decodeFromUrl(), []);
  const isSharedView = shared !== null;

  const handleDownload = () => window.print();

  const handleShare = () => {
    const mode = app.mode;
    let url: string;
    if (mode === "resume") {
      url = encodeToUrl(app.resumeData, app.resumeTemplate, "resume", app.sectionOrder, app.customization);
    } else if (mode === "athletic") {
      url = encodeToUrl(app.athleticData, app.athleticTemplate, "athletic", undefined, app.customization);
    } else if (mode === "highlights") {
      url = encodeToUrl(app.highlightsData, "", "highlights", undefined, app.customization, app.athleticData);
    } else if (mode === "services") {
      url = encodeToUrl(app.servicesData, "", "services", undefined, app.customization);
    } else {
      url = encodeToUrl(app.creativeData, "", "creative", undefined, app.customization);
    }
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Share link copied!");
      })
      .catch(() => {
        prompt("Copy this link:", url);
      });
  };

  const handleExitShared = () => {
    window.location.href = window.location.pathname;
  };

  // ── Shared read-only view ──
  if (isSharedView) {
    if (shared.type === "services") {
      return (
        <div>
          <header className="no-print sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Handshake size={16} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {shared.data.name ? `${shared.data.name}'s Services` : "Services"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ActionBtn onClick={handleExitShared} icon={<ArrowLeft size={13} />} label="Build yours" />
            </div>
          </header>
          <SharedServicesWebView data={shared.data as ServicesData} customization={shared.customization} />
        </div>
      );
    }

    if (shared.type === "highlights") {
      return (
        <SharedHighlightsWebView
          data={shared.data as HighlightsData}
          athleticData={(shared.athleticData || defaultAthleticData) as AthleticProfileData}
          customization={shared.customization}
        />
      );
    }

    if (shared.type === "creative") {
      return (
        <div>
          <header className="no-print sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Paintbrush size={16} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {shared.data.name ? `${shared.data.name}'s Portfolio` : "Creative Portfolio"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ActionBtn onClick={handleDownload} icon={<Download size={13} />} label="PDF" primary />
              <ActionBtn onClick={handleExitShared} icon={<ArrowLeft size={13} />} label="Build yours" />
            </div>
          </header>
          <SharedCreativeWebView data={shared.data as CreativePortfolioData} />
        </div>
      );
    }

    if (shared.type === "athletic") {
      return (
        <div>
          <header className="no-print sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {shared.data.name ? `${shared.data.name}'s Athletic Profile` : "Athletic Profile"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ActionBtn onClick={handleDownload} icon={<Download size={13} />} label="PDF" primary />
              <ActionBtn onClick={handleExitShared} icon={<ArrowLeft size={13} />} label="Build yours" />
            </div>
          </header>
          <SharedAthleticWebView data={shared.data as AthleticProfileData} />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-muted/30">
        <header className="no-print sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 py-2.5">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {shared.data.name ? `${shared.data.name}'s Resume` : "Shared Resume"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ActionBtn onClick={handleDownload} icon={<Download size={13} />} label="PDF" primary />
            <ActionBtn onClick={handleExitShared} icon={<ArrowLeft size={13} />} label="Build yours" />
          </div>
        </header>
        <main className="flex justify-center p-8">
          <div className="w-full max-w-[600px]">
            <ResumePreview
              data={shared.data as ResumeData}
              template={shared.template as TemplateName}
              sectionOrder={shared.sectionOrder}
              customization={shared.customization}
            />
          </div>
        </main>
      </div>
    );
  }

  // ── Landing ──
  if (app.mode === "landing") {
    const progress: Record<LandingMode, number> = {
      resume: computeProgress(app.resumeData),
      athletic: computeProgress(app.athleticData),
      creative: computeProgress(app.creativeData),
      highlights: computeProgress(app.highlightsData),
      services: computeProgress(app.servicesData),
    };
    return <LandingScreen onChoose={(m) => app.setMode(m)} progress={progress} />;
  }

  const isResume = app.mode === "resume";
  const isAthletic = app.mode === "athletic";
  const isCreative = app.mode === "creative";
  const isHighlights = app.mode === "highlights";
  const isServices = app.mode === "services";
  const activeMode = app.mode as "resume" | "athletic" | "creative" | "highlights" | "services";

  // Render the correct panel content based on tab
  const renderPanelContent = () => {
    if (editorTab === "overview") {
      return <OverviewPanel app={app} />;
    }

    if (editorTab === "content") {
      if (isResume) {
        return (
          <ResumeForm
            data={app.resumeData}
            updateField={app.updateResume}
            sectionOrder={app.sectionOrder}
            onSectionOrderChange={app.setSectionOrder}
          />
        );
      }
      if (isAthletic) {
        return (
          <AthleticForm
            data={app.athleticData}
            updateField={app.updateAthletic}
            sectionOrder={app.athleticSectionOrder}
            onSectionOrderChange={app.setAthleticSectionOrder}
          />
        );
      }
      if (isHighlights) {
        return (
          <HighlightsForm
            data={app.highlightsData}
            updateField={app.updateHighlights}
            athleticData={app.athleticData}
          />
        );
      }
      if (isServices) {
        return (
          <ServicesForm
            data={app.servicesData}
            updateField={app.updateServices}
          />
        );
      }
      return <CreativeForm data={app.creativeData} updateField={app.updateCreative} />;
    }

    if (editorTab === "customize") {
      return (
        <CustomizePanel
          customization={app.customization}
          updateCustomization={app.updateCustomization}
          sectionOrder={app.sectionOrder}
          mode={activeMode}
          athleticSectionOrder={app.athleticSectionOrder}
        />
      );
    }

    return <AiTipsPanel />;
  };

  const renderPreview = () => {
    if (isResume)
      return (
        <ResumePreview
          data={app.resumeData}
          template={app.resumeTemplate}
          sectionOrder={app.sectionOrder}
          customization={app.customization}
        />
      );
    if (isAthletic)
      return (
        <AthleticPreview data={app.athleticData} template={app.athleticTemplate} customization={app.customization} />
      );
    if (isHighlights)
      return (
        <HighlightsPreview
          data={app.highlightsData}
          athleticData={app.athleticData}
          customization={app.customization}
        />
      );
    if (isServices)
      return (
        <ServicesPreview data={app.servicesData} customization={app.customization} />
      );
    return <CreativePreview data={app.creativeData} customization={app.customization} />;
  };

  // ── Builder ──
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Desktop */}
      <div className="hidden lg:flex flex-col h-full overflow-hidden">
        {/* Fixed header */}
        <div
          className="no-print flex-shrink-0 backdrop-blur z-10 border-b border-border/60"
          style={{ backgroundColor: "hsla(155, 75%, 24%, 0.06)" }}
        >
          <div className="flex items-center justify-between border-b border-border px-5 h-12">
            <ModeToggle mode={activeMode} setMode={app.setMode} goHome={() => app.setMode("landing")} />
            <div className="flex items-center gap-1.5">
              <ActionBtn onClick={handleShare} icon={<Share2 size={13} />} label="Share" />
              {isServices && <ActionBtn onClick={() => setShowFlyer(true)} icon={<Printer size={13} />} label="Flyer" />}
              <ActionBtn onClick={handleDownload} icon={<Download size={13} />} label="PDF" primary />
            </div>
          </div>
          <TabNav tab={editorTab} setTab={setEditorTab} />
        </div>

        {/* Two-panel layout with independent scroll */}
        <div className="flex flex-1 overflow-hidden">
          <aside className="no-print w-[520px] flex-shrink-0 overflow-y-auto border-r border-border bg-background p-5">
            {renderPanelContent()}
          </aside>
          <main className="flex-1 overflow-y-auto bg-muted/30 p-8 flex items-start justify-center">
            <div className="w-full max-w-[720px]">{renderPreview()}</div>
          </main>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <header
          className="no-print sticky top-0 z-20 backdrop-blur border-b border-border/60"
          style={{ backgroundColor: "hsla(155, 75%, 24%, 0.06)" }}
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <ModeToggle mode={activeMode} setMode={app.setMode} goHome={() => app.setMode("landing")} />
            <div className="flex items-center gap-1.5">
              <ActionBtn
                onClick={() => setShowPreview(!showPreview)}
                icon={<Eye size={13} />}
                label={showPreview ? "Edit" : "Preview"}
              />
              <ActionBtn onClick={handleShare} icon={<Share2 size={13} />} />
              {isServices && <ActionBtn onClick={() => setShowFlyer(true)} icon={<Printer size={13} />} />}
              <ActionBtn onClick={handleDownload} icon={<Download size={13} />} label="PDF" primary />
            </div>
          </div>
          {!showPreview && <TabNav tab={editorTab} setTab={setEditorTab} />}
        </header>

        {showPreview ? (
          <main className="flex-1 overflow-y-auto bg-muted/30 p-4 flex justify-center">{renderPreview()}</main>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 no-print">{renderPanelContent()}</div>
        )}
      </div>
      {showFlyer && <ServicesFlyerModal data={app.servicesData} onClose={() => setShowFlyer(false)} />}
    </div>
  );
};

export default Index;
