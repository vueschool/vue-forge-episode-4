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

      <div class="relative">
        <input
          class="block w-full p-2 pl-6 mb-2 border rounded"
          type="text"
          v-model="amount"
        />
        <span class="absolute top-[50%] translate-y-[-50%] left-3">$</span>
      </div>
      <button class="btn btn-primary">Pledge Now</button>
    </label>
  </form>
</template>
