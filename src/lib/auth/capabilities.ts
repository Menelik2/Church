/**
 * Department & operational capabilities (§4.1 + role matrix)
 * Source: ማኅተመ ክርስቶስ organizational duties
 */

import type { UserRole } from "./require-admin";

export type DeptCode =
  | "sebabi"
  | "vice-sebabi"
  | "secretary"
  | "hisab"
  | "nebrat"
  | "timihirt"
  | "media"
  | "kutator"
  | "mezmur"
  | "kine-tibeb"
  | "hitsanat"
  | "genegnet"
  | "limat"
  | "advisory";

/** Human-readable duty summary per department role */
export const DEPT_DUTIES: Record<
  DeptCode,
  { title_am: string; duties_am: string; writeDomains: string[] }
> = {
  secretary: {
    title_am: "ፀሐፊ",
    duties_am:
      "የአባል መዝገብ፣ ስብሰባ፣ ቃለ ጉባኤ፣ ደብዳቤ እና ሰነዶችን ያስተዳድራል፤ በተፈቀደለት መጠን።",
    writeDomains: ["meetings", "correspondence", "records", "member_registry_view"],
  },
  hisab: {
    title_am: "የሒሳብ ክፍል ኃላፊ",
    duties_am: "ገቢ፣ ወጪ፣ መዋጮ፣ በጀት እና የሒሳብ ሪፖርት ይመዘግባል።",
    writeDomains: ["finance", "contributions", "budget", "finance_reports"],
  },
  nebrat: {
    title_am: "የንብረት ክፍል ኃላፊ",
    duties_am:
      "ቋሚና አላቂ ንብረቶችን፣ ውሰትን፣ መመለሻን እና ጥገናን ይከታተላል።",
    writeDomains: ["inventory", "checkout", "maintenance"],
  },
  timihirt: {
    title_am: "የትምህርት ክፍል ኃላፊ",
    duties_am: "ኮርስ፣ ሥልጠና፣ ተማሪዎች፣ የማጠናቀቂያ መዝገብ ያስተዳድራል።",
    writeDomains: ["classes", "courses", "students", "completion"],
  },
  media: {
    title_am: "የሚዲያና ሰነድ ክፍል",
    duties_am:
      "ፎቶ፣ ድምፅ፣ ቪዲዮ፣ ዜና፣ የታሪክ ቅርስ እና ማስታወቂያ ያስተዳድራል።",
    writeDomains: ["media", "announcements", "heritage"],
  },
  kutator: {
    title_am: "የቁጥጥር ክፍል",
    duties_am:
      "የተፈቀደለትን የተገኝነት ክትትል እና በደንቡ የተጠቀሱ የክትትል ሂደቶችን ይመዘግባል።",
    writeDomains: ["attendance_oversight", "discipline_records"],
  },
  sebabi: {
    title_am: "ሰብሳቢ",
    duties_am:
      "የተሰጡትን የአመራር ሥራዎች፣ ሪፖርቶችና ውሳኔዎች ይከታተላል።",
    writeDomains: ["approvals", "correspondence", "reports", "decisions"],
  },
  "vice-sebabi": {
    title_am: "ምክትል ሰብሳቢ",
    duties_am:
      "የተሰጡትን የአመራር ሥራዎች፣ ሪፖርቶችና ውሳኔዎች ይከታተላል።",
    writeDomains: ["approvals", "reports", "tasks"],
  },
  advisory: {
    title_am: "አማካሪ ቦርድ / ሰበካ ጉባኤ ተወካይ",
    duties_am:
      "በደንቡና በተሰጠው ሥልጣን መሠረት ተገቢ መረጃ ይመለከታል (እንደ አብዛኛው ንባብ ብቻ)።",
    writeDomains: [],
  },
  mezmur: {
    title_am: "መዝሙር ክፍል",
    duties_am: "መዝሙር፣ ልምምድ፣ አገልግሎት።",
    writeDomains: ["choir", "rehearsal"],
  },
  "kine-tibeb": {
    title_am: "ኪነጥበብ",
    duties_am: "ኪነጥበብ ዝግጅቶች።",
    writeDomains: ["arts"],
  },
  hitsanat: {
    title_am: "ሕፃናት ክፍል",
    duties_am: "የሕፃናት ቡድንና እንቅስቃሴ (ልዩ ጥበቃ)።",
    writeDomains: ["children"],
  },
  genegnet: {
    title_am: "ግንኙነት",
    duties_am: "አዲስ አባላትና ግንኙነት።",
    writeDomains: ["relations"],
  },
  limat: {
    title_am: "ልማትና በጎ አድራጎት",
    duties_am: "ፕሮጀክትና በጎ አድራጎት።",
    writeDomains: ["charity"],
  },
};

export function isLeadershipRole(role: UserRole): boolean {
  return role === "super_admin" || role === "admin";
}

/** System/CMS admin alone does not grant decision authority */
export function isSystemAdminOnly(role: UserRole): boolean {
  return role === "editor";
}

export function canViewFinance(
  role: UserRole,
  deptCodes: string[] = []
): boolean {
  if (isLeadershipRole(role)) return true;
  return deptCodes.includes("hisab");
}

export function canManageDiscipline(
  role: UserRole,
  deptCodes: string[] = []
): boolean {
  if (isLeadershipRole(role)) return true;
  return deptCodes.includes("kutator");
}

export function canDecideServiceOrPunishment(role: UserRole): boolean {
  // Not editor / not system-admin-only; requires operational leadership
  return isLeadershipRole(role);
}

export function canSecretaryScope(
  role: UserRole,
  deptCodes: string[] = []
): boolean {
  if (isLeadershipRole(role)) return true;
  return deptCodes.includes("secretary");
}

export function canManageProperty(
  role: UserRole,
  deptCodes: string[] = []
): boolean {
  if (isLeadershipRole(role)) return true;
  return deptCodes.includes("nebrat");
}

export function canManageEducation(
  role: UserRole,
  deptCodes: string[] = []
): boolean {
  if (isLeadershipRole(role)) return true;
  return deptCodes.includes("timihirt");
}

export function canManageMedia(
  role: UserRole,
  deptCodes: string[] = []
): boolean {
  if (isLeadershipRole(role)) return true;
  return deptCodes.includes("media");
}

export function canAccessChildren(
  role: UserRole,
  deptCodes: string[] = []
): boolean {
  if (isLeadershipRole(role)) return true;
  return deptCodes.includes("hitsanat");
}

export function canAccessWorkspace(
  role: UserRole,
  workspaceCode: string,
  deptCodes: string[] = []
): boolean {
  if (role === "super_admin" || role === "admin" || role === "editor") {
    return true;
  }
  if (role === "department_manager") {
    return deptCodes.includes(workspaceCode);
  }
  return false;
}

export function canWriteWorkspace(
  role: UserRole,
  workspaceCode: string,
  deptCodes: string[] = []
): boolean {
  if (isLeadershipRole(role)) return true;
  if (role === "department_manager" && deptCodes.includes(workspaceCode)) {
    // Advisory is read-only
    if (workspaceCode === "advisory") return false;
    return true;
  }
  return false;
}
