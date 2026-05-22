import { ReactNode, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DraggableFormSectionProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

const DraggableFormSection = ({ id, title, icon, children, defaultOpen = false }: DraggableFormSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-border bg-card transition-shadow ${
        isDragging ? "shadow-lg opacity-90" : "shadow-none"
      }`}
    >
      <div className="flex items-center gap-0">
        {/* Drag handle */}
        <button
          type="button"
          className="flex items-center justify-center w-8 h-full shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors rounded-l-lg"
          {...attributes}
          {...listeners}
          tabIndex={-1}
        >
          <GripVertical size={14} />
        </button>

        {/* Header toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center justify-between py-3 pr-3 text-left"
        >
          <div className="flex items-center gap-2">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <span className="text-[13px] font-medium text-foreground">{title}</span>
          </div>
          <ChevronDown
            size={14}
            className={`text-muted-foreground/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-4 pt-1 space-y-3 border-t border-border/50 ml-8">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DraggableFormSection;
