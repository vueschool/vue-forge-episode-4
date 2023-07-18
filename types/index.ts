import type { Database } from "@/supabase/schema";
export type UuidT = string;

export type CategoryT = Database["public"]["Tables"]["categories"]["Row"];

export type ProjectT = Database["public"]["Tables"]["projects"]["Row"] & {
  category?: CategoryT;
};

export type PaginationT = {
  total: number;
  page: number;
  limit: number;
  pages: number;
  isNextAvailable: boolean;
  isPrevAvailable: boolean;
  next: number | null;
  prev: number | null;
};

export type ApiResponseT = {
  data: any;
  pagination: PaginationT;
};
