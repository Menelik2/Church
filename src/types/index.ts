export type UserRole = "super_admin" | "admin" | "editor" | "visitor";

export type Article = {
  id: string;
  number: number;
  title_am: string;
  title_en?: string | null;
  body_am: string;
  body_en?: string | null;
  slug: string;
  published: boolean;
};

export type Department = {
  id: string;
  name_am: string;
  name_en?: string | null;
  slug: string;
  description_am?: string | null;
  sort_order: number;
};
