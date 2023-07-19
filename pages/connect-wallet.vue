<script setup>
import { useWallet } from '~/composables/useWallet'

const { connect, disconnect, account } = useWallet();
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
    <pre>
	    {{ account }}
    </pre>
    <button v-if="account" @click="disconnect">Disconnect</button>

    <button v-if="!account" @click="connect">Connect</button>
  </div>
</template>
