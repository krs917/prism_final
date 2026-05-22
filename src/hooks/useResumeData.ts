import { useState, useEffect, useRef, useCallback } from "react";
import {
  SharedProfile,
  ResumeData,
  AthleticProfileData,
  CreativePortfolioData,
  HighlightsData,
  ServicesData,
  TemplateName,
  AthleticTemplateName,
  AppMode,
  ResumeSectionId,
  AthleticSectionId,
  ResumeCustomization,
  DEFAULT_RESUME_SECTION_ORDER,
  DEFAULT_ATHLETIC_SECTION_ORDER,
  defaultSharedProfile,
  defaultResumeData,
  defaultAthleticData,
  defaultCreativeData,
  defaultHighlightsData,
  defaultServicesData,
  defaultCustomization,
} from "@/types/resume";



const PROFILE_KEY = "student-shared-profile";
const RESUME_KEY = "student-resume-data";
const ATHLETIC_KEY = "student-athletic-data";
const CREATIVE_KEY = "student-creative-data";
const HIGHLIGHTS_KEY = "student-highlights-data";
const SERVICES_KEY = "student-services-data";
const RESUME_TPL_KEY = "student-resume-template";
const ATHLETIC_TPL_KEY = "student-athletic-template";
const MODE_KEY = "student-app-mode";
const SECTION_ORDER_KEY = "student-resume-section-order";
const ATHLETIC_SECTION_ORDER_KEY = "student-athletic-section-order";
const CUSTOMIZATION_KEY = "student-resume-customization";

function load<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return { ...fallback, ...JSON.parse(saved) };
  } catch {}
  return fallback;
}

function loadEnum<T extends string>(key: string, valid: T[], fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved && valid.includes(saved as T)) return saved as T;
  } catch {}
  return fallback;
}

function loadSectionOrder(): ResumeSectionId[] {
  try {
    const saved = localStorage.getItem(SECTION_ORDER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as ResumeSectionId[];
      const all = new Set(DEFAULT_RESUME_SECTION_ORDER);
      const result = parsed.filter(id => all.has(id));
      for (const id of DEFAULT_RESUME_SECTION_ORDER) {
        if (!result.includes(id)) result.push(id);
      }
      return result;
    }
  } catch {}
  return [...DEFAULT_RESUME_SECTION_ORDER];
}

function loadAthleticSectionOrder(): AthleticSectionId[] {
  try {
    const saved = localStorage.getItem(ATHLETIC_SECTION_ORDER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as AthleticSectionId[];
      const all = new Set(DEFAULT_ATHLETIC_SECTION_ORDER);
      const result = parsed.filter(id => all.has(id));
      for (const id of DEFAULT_ATHLETIC_SECTION_ORDER) {
        if (!result.includes(id)) result.push(id);
      }
      return result;
    }
  } catch {}
  return [...DEFAULT_ATHLETIC_SECTION_ORDER];
}

function loadCustomization(): ResumeCustomization {
  try {
    const saved = localStorage.getItem(CUSTOMIZATION_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultCustomization,
        ...parsed,
        headerVisible: { ...defaultCustomization.headerVisible, ...(parsed.headerVisible || {}) },
      };
    }
  } catch {}
  return { ...defaultCustomization };
}

export function useAppData() {
  const [mode, setModeState] = useState<AppMode>(() => loadEnum(MODE_KEY, ["landing", "resume", "athletic", "creative", "highlights", "services"], "landing"));
  const [profile, setProfile] = useState<SharedProfile>(() => load(PROFILE_KEY, defaultSharedProfile));
  const [resumeData, setResumeDataRaw] = useState<ResumeData>(() => load(RESUME_KEY, defaultResumeData));
  const [athleticData, setAthleticDataRaw] = useState<AthleticProfileData>(() => load(ATHLETIC_KEY, defaultAthleticData));
  const [creativeData, setCreativeDataRaw] = useState<CreativePortfolioData>(() => load(CREATIVE_KEY, defaultCreativeData));
  const [highlightsData, setHighlightsDataRaw] = useState<HighlightsData>(() => load(HIGHLIGHTS_KEY, defaultHighlightsData));
  const [servicesData, setServicesDataRaw] = useState<ServicesData>(() => load(SERVICES_KEY, defaultServicesData));
  const [resumeTemplate, setResumeTemplate] = useState<TemplateName>(() => loadEnum(RESUME_TPL_KEY, ["scholar", "professional", "modernist"], "scholar"));
  const [athleticTemplate, setAthleticTemplate] = useState<AthleticTemplateName>(() => loadEnum(ATHLETIC_TPL_KEY, ["classic", "bold", "clean"], "classic"));
  const [sectionOrder, setSectionOrderState] = useState<ResumeSectionId[]>(loadSectionOrder);
  const [athleticSectionOrder, setAthleticSectionOrderState] = useState<AthleticSectionId[]>(loadAthleticSectionOrder);
  const [customization, setCustomizationState] = useState<ResumeCustomization>(loadCustomization);

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const mergedResume: ResumeData = { ...resumeData, ...profile };
  const mergedAthletic: AthleticProfileData = { ...athleticData, ...profile };
  const mergedCreative: CreativePortfolioData = { ...creativeData, ...profile };
  const mergedHighlights: HighlightsData = { ...highlightsData, ...profile };
  const mergedServices: ServicesData = { ...servicesData, ...profile };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      localStorage.setItem(RESUME_KEY, JSON.stringify(resumeData));
      localStorage.setItem(ATHLETIC_KEY, JSON.stringify(athleticData));
      localStorage.setItem(CREATIVE_KEY, JSON.stringify(creativeData));
      localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(highlightsData));
      localStorage.setItem(SERVICES_KEY, JSON.stringify(servicesData));
    }, 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [profile, resumeData, athleticData, creativeData, highlightsData, servicesData]);

  useEffect(() => { localStorage.setItem(RESUME_TPL_KEY, resumeTemplate); }, [resumeTemplate]);
  useEffect(() => { localStorage.setItem(ATHLETIC_TPL_KEY, athleticTemplate); }, [athleticTemplate]);

  const setMode = useCallback((m: AppMode) => {
    setModeState(m);
    localStorage.setItem(MODE_KEY, m);
  }, []);

  const setSectionOrder = useCallback((order: ResumeSectionId[]) => {
    setSectionOrderState(order);
    localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(order));
  }, []);

  const setAthleticSectionOrder = useCallback((order: AthleticSectionId[]) => {
    setAthleticSectionOrderState(order);
    localStorage.setItem(ATHLETIC_SECTION_ORDER_KEY, JSON.stringify(order));
  }, []);

  const setCustomization = useCallback((c: ResumeCustomization) => {
    setCustomizationState(c);
    localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(c));
  }, []);

  const updateCustomization = useCallback(<K extends keyof ResumeCustomization>(key: K, value: ResumeCustomization[K]) => {
    setCustomizationState(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateProfile = useCallback(<K extends keyof SharedProfile>(field: K, value: SharedProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateResume = useCallback(<K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    if (field in defaultSharedProfile) {
      setProfile(prev => ({ ...prev, [field]: value } as SharedProfile));
    } else {
      setResumeDataRaw(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const updateAthletic = useCallback(<K extends keyof AthleticProfileData>(field: K, value: AthleticProfileData[K]) => {
    if (field in defaultSharedProfile) {
      setProfile(prev => ({ ...prev, [field]: value } as SharedProfile));
    } else {
      setAthleticDataRaw(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const updateCreative = useCallback(<K extends keyof CreativePortfolioData>(field: K, value: CreativePortfolioData[K]) => {
    if (field in defaultSharedProfile) {
      setProfile(prev => ({ ...prev, [field]: value } as SharedProfile));
    } else {
      setCreativeDataRaw(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const updateHighlights = useCallback(<K extends keyof HighlightsData>(field: K, value: HighlightsData[K]) => {
    if (field in defaultSharedProfile) {
      setProfile(prev => ({ ...prev, [field]: value } as SharedProfile));
    } else {
      setHighlightsDataRaw(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const updateServices = useCallback(<K extends keyof ServicesData>(field: K, value: ServicesData[K]) => {
    if (field in defaultSharedProfile) {
      setProfile(prev => ({ ...prev, [field]: value } as SharedProfile));
    } else {
      setServicesDataRaw(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  return {
    mode, setMode,
    profile, updateProfile,
    resumeData: mergedResume, updateResume,
    athleticData: mergedAthletic, updateAthletic,
    creativeData: mergedCreative, updateCreative,
    highlightsData: mergedHighlights, updateHighlights,
    servicesData: mergedServices, updateServices,
    resumeTemplate, setResumeTemplate,
    athleticTemplate, setAthleticTemplate,
    sectionOrder, setSectionOrder,
    athleticSectionOrder, setAthleticSectionOrder,
    customization, setCustomization, updateCustomization,
  };
}
