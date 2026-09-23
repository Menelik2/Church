/**
 * Programs & assemblies under the Sunday School (አንቀጽ 16)
 * Source: ማኅተመ ክርስቶስ ህግና ደንብ — user-provided detailed text
 * DO NOT alter legal meaning. Amharic is source of truth.
 */

export type ProgramItem = {
  id: string;
  order: number;
  title_am: string;
  body_am: string;
  /** Optional sub-groups (e.g. age bands) */
  subgroups_am?: string[];
  /** Link to related department or page when useful */
  related_href?: string;
  related_label_am?: string;
};

export const PROGRAMS_INTRO_AM =
  "የደ/ሰ/በ/እግዚአብሔር ቤ/ያን ማኅተመ ክርስቶስ ሰንበት ት/ቤት በስሩ የሚያስኬዳቸው መርሃ ግብራት እና የሚያስተዳድራቸው ጉባኤያት ከዚህ እንደሚከተለው ተዘርዝረው ይገኛሉ፡-";

export const PROGRAMS: ProgramItem[] = [
  {
    id: "hitsanat",
    order: 1,
    title_am: "የሰንበት ት/ቤቱ የሕጻናት መርሃ ግብር",
    body_am:
      "እነዚህ ጉባኤያት በሰንበት ትምህርት ቤቱ ሕጻናት ክፍል የሚመሩ ሲሆን በስሩ ባቋቋማቸው ንዑሳን ክፍሎች አማካይነት አገልግሎቱን ያከናውናል።",
    subgroups_am: [
      "ሀ. ደቂቅ (ከ7–10 ዓመት)",
      "ለ. ማዕከላውያን (ከ11–17)",
    ],
    related_href: "/departments/hitsanat",
    related_label_am: "ሕፃናት ክፍል",
  },
  {
    id: "youth",
    order: 2,
    title_am: "የሰንበት ት/ቤቱ የወጣቶች መርሃ ግብር",
    body_am:
      "ይህ ጉባኤ በሰንበት ት/ቤቱ ሥራ አስፈጻሚ ኮሚቴ የሚመራና ባሉት ክፍሎች አማካኝነት አገልግሎቱ የሚሸፈን ነው።",
  },
  {
    id: "professionals",
    order: 3,
    title_am: "የባለሥራዎች ጉባኤ",
    body_am:
      "ይህ ጉባኤ በጽህፈት ቤቱ ስር ሆኖ የሚመራ ሲሆን ሁሉም አገልግሎቱ በሰንበት ት/ቤቱ የአገልግሎት ክፍሎች የሚሸፈን ይሆናል።",
  },
  {
    id: "mesenad",
    order: 4,
    title_am: "የመሰናድ ግቢ ጉባኤ",
    body_am:
      "ተጠሪነቱ ለሰንበት ት/ቤቱ ሥራ አስፈጻሚ ኮሚቴ ሲሆን ከሰንበት ትምህርት ቤቱ አባላት እና ከመሰናድ ት/ቤት በሚወከሉ ተማሪዎች በሚቋቋም ኮሚቴ የሚመራ ሲሆን የመድረክ አገልግሎቱ በሰንበት ት/ቤቱ የሚሸፈን ሲሆን አጠቃላይ የገንዘብ ገቢና ወጪውን የሚቆጣጠረው ሰንበት ት/ቤቱ ነው።",
  },
  {
    id: "st-michael-tswa",
    order: 5,
    title_am: "የቅዱስ ሚካኤል የጽዋ ማህበር",
    body_am:
      "ተጠሪነቱ ለሰንበት ት/ቤቱ ሥራ አስፈጻሚ ኮሚቴ ሲሆን ከጽዋ ማህበሩ በሚመረጡ አባላት በሚቋቋም ኮሚቴ የሚመራ ሲሆን የመድረክ አገልግሎቱ በሰንበት ት/ቤቱ የሚሸፈን ሲሆን አጠቃላይ የገንዘብ ገቢና ወጪውን የሚቆጣጠረው ሰንበት ት/ቤቱ ነው።",
  },
];
