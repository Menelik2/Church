/**
 * Authoritative content extracted from:
 * ማኅተመ ክርስቶስ ህግና ደንብ.pdf
 * Revised: ሰኔ 30/2016 ዓ.ም
 * 26 pages
 *
 * DO NOT alter legal meaning. Keep Amharic as source of truth.
 */

import { EXTRA_ARTICLES } from "./articles-extra";

export const DOCUMENT_META = {
  title_am: "የደ/ሰ/በዓለ እግዚአብሔር ቤተ ክርስቲያን ማኅተመ ክርስቶስ ሰ/ት/ቤት የውስጥ መተዳደሪያ ሕግና ደንብ",
  title_en: "Debre Selam Beale Egziabher Church - Makhteme Kristos Sunday School Internal Regulations",
  organization_am: "ማኅተመ ክርስቶስ ሰንበት ት/ቤት",
  organization_en: "Makhteme Kristos Sunday School",
  church_am: "ደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስቲያን",
  diocese_am: "ባህር ዳር ሀገረ ስብከት",
  revision_date_am: "ሰኔ 30/2016 ዓ.ም",
  revision_date_en: "Sene 30, 2016 E.C.",
  page_count: 26,
  version: "2016",
} as const;

export const TOC = [
  { id: "intro", title_am: "መግቢያ", title_en: "Introduction", page: 1 },
  { id: "history-sunday-school", title_am: "የሰንበት ትምህርት ቤት አመሠራረት", title_en: "Origin of Sunday School", page: 1 },
  { id: "history-makhteme", title_am: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት አመሰራረት", title_en: "Founding of Makhteme Kristos Sunday School", page: 2 },
  { id: "art-1", number: 1, title_am: "ስያሜ", title_en: "Name", page: 2 },
  { id: "art-2", number: 2, title_am: "ትርጓሜ", title_en: "Definitions", page: 3 },
  { id: "art-3", number: 3, title_am: "የሰንበት ት/ቤቱ ርእይ", title_en: "Vision", page: 3 },
  { id: "art-4", number: 4, title_am: "የሰንበት ት/ቤቱ ተልዕኮ", title_en: "Mission", page: 3 },
  { id: "art-5", number: 5, title_am: "የሰ/ት/ቤቱ አጠቃላይ ዓላማ", title_en: "General Objectives", page: 4 },
  { id: "art-6", number: 6, title_am: "የጠቅላላ ጉባኤ", title_en: "General Assembly", page: 4 },
  { id: "art-7", number: 7, title_am: "የሰ/ት/ቤቱን አማካሪ ቦርድ", title_en: "Advisory Board", page: 4 },
  { id: "art-8", number: 8, title_am: "የስራ አስፈፃሚ ኮሚቴ ተግባርና ኃላፊነት", title_en: "Executive Committee Duties", page: 5 },
  { id: "art-9", number: 9, title_am: "የሰበካ ጉባኤ ተወካይ", title_en: "Parish Council Representative", page: 6 },
  { id: "art-10", number: 10, title_am: "የስራ አስፈጻሚ መዋቅር እና የአመራረጥ ሂደት", title_en: "Organizational Structure & Election", page: 6 },
  { id: "art-11", number: 11, title_am: "የአገልጋይ መብት", title_en: "Rights of Servants", page: 18 },
  { id: "art-12", number: 12, title_am: "የአገልጋይ ግዴታ", title_en: "Duties of Servants", page: 18 },
  { id: "art-13", number: 13, title_am: "ከአገልግሎት የሚያሳግዱ ጉዳዮች", title_en: "Matters that Disqualify from Service", page: 19 },
  { id: "art-14", number: 14, title_am: "የቋሚ አባልነት (የአገልጋይነት) መመዘኛ መስፈርቶች", title_en: "Permanent Membership / Service Criteria", page: 20 },
  { id: "art-15", number: 15, title_am: "ልዩ ልዩ ድንጋጌዎች", title_en: "Special Provisions", page: 20 },
  { id: "art-16", number: 16, title_am: "በሰንበት ት/ቤቱ ስር ያሉ መርሐግብራት", title_en: "Programs under the Sunday School", page: 22 },
] as const;

export const DEPARTMENTS = [
  { id: "arts", slug: "kine-tibeb", title_am: "ኪነ ጥበብ", title_en: "Arts", order: 1 },
  { id: "finance", slug: "hisab", title_am: "ሒሳብ", title_en: "Finance / Accounting", order: 2 },
  { id: "education", slug: "timihirt", title_am: "ትምህርት", title_en: "Education", order: 3 },
  { id: "oversight", slug: "kutator", title_am: "ቁጥጥርና ክርስትያናዊ ሕይወት ክትትል", title_en: "Oversight & Christian Life Follow-up", order: 4 },
  { id: "hymn", slug: "mezmur", title_am: "መዝሙር", title_en: "Hymn / Music", order: 5 },
  { id: "development", slug: "limat", title_am: "ልማትና በጎ አድራጎት", title_en: "Development & Charity", order: 6 },
  { id: "children", slug: "hitsanat", title_am: "ሕፃናት", title_en: "Children", order: 7 },
  { id: "relations", slug: "genegnet", title_am: "ግንኙነት", title_en: "Relations / Communications", order: 8 },
  { id: "media", slug: "media", title_am: "ሚዲያና ዶክመንቴሽን", title_en: "Media & Documentation", order: 9 },
  { id: "property", slug: "nebrat", title_am: "ንብረት", title_en: "Property", order: 10 },
] as const;

/** Articles 1–7 inline; 8–16 from articles-extra (PDF extract) */
const BASE_ARTICLES: Record<string, {
  number: number;
  title_am: string;
  title_en: string;
  content_am: string;
}> = {
  "1": {
    number: 1,
    title_am: "ስያሜ",
    title_en: "Name",
    content_am: `ሰንበት ት/ቤቱ በቤተ ክርስትያኒቱ ስያሜ የደ/ሰ/በዓለ እግዚአብሔር ቤተ ክርስትያን ማኅተመ ክርስቶስ ሰ/ት/ቤት ተብሎ ይጠራል። በመሆኑም ይህ መተዳደሪያ ደንብ የደ/ሰ/በዓለ እግዚአብሔር ቤተ ክርስትያን ማኅተመ ክርስቶስ ሰ/ት/ቤት የውስጥ መተዳደሪያ ደንብ ተብሎ ይጠራል።`,
  },
  "2": {
    number: 2,
    title_am: "ትርጓሜ",
    title_en: "Definitions",
    content_am: `1. ቤተ ክርስትያን ማለት፡- የኢትዮጵያ ኦርቶድክስ ተዋሕዶ ቤተክርስቲያን ማለት ነው።
2. ሰ/ት/ቤት ማለት፡- የቤተ ክርስትያኗ አባላት በዕለተ ሰንበትና በአመቺ ጊዜያት ከህፃንነት እስከ ወጣትነት፣ ከወጣትነት እስከ እርጅና በተመጣጠነ ሁኔታ የቤተክርስቲያኗን እምነት፣ ስርዓት፣ ታሪክ፣ የስነ ምግባር፣ የግዕዝ ቋንቋ፣ የመዝሙር፣ የቅዳሴ ተሰጥኦ ወዘተ ትምህርት የሚማሩበትና ባላቸው ጸጋም የሚያገለግሉበት ተጠሪነቱ ለአጥቢያ ቤተክርስቲያን ሰበካ መንፈሳዊ አስተዳደር ጉባኤ የሆነ የአገልግሎት የስራ ክፍል ማለት ነው።
3. የስራ አመራር ማለት፡- የአጥቢያ ቤተክርስቲያን ሰንበት ት/ቤት ስራ አመራር ኮሚቴ ማለት ነው።
4. ንዑስ ክፍል ማለት፡- ከአገልግሎቶች ክፍሎች በታች የሚደራጁ የአገልግሎት መዋቅር ማለት ነው።
5. አገልጋይ ማለት፡- ከአባልነት እስከ ሥራ አስፈፃሚ በመሆን በሰ/ት/ቤቱ የሚሳተፍ የቋሚ አባላት መጠሪያ ነው።
6. አባላት ማለት፡- የሰ/ት/ቤቱን መደበኛ መርሐግብር የሚከታተሉ አባላትን ያጠቃልላል።`,
  },
  "3": {
    number: 3,
    title_am: "የሰንበት ት/ቤቱ ርእይ",
    title_en: "Vision of the Sunday School",
    content_am: `በአጥቢያ ያሉ ኦርቶድክሳውያን ሕፃናትና ወጣቶች በሙሉ የሰ/ት/ቤቱ አባል ሆነው በቤተ ክርስትያኒቷ የሃይማኖት ዶግማና ሥርዓት የተኮተኮቱ፣ ሃይማኖቱ የሚያዘውን አኗኗር የሚጠብቁና የሚያስጠብቁ፣ በየዘመናቸው ለክርስትና መከፈል የሚገባውን የመንፈሳዊ ተጋድሎ ዋጋ በመክፈል ከትውልድ ወደ ትውልድ ክርስትናን ከነሙሉ መገለጫዎቹ ጋር የሚያሻግሩ ክርስቲያኖችን ማፍራት።`,
  },
  "4": {
    number: 4,
    title_am: "የሰንበት ት/ቤቱ ተልዕኮ",
    title_en: "Mission of the Sunday School",
    content_am: `4.1. በሰ/ት/ቤቱ ለሚታቀፉ ሕፃናት፣ ወጣቶችና ጎልማሶች በትምህርተ ሃይማኖት፣ በሥርዓተ ቤተ ክርስትያን፣ በኢትዮጵያና በዓለም የቤተ ክርስትያን ታሪክ፣ በቤተ ክርስትያን የአብነት ትምህርቶች፣ በቤተ ክርስትያን አገልግሎት ምሥጢራዊ አፈጻጸም፣ በተቀደሰ ትውፊት ላይ ወጥነትና ተከታታይነት ያለው እውቀትን ማስተላለፍ።

4.2. ለሕፃናትና ወጣቶች የሚሰጠው ትምህርት በአሰጣጡ፣ በአደረጃጀቱና በዘዴው ዘመኑን በሚዋጅ መልኩ እየተሻሻለ የቅድስት ቤተ ክርስትያንን ተልዕኮና ራእይ የሚያሳካ በሚሆንበት መልኩ የተቃኘ ማድረግና መቆጣጠር።`,
  },
  "5": {
    number: 5,
    title_am: "የሰ/ት/ቤቱ አጠቃላይ ዓላማ",
    title_en: "General Objectives",
    content_am: `• የኢትዮጵያ ኦርቶድክስ ተዋሕዶ ቤተ ክርስትያን እምነት፣ ዶግማ፣ ሥርዓትና ትውፊቷ ለተተኪው ትውልድ እንዲተላለፍ ማድረግ።
• የኢትዮጵያ ኦርቶድክስ ተዋሕዶ ቤተ ክርስትያን እምነትና ሥርዓት ሳይለወጥና ሳይበረዝ በቀጥታ ከትውልድ ወደ ትውልድ እንዲተላለፍ ማድረግ።
• ማንኛውንም የቤተ ክርስትያኒቱ ተከታይ የሆነ ክርስቲያን ሁሉ ሃይማኖቱንና የሃይማኖቱን ስርዓት በውል እንዲያውቅና እንዲረዳ ማድረግ።
• መንፈሳውያን ወጣቶች በሰንበት ትምህርት ቤት ተደራጅተው እየተማሩ የአገርንም ሆነ የቤተ ክርስትያንን ታሪክ በሚገባ አውቀው የነገረ መለኮትን ሃይማኖታዊ ትምህርት እንዲረዱ ማድረግ።
• የቤተ ክርስትያኒቱ ልጆች ብስለት እንዲያገኙና የነገዋን ቤተክርስትያን በኃላፊነት ለመረከብ ብቁዎች እንዲሆኑ ማድረግ።
• ወጣቶች የቤተክርስቲያንን ህግ፤ ሥርዓት፤ ቃለ እግዚአብሔር ተምረው ወላጆቻቸውንና ታላላቆቻቸውን አክባሪ እንዲሆኑ በአጠቃላይ በሃይማኖትና በሥነ-ምግባር ታንፀው እንዲያድጉና ለሀገርና ለወገን መልካም ዜጎች እንዲሆኑ ማድረግ።
• ወጣቶች ወደ ቤተ እግዚአብሔር እንዲሄዱና በጉብዝናቸው ወራት ፈጣሪያቸውን እንዲያስቡ በቅድሳት መጽሐፍት የታዘዘውን ለመፈጸም እንዲችሉ ማድረግ።`,
  },
  "6": {
    number: 6,
    title_am: "የጠቅላላ ጉባኤ",
    title_en: "General Assembly",
    content_am: ` የጠቅላላ ጉባኤ እድሜያቸው ከ17 ዓመት በላይ የሆኑ ታዳጊዎች ወጣቶችና ጎልማሶች የሚገኙበት የሰንበት ት/ቤት አባላት ስብሰባ ነው።
 ሰንበት ት/ቤቱ በዓመት አራት ጊዜ የሥራ እንቅስቃሴውን በተመለከተ ጠቅላላ ሪፖርት የሚቀርብበት የጠቅላላ ጉባኤ ይኖረዋል።
 የጠቅላላ ጉባኤው በሰንበት ት/ቤት ሊቀመንበር ሰብሳቢነት በሪፖርቱ ላይ ተወያይቶ በአብላጫ ድምፅ ሲያጸድቀው ሪፖርቱ ተቀባይነት ያገኛል፤ ለሰበካ መንፈሳዊ አስተዳደር ጉባኤም ገቢ ይደረጋል።
 ጠቅላላ ጉባኤው ውሳኔዎችን ለማጽደቅ 2/3ኛ አባላት ከተገኙ ይችላል።`,
  },
  "7": {
    number: 7,
    title_am: "የሰ/ት/ቤቱን አማካሪ ቦርድ",
    title_en: "Advisory Board",
    content_am: ` የሰ/ት/ቤቱ የበላይ ጠባቂ ሰበካ ጉባኤው ሲሆን የሰ/ትቤቱን ጠቅላላ አገልግሎትና የሥራ አስፈጻሚውን የሥራ እንቅስቃሴ የሚደግፉ፣ የሚያማክሩና የሚቆጣጠሩ በሥራ አስፈጻሚው ኮሚቴ አቅራቢነት ለጠቅላላ አባል ቀርቦ ሲጸድቅ ተጠሪነቱ ለጠቅላላ አባላት የሆነ የአማካሪ ቦርድ ይኖረዋል።

7.1. የአማካሪ ቦርድ ዓላማ
 በሰ/ት/ቤቱ የሚሰጠውን ማንኛውም መንፈሳዊ አገልግሎት በቅርበት የሚከታተሉ፣ የሚያግዙ፣ መንገድ የሚጠቁሙ፣ የሚያማክሩና የሚቆጣጠሩ ይሆናል።

7.2. የአማካሪ ቦርድ ኃላፊነትና ተግባራት
 የአማካሪ ቦርድ አንድ ሰብሳቢ እና አራት አባላት ይኖሩታል። አጠቃላይ የሥራ ዘመኑ 3 ዓመት ነው።`,
  },
};

export const ARTICLES = {
  ...BASE_ARTICLES,
  ...EXTRA_ARTICLES,
};

export const HISTORY = {
  intro_am: `በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን\n\nመግቢያ\nየሰንበት ትምህርት ቤት አመሠራረት`,
  founding_am: `የማኅተመ ክርስቶስ ሰንበት ት/ቤት አመሰራረት\n\nበባህርዳር ሀገር ስብከት የምእመናን መብዛት እና የከተማዋን መስፋፋት ተከትሎ የደ/ሰ/በዓለ እግዚአብሔር ቤተ ክርስትያን በአካባቢው ለሚገኙ ምእመናን አገልግሎት እንዲሰጥ ታስቦ በ1995 ዓ.ም የወቅቱ የሀገረ ስብከቱ ሊቀ ጳጳስ በነበሩት በብፁዕ አቡነ በርናባስ መልካም ፈቃድ መመስረቱ ይታወቃል።\n\nየአጥቢያው ሰ/ት/ቤትም የቤተክርስትያኒቱን መመስረት ተከትሎ ጥቅምት 2 ቀን 1996 ዓ.ም የተመሠረተ ሲሆን በ2001 ዓ.ም የመጀመሪያው የውስጥ መተዳደሪያ ደንብ እንዲዘጋጅ ተደርጓል።`,
  timeline: [
    { year_am: "1936 ዓ.ም", event_am: "በኢ/ኦ/ተ/ቤተ ክርስትያን ታሪክ የወጣቶች ሰ/ት/ቤት መቋቋም የተጀመረበት" },
    { year_am: "1939 ዓ.ም", event_am: "«ተምሮ ማስተማር» የተባለው ሰንበት ት/ቤት ተቋቋመ" },
    { year_am: "1970 ዓ.ም", event_am: "በቃለ አዋጁ ሰንበት ትምህርት ቤት ሙሉ ዕውቅና አገኘ" },
    { year_am: "1995 ዓ.ም", event_am: "ደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስትያን በብፁዕ አቡነ በርናባስ ፈቃድ ተመሠረተ" },
    { year_am: "ጥቅምት 2 ቀን 1996 ዓ.ም", event_am: "ማኅተመ ክርስቶስ ሰንበት ት/ቤት ተመሠረተ" },
    { year_am: "2001 ዓ.ም", event_am: "የመጀመሪያው የውስጥ መተዳደሪያ ደንብ ተዘጋጀ" },
    { year_am: "ሰኔ 30/2016 ዓ.ም", event_am: "አሁን ያለው የተሻሻለ መተዳደሪያ ደንብ" },
  ],
};
