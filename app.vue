<script setup lang="ts">
const { pollPendingRequests } = await usePact();

onMounted(() => {
  pollPendingRequests();
});
</script>

<template>
  <div class="relative flex flex-col items-center justify-start">
    <NuxtPage />
    <AppAlerts />
  </div>
</template>
