import { getClient, IPactCommand, Pact } from '@kadena/client'
import { Ref } from 'vue'

let initialized = ref(false)

export const useWallet = () => {
	const networkId = ref("testnet04")
	const chain = ref<Ref<IPactCommand['meta']['chainId']>>("0")
	const instance = ref(null)
	
	const publicKey = ref(null)
	const balance = ref(null)
	const account = ref(null)
	const connectedSites = ref([])
	
	const isInstalled = ref(false)
	
	watch(isInstalled, (value) => {
		if (!value) {
			console.warn('Kadena Wallet is not installed')
		}
	})
	const checkIdWalletIsInstalled = () => {
		if (initialized.value) return
		const { kadena } = window
		isInstalled.value = Boolean(kadena && kadena.isKadena)
		instance.value = kadena
		initialized.value = true
	}
	
	const initialize = async () => {
		checkIdWalletIsInstalled()
		if (isInstalled.value) {
			// You will start here
		}
	}
	
	const connect = async () => {
		console.log('heeere before')
		if(isInstalled.value && instance.value) {
			const { account: accountResponse } = await instance?.value.request({ method: 'kda_connect', networkId: networkId.value})
			console.log('heeere', accountResponse)
			account.value = accountResponse.account
			publicKey.value = accountResponse.publicKey
			connectedSites.value = accountResponse.connectedSites
			console.log('after connect', account.value)
			return accountResponse
		}
	}
	
	const requestAccount = async () => {
		if(isInstalled.value && instance.value) {
			const response = await instance?.value.request({ method: 'kda_requestAccount', networkId: networkId.value})
			console.log('kda_requestAccount', response)
			return response
		}
	}
	
	const checkStatus = async () => {
		if(isInstalled.value && instance.value) {
			const response = await instance?.value.request({ method: 'kda_checkStatus', networkId: networkId.value})
			console.log('kda_checkStatus', response)
			return response
		}
	}
	
	const disconnect = async () => {
		if(isInstalled.value && instance.value) {
			const response = await instance?.value.request({ method: 'kda_disconnect', networkId: networkId.value})
			console.log('disconnect response', response)
			return response
		}
	}
	
	const getBalance = async () => {
			console.log(account.value)
			if (!account.value) return;
			const transaction = Pact.builder
				.execution((Pact.modules as any).coin['get-balance'](account.value))
				.setMeta({ sender: account.value, chainId: chain.value })
				.setNetworkId(networkId.value)
				.createTransaction();
			
			const { dirtyRead, submit } = getClient();
			
			const { result: { status, data } } = await dirtyRead(transaction);
			console.log(status, data)
			if (status === 'success') {
				balance.value = data || '0'
			}
		console.log('balance', balance.value )
	}
	
	initialize()
	
	watch(account, async (value) => {
		console.log('account watcher', value)
		if (value) {
			await getBalance()
		}
	})
	
	
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
		isXWalletInstalled: computed(() => isInstalled.value)
	}
}
