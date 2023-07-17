<script setup lang="ts">
import { UuidT } from "~/types";
</script>

<template>
  <div class="relative flex flex-col items-center justify-start">
    <NavBar />
    <ProjectsDetails class="mt-24" :uuid="($route.params.uuid as UuidT)" />
  </div>
</template>
