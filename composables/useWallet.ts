import { getClient, IPactCommand, Pact } from '@kadena/client'
import { ICommand } from '@kadena/types'

import { Ref } from 'vue'

const initialized = ref(false)
const balance = ref<Ref<string | null>>(null)
const networkId = ref('testnet04')
const chain = ref<Ref<IPactCommand['meta']['chainId']>>('0')
const instance = ref(null)
const publicKey = ref(null)
const account = ref('')
const connectedSites = ref([])
const isInstalled = ref(false)

export function useWallet () {
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
		if (isInstalled.value && instance.value) {
			const { account: accountResponse } = await instance?.value.request({
				method: 'kda_connect',
				networkId: networkId.value
			})
			account.value = accountResponse.account
			publicKey.value = accountResponse.publicKey
			connectedSites.value = accountResponse.connectedSites
			return accountResponse
		}
	}
	
	const requestAccount = async () => {
		if (isInstalled.value && instance.value) {
			const response = await instance?.value.request({ method: 'kda_requestAccount', networkId: networkId.value })
			console.log('kda_requestAccount', response)
			return response
		}
	}
	
	const checkStatus = async () => {
		if (isInstalled.value && instance.value) {
			const response = await instance?.value.request({ method: 'kda_checkStatus', networkId: networkId.value })
			console.log('kda_checkStatus', response)
			return response
		}
	}
	
	const testMethod = async () => {
		const client = getClient()
		const transaction = Pact.builder
			.execution((Pact.modules as any).coin['get-balance'](account.value))
			.setMeta({ sender: account.value, chainId: chain.value })
			.setNetworkId(networkId.value)
			.createTransaction()
		
		return client.dirtyRead(transaction)
	}
	
	const disconnect = async () => {
		if (isInstalled.value && instance.value) {
			const response = await instance?.value.request({ method: 'kda_disconnect', networkId: networkId.value })
			console.log('disconnect response', response)
			return response
		}
	}
	
	const getBalance = async () => {
		if (account.value) {
			const client = getClient()
			const transaction = Pact.builder
				.execution((Pact.modules as any).coin['get-balance'](account.value))
				.setMeta({ sender: account.value, chainId: chain.value })
				.setNetworkId(networkId.value)
				.createTransaction()
			
			const { result: { data } } = await client.dirtyRead(transaction)
			
			balance.value = data
		}
		return
	}
	
	const signTransaction = async (transaction: any): Promise<ICommand> => {
		console.log(transaction)
		
		const response = await instance.value?.request({
			method: 'kda_requestQuickSign',
			data: {
				networkId: networkId.value,
				// signingCmd: signingRequest,
				commandSigDatas: [
					{
						sigs: [{
							pubKey: '6c63dda2d4b2b6d1d10537484d7279619283371b3ba62957a773676369944b17',
							sig: undefined
						}],
						cmd: transaction.cmd
					}]
			}
		})
		
		if (transaction.hash !== response?.quickSignData?.[0]?.outcome?.hash) {
			throw Error('Hashes do not match!')
		}
		
		return {
			cmd: transaction.cmd,
			sigs: response?.quickSignData?.[0]?.commandSigData?.sigs,
			hash: response?.quickSignData?.[0]?.outcome?.hash
		}
		
	}
	
	watch(account, async (value) => {
		console.log('account watcher', value)
		if (value) {
			await getBalance()
		}
	})
	
	initialize()
	
	return {
		initialize,
		signTransaction,
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
