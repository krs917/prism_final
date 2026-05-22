import { TemplateName } from "@/types/resume";
import { motion } from "framer-motion";

interface TemplateSwitcherProps {
  template: TemplateName;
  setTemplate: (t: TemplateName) => void;
}

const options: { value: TemplateName; label: string; desc: string }[] = [
  { value: "scholar", label: "Scholar", desc: "Minimal & classic" },
  { value: "professional", label: "Professional", desc: "Sidebar layout" },
  { value: "modernist", label: "Modernist", desc: "Bold header" },
];

const TemplateSwitcher = ({ template, setTemplate }: TemplateSwitcherProps) => (
  <div className="flex gap-2">
    {options.map(opt => (
      <button
        key={opt.value}
        onClick={() => setTemplate(opt.value)}
        className={`relative flex-1 rounded-lg px-3 py-2.5 text-left transition-colors ${
          template === opt.value
            ? "text-accent-foreground"
            : "text-muted-foreground hover:bg-secondary"
        }`}
      >
        {template === opt.value && (
          <motion.div
            layoutId="template-bg"
            className="absolute inset-0 rounded-lg bg-accent"
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          />
        )}
        <span className="relative z-10 block text-xs font-semibold">{opt.label}</span>
        <span className="relative z-10 block text-[10px] opacity-70">{opt.desc}</span>
      </button>
    ))}
  </div>
);

export default TemplateSwitcher;
