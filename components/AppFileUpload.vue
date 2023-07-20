<script setup lang="ts">
import { nanoid } from "nanoid";

const props = defineProps<{
  bucket: string;
  hint?: string;
  label?: string;
}>();

const emit = defineEmits<{
  (e: "file:uploaded", payload: string): void;
}>();

const { storage } = useSupabaseClient();

async function handleChange(e: Event) {
  const el = e.target as HTMLInputElement;
  if (!el.files?.length) return;
  const file = el.files[0];
  const { data, error } = await storage
    .from(props.bucket)
    .upload(`${nanoid(6)}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    console.log(error.message);
    throw createError({ message: "failed to upload image" });
  } else {
    const { data: urlData } = await storage
      .from(props.bucket)
      .getPublicUrl(data.path);

    emit("file:uploaded", urlData.publicUrl);
  }
}
</script>
<template>
  <div class="w-full max-w-full form-control">
    <label v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <input
      @change="handleChange"
      ref="fileInput"
      type="file"
      class="w-full file-input file-input-bordered"
    />
    <label v-if="hint" class="label">
      <span class="text-gray-400 label-text-alt">{{ hint }}</span>
    </label>
  </div>
</template>
