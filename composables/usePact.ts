import {
	createWalletConnectQuicksign,
	getClient,
	ICommandResult,
	IPactCommand,
	isSignedCommand,
	literal,
	Pact,
	readKeyset
} from '@kadena/client'
import { PactNumber } from '@kadena/pactjs'
import SignClient from '@walletconnect/sign-client'
import { SessionTypes } from '@walletconnect/types'
import { nanoid } from 'nanoid'
import { RemovableRef, useStorage } from '@vueuse/core'

const kadenaClient = getClient();
const { chain, networkId } = useWallet()
export const usePact = async () => {
	const pendingRequestsKeys: RemovableRef<any[]> = useStorage("pendingRequestsKeys", []);
	
	const { client, session, connect, pairings } = await useWalletConnect();
	type Key = string
	type Account = `${'k' | 'w'}:${string}` | string
	const keyFromAccount = (account: Account): string => {
		return account.split(':')[1];
	}
	
	type Sender = {
		account: Account;
		publicKey: Key;
	}
	
	type TProject = {
		id: string;
		name: string;
		sender: Sender;
		dates: {
			startsAt: Date;
			finishesAt: Date;
		},
		hardCap: number;
		softCap: number;
		keyset: string;
	}
	
	const createProjectObject = ({
		id,
		name,
		sender,
		dates,
		hardCap,
		softCap,
		keyset
	}: TProject) => {
		return Pact.modules['free.crowdfund']["create-project"](
			id,
			name,
			literal('coin'),
			new PactNumber(hardCap).toPactDecimal(),
			new PactNumber(softCap).toPactDecimal(),
			new Date(dates.startsAt),
			new Date(dates.finishesAt),
			sender.account,
			readKeyset(keyset)
		)
	}
	type TTransactionOptions = {
		networkId?: string;
		chain?: IPactCommand['meta']['chainId'];
	}
	
	const _getOptions = (options?: TTransactionOptions | TSignTransactionOptions) => {
		return {
			networkId: options?.networkId || 'testnet04',
			chain: options?.chain || '0'
		}
	}
	
	const createTransaction = (executionObject: any, keyset: string, sender: Sender, options?: TTransactionOptions) => {
		const {chain: chainId, networkId} = _getOptions(options);

		return Pact.builder
			.execution(executionObject)
			.addKeyset(keyset, "keys-all", sender.publicKey)
			.setNetworkId(networkId) //fast-development - https://github.com/kadena-community/crowdfund
			.setMeta({ chainId, sender: sender.account, })
			.addSigner(sender.publicKey)
			.createTransaction();
	}
	
	const createSenderObject = (publicKey: Key): Sender => {
		return {
			account: `k:${publicKey}`,
			publicKey: publicKey
		}
	}
	type TSignTransactionOptions = {
		networkId?: string;
		chain?: IPactCommand['meta']['chainId'];
	}
	
	const signTransaction = async (transaction: any, options?: TSignTransactionOptions ) => {
		const { networkId} = _getOptions(options);
		const signWithWalletConnect = createWalletConnectQuicksign(
			client.value as SignClient,
			session.value as SessionTypes.Struct,
			`kadena:${networkId}`,
		);

		return await signWithWalletConnect(transaction);
	}
	
	const submitCommand = async (signedTransaction: any) => {
		return await kadenaClient.submit(signedTransaction);
	}
	
	
	const listen = async (requestKey: string): Promise<ICommandResult> => {
		return await kadenaClient.listen(requestKey, { networkId: networkId.value, chainId: chain.value });
	}
	
	const poll = async (requestKeys: string[])   => {
		return kadenaClient.pollStatus(requestKeys, { networkId: networkId.value, chainId: chain.value })
	}
	
	type TProjectForm = {
		id: string;
		name: string;
		startsAt: string;
		finishesAt: string;
		hardCap: number;
		softCap: number;
	}
	
	
	const create = async (form: TProjectForm): Promise<{requestKey: string | null}>  => {
		try {
			const publicKey = `6c63dda2d4b2b6d1d10537484d7279619283371b3ba62957a773676369944b17`;
			const sender = createSenderObject(publicKey);
			await connect('walletconnect');
			// this is from the wallet
			const keyset = 'ks'
			
			if (!publicKey) throw new Error("Public key required to build transaction");
			if (!client.value)
				throw new Error("wallet connect client required to build transaction");
			
			const transaction = createTransaction(
				createProjectObject({
					id: form.id,
					name: form.name,
					sender,
					dates: {
						startsAt: new Date(form.startsAt),
						finishesAt: new Date(form.finishesAt),
					},
					hardCap: form.hardCap,
					softCap: form.softCap,
					keyset
				}),
				keyset,
				sender,
			)
			const signedCommand = await signTransaction(transaction)
			if (isSignedCommand(signedCommand)) {
				const url = ""; // this will be the local url for devnet and should pass in below
				const requestKey = await submitCommand(signedCommand)
				saveToRequestKeyLocalStorage(requestKey)
				return { requestKey }
			}
		} catch (err) {
			console.log(err);
			// alert there was an error submitting to blockchain
		}
		
		return { requestKey: null }
	};
	
	const saveToRequestKeyLocalStorage = (requestKey: string) => {
		const currentRequestKeys = new Set(pendingRequestsKeys.value)
		currentRequestKeys.add(requestKey)
		pendingRequestsKeys.value = [...currentRequestKeys]
	}
	
	const getPendingRequests = () => {
		return pendingRequestsKeys.value
	}
	
	const updatePendingRequestStatus = (pendingRequest: ICommandResult) => {
		const { updateStatusForRequestKey } = useProjects()
		console.log('pendingRequest', pendingRequest , pendingRequest.result, pendingRequest.reqKey,)
		// 	// update project status on DB with response from blockchain
		if (pendingRequest.result.status === "success") {
					const response = updateStatusForRequestKey(pendingRequest.reqKey, { status: "created" })
					console.log("success", response);
					// data has been stored in the blockchain
					// we can connect it with the data in the database
					// remove from pending requests

				} else {
					console.log("nope");
					// there was an error alert
				}
	}
	
	
	const pollPendingRequests = async () => {
		if (kadenaClient) {
			for (const requestKey of Object.values(pendingRequestsKeys.value)) {
				const response = await listen(requestKey)
				updatePendingRequestStatus(response)
			}
		}
	}
	
	
	const getProjectStatus = async (uuid: string) => {
		const transaction = Pact.builder
			.execution(
				Pact.modules['free.crowdfund']["read-project-fundstate"](uuid)
			)
			.setNetworkId(networkId.value) //fast-development - https://github.com/kadena-community/crowdfund
			.setMeta({
				chainId: chain.value, // instruct everyone to use chain 0 on devnet
			})
			.createTransaction()
		// const response = await  client.preflight(transaction)
		const response = await kadenaClient.dirtyRead(transaction)
		console.log('response',response)
		
		return response
	}
	
	
	// watch(pendingRequestsKeys, async (value) => {
	// 	if (value.length) {
	// 		await pollPendingRequests()
	// 	}
	// }, {deep: true})
	
	return {
		create,
		pollPendingRequests,
		getProjectStatus,
		listen
	}
}
