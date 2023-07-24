<script setup lang="ts">
const { alerts, success, error, warning, info, dismiss } = useAlerts();
</script>
<template>
  <div
    class="fixed bottom-0 z-10 w-full p-2 right-2 sm:p-0 sm:w-auto sm:bottom-5"
  >
    Alerts should show up here
  </div>
</template>
