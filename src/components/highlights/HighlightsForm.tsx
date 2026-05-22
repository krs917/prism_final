import { useState, useRef } from "react";
import {
  HighlightsData,
  HighlightCard,
  createHighlightCard,
  AthleticProfileData,
} from "@/types/resume";
import { FieldInput, FieldTextarea } from "../resume/FieldInput";
import { Plus, Trash2, GripVertical, Image, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface HighlightsFormProps {
  data: HighlightsData;
  updateField: <K extends keyof HighlightsData>(field: K, value: HighlightsData[K]) => void;
  athleticData: AthleticProfileData;
}

const transition = { duration: 0.3, ease: [0.2, 0, 0, 1] as const };

function SortableCard({
  card,
  index,
  onUpdate,
  onRemove,
}: {
  card: HighlightCard;
  index: number;
  onUpdate: (id: string, updates: Partial<HighlightCard>) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition: t, isDragging } = useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: t,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={transition}
      className="space-y-3 rounded-md border border-border bg-secondary/30 p-3 relative"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 rounded text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={14} />
        </button>
        <span className="text-xs font-medium text-muted-foreground">Highlight {index + 1}</span>
        <button
          type="button"
          onClick={() => onRemove(card.id)}
          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Remove highlight"
        >
          <Trash2 size={13} />
        </button>
      </div>
      <FieldInput
        label="Title"
        id={`hl-title-${card.id}`}
        placeholder="ECNL Showcase vs. Pipeline SC"
        value={card.title}
        onChange={(e) => onUpdate(card.id, { title: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <FieldInput
          label="Date"
          id={`hl-date-${card.id}`}
          type="date"
          value={card.date}
          onChange={(e) => onUpdate(card.id, { date: e.target.value })}
        />
        <FieldInput
          label="Key Stat / Note"
          id={`hl-stat-${card.id}`}
          placeholder="6 saves · Clean sheet"
          value={card.statNote}
          onChange={(e) => onUpdate(card.id, { statNote: e.target.value })}
        />
      </div>
      <div>
        <FieldInput
          label="Video URL"
          id={`hl-url-${card.id}`}
          placeholder="https://youtube.com/watch?v=..."
          value={card.videoUrl}
          onChange={(e) => onUpdate(card.id, { videoUrl: e.target.value })}
        />
        <p className="text-[10px] text-muted-foreground mt-1">
          Paste a YouTube or Vimeo link to embed directly, or a Hudl link to link out.
        </p>
      </div>
    </motion.div>
  );
}

const HighlightsForm = ({ data, updateField, athleticData }: HighlightsFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Derive info from athletic data
  const firstSport = athleticData.sports?.[0];
  const sportName = firstSport?.sportType === "Other" ? firstSport?.customSportName : firstSport?.sportType || "";
  const position = firstSport?.position || "";
  const jersey = firstSport?.jerseyNumber || "";
  const hsTeam = athleticData.sports?.find((s) => s.teamType === "highSchool");
  const clubTeam = athleticData.sports?.find((s) => s.teamType === "club");

  const gradYearMap: Record<string, string> = {
    freshman: "2029",
    sophomore: "2028",
    junior: "2027",
    senior: "2026",
  };
  const gradYear = data.classYear ? gradYearMap[data.classYear] || "" : "";

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField("profilePhoto", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const updateCard = (id: string, updates: Partial<HighlightCard>) => {
    updateField(
      "highlightCards",
      data.highlightCards.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const removeCard = (id: string) => {
    updateField(
      "highlightCards",
      data.highlightCards.filter((c) => c.id !== id)
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.highlightCards.findIndex((c) => c.id === active.id);
    const newIndex = data.highlightCards.findIndex((c) => c.id === over.id);
    updateField("highlightCards", arrayMove(data.highlightCards, oldIndex, newIndex));
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Image size={16} /> Profile Photo
        </h3>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors bg-secondary/30"
          >
            {data.profilePhoto ? (
              <img src={data.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Plus size={20} className="text-muted-foreground" />
            )}
          </button>
          <div className="text-xs text-muted-foreground">
            <p>Click to upload a photo</p>
            {data.profilePhoto && (
              <button
                type="button"
                onClick={() => updateField("profilePhoto", "")}
                className="text-destructive hover:underline mt-1"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>
      </div>

      {/* Auto-filled info */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Player Info (from your profile)</h3>
        <div className="rounded-md border border-border bg-secondary/20 p-3 space-y-1.5 text-sm">
          {data.name && <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{data.name}</span></p>}
          {sportName && <p><span className="text-muted-foreground">Sport:</span> {sportName}</p>}
          {position && <p><span className="text-muted-foreground">Position:</span> {position}</p>}
          {jersey && <p><span className="text-muted-foreground">Jersey:</span> #{jersey}</p>}
          {gradYear && <p><span className="text-muted-foreground">Class of:</span> {gradYear}</p>}
          {data.school && <p><span className="text-muted-foreground">School:</span> {data.school}</p>}
          {clubTeam?.teamName && <p><span className="text-muted-foreground">Club:</span> {clubTeam.teamName}</p>}
          {data.gpa && <p><span className="text-muted-foreground">GPA:</span> {data.gpa}</p>}
          {!data.name && <p className="text-muted-foreground italic">Fill in your Athletic Profile to auto-populate this section.</p>}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hl-show-gpa"
            checked={data.showGpa}
            onChange={(e) => updateField("showGpa", e.target.checked)}
            className="rounded border-border"
          />
          <label htmlFor="hl-show-gpa" className="text-xs text-muted-foreground">Show GPA on highlight page</label>
        </div>
      </div>

      {/* Contact & Tagline */}
      <div className="space-y-3">
        <FieldInput
          label="Contact Email"
          id="hl-contact-email"
          type="email"
          placeholder="jane@email.com"
          value={data.contactEmail}
          onChange={(e) => updateField("contactEmail", e.target.value)}
        />
        <FieldInput
          label="Recruiting Tagline"
          id="hl-tagline"
          placeholder="Division II goalkeeper seeking Northeast programs"
          value={data.recruitingTagline}
          onChange={(e) => updateField("recruitingTagline", e.target.value)}
        />
      </div>

      {/* Highlight Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Video size={16} /> Highlight Cards
        </h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={data.highlightCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <AnimatePresence initial={false}>
              {data.highlightCards.map((card, i) => (
                <SortableCard key={card.id} card={card} index={i} onUpdate={updateCard} onRemove={removeCard} />
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
        <button
          type="button"
          onClick={() => updateField("highlightCards", [...data.highlightCards, createHighlightCard()])}
          className="flex items-center gap-2 w-full justify-center rounded-md border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors"
        >
          <Plus size={14} /> Add Highlight
        </button>
      </div>
    </div>
  );
};

export default HighlightsForm;
