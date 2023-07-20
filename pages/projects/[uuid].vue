<script setup lang="ts">
import { UuidT } from "~/types";

const projectId = computed(() => useRoute().params.uuid as UuidT);
</script>

<template>
  <ProjectsDetails v-if="projectId" class="mt-24" :uuid="projectId" />
</template>
