/**
 * Detailed duties & sub-departments per ክፍል
 * Source: ማኅተመ ክርስቶስ ህግና ደንብ.pdf (አንቀጽ 10 detailed pages)
 * DO NOT alter legal meaning. Amharic is source of truth.
 */

export type DepartmentDetail = {
  slug: string;
  intro_am: string;
  duties_am: string[];
  sub_departments_am: string[];
};

export const DEPARTMENT_DETAILS: Record<string, DepartmentDetail> = {
  limat: {
    slug: "limat",
    intro_am:
      "ይህ ክፍል ተጠሪነቱ ለጽሕፈት ቤቱ ሆኖ የሚከተሉትን ተግባራት ያከናውናል፡-",
    duties_am: [
      "በስሩ ያሉ ንዑስ ክፍሎችን አጠቃላይ የስራ እንቅስቃሴያቸውን በየወሩ ይገመግማል።",
      "ክፍሉን በበላይነት ይመራል ይቆጣጠራል።",
      "ማንኛውም የሰ/ት/ቤቱ ቋሚና ዕለታዊ የሆነ የገቢ ማስገኛ ምንጮችንና ቦታዎችን ያመቻቻል ለእያንዳንዱ ሥራም ክትትል ያደርጋል።",
      "ማንኛውም ለሰ/ት/ቤቱ ቋሚ ዕቃዎችና ለሽያጭ የሚውሉትን ዕቃዎች ጥንካሬአቸውንና ጥራታቸው በማጥናት ያቀርባል።",
      "ከተለያዩ ለጋሽ ባለሀብቶችና ድርጅቶች ጋር የውይይት መድረኮችን በመፍጠርና በማዘጋጀት ለሰ/ት/ቤቱ የገቢ ምንጮችን ያፈላልጋል።",
      "የተለያዩ የልማት ፕሮጀክት በመቅረጽ የገቢ ማስገኛ ስራዎችን ይሰራል።",
      "የሚሰራቸውን ሥራዎች በየ3 ወሩ ለጽ/ቤት ሪፖርት ያደርጋል።",
      "የዓመቱን የድርጊት መርሃ ግብር በማጥናት ያቅዳል ተፈጻሚነቱንም ይከታተላል።",
      "በተጨማሪ ከጽ/ቤት የሚሰጠውን ተግባር ይፈጽማል የሰ/ት/ቤቱን መተዳደሪያ ደንብ ያከብራል ያስከብራል።",
      "ለሰ/ት/ቤቱ የሕፃናት ክፍል አገልግሎት ድጋፍና ክትትል ያደርጋል።",
      "ድጋፍ ለሚያስፈልጋቸው አድባራትና ገዳማት ከመጎ አድራጊዎች ገንዘብና ስጦታዎችን በመሰብሰብ የድጋፍ ስራ ይሰራል።",
      "ለአቅመ ደካሞችና በዝቅተኛ የኑሮ ደረጃ ላይ የሚገኙ ግለሰቦችን በመለየት የድጋፍ ስራ ይሰራል።",
      "የአብነት ተማሪዎችን የሚያስፈልጋቸውን መሰረታዊ ፍላጎት በማጥናት አቅሙ በሚፈቅደው መጠን የድጋፍ ስራ ይሰራል።",
    ],
    sub_departments_am: [
      "ገቢ ማስገኛ ንዑስ ክፍል",
      "በጎ አድራጎት ንዑስ ክፍል",
      "ሙያ ንዑስ ክፍል",
      "ጽዳት እና ግቢ ማስዋብ ንዑስ ክፍል",
    ],
  },
};

export function getDepartmentDetail(slug: string): DepartmentDetail | undefined {
  return DEPARTMENT_DETAILS[slug];
}
