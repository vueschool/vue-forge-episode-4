<script setup lang="ts">
const{ balance, getBalance, isConnected, checkStatus, connect } = useWallet()
onMounted(async () => await checkStatus())

</script>

<template>
	<div  class="form-control">
		<span v-if="isConnected" class=" rounded-r-full text-sm font-bold flex items-center justify-center border border-white btn-sm btn-secondary leading-5 text-white bg-opacity-90 relative -left-5 rounded-l-none z-0">
	      $KDA {{ balance }}
		</span>
		<button @click="connect" v-else class="btn border border-white btn-sm btn-secondary leading-5 text-white bg-opacity-90 relative -left-5 rounded-l-none z-0">
			Connect Your Wallet
		</button>
	</div>
</template>
