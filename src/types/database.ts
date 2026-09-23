export type UserRole =
  | "super_admin"
  | "admin"
  | "editor"
  | "department_manager"
  | "member"
  | "visitor";

export interface Profile {
  id: string;
  email: string | null;
  full_name_am: string | null;
  full_name_en: string | null;
  role: UserRole;
  department_id: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  article_number: number;
  title_am: string;
  title_en: string | null;
  slug: string;
  content_am: string;
  content_en: string | null;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  slug: string;
  title_am: string;
  title_en: string | null;
  description_am: string | null;
  description_en: string | null;
  responsibilities_am: string | null;
  responsibilities_en: string | null;
  order_index: number;
  published: boolean;
}

export interface Program {
  id: string;
  slug: string;
  title_am: string;
  title_en: string | null;
  description_am: string | null;
  description_en: string | null;
  order_index: number;
  published: boolean;
}

export interface Announcement {
  id: string;
  title_am: string;
  title_en: string | null;
  slug: string;
  body_am: string;
  body_en: string | null;
  category: string | null;
  is_featured: boolean;
  published: boolean;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title_am: string;
  title_en: string | null;
  slug: string;
  description_am: string | null;
  description_en: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}
