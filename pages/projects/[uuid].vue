<script setup lang="ts">
import { UuidT } from "~/types";
</script>

<template>
  <ProjectsDetails class="mt-24" :uuid="($route.params.uuid as UuidT)" />
</template>
