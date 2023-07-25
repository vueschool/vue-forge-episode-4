<script setup lang="ts">
const { fund } = await usePact()
const props = defineProps<{
	projectId: string;
}>();
const amount = ref("");
async function handlePledge() {
  if (!amount.value) return;
	
	await fund({
		id: props.projectId,
		amount: amount.value,
	})
  // send pledge amount to blockchain
  useAlerts().success("This is a placeholder, right now nothing is happening", {
    title: "Thanks for pledging!",
  });
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
