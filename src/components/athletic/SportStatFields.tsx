import { Sport } from "@/types/resume";
import { SportType, SPORT_CONFIGS, getStatFields } from "@/config/sportFields";
import { FieldInput } from "../resume/FieldInput";

interface SportStatFieldsProps {
  sport: Sport;
  onStatChange: (key: string, value: string) => void;
  onCustomLabelChange?: (key: string, label: string) => void;
}

const SportStatFields = ({ sport, onStatChange, onCustomLabelChange }: SportStatFieldsProps) => {
  const sportType = sport.sportType as SportType;
  if (!sportType) return null;

  const config = SPORT_CONFIGS[sportType];
  if (!config) return null;

  const fields = getStatFields(sportType, sport.position);

  if (sportType === "Other") {
    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Enter your own stat labels and values:</p>
        {fields.map((f) => (
          <div key={f.key} className="grid grid-cols-2 gap-2">
            <FieldInput
              label="Label"
              id={`stat-label-${sport.id}-${f.key}`}
              placeholder="e.g. Goals Scored"
              value={sport.customStatLabels?.[f.key] || ""}
              onChange={(e) => onCustomLabelChange?.(f.key, e.target.value)}
            />
            <FieldInput
              label="Value"
              id={`stat-val-${sport.id}-${f.key}`}
              placeholder="e.g. 25"
              value={sport.stats[f.key] || ""}
              onChange={(e) => onStatChange(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map((f) => (
        <FieldInput
          key={f.key}
          label={f.label}
          id={`stat-${sport.id}-${f.key}`}
          placeholder={f.placeholder}
          value={sport.stats[f.key] || ""}
          onChange={(e) => onStatChange(f.key, e.target.value)}
        />
      ))}
    </div>
  );
};

export default SportStatFields;
