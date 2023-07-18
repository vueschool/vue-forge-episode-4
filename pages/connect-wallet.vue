<script setup>
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { configureChains, createConfig } from "@wagmi/core";
import { arbitrum, mainnet, polygon } from "@wagmi/core/chains";

console.log(mainnet);

const {
  public: { WALLET_CONNECT_PROJECT_ID },
} = useRuntimeConfig();

const chains = [arbitrum, mainnet, polygon];
const projectId = WALLET_CONNECT_PROJECT_ID;

console.log(projectId);

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3modal = new Web3Modal({ projectId }, ethereumClient);
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
    <w3m-core-button></w3m-core-button>
  </div>
</template>
