<script setup lang="ts">
const colorMode = useColorMode();

const { pollPendingRequests } = await usePact()
colorMode.value = "cupcake";

onMounted(() => {
	pollPendingRequests();
})
</script>

<template>
  <div class="relative flex flex-col items-center justify-start">
    <NavBar />
    <NuxtPage />
    <AppAlerts />
  </div>
</template>
