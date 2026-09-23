/** Supabase database shape — extend as tables grow */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: string;
          created_at: string;
        };
      };
      articles: {
        Row: {
          id: string;
          number: number;
          title_am: string;
          body_am: string;
          slug: string;
          published: boolean;
        };
      };
      servants: {
        Row: {
          id: string;
          full_name_am: string;
          status: string;
        };
      };
      membership_applications: {
        Row: {
          id: string;
          full_name_am: string;
          status: string;
        };
      };
      wedding_requests: {
        Row: {
          id: string;
          groom_name: string;
          bride_name: string;
          status: string;
        };
      };
    };
  };
}
