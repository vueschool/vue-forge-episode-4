<script setup lang="ts">
const { connect } = useWallet();
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
    <button class="mt-5 btn btn-primary" @click="connect">
      Connect Wallet
    </button>
  </div>
</template>
