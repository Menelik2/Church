/**
 * New-member onboarding checklist — retention first 90 days
 * Used by admin onboarding UI and seed on approval
 */

export type OnboardingStep = {
  key: string;
  label_am: string;
  description_am: string;
  order: number;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    key: "welcome_contact",
    label_am: "የመጀመሪያ እንኳን ደህና መጡ ግንኙነት",
    description_am: "በስልክ ወይም በአካል በመጀመሪያው ሳምንት ውስጥ ተገናኝቷል።",
    order: 1,
  },
  {
    key: "registration_complete",
    label_am: "መመዝገቢያ ቅጽ ተሟልቷል",
    description_am: "የአባላት መመዝገቢያ እና መሰረታዊ መረጃ ተቀብሏል።",
    order: 2,
  },
  {
    key: "mentor_assigned",
    label_am: "አማካሪ / አጋር ተመድቧል",
    description_am: "ከነባር አገልጋይ ጋር ለ3–6 ወር ተጣምሯል።",
    order: 3,
  },
  {
    key: "course_enrolled",
    label_am: "የተከታታይ ትምህርት (ኮርስ) ተጀምሯል",
    description_am: "ከትምህርት ክፍል ጋር የስልጠና መርሐግብር ተይዟል።",
    order: 4,
  },
  {
    key: "first_gathering",
    label_am: "የመጀመሪያ መርሐግብር ተሳትፎ",
    description_am: "ቢያንስ አንድ መደበኛ መርሐግብር ላይ ተገኝቷል።",
    order: 5,
  },
  {
    key: "department_intro",
    label_am: "የክፍል / አገልግሎት መግቢያ",
    description_am: "የመድረክ ወይም ሌላ ክፍል አገልግሎት ተብራርቷል።",
    order: 6,
  },
  {
    key: "month_1_checkin",
    label_am: "የ1 ወር ክትትል",
    description_am: "ከአማካሪ ወይም ግንኙነት ክፍል ጋር የ1 ወር ንግግር ተደርጓል።",
    order: 7,
  },
  {
    key: "course_complete",
    label_am: "ኮርስ ተጠናቋል",
    description_am: "የተከታታይ ትምህርት ስልጠና ተጠናቅቆ ለአገልጋይነት ዝግጁ ነው።",
    order: 8,
  },
];

export function allStepKeys() {
  return ONBOARDING_STEPS.map((s) => s.key);
}
