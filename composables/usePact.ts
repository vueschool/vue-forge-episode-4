import {
  createWalletConnectQuicksign,
  getClient,
  ICommandResult,
  IPactCommand,
  isSignedCommand,
  literal,
  Pact,
  readKeyset,
} from "@kadena/client";
import { ExtractType } from "@kadena/client/lib/commandBuilder/commandBuilder";
import { ICapabilityItem } from "@kadena/client/lib/interfaces/IPactCommand";
import { PactNumber } from "@kadena/pactjs";
import Client from "@walletconnect/sign-client";
import SignClient from "@walletconnect/sign-client";
import { SessionTypes } from "@walletconnect/types";
import { nanoid } from "nanoid";
import { RemovableRef, useStorage } from "@vueuse/core";

const kadenaClient = getClient(
  ({ chainId }) =>
    `http://127.0.0.1:8080/chainweb/0.0/fast-development/chain/${chainId}/pact`
);
const { chain, networkId, isConnected, publicKey } = useWallet();
export const usePact = async () => {
  const { signTransaction, connect, networkId, chain } = useWallet();
  const pendingRequestsKeys: RemovableRef<
    Record<string, { requestKey: string; type: string }>
  > = useStorage("pendingRequestsKeys", {});

  type Key = string;
  type Account = `${"k" | "w"}:${string}` | string;
  const keyFromAccount = (account: Account): string => {
    return account.split(":")[1];
  };

  type Sender = {
    account: Account;
    publicKey: Key;
  };

  type TFund = {
    projectId: string;
    funder: string;
    amount: number;
  };
  type TProject = {
    id: string;
    name: string;
    sender: Sender;
    dates: {
      startsAt: Date;
      finishesAt: Date;
    };
    hardCap: number;
    softCap: number;
    keyset: string;
  };

  const createProjectObject = ({
    id,
    name,
    sender,
    dates,
    hardCap,
    softCap,
    keyset,
  }: TProject) => {
    const cmd = Pact.modules["free.crowdfund"]["create-project"](
      id,
      name,
      literal("coin"),
      new PactNumber(hardCap).toPactDecimal(),
      new PactNumber(softCap).toPactDecimal(),
      new Date(dates.startsAt),
      new Date(dates.finishesAt),
      sender.account,
      readKeyset(keyset)
    );

    return cmd;
  };
  type TTransactionOptions = {
    networkId?: string;
    chain?: IPactCommand["meta"]["chainId"];
  };

  const createFundObject = ({ projectId, funder, amount }: TFund) => {
    return Pact.modules["free.crowdfund"]["fund-project"](
      projectId,
      funder,
      new PactNumber(amount).toPactDecimal()
    );
  };

  const _getOptions = (
    options?: TTransactionOptions | TSignTransactionOptions
  ) => {
    return {
      networkId: options?.networkId || networkId.value,
      chain: options?.chain || chain.value,
    };
  };

  const createTransaction = (
    executionObject: any,
    keyset: string,
    sender: Sender,
    options?: TTransactionOptions,
    capabilities?: (withCapability: ExtractType<TCommand>) => ICapabilityItem[]
  ) => {
    const { chain: chainId, networkId } = _getOptions(options);

    return Pact.builder
      .execution(executionObject)
      .addKeyset(keyset, "keys-all", sender.publicKey)
      .setNetworkId(networkId) //fast-development - https://github.com/kadena-community/crowdfund
      .setMeta({ chainId, sender: sender.account })
      .addSigner(sender.publicKey, capabilities)
      .createTransaction();
  };

  const createSenderObject = (publicKey: Key): Sender => {
    return {
      account: `k:${publicKey}`,
      publicKey: publicKey,
    };
  };
  type TSignTransactionOptions = {
    networkId?: string;
    chain?: IPactCommand["meta"]["chainId"];
  };

  const submitCommand = async (signedTransaction: any) => {
    return await kadenaClient.submit(signedTransaction);
  };

  const listen = async (requestKey: string): Promise<ICommandResult> => {
    return await kadenaClient.listen(requestKey, {
      networkId: networkId.value,
      chainId: chain.value,
    });
  };

  const poll = async (requestKeys: string[]) => {
    return kadenaClient.pollStatus(requestKeys, {
      networkId: networkId.value,
      chainId: chain.value,
    });
  };

  type TProjectForm = {
    id: string;
    name: string;
    startsAt: string;
    finishesAt: string;
    hardCap: string;
    softCap: string;
  };

  type TFundForm = {
    id: string;
    amount: string;
  };

  const create = async (
    form: TProjectForm
  ): Promise<{ requestKey: string | null }> => {
    await connect();
    try {
      if (!publicKey.value)
        throw new Error("Public key required to build transaction");

      const sender = createSenderObject(publicKey.value);
      // this is from the wallet
      const keyset = "ks";
      const cmd = createProjectObject({
        id: form.id,
        name: form.name,
        sender,
        dates: {
          startsAt: new Date(form.startsAt),
          finishesAt: new Date(form.finishesAt),
        },
        hardCap: form.hardCap,
        softCap: form.softCap,
        keyset,
      });
      const transaction = createTransaction(cmd, keyset, sender);
      const signedCommand = await signTransaction(transaction);

      if (isSignedCommand(signedCommand)) {
        const url = ""; // this will be the local url for devnet and should pass in below
        const requestKey = await submitCommand(signedCommand);
        saveToRequestKeyLocalStorage(requestKey, "create");
        pollPendingRequests().then(() => null);
        return { requestKey };
      }
    } catch (err) {
      console.log(err);
      // alert there was an error submitting to blockchain
    }

    return { requestKey: null };
  };

  const fund = async (
    form: TFundForm
  ): Promise<{ requestKey: string | null }> => {
    await connect();
    try {
      if (!publicKey.value)
        throw new Error("Public key required to build transaction");

      const sender = createSenderObject(publicKey.value);
      // this is from the wallet
      const keyset = "ks";
      const cmd = createFundObject({
        projectId: form.id,
        funder: sender.account,
        amount: form.amount,
      });
      const transaction = createTransaction(
        cmd,
        keyset,
        sender,
        {},
        (withCapability) => [
          withCapability("coin.GAS"),
          withCapability("coin.TRANSFER"),
        ]
      );
      const signedCommand = await signTransaction(transaction);

      if (isSignedCommand(signedCommand)) {
        const url = ""; // this will be the local url for devnet and should pass in below
        const requestKey = await submitCommand(signedCommand);
        saveToRequestKeyLocalStorage(requestKey, "fund");
        pollPendingRequests().then(() => null);
        return { requestKey };
      }
    } catch (err) {
      console.log(err);
      // alert there was an error submitting to blockchain
    }

    return { requestKey: null };
  };

  const saveToRequestKeyLocalStorage = (
    requestKey: string,
    type: "create" | "fund"
  ) => {
    const currentRequestKeys: Record<
      string,
      { requestKey: string; type: string }
    > = pendingRequestsKeys.value;
    currentRequestKeys[requestKey] = { requestKey, type };
    pendingRequestsKeys.value = currentRequestKeys;
  };

  const updatePendingRequestStatus = (
    pendingRequest: ICommandResult,
    pending: { requestKey: string; type: string }
  ) => {
    const { updateStatusForRequestKey } = useProjects();
    // 	// update project status on DB with response from blockchain
    if (pendingRequest.result.status === "success") {
      let data = {};
      // If the pending request is a create project
      if (pending.type === "create") {
        data = { status: "created" };
      }
      // If the pending request is a fund project
      if (pending.type === "fund") {
        // Add +1 Backer
        data = { backers: 1 };
      }
      const response = updateStatusForRequestKey(pendingRequest.reqKey, data);
      console.log("success", response);
      // data has been stored in the blockchain
      // we can connect it with the data in the database
      // remove from pending requests
    } else {
      // there was an error alert
    }
  };

  const pollPendingRequests = async () => {
    if (kadenaClient) {
      for (const pending of Object.values(pendingRequestsKeys.value)) {
        const response = await listen(pending.requestKey);
        updatePendingRequestStatus(response, pending);
      }
    }
  };

  const getProjectStatus = async (uuid: string) => {
    const transaction = Pact.builder
      .execution(Pact.modules["free.crowdfund"]["read-project"](uuid))
      .setNetworkId(networkId.value) //fast-development - https://github.com/kadena-community/crowdfund
      .setMeta({
        chainId: chain.value, // instruct everyone to use chain 0 on devnet
      })
      .createTransaction();
    const response = await kadenaClient.dirtyRead(transaction);
    console.log("response", response);

    return response;
  };

  return {
    create,
    fund,
    pollPendingRequests,
    getProjectStatus,
    listen,
  };
};
