<script setup lang="ts">
const { balance, getBalance } = useWallet();

onMounted(async () => {
  await getBalance();
});
</script>

<template>
  <div class="form-control" v-if="balance">
    <span class="btn btn-sm bg-opacity-90"> KDA {{ balance }} </span>
  </div>
</template>
