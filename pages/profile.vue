<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const user = useSupabaseUser();
const {
  connect,
  disconnect,
  isConnected,
  publicKey,
  balance,
  isXWalletInstalled,
} = useWallet();

const fromRegisterPage = useRoute().query.from === "register";
</script>
<template>
  <div class="mt-24">
    <h1 v-if="fromRegisterPage" class="mb-5 text-2xl">
      You've successfully registered 🎉
    </h1>

    <h1 class="mb-5 text-2xl">Wallet Info</h1>
    <a
      v-if="!isXWalletInstalled"
      href="https://chrome.google.com/webstore/detail/eckowallet/bofddndhbegljegmpmnlbhcejofmjgbn"
      class="btn-error btn"
      @click="disconnect"
      target="_blank"
      >Download Ecko Wallet</a
    >
    <div v-else>
      <div v-if="isConnected">
        <div class="flex flex-col items-start justify-start mb-2">
          <span class="font-bold">Current wallet connected:</span>
          <span>{{ publicKey }}</span>
        </div>
        <div class="flex flex-col items-start justify-start mb-2">
          <span class="font-bold">Current balance:</span>
          <span
            ><Money :amount="balance || 0" sign="$KDA" currency="other"
          /></span>
        </div>
        <button class="btn-error btn" @click="disconnect">
          Disconnect Your Wallet
        </button>
      </div>
      <button v-else class="btn-primary btn" @click="connect">
        Connect Your Wallet
      </button>
    </div>
    <h1 class="mt-5 text-2xl">Supabase User</h1>
    <pre>{{ user }}</pre>
  </div>
</template>
