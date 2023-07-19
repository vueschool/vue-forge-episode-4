<script setup lang="ts">

const { connect: walletConnect, disconnect, account, balance, getBalance } = useWallet();
import { getClient, IPactCommand, Pact } from '@kadena/client'
import { Ref } from 'vue'
// walletConnect()
// const { connect, disconnect, accounts, session } = useWalletConnect();
// const getBalance = async () => {
// 	console.log(account.value)
// 	const currentAccount = accounts.value?.[1].replace('kadena:testnet04', 'k')
// 	console.log(currentAccount)
// 	const networkId = ref('testnet04')
// 	const chain = ref<Ref<IPactCommand['meta']['chainId']>>('0')
//
// 	if (currentAccount) {
// 		const client = getClient()
// 		const transaction = Pact.builder
// 			.execution((Pact.modules as any).coin['get-balance'](currentAccount))
// 			.setMeta({ sender: currentAccount, chainId: chain.value })
// 			.setNetworkId(networkId.value)
// 			.createTransaction()
//
// 		const response = await client.dirtyRead(transaction)
// 		balance.value = response.result.data
// 		console.log(response)
// 	}
// };



</script>
<template>
  <div class="mt-24">
    <h1 class="text-2xl">You've successfully registered 🎉</h1>
    <p>
      Download
      <a
        href="https://chrome.google.com/webstore/detail/eckowallet/bofddndhbegljegmpmnlbhcejofmjgbn"
        >Ecko Wallet</a
      >
      or connect your existing wallet if you already have one.
    </p>
	  
	  <div>Balance: {{ balance }}</div>
	  
	  <button class="btn-primary" v-if="account" @click="getBalance">Get Balance</button>
    <pre>
	    {{ account }}
    </pre>
    <button v-if="account" @click="disconnect">Disconnect</button>

    <button v-if="!account" @click="walletConnect">Connect</button>
  </div>
</template>
