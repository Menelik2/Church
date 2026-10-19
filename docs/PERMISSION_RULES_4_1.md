# 4.1 የፈቃድ አስፈላጊ ሕጎች — Permission Rules

Authoritative operational constraints for ማኅተመ ክርስቶስ digital platform.
Implemented in `supabase/migrations/020_permission_rules_4_1.sql` and `src/lib/auth/require-admin.ts`.

## Rules

1. **የሒሳብ መረጃ** — Accounting/financial data is visible only to authorized accounting and leadership users.
2. **የአባል የግል መረጃ** — Member personal information is not visible to the public.
3. **የቁጥጥርና የሥነ ምግባር** — Supervision and ethics matters are visible only to the relevant authorized bodies.
4. **የስርዓት አስተዳዳሪ** — The system/content administrator role alone does **not** grant authority to decide a person’s service (ministry) or punishment.
5. **ከPDF የሚመጡ ውሳኔዎች** — Decision processes from the bylaws PDF are executed by authorized humans; the software does **not** replace those decisions.
6. **የልጆች መረጃና ፎቶ** — Children’s data and photos are held under special access protection.

## Role → capability matrix

| Capability | super_admin | admin | editor | department_manager | member / visitor |
|------------|:-----------:|:-----:|:------:|:------------------:|:----------------:|
| Content CMS (articles, announcements, events) | ✓ | ✓ | ✓ | — | — |
| View member PII (servants, applications) | ✓ | ✓ | ✓* | ✓* | — |
| **Finance** (contributions, dept finance) | ✓ | ✓ | — | — | — |
| **Discipline** cases | ✓ | ✓ | — | — | — |
| **Decide** service status / punishment | ✓ | ✓ | — | — | — |
| **Children** groups & activities | ✓ | ✓ | — | hitsanat only | — |
| Promote roles / delete profiles | ✓ | — | — | — | — |
| Public site | — | — | — | — | read published only |

\* Editor may *read* operational lists for content context but cannot change servant status or discipline outcomes (RLS + app guards).

## Database helpers

| Function | Meaning |
|----------|---------|
| `is_leadership()` | `super_admin` \| `admin` |
| `can_view_finance()` | Finance tables |
| `can_manage_discipline()` | Disciplinary cases |
| `can_decide_service_or_punishment()` | Servant status & punishment decisions |
| `can_access_children()` | Children tables |
| `can_view_member_pii()` | Staff access to personal data |

## Application layer

Use the matching guards in server components / actions:

```ts
import {
  requireAdmin,
  requireFinance,
  requireDiscipline,
  requireServiceDecision,
  requireChildrenAccess,
} from "@/lib/auth/require-admin";

// Contributions page
await requireFinance();

// Discipline page
await requireDiscipline();

// Membership approve / servant status change
await requireServiceDecision();
```

## Human decisions (software does not auto-decide)

- Membership approve/reject, servant status changes, and discipline outcomes are **recorded** by authorized users.
- Columns `decided_by`, `decision_note`, `status_changed_by`, `status_change_note` support an audit trail.
- Do not add automated rules that suspend, dismiss, or approve without an explicit staff action.

## Apply migration

In Supabase SQL Editor (after 001–019):

```sql
-- paste contents of supabase/migrations/020_permission_rules_4_1.sql
```

Or via CLI if linked:

```bash
supabase db push
```
