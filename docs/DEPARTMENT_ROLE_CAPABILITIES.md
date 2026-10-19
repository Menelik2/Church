# የክፍል ሚና ችሎታዎች — Department Role Capabilities

Implemented in:
- `supabase/migrations/021_department_role_capabilities.sql`
- `src/lib/auth/capabilities.ts`
- `src/lib/auth/require-admin.ts`
- Workspace pages under `/admin/workspace`

## ሚናዎችና ተግባራት

| ኮድ | ሚና | ተግባር |
|-----|-----|--------|
| `secretary` | ፀሐፊ | የአባል መዝገብ፣ ስብሰባ፣ ቃለ ጉባኤ፣ ደብዳቤ፣ ሰነዶች (በተፈቀደለት መጠን) |
| `hisab` | የሒሳብ ክፍል ኃላፊ | ገቢ፣ ወጪ፣ መዋጮ፣ በጀት፣ የሒሳብ ሪፖርት |
| `nebrat` | የንብረት ክፍል ኃላፊ | ቋሚ/አላቂ ንብረት፣ ውሰት፣ መመለሻ፣ ጥገና |
| `timihirt` | የትምህርት ክፍል ኃላፊ | ኮርስ፣ ሥልጠና፣ ተማሪዎች፣ የማጠናቀቂያ መዝገብ |
| `media` | ሚዲያና ሰነድ | ፎቶ፣ ድምፅ፣ ቪዲዮ፣ ዜና፣ ቅርስ፣ ማስታወቂያ |
| `kutator` | ቁጥጥር ክፍል | የተገኝነት ክትትል፣ በደንቡ የተጠቀሱ የክትትል ሂደቶች (መዝገብ) |
| `sebabi` / `vice-sebabi` | ሰብሳቢ / ምክትል | የአመራር ሥራ፣ ሪፖርት፣ ውሳኔ |
| `advisory` | አማካሪ ቦርድ / ሰበካ ጉባኤ | ተገቢ መረጃ **ንባብ** (በደንብና ሥልጣን) |
| *(system)* | ሲስተም አስተዳዳሪ | ቴክኒክ፣ ተጠቃሚ መለያ፣ ደህንነት — **ብቻውን የውሳኔ ሥልጣን አይሰጥም** |

## የስርዓት አስተዳዳሪ vs ውሳኔ

- `editor` = CMS ብቻ (ይዘት) — አገልጋይነት/ቅጣት/አባልነት ማጽደቅ **አይችልም**
- `super_admin` = ቴክኒክ + አስፈላጊ አመራር bootstrap
- `admin` = የአሠራር አመራር (ፋይናንስ፣ ዲስፕሊን ውሳኔ፣ አባልነት)
- የመጨረሻ የአገልጋይ ሁኔታ/ቅጣት: `can_decide_service_or_punishment()` → leadership ብቻ

## መመደብ (assignment)

```sql
-- Primary department
UPDATE profiles
SET role = 'department_manager', department_code = 'hisab'
WHERE email = 'finance@example.com';

-- Extra roles
INSERT INTO profile_department_roles (profile_id, department_code, can_write)
SELECT id, 'secretary', true FROM profiles WHERE email = '...';
```

## App guards

```ts
await requireFinance();      // leadership | hisab
await requireDiscipline();   // leadership | kutator
await requireSecretary();    // leadership | secretary
await requireProperty();     // leadership | nebrat
await requireEducation();    // leadership | timihirt
await requireMediaDept();    // leadership | media
await requireWorkspaceAccess('hisab');
await requireServiceDecision(); // leadership only
```

## Apply migrations

1. `020_permission_rules_4_1.sql`
2. `021_department_role_capabilities.sql`
