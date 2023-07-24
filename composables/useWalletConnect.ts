import Client from "@walletconnect/sign-client";
import { PairingTypes, SessionTypes } from "@walletconnect/types";
import { WalletConnectModal } from "@walletconnect/modal";
import { getSdkError } from "@walletconnect/utils";

/**
 * Types
 */
const defaultState = {
  client: undefined as Client | undefined,
  session: undefined as SessionTypes.Struct | undefined,
  connect: (pairing?: { topic: string }) => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  isInitializing: false,
  pairings: [] as PairingTypes.Struct[],
  accounts: [] as string[],
};

const requiredNamespaces = {
  kadena: {
    methods: [
      "kadena_getAccounts_v1",
      "kadena_sign_v1",
      "kadena_quicksign_v1",
    ],
    chains: [
      "kadena:mainnet01",
      "kadena:testnet04",
      "kadena:development",
    ],
    events: [],
  },
};

export async function useWalletConnect() {
  if (!process.server) {
    window.global ||= window;
  }
  /**
   * walletConnectModal Config
   */
  const {
    public: { WALLET_CONNECT_PROJECT_ID, WALLET_CONNECT_RELAY_URL },
  } = useRuntimeConfig();

  const walletConnectModal = new WalletConnectModal({
    projectId: WALLET_CONNECT_PROJECT_ID,
    themeMode: "light",
  });

  const state = reactive({ ...defaultState });

  const reset = () => {
    state.session = undefined;
  };

  const onSessionConnected = async (_session: SessionTypes.Struct) => {
    state.session = _session;
    state.accounts = _session?.namespaces?.kadena?.accounts;
  };

  const connect = async (pairing: any) => {
    console.log('connect', )
    if (typeof state.client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    const lastKeyIndex = state.client.session.getAll().length - 1
    const lastSession = state.client.session.getAll()[lastKeyIndex]
    console.log('lastSession', state.client)
    await onSessionConnected(lastSession)
    
    try {
      const currentSession = await state.client.find({ requiredNamespaces });
      console.log('currentSession', currentSession)
      console.log('pairings', state.pairings)
      // if (currentSession) return
      const { uri, approval } = await state.client.connect({
        pairingTopic: state.pairings?.[0]?.topic || pairing?.topic,
        requiredNamespaces: lastSession?.requiredNamespaces || requiredNamespaces,
      });
      console.log('uri', uri)

      // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
      if (uri) {
        walletConnectModal.openModal({ uri });
      }
      
      const session = await approval();
      console.log("Established session:", session);
      await onSessionConnected(session);
     
      // Update known pairings after session is connected.
      state.pairings = state.client.pairing.getAll({ active: true });
    } catch (e) {
      console.error(e);
      // ignore rejection
    } finally {
      // close modal in case it was open
      walletConnectModal.closeModal();
    }
  };

  const disconnect = async () => {
    if (typeof state.client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof state.session === "undefined") {
      throw new Error("Session is not connected");
    }

    try {
      await state.client.disconnect({
        topic: state.session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
      console.log("disconnected");
    } catch (error) {
      console.error("SignClient.disconnect failed:", error);
    } finally {
      // Reset app state after disconnect.
      reset();
    }
  };

  const _subscribeToEvents = async (_client: Client) => {
    if (typeof _client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }

    _client.on("session_ping", (args) => {
      console.log("EVENT", "session_ping", args);
    });

    _client.on("session_event", (args) => {
      console.log("EVENT", "session_event", args);
    });

    _client.on("session_update", ({ topic, params }) => {
      console.log("EVENT", "session_update", { topic, params });
      const { namespaces } = params;
      const _session = _client.session.get(topic);
      const updatedSession = { ..._session, namespaces };
      onSessionConnected(updatedSession);
    });

    _client.on("session_delete", () => {
      console.log("EVENT", "session_delete");
      reset();
    });
  };

  const _checkPersistedState = async (_client: Client) => {
    if (typeof _client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    // populates existing pairings to state
    state.pairings = _client.pairing.getAll({ active: true });
    console.log(
      "RESTORED PAIRINGS: ",
      _client.pairing.getAll({ active: true })
    );

    if (typeof state.session !== "undefined") return;
    // populates (the last) existing session to state
    if (_client.session.length) {
      const lastKeyIndex = _client.session.keys.length - 1;
      const _session = _client.session.get(_client.session.keys[lastKeyIndex]);
      console.log("RESTORED SESSION:", _session);
      await onSessionConnected(_session);
      return _session;
    }
  };

  const createClient = async () => {
    try {
      state.isInitializing = true;

      const _client = await Client.init({
        relayUrl: WALLET_CONNECT_RELAY_URL,
        projectId: WALLET_CONNECT_PROJECT_ID,
      });

      console.log("CREATED CLIENT: ", _client);
      state.client = _client;
      await _subscribeToEvents(_client);
      await _checkPersistedState(_client);
    } catch (err) {
      throw err;
    } finally {
      state.isInitializing = false;
    }
  };
  
  const currentClient = computed(() => state.client)
  await createClient();
  
  watch(currentClient, async (client) => {
    if (!client) return
    const [currentSession] = await client.find({ requiredNamespaces });
    await onSessionConnected(currentSession)
    console.log("lastSession", currentSession)
  })
 
  return {
    pairings: computed(() => state.pairings),
    isInitializing: computed(() => state.isInitializing),
    accounts: computed(() => state.accounts),
    client: computed(() => state.client),
    session: computed(() => state.session),
    connect,
    disconnect,
  };
}
