/**
 * Functional modules per department / leadership role
 * Source: organizational structure in ማኅተመ ክርስቶስ ህግና ደንብ
 * Capabilities enforced in src/lib/auth/capabilities.ts + migration 021
 */

export type DeptModule =
  | "overview"
  | "tasks"
  | "meetings"
  | "reports"
  | "finance"
  | "membership"
  | "discipline"
  | "classes"
  | "attendance"
  | "inventory"
  | "media"
  | "charity"
  | "correspondence"
  | "choir"
  | "children"
  | "arts"
  | "approvals"
  | "relations";

export type DepartmentWorkspace = {
  code: string;
  title_am: string;
  title_en: string;
  is_leadership: boolean;
  description_am: string;
  modules: DeptModule[];
  actions: { label_am: string; href: string; module: DeptModule }[];
};

export const DEPARTMENT_WORKSPACES: DepartmentWorkspace[] = [
  {
    code: "sebabi",
    title_am: "ሰብሳቢ",
    title_en: "Chairperson",
    is_leadership: true,
    description_am:
      "የተሰጡትን የአመራር ሥራዎች፣ ሪፖርቶችና ውሳኔዎች ይከታተላል።",
    modules: ["overview", "approvals", "correspondence", "meetings", "reports", "tasks"],
    actions: [
      { label_am: "ፈቃድ / ደብዳቤ / ክትትል", href: "/admin/workspace/sebabi?tab=approvals", module: "approvals" },
      { label_am: "ስብሰባዎች", href: "/admin/operations/meetings", module: "meetings" },
      { label_am: "የአባልነት ፈቃዶች", href: "/admin/operations/membership", module: "approvals" },
      { label_am: "ተግባራት", href: "/admin/workspace/sebabi?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "vice-sebabi",
    title_am: "ምክትል ሰብሳቢ",
    title_en: "Vice Chairperson",
    is_leadership: true,
    description_am:
      "የተሰጡትን የአመራር ሥራዎች፣ ሪፖርቶችና ውሳኔዎች ይከታተላል።",
    modules: ["overview", "tasks", "meetings", "reports"],
    actions: [
      { label_am: "ተግባራት", href: "/admin/workspace/vice-sebabi?tab=tasks", module: "tasks" },
      { label_am: "ስብሰባዎች", href: "/admin/operations/meetings", module: "meetings" },
      { label_am: "ሪፖርቶች", href: "/admin/operations/reports", module: "reports" },
    ],
  },
  {
    code: "secretary",
    title_am: "ፀሐፊ",
    title_en: "Secretary",
    is_leadership: true,
    description_am:
      "የአባል መዝገብ፣ ስብሰባ፣ ቃለ ጉባኤ፣ ደብዳቤ እና ሰነዶችን ያስተዳድራል፤ በተፈቀደለት መጠን።",
    modules: ["overview", "correspondence", "meetings", "attendance", "tasks", "reports"],
    actions: [
      { label_am: "ቃለ ጉባኤ / ስብሰባ", href: "/admin/operations/meetings", module: "meetings" },
      { label_am: "ደብዳቤና ሰነድ", href: "/admin/workspace/secretary?tab=correspondence", module: "correspondence" },
      { label_am: "የአባል መዝገብ", href: "/admin/operations/membership", module: "membership" },
      { label_am: "ተግባራት", href: "/admin/workspace/secretary?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "hisab",
    title_am: "ሒሳብ ክፍል",
    title_en: "Finance",
    is_leadership: false,
    description_am: "ገቢ፣ ወጪ፣ መዋጮ፣ በጀት እና የሒሳብ ሪፖርት ይመዘግባል።",
    modules: ["overview", "finance", "tasks", "reports"],
    actions: [
      { label_am: "ሒሳብ መዝገብ", href: "/admin/workspace/hisab?tab=finance", module: "finance" },
      { label_am: "መዋጮ", href: "/admin/operations/contributions", module: "finance" },
      { label_am: "ተግባራት", href: "/admin/workspace/hisab?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "nebrat",
    title_am: "ንብረት ክፍል",
    title_en: "Property",
    is_leadership: false,
    description_am:
      "ቋሚና አላቂ ንብረቶችን፣ ውሰትን፣ መመለሻን እና ጥገናን ይከታተላል።",
    modules: ["overview", "inventory", "tasks", "reports"],
    actions: [
      { label_am: "ንብረት መዝገብ", href: "/admin/workspace/nebrat?tab=inventory", module: "inventory" },
      { label_am: "ውሰት / መመለስ", href: "/admin/workspace/nebrat?tab=checkout", module: "inventory" },
      { label_am: "ተግባራት", href: "/admin/workspace/nebrat?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "timihirt",
    title_am: "ትምህርት ክፍል",
    title_en: "Education",
    is_leadership: false,
    description_am: "ኮርስ፣ ሥልጠና፣ ተማሪዎች፣ የማጠናቀቂያ መዝገብ ያስተዳድራል።",
    modules: ["overview", "classes", "attendance", "tasks", "reports"],
    actions: [
      { label_am: "ክፍሎች / ኮርስ", href: "/admin/workspace/timihirt?tab=classes", module: "classes" },
      { label_am: "መገኘት", href: "/admin/workspace/timihirt?tab=attendance", module: "attendance" },
      { label_am: "ተግባራት", href: "/admin/workspace/timihirt?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "media",
    title_am: "ሚዲያና ሰነድ ክፍል",
    title_en: "Media & Documentation",
    is_leadership: false,
    description_am:
      "ፎቶ፣ ድምፅ፣ ቪዲዮ፣ ዜና፣ የታሪክ ቅርስ እና ማስታወቂያ ያስተዳድራል።",
    modules: ["overview", "media", "tasks", "reports"],
    actions: [
      { label_am: "ሚዲያ መመዝገብ", href: "/admin/workspace/media?tab=media", module: "media" },
      { label_am: "ማስታወቂያ", href: "/admin/announcements", module: "overview" },
      { label_am: "ተግባራት", href: "/admin/workspace/media?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "kutator",
    title_am: "ቁጥጥር ክፍል",
    title_en: "Oversight",
    is_leadership: false,
    description_am:
      "የተፈቀደለትን የተገኝነት ክትትል እና በደንቡ የተጠቀሱ የክትትል ሂደቶችን ይመዘግባል።",
    modules: ["overview", "discipline", "attendance", "tasks", "reports"],
    actions: [
      { label_am: "ክትትል / ዲስፕሊን", href: "/admin/workspace/kutator?tab=discipline", module: "discipline" },
      { label_am: "ተገኝነት", href: "/admin/operations/attendance", module: "attendance" },
      { label_am: "ተግባራት", href: "/admin/workspace/kutator?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "advisory",
    title_am: "አማካሪ ቦርድ / ሰበካ ጉባኤ ተወካይ",
    title_en: "Advisory / Parish Assembly",
    is_leadership: true,
    description_am:
      "በደንቡና በተሰጠው ሥልጣን መሠረት ተገቢ መረጃ ይመለከታል።",
    modules: ["overview", "reports", "meetings"],
    actions: [
      { label_am: "ሪፖርቶች", href: "/admin/operations/reports", module: "reports" },
      { label_am: "ስብሰባዎች", href: "/admin/operations/meetings", module: "meetings" },
    ],
  },
  {
    code: "mezmur",
    title_am: "መዝሙር ክፍል",
    title_en: "Hymn / Music",
    is_leadership: false,
    description_am: "መዝሙር፣ ልምምድ፣ አገልግሎት — ተጠሪነት ለፀሐፊ።",
    modules: ["overview", "choir", "attendance", "tasks", "reports"],
    actions: [
      { label_am: "ልምምድ / መዝገብ", href: "/admin/workspace/mezmur?tab=choir", module: "choir" },
      { label_am: "ተግባራት", href: "/admin/workspace/mezmur?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "kine-tibeb",
    title_am: "ኪነጥበብ ክፍል",
    title_en: "Arts",
    is_leadership: false,
    description_am: "ጽሁፍ፣ ድራማ፣ መድረክ — ተጠሪነት ለም/ሰብሳቢ።",
    modules: ["overview", "arts", "tasks", "reports"],
    actions: [
      { label_am: "ዝግጅቶች", href: "/admin/workspace/kine-tibeb?tab=arts", module: "arts" },
      { label_am: "ተግባራት", href: "/admin/workspace/kine-tibeb?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "hitsanat",
    title_am: "ሕፃናት ክፍል",
    title_en: "Children",
    is_leadership: false,
    description_am: "ደቂቅና ማዕከላዊያን — ልዩ የመረጃ ጥበቃ።",
    modules: ["overview", "children", "classes", "attendance", "tasks"],
    actions: [
      { label_am: "ሕፃናት", href: "/admin/workspace/hitsanat?tab=children", module: "children" },
      { label_am: "ተግባራት", href: "/admin/workspace/hitsanat?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "genegnet",
    title_am: "ግንኙነት ክፍል",
    title_en: "Relations",
    is_leadership: false,
    description_am: "አዲስ አባላት፣ ኮርስ ክትትል፣ ውጭ/ውስጥ ግንኙነት።",
    modules: ["overview", "relations", "tasks", "reports"],
    actions: [
      { label_am: "መመዝገቢያ / ኮርስ", href: "/admin/workspace/genegnet?tab=relations", module: "relations" },
      { label_am: "ተግባራት", href: "/admin/workspace/genegnet?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "limat",
    title_am: "ልማትና በጎ አድራጎት",
    title_en: "Development & Charity",
    is_leadership: false,
    description_am: "ፕሮጀክት፣ በጎ አድራጎት፣ ልማት።",
    modules: ["overview", "charity", "finance", "tasks", "reports"],
    actions: [
      { label_am: "ፕሮጀክቶች", href: "/admin/workspace/limat?tab=charity", module: "charity" },
      { label_am: "ተግባራት", href: "/admin/workspace/limat?tab=tasks", module: "tasks" },
    ],
  },
];

export function getWorkspace(code: string) {
  return DEPARTMENT_WORKSPACES.find((d) => d.code === code);
}
