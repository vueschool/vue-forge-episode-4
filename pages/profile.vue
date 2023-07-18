<script setup lang="ts">
const user = useSupabaseUser();
</script>
<template>
  <div class="mt-24">
    <pre>{{ user }}</pre>
  </div>
</template>
