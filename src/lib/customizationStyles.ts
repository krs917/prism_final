import { ResumeCustomization } from "@/types/resume";

export function getStyleVars(c: ResumeCustomization) {
  const fontMap = {
    inter: "'Inter', system-ui, sans-serif",
    serif: "'IBM Plex Serif', Georgia, serif",
    mono: "'IBM Plex Mono', monospace",
  };
  const sizeMap = { small: "10px", medium: "11px", large: "12px" };
  const marginMap = { compact: "24px", normal: "32px", spacious: "40px" };
  const lineMap = { tight: "1.4", normal: "1.6", relaxed: "1.8" };

  return {
    fontFamily: fontMap[c.font],
    fontSize: sizeMap[c.fontSize],
    padding: marginMap[c.margin],
    lineHeight: lineMap[c.lineSpacing],
  };
}
