<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div class="relative flex flex-col items-center justify-start">
    <NavBar />
    <ProjectsForm class="mt-24" />
  </div>
</template>
