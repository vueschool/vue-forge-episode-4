<script setup>
const { connect, session, disconnect } = useWalletConnect();
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
    {{ session }}
    <button v-if="session" @click="disconnect">Disconnect</button>

    <button v-if="!session" @click="connect">Connect</button>
  </div>
</template>
