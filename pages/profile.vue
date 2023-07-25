<script setup lang="ts">
const user = useSupabaseUser();
const {connect, disconnect, isConnected, publicKey, balance} = useWallet()

</script>
<template>
  <div class="mt-24">
	  <h1 class="text-2xl">You've successfully registered 🎉</h1>
	  <p>
		  Download
		  <a
			  
			  href="https://chrome.google.com/webstore/detail/eckowallet/bofddndhbegljegmpmnlbhcejofmjgbn"
		  >
			  Ecko Wallet
		  </a>
		  or connect your existing wallet if you already have one.
	  </p>
	  
	  <div class="flex flex-col items-start justify-start mb-2">
		  <span class="font-bold">Current wallet connected:</span>
		  <span>{{ publicKey }}</span>
	  </div>
	  <div class="flex flex-col items-start justify-start mb-2">
		  <span class="font-bold">Current balance:</span>
		  <span><Money :amount="balance || 0" sign="$KDA" currency="other"/></span>
	  </div>
	  <button v-if="isConnected" class="btn-error btn" @click="disconnect">Disconnect Your Wallet</button>
	  <button v-else  class="btn-primary btn" @click="connect">Connect Your Wallet</button>
    <pre>{{ user }}</pre>
  </div>
</template>
