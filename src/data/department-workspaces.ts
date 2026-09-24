/**
 * Functional modules per department / leadership role
 * Source: organizational structure in ማእተመ ክርስቶስ ህግና ደንብ
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
      "ተጠሪነት ለሥራ አስፈጻሚ ኮሚቴ — ኮሚቴ መሪነት፣ ደብዳቤ፣ ፈቃድ/ፊርማ፣ የሥራ አስፈጻሚ ክትትል (7.1–7.6)፣ ዓመታዊ መርሃ ግብር፣ በስሩ፡ ቁጥጥር፣ ሂሳብ፣ ንብረት፣ ሚዲያ።",
    modules: ["overview", "approvals", "correspondence", "meetings", "reports", "tasks"],
    actions: [
      { label_am: "ፈቃድ / ደብዳቤ / ክትትል", href: "/admin/workspace/sebabi?tab=approvals", module: "approvals" },
      { label_am: "ስብሰባዎች", href: "/admin/operations/meetings", module: "meetings" },
      { label_am: "የአባልነት ፈቃዶች", href: "/admin/operations/membership", module: "approvals" },
      { label_am: "የአባል ጉዦ", href: "/admin/operations/journey", module: "approvals" },
      { label_am: "ተግባራት", href: "/admin/workspace/sebabi?tab=tasks", module: "tasks" },
    ],
  },
  {
    code: "mezmur",
    title_am: "መዕሙር ክፍል",
    title_en: "Hymn / Music",
    is_leadership: false,
    description_am:
      "ተጠሪነቱ ለጸሓፊው ሆኖ የሚከተሉትን ተግባራት ያከናውናል (§10.8)፦\n" +
      "፩. የቤተክርስቲያን ሥርዓትና ደንብ የጠበቁ መዕሙሮች እንዲዘመሩ ማድረግ\n" +
      "፪. በሰ/ት/ቤቱ መደበኛ ፅሮግራም ሳይቆረጥ የመዕሙር አገልግሎት እንዲሰጥ ማድረግ\n" +
      "፫. የተፈቀደ መዕሙሮችን ብቻ ማስጠናትና ማዘመር\n" +
      "፬. አስፈላጊ ሆኖ ሲገኝ ከጽ/ቤቱ ጋር በመነጋገር ወደ ሌሎች ሰ/ት/ቤቶች አገልጋዮች መላክ\n" +
      "፭. የሰርግ እጀባ ግብዛዎች ሲቀርቡ የማጀብ አገልግሎት መስጠት\n" +
      "፮. በጉባኤና ንግስ በዓል የመዕሙር አገልግሎት ማዘጋጀት\n" +
      "፯. ወቅቱን የጠበቁ መዕሙሮች እንዲዘመሩ ክትትል ማድረግ\n" +
      "፰. የልምምድ ቀን መገኝት መቆጣጠር\n" +
      "፱. በአጥቢያ ንግስ በዓላት አገልጋዮች መላክ\n" +
      "፲. ወርሃዊ ግምገማና ሩብ ዓመት ሪፖርት\n" +
      "፲፩. የዓመት ዕቅድና ክትትል\n" +
      "፲፪. ከጽ/ቤቱ የሚሰጡ ተግባራትና መተዳደሪያ ማክበር\n" +
      "፲፫. የውስጥ ደንብ ማውጣትና ለጽ/ቤት ማሳወቅ\n" +
      "፲፬. ለህጳናት ክፍል አገልግሎት ድጋፍና ክትትል\n" +
      "ንዑሳን፦ መዕሙር አስጠኝ · አቴንዲንስ · ልብስ · የዝማሬ መሳሪያዎች",
    modules: ["overview", "choir", "attendance", "tasks", "reports"],
    actions: [
      { label_am: "ልምምድ / መዝገብ / አገልግሎት", href: "/admin/workspace/mezmur?tab=choir", module: "choir" },
      { label_am: "ተግባራት", href: "/admin/workspace/mezmur?tab=tasks", module: "tasks" },
    ],
  },
];

export function getWorkspace(code: string) {
  return DEPARTMENT_WORKSPACES.find((d) => d.code === code);
}
