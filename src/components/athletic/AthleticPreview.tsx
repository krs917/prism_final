import { AthleticProfileData, AthleticTemplateName, ResumeCustomization, defaultCustomization } from "@/types/resume";
import ClassicAthleticTemplate from "./templates/ClassicAthleticTemplate";
import BoldAthleticTemplate from "./templates/BoldAthleticTemplate";
import CleanAthleticTemplate from "./templates/CleanAthleticTemplate";
import { AnimatePresence, motion } from "framer-motion";
import { getStyleVars } from "@/lib/customizationStyles";

interface AthleticPreviewProps {
  data: AthleticProfileData;
  template: AthleticTemplateName;
  customization?: ResumeCustomization;
}

const templates: Record<AthleticTemplateName, React.FC<{ data: AthleticProfileData; customization?: ResumeCustomization }>> = {
  classic: ClassicAthleticTemplate,
  bold: BoldAthleticTemplate,
  clean: CleanAthleticTemplate,
};

const AthleticPreview = ({ data, template, customization }: AthleticPreviewProps) => {
  const Template = templates[template];
  const cust = customization || defaultCustomization;
  const vars = getStyleVars(cust);

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
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Template data={data} customization={cust} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AthleticPreview;
