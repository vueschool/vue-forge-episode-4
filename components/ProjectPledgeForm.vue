<script setup lang="ts">
const amount = ref("");
function handlePledge() {
  if (!amount.value) return;
  // send pledge amount to blockchain
  useAlerts().success("Thanks for pledging!");
}
</script>
<template>
  <form @submit.prevent="handlePledge">
    <label>
      <div>How much would you like to pledge?</div>

      <input
        class="block w-full p-2 mb-2 border rounded"
        type="text"
        v-model="amount"
      />
      <button class="btn btn-primary">Pledge Now</button>
    </label>
  </form>
</template>
