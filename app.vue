<script setup lang="ts">
const colorMode = useColorMode();

colorMode.value = "cupcake";
</script>

<template>
  <div class="relative flex flex-col items-center justify-start">
    <NavBar />
    <NuxtPage />
    <AppAlerts />
  </div>
</template>
