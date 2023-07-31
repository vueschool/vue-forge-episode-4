<script setup lang="ts">
import { useTimeAgo } from "@vueuse/core";

type TimeAgoProps = {
  date?: string;
};
const props = defineProps<TimeAgoProps>();

const date = computed(() => (props.date ? new Date(props.date).toString() : ""));
const ago = useTimeAgo(date);
</script>

<template>
  <div class="flex gap-5">
    {{ ago }}
  </div>
</template>
