import { getClient, IPactCommand, Pact } from "@kadena/client";
import { ICommand } from "@kadena/types";

const initialized = ref(false);
const balance = ref<string | null>(null);
const networkId = ref("fast-development");
const chain = ref<IPactCommand["meta"]["chainId"]>("0");
const instance = ref<any>(null);
const publicKey = ref<null | string>(null);
const account = ref<null | string>("");
const isInstalled = ref(false);
const isConnected = computed(() => account.value && publicKey.value);

export function useWallet() {
  watch(isInstalled, (value) => {
    if (!value) {
      console.warn("Kadena Wallet is not installed");
    }
  });
  const checkIfWalletIsInstalled = () => {
    if (initialized.value) return;
    // @ts-expect-error - ecko wallet (kadena) may not be installed
    const { kadena } = window;
    isInstalled.value = Boolean(kadena && kadena.isKadena);
    instance.value = kadena;
    initialized.value = true;
  };

  const connect = async () => {
    if (isInstalled.value && instance.value) {
      const { account, status } = await instance?.value.request({
        method: "kda_connect",
        networkId: networkId.value,
      });

      if (status === "success") {
        setAccount(account);
      }

      return { account, status };
    }
  };

  const setAccount = (data: {
    account: string | null;
    publicKey: string | null;
  }) => {
    account.value = data.account;
    publicKey.value = data.publicKey;
  };

  const checkStatus = async () => {
    if (isInstalled.value && instance.value) {
      const { account, status } = await instance?.value.request({
        method: "kda_checkStatus",
        networkId: networkId.value,
      });
      if (status === "success") {
        setAccount(account);
      }

      return { account, status };
    }
  };

  const disconnect = async () => {
    if (isInstalled.value && instance.value) {
      if (isConnected.value) {
        const response = await instance?.value.request({
          method: "kda_disconnect",
          networkId: networkId.value,
        });
        console.log("disconnect response", response);
        setAccount({ account: null, publicKey: null });
        return response;
      }
    }
  };

  const getBalance = async () => {
    if (account.value) {
      // Exercise 1 starts here
      // Use the Kadena Client to get the balance
      const client = getClient(
        ({ chainId }) =>
          `http://127.0.0.1:8080/chainweb/0.0/fast-development/chain/${chainId}/pact`
      );
      const transaction = Pact.builder
        .execution(Pact.modules.coin["get-balance"](account.value))
        .setMeta({ sender: account.value, chainId: chain.value })
        .setNetworkId(networkId.value)
        .createTransaction();

      const { result } = await client.dirtyRead(transaction);

      if (result.status === "failure") {
        throw new Error(
          `Can't get balance. Account (${account.value}) not found on network: ${networkId.value} and chain: ${chain.value}`
        );
      }

      balance.value = result.data as string;
    }

    return balance.value;
  };

  const signTransaction = async (transaction: any): Promise<ICommand> => {
    const response = await instance.value?.request({
      method: "kda_requestQuickSign",
      data: {
        networkId: networkId.value,
        commandSigDatas: [
          {
            sigs: [
              {
                pubKey: publicKey.value,
                sig: undefined,
              },
            ],
            cmd: transaction.cmd,
          },
        ],
      },
    });

    if (transaction.hash !== response?.quickSignData?.[0]?.outcome?.hash) {
      throw Error("Hashes do not match!");
    }

    return {
      cmd: transaction.cmd,
      sigs: response?.quickSignData?.[0]?.commandSigData?.sigs,
      hash: response?.quickSignData?.[0]?.outcome?.hash,
    };
  };

  watch(account, async (value) => {
    if (value) {
      await getBalance();
    }
  });

  checkIfWalletIsInstalled();
  return {
    connect,
    disconnect,
    checkStatus,
    signTransaction,

    balance: computed(() => balance.value),
    isConnected,
    account: computed(() => account.value),
    publicKey: computed(() => publicKey.value),
    chain: computed(() => chain.value),
    networkId: computed(() => networkId.value),
    instance: computed(() => instance.value),
    isXWalletInstalled: computed(() => isInstalled.value),
  };
}
