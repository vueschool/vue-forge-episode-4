<script setup lang="ts">
import { useGetBalance } from '~/composables/useGetBalance'
import { useWallet } from '~/composables/useWallet'

const useWalletInstance = useWallet()
const {balance} = useWalletInstance
// {initialized, connect, account, getBalance, balance }

console.log(balance)

onMounted(async () => {
	// await connect()
	
	await useWalletInstance.getBalance()
	
	
	// const response = await kadena.request({
	// 	method: 'kda_requestAccount',
	// 	networkId: NETWORKID,
	// });
	//
	// await getBalance(response.wallet.account)
	console.log(useWalletInstance.balance.value)
})

</script>

<template>
	<div class="form-control">
		<span class="btn btn-sm bg-opacity-90">
	      $KDA {{ useWalletInstance.balance }}
      </span>
	</div>
</template>
