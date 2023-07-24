const initialized = ref(false);
const balance = ref<string | null>(null);
const networkId = ref("testnet04");
const chain = ref("0");
const instance = ref(null);
const publicKey = ref(null);
const account = ref("");
const connectedSites = ref([]);
const isInstalled = ref(false);

export function useFakeWallet() {
  watch(isInstalled, (value) => {
    if (!value) {
      console.warn("Kadena Wallet is not installed");
    }
  });
  const checkIdWalletIsInstalled = () => {
    initialized.value = true;
  };

  const initialize = async () => {
    checkIdWalletIsInstalled();
  };

  const connect = async () => {
    const confirmed = confirm(
      "Wallet functionality not complete. Choose Ok to similuate connecting web 3 wallet"
    );
    return confirmed;
  };

  const requestAccount = async () => {
    if (isInstalled.value && instance.value) {
      return true;
    }
  };

  const checkStatus = async () => {
    return true;
  };

  const disconnect = async () => {
    if (isInstalled.value && instance.value) {
      alert("disconnected wallet");
    }
  };

  const getBalance = async () => {
    balance.value = "600";
    return;
  };

  watch(account, async (value) => {
    if (value) {
      await getBalance();
    }
  });

  initialize();

  return {
    initialize,
    connect,
    disconnect,
    requestAccount,
    checkStatus,
    checkIdWalletIsInstalled,
    getBalance,
    balance: computed(() => balance.value),
    initialized: computed(() => initialized.value),
    account: computed(() => account.value),
    publicKey: computed(() => publicKey.value),
    connectedSites: computed(() => connectedSites.value),
    chain: computed(() => chain.value),
    networkId: computed(() => networkId.value),
    instance: computed(() => instance.value),
    isXWalletInstalled: computed(() => isInstalled.value),
  };
}
