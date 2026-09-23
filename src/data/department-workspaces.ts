/**
 * Functional modules per department / leadership role
 * Source: organizational structure in ማኅተመ ክርስቶስ ህግና ደንብ
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
  | "approvals";

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
      "ተጠሪነት ለሥራ አስፈጻሚ ኮሚቴ — ኮሚቴ መሪነት፣ ደብዳቤ፣ ፈቃድ/ፊርማ፣ የሥራ አስፈጻሚ ክትትል (7.1–7.6)፣ ዓመታዊ መርሃ ግብር፣ በስሩ፡ ቁጥጥር፣ ሒሳብ፣ ንብረት፣ ሚዲያ።",
    modules: ["overview", "approvals", "correspondence", "meetings", "reports", "tasks"],
    actions: [
      { label_am: "ፈቃድ / ደብዳቤ / ክትትል", href: "/admin/workspace/sebabi?tab=approvals", module: "approvals" },
      { label_am: "ስብሰባዎች", href: "/admin/operations/meetings", module: "meetings" },
      { label_am: "የአባልነት ፈቃዶች", href: "/admin/operations/membership", module: "approvals" },
      { label_am: "የአባል ጉዞ", href: "/admin/operations/journey", module: "approvals" },
      { label_am: "የክፍል ሪፖርቶች", href: "/admin/operations/reports", module: "reports" },
      { label_am: "ተግባራት", href: "/admin/workspace/sebabi?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "vice-sebabi",
    title_am: "ም/ሰብሳቢ",
    title_en: "Vice Chairperson",
    is_leadership: true,
    description_am: "የሰብሳቢ ምትክና ድጋፍ — ማስተባበር፣ ክትትልና ተግባራት።",
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
    description_am: "ደቂቃ፣ ደብዳቤ፣ መገኘት መዝገብና ማህደር አስተዳደር።",
    modules: ["overview", "correspondence", "meetings", "attendance", "tasks"],
    actions: [
      { label_am: "ደቂቃ / ስብሰባ", href: "/admin/operations/meetings", module: "meetings" },
      { label_am: "ደብዳቤና ማስታወሻ", href: "/admin/workspace/secretary?tab=correspondence", module: "correspondence" },
      { label_am: "ተግባራት", href: "/admin/workspace/secretary?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "timihirt",
    title_am: "ትምህርት ክፍል",
    title_en: "Education",
    is_leadership: false,
    description_am: "የትምህርት ክፍሎች፣ መምህራን፣ መገኘትና የትምህርት እቅድ።",
    modules: ["overview", "classes", "attendance", "tasks", "reports"],
    actions: [
      { label_am: "ክፍሎች", href: "/admin/workspace/timihirt?tab=classes", module: "classes" },
      { label_am: "መገኘት", href: "/admin/workspace/timihirt?tab=attendance", module: "attendance" },
      { label_am: "ተግባራት", href: "/admin/workspace/timihirt?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "mezmur",
    title_am: "መዝሙር ክፍል",
    title_en: "Hymn / Music",
    is_leadership: false,
    description_am:
      "ተፈቅደ መዝሙር፣ መደበኛና ሰርግ/ንግስ አገልግሎት፣ ልምምድ ክትትል — ንዑስ፡ አስጠኝ፣ አቴንዲንስ፣ ልብስ፣ ዝማሬ መሳሪያዎች፤ ሩብ ዓመታዊ ሪፖርት።",
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
    description_am: "የኪነጥበብ ዝግጅት፣ ትርኢትና ስልጠና።",
    modules: ["overview", "tasks", "reports"],
    actions: [
      { label_am: "ተግባራት", href: "/admin/workspace/kine-tibeb?tab=tasks", module: "tasks" },
      { label_am: "ሪፖርት", href: "/admin/operations/reports", module: "reports" },
    ],
  },
  {
    code: "hisab",
    title_am: "ሒሳብ ክፍል",
    title_en: "Finance",
    is_leadership: false,
    description_am: "ገቢ፣ ወጪ፣ የወርሃዊ መዋጮና የሒሳብ ሪፖርት — ተጠሪነት ለሰብሳቢ።",
    modules: ["overview", "finance", "tasks", "reports"],
    actions: [
      { label_am: "ሒሳብ መዝገብ", href: "/admin/workspace/hisab?tab=finance", module: "finance" },
      { label_am: "መዋጮ", href: "/admin/operations/contributions", module: "finance" },
      { label_am: "ተግባራት", href: "/admin/workspace/hisab?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "hitsanat",
    title_am: "ሕፃናት ክፍል",
    title_en: "Children",
    is_leadership: false,
    description_am:
      "ደቂቅ (7–10) እና ማዕከላዊያን (11–17) — ትምህርት፣ ግብረገብ፣ ሥርዓተ-ትምህርት፣ ድራማና ሐዋርያዊ ጉዞ፤ ሩብ ዓመታዊ ሪፖርት።",
    modules: ["overview", "children", "classes", "attendance", "tasks"],
    actions: [
      { label_am: "መገኘት", href: "/admin/workspace/hitsanat?tab=attendance", module: "attendance" },
      { label_am: "ክፍሎች", href: "/admin/workspace/hitsanat?tab=classes", module: "classes" },
      { label_am: "ተግባራት", href: "/admin/workspace/hitsanat?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "genegnet",
    title_am: "ግንኙነት ክፍል",
    title_en: "Relations",
    is_leadership: false,
    description_am:
      "አዲስ አባላት፣ ኮርስ ክትትል፣ ሀዘንና ድስታ፣ ጽዋ፣ ውጭ/ውስጥ ግንኙነት፣ የወንድሞችና እህቶች ጉባኤ — ተጠሪነት ለም/ሰብሳቢ።",
    modules: ["overview", "correspondence", "tasks", "reports"],
    actions: [
      { label_am: "መመዝገቢያ / ኮርስ", href: "/admin/workspace/genegnet?tab=correspondence", module: "correspondence" },
      { label_am: "የአባል ጉዞ", href: "/admin/operations/journey", module: "correspondence" },
      { label_am: "ተግባራት", href: "/admin/workspace/genegnet?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "kutator",
    title_am: "ቁጥጥርና ክርስትያናዊ ህይወት ክትትል",
    title_en: "Oversight & Christian Life",
    is_leadership: false,
    description_am: "የክርስቲያናዊ ሕይወት ክትትል፣ ዲስፕሊንና ማረሚያ — ተጠሪነት ለሰብሳቢ።",
    modules: ["overview", "discipline", "tasks", "reports"],
    actions: [
      { label_am: "ዲስፕሊን", href: "/admin/operations/discipline", module: "discipline" },
      { label_am: "ተግባራት", href: "/admin/workspace/kutator?tab=tasks", module: "tasks" },
      { label_am: "ሪፖርት", href: "/admin/operations/reports", module: "reports" },
    ],
  },
  {
    code: "limat",
    title_am: "ልማትና በጎ አድራጎት ክፍል",
    title_en: "Development & Charity",
    is_leadership: false,
    description_am:
      "የገቢ ማስገኛ፣ የልማት ፕሮጀክት፣ በጎ አድራጎት፣ ሙያ፣ ጽዳትና ግቢ ማስዋብ — ንዑስ ክፍሎችን በየወሩ መገምገምና ሩብ ዓመታዊ ሪፖርት።",
    modules: ["overview", "charity", "finance", "tasks", "reports"],
    actions: [
      { label_am: "ፕሮጀክቶች / በጎ አድራጎት", href: "/admin/workspace/limat?tab=charity", module: "charity" },
      { label_am: "ተግባራት", href: "/admin/workspace/limat?tab=tasks", module: "tasks" },
      { label_am: "ሪፖርት", href: "/admin/operations/reports", module: "reports" },
    ],
  },
  {
    code: "media",
    title_am: "ሚዲያ እና ዶክመንቴሽን ክፍል",
    title_en: "Media & Documentation",
    is_leadership: false,
    description_am: "ፎቶ፣ ቪዲዮ፣ ዶክመንት መመዝገብና ማህደር — ተጠሪነት ለሰብሳቢ።",
    modules: ["overview", "media", "tasks", "reports"],
    actions: [
      { label_am: "ሚዲያ መመዝገብ", href: "/admin/workspace/media?tab=media", module: "media" },
      { label_am: "ተግባራት", href: "/admin/workspace/media?tab=tasks", module: "tasks" },
      { label_am: "ማስታወቂያ", href: "/admin/announcements", module: "overview" },
    ],
  },
  {
    code: "nebrat",
    title_am: "ንብረት ክፍል",
    title_en: "Property",
    is_leadership: false,
    description_am:
      "ቋሚና አላቂ ንብረት፣ መዝገብ፣ እቃ ቤት፣ የውሰት ፍርም፣ ጥገናና ንጽህና — ተጠሪነት ለሰብሳቢ፤ ንዑስ፡ እቃ፣ ቁጥጥር፣ ጥገናና ንጽህና።",
    modules: ["overview", "inventory", "tasks", "reports"],
    actions: [
      { label_am: "ንብረት መዝገብ", href: "/admin/workspace/nebrat?tab=inventory", module: "inventory" },
      { label_am: "ውሰት / መመለስ", href: "/admin/workspace/nebrat?tab=checkout", module: "inventory" },
      { label_am: "ተግባራት", href: "/admin/workspace/nebrat?tab=tasks", module: "tasks" },
      { label_am: "ሪፖርት", href: "/admin/operations/reports", module: "reports" },
    ],
  },
];

export function getWorkspace(code: string) {
  return DEPARTMENT_WORKSPACES.find((d) => d.code === code);
}
