<script setup lang="ts">
const { balance, isConnected, checkStatus, connect } = useWallet();
onMounted(async () => await checkStatus());
</script>

<template>
  <div class="form-control">
    <span
      v-if="isConnected"
      class="relative z-0 flex items-center justify-center text-sm font-bold leading-5 text-white border border-white rounded-l-none rounded-r-full btn-sm btn-secondary bg-opacity-90 -left-5"
    >
      $KDA {{ balance }}
    </span>
    <button
      @click="connect"
      v-else
      class="relative z-0 leading-5 text-white border border-white rounded-l-none btn btn-sm btn-secondary bg-opacity-90 -left-5"
    >
      Connect Your Wallet
    </button>
  </div>
</template>
