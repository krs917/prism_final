import { ResumeData, TemplateName, ResumeSectionId, ResumeCustomization, DEFAULT_RESUME_SECTION_ORDER, defaultCustomization } from "@/types/resume";
import ScholarTemplate from "./templates/ScholarTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import ModernistTemplate from "./templates/ModernistTemplate";
import { AnimatePresence, motion } from "framer-motion";
import { getStyleVars } from "@/lib/customizationStyles";

export interface TemplateProps {
  data: ResumeData;
  sectionOrder: ResumeSectionId[];
  customization: ResumeCustomization;
}

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateName;
  sectionOrder?: ResumeSectionId[];
  customization?: ResumeCustomization;
}

const templates: Record<TemplateName, React.FC<TemplateProps>> = {
  scholar: ScholarTemplate,
  professional: ProfessionalTemplate,
  modernist: ModernistTemplate,
};

const ResumePreview = ({ data, template, sectionOrder, customization }: ResumePreviewProps) => {
  const Template = templates[template];
  const order = sectionOrder || DEFAULT_RESUME_SECTION_ORDER;
  const cust = customization || defaultCustomization;
  const vars = getStyleVars(cust);

  // Filter out hidden sections
  const visibleOrder = order.filter(id => !cust.hiddenSections.includes(id));

  return (
    <div
      id="resume-preview"
      className="w-full max-w-[210mm] bg-card print-only overflow-visible rounded-lg border border-border"
      style={{
        minHeight: "280mm",
        boxShadow: "var(--preview-shadow)",
        fontFamily: vars.fontFamily,
        fontSize: vars.fontSize,
        lineHeight: vars.lineHeight,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={template + cust.font + cust.fontSize + cust.accentColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Template data={data} sectionOrder={visibleOrder} customization={cust} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ResumePreview;
