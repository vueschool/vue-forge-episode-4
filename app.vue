<script setup lang="ts">
const colorMode = useColorMode();

colorMode.value = 'cupcake';
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>
