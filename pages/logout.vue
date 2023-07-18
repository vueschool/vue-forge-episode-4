<script setup lang="ts">
const client = useSupabaseAuthClient();
client.auth.signOut();
navigateTo("/");
</script>
<template>
  <div></div>
</template>
