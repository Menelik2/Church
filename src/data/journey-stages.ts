export const JOURNEY_STAGES = [
  {
    key: "visitor",
    label_am: "ጎብኝ",
    label_en: "Visitor",
    order: 1,
  },
  {
    key: "registered",
    label_am: "ተመዝጋቢ",
    label_en: "Registered",
    order: 2,
  },
  {
    key: "course",
    label_am: "ኮርስ",
    label_en: "Course",
    order: 3,
  },
  {
    key: "servant",
    label_am: "አገልጋይ",
    label_en: "Servant",
    order: 4,
  },
] as const;

export type JourneyStageKey = (typeof JOURNEY_STAGES)[number]["key"];

export function stageLabel(key: string): string {
  return JOURNEY_STAGES.find((s) => s.key === key)?.label_am ?? key;
}

export function nextStage(key: string): JourneyStageKey | null {
  const i = JOURNEY_STAGES.findIndex((s) => s.key === key);
  if (i < 0 || i >= JOURNEY_STAGES.length - 1) return null;
  return JOURNEY_STAGES[i + 1].key;
}
