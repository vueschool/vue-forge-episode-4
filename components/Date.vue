<script setup lang="ts">
type DateProps = {
  date?: string | number | Date;
};

const props = defineProps<DateProps>();

const date = computed(() => new Date(props.date || ""));
</script>

<template>
  <span v-if="props.date">
    {{ date.toLocaleString() }}
  </span>
</template>
