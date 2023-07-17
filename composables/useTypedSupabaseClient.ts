import type { Database } from "@/supabase/schema";
export const useTypedSupabaseClient = () => {
  return useSupabaseClient<Database>();
};
