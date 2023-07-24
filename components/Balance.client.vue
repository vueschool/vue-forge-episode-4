<script setup lang="ts">
const { connect } = await useWalletConnect()
const{ balance, getBalance, all, initialized, initialize } = useWallet()

// {initialized, connect, account, getBalance, balance }
watch(balance, (newBalance) => {
	console.log(newBalance)
})
console.log(balance)

onMounted(async () => {
	await connect()
	await getBalance()
	console.log(balance.value)
})

</script>

<template>
	<div class="form-control">
		<span class="btn btn-sm bg-opacity-90">
	      $KDA {{ balance }}
      </span>
	</div>
</template>
