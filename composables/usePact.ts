import {
	ICommandResult,
	IPactCommand,
	isSignedCommand,
	literal,
	Pact,
	readKeyset
} from '@kadena/client'
import { ExtractType } from '@kadena/client/lib/commandBuilder/commandBuilder'
import { ICapabilityItem } from '@kadena/client/lib/interfaces/IPactCommand'
import { PactNumber } from '@kadena/pactjs'
import { RemovableRef, useStorage } from '@vueuse/core'

const kadenaClient = useGetClient()
const { publicKey } = useWallet()
export const usePact = async () => {
	const { signTransaction, connect, networkId, chain } = useWallet()
	const pendingRequestsKeys: RemovableRef<
		Record<string, { requestKey: string; type: string }>
	> = useStorage('pendingRequestsKeys', {})
	
	type Key = string;
	type Account = `${ 'k' | 'w' }:${ string }` | string;
	const keyFromAccount = (account: Account): string => {
		return account.split(':')[1]
	}
	
	type Sender = {
		account: Account;
		publicKey: Key;
	};
	
	type TFund = {
		projectId: string;
		funder: string;
		amount: string;
	};
	
	type TCancel = {
		projectId: string;
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
		keyset
	}: TProject) => {
		const cmd = Pact.modules['free.crowdfund']['create-project'](
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
		
		return cmd
	}
	type TTransactionOptions = {
		networkId?: string;
		chain?: IPactCommand['meta']['chainId'];
	};
	
	const createFundObject = ({ projectId, funder, amount }: TFund) => {
		return Pact.modules['free.crowdfund']['fund-project'](
			projectId,
			funder,
			new PactNumber(amount).toPactDecimal()
		)
	}
	
	const createCancelObject = ({ projectId }: TCancel) => {
		return Pact.modules['free.crowdfund']['cancel-project'](
			projectId
		)
	}
	
	const _getOptions = (
		options?: TTransactionOptions | TSignTransactionOptions
	) => {
		return {
			networkId: options?.networkId || networkId.value,
			chain: options?.chain || chain.value
		}
	}
	
	const createTransaction = <TCode extends string & { capability: any }> (
		executionObject: TCode,
		keyset: string,
		sender: Sender,
		options?: TTransactionOptions,
		capabilities?: (
			withCapability: ExtractType<{ payload: { funs: [TCode] } }>
		) => ICapabilityItem[]
	) => {
		const { chain: chainId, networkId } = _getOptions(options)
		
		return Pact.builder
			.execution(executionObject)
			.addKeyset(keyset, 'keys-all', sender.publicKey)
			.setNetworkId(networkId) //fast-development - https://github.com/kadena-community/crowdfund
			.setMeta({ chainId, sender: sender.account })
			.addSigner(sender.publicKey, capabilities as any)
			.createTransaction()
	}
	
	const createSenderObject = (publicKey: Key): Sender => {
		return {
			account: `k:${ publicKey }`,
			publicKey: publicKey
		}
	}
	type TSignTransactionOptions = {
		networkId?: string;
		chain?: IPactCommand['meta']['chainId'];
	};
	
	const submitCommand = async (signedTransaction: any) => {
		return await kadenaClient.submit(signedTransaction)
	}
	
	const listen = async (requestKey: string): Promise<ICommandResult> => {
		return await kadenaClient.listen(requestKey, {
			networkId: networkId.value,
			chainId: chain.value
		})
	}
	
	const poll = async (requestKeys: string[]) => {
		return kadenaClient.pollStatus(requestKeys, {
			networkId: networkId.value,
			chainId: chain.value
		})
	}
	
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
		await connect()
		try {
			if (!publicKey.value)
				throw new Error('Public key required to build transaction')
			
			const sender = createSenderObject(publicKey.value)
			// this is from the wallet
			const keyset = 'ks'
			const cmd = createProjectObject({
				id: form.id,
				name: form.name,
				sender,
				dates: {
					startsAt: new Date(form.startsAt),
					finishesAt: new Date(form.finishesAt)
				},
				hardCap: Number(form.hardCap),
				softCap: Number(form.softCap),
				keyset
			})
			const transaction = createTransaction(cmd, keyset, sender)
			const signedCommand = await signTransaction(transaction)
			
			if (isSignedCommand(signedCommand)) {
				const url = '' // this will be the local url for devnet and should pass in below
				const requestKey = await submitCommand(signedCommand)
				saveToRequestKeyLocalStorage(requestKey, 'create')
				pollPendingRequests().then(() => null)
				return { requestKey }
			}
		} catch (err) {
			console.log(err)
			// alert there was an error submitting to blockchain
		}
		
		return { requestKey: null }
	}
	
	const cancel = async (
		projectId: string
	): Promise<{ requestKey: string | null }> => {
		await connect()
		try {
			if (!publicKey.value)
				throw new Error('Public key required to build transaction')
			
			const sender = createSenderObject(publicKey.value)
			// this is from the wallet
			const keyset = 'ks'
			const cmd = createCancelObject({ projectId })
			
			const transaction = createTransaction(
				cmd,
				keyset,
				sender,
				{},
				(withCapability) => [
					withCapability('coin.GAS'),
					withCapability('free.crowdfund.PROJECT_OWNER', projectId),
					withCapability('free.crowdfund.CANCEL', projectId)
				]
			)
			const signedCommand = await signTransaction(transaction)
			
			if (isSignedCommand(signedCommand)) {
				const url = '' // this will be the local url for devnet and should pass in below
				const requestKey = await submitCommand(signedCommand)
				saveToRequestKeyLocalStorage(requestKey, 'cancel')
				pollPendingRequests().then(() => null)
				return { requestKey }
			}
		} catch (err) {
			console.log(err)
			// alert there was an error submitting to blockchain
		}
		
		return { requestKey: null }
	}
	
	
	const fund = async (
		form: TFundForm
	): Promise<{ requestKey: string | null }> => {
		await connect()
		try {
			if (!publicKey.value)
				throw new Error('Public key required to build transaction')
			
			const sender = createSenderObject(publicKey.value)
			// this is from the wallet
			const keyset = 'ks'
			const cmd = createFundObject({
				projectId: form.id,
				funder: sender.account,
				amount: form.amount
			})
			
			const { result: { data: projectAccount } } = await getProjectAccount(form.id)
			
			const transaction = createTransaction(
				cmd,
				keyset,
				sender,
				{},
				(withCapability) => [
					withCapability('coin.GAS'),
					withCapability('coin.TRANSFER', sender.account, projectAccount, new PactNumber(form.amount).toPactDecimal()),
					withCapability('free.crowdfund.ACCT_GUARD', sender.account, form.id)
				]
			)
			console.log(transaction)
			const signedCommand = await signTransaction(transaction)
			
			if (isSignedCommand(signedCommand)) {
				const url = '' // this will be the local url for devnet and should pass in below
				const requestKey = await submitCommand(signedCommand)
				saveToRequestKeyLocalStorage(requestKey, 'fund')
				pollPendingRequests().then(() => null)
				return { requestKey }
			}
		} catch (err) {
			console.log(err)
			// alert there was an error submitting to blockchain
		}
		
		return { requestKey: null }
	}
	
	const saveToRequestKeyLocalStorage = (
		requestKey: string,
		type: 'create' | 'fund' | 'cancel' | 'fail' | 'success'
	) => {
		const currentRequestKeys: Record<
			string,
			{ requestKey: string; type: string }
		> = pendingRequestsKeys.value
		currentRequestKeys[requestKey] = { requestKey, type }
		pendingRequestsKeys.value = currentRequestKeys
	}
	
	const updatePendingRequestStatus = async (
		pendingRequest: ICommandResult,
		pending: { requestKey: string; type: string }
	) => {
		const { updateStatusForRequestKey } = useProjects()
		// If the pending request is a fund project
		if (pending.type === 'fund') {
			delete pendingRequestsKeys.value[pending.requestKey]
      if (pendingRequest.result.status === 'failure') {
        useAlerts().error(pendingRequest.result?.error?.message || 'There was an error funding the project', {
          title: 'There was an error funding the project',
          dismissiable: false
        })
      }
      
      if (pendingRequest.result.status === 'success') {
        useAlerts().success('Project funded successfully')
      }
      
      delete pendingRequestsKeys.value[pending.requestKey]
		}
		
		if (pending.type === 'create') {
			// 	// update project status on DB with response from blockchain
			if (pendingRequest.result.status === 'success') {
        let data = {}
        // If the pending request is a create project
        data = { status: 'created' }
				useAlerts().success('Project created successfully on the blockchain')
				await updateStatusForRequestKey(pendingRequest.reqKey, data)
					.then(() => {
						// data has been stored in the blockchain
						// we can connect it with the data in the database
						// remove from pending requests
						delete pendingRequestsKeys.value[pending.requestKey]
					})
      }
			
      if (pendingRequest.result.status === 'failure') {
	      useAlerts().error(
					pendingRequest.result?.error?.message || 'There was an error creating the project on the blockchain',
		      { title: 'There was an error creating the project' }
	      )
	      await updateStatusForRequestKey(pendingRequest.reqKey, { status: 'failed' })
      }
		}
	}
	
	const pollPendingRequests = async () => {
		if (kadenaClient) {
			for (const pending of Object.values(pendingRequestsKeys.value)) {
				const response = await listen(pending.requestKey)
				updatePendingRequestStatus(response, pending)
			}
		}
	}
	
	const getProjectStatus = async (uuid: string) => {
		const transaction = Pact.builder
			.execution(Pact.modules['free.crowdfund']['read-project'](uuid))
			.setNetworkId(networkId.value) //fast-development - https://github.com/kadena-community/crowdfund
			.setMeta({
				chainId: chain.value // instruct everyone to use chain 0 on devnet
			})
			.createTransaction()
		const response = await kadenaClient.dirtyRead(transaction)
		return response
	}
	
	const getProjectAccount = async (uuid: string) => {
		const transaction = Pact.builder
			.execution(Pact.modules['free.crowdfund']['vault-account'](uuid))
			.setNetworkId(networkId.value) //fast-development - https://github.com/kadena-community/crowdfund
			.setMeta({
				chainId: chain.value // instruct everyone to use chain 0 on devnet
			})
			.createTransaction()
		const response = await kadenaClient.dirtyRead(transaction)
		
		return response
	}
	
	return {
		create,
		fund,
		cancel,
		pollPendingRequests,
		getProjectStatus,
		getProjectAccount,
		listen
	}
}
