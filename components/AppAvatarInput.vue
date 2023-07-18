<script setup lang="ts">
import { nanoid } from "nanoid";

const props = withDefaults(
  defineProps<{
    bucket?: string;
  }>(),
  {
    bucket: "avatars",
  }
);
const placeholder =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";
const src = ref<string | File>("");
// @ts-ignore
const { base64 } = useBase64(src);
const url = computed(() => (src.value ? base64.value : placeholder));

const { storage } = useSupabaseClient();

async function handleChange(e: Event) {
  const el = e.target as HTMLInputElement;
  if (!el.files?.length) return;
  const file = el.files[0];
  src.value = file;
  const { data, error } = await storage
    .from(props.bucket)
    .upload(`${nanoid(6)}${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
}
</script>
<template>
  <div class="avatar">
    <div class="relative w-24 border-2 rounded-full dark:border-gray-700">
      <label for="avatar" class="cursor-pointer">
        <div class="absolute bottom-3 right-1">✍️</div>

        <img :src="url" />
      </label>
      <input
        id="avatar"
        class="hidden"
        type="file"
        accept="image/png, image/jpeg"
        @change="handleChange"
      />
    </div>
  </div>
</template>
