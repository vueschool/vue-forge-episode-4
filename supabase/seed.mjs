import { config } from "dotenv";
config();

await new Promise((resolve) => {
  setTimeout(resolve, 2000);
});

import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

const { data, error } = await supabase.storage.createBucket("avatars", {
  public: true,
  allowedMimeTypes: ["image/png", "image/jpeg"],
  fileSizeLimit: 1024,
});

if (error) {
  throw new Error(error.message);
}
