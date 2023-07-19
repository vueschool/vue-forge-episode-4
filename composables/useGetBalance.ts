import { IPactCommand, Pact, getClient } from '@kadena/client';

export interface TUseGetBalance {
	getBalance: (account: string) => Promise<void>;
	balance: ComputedRef<string>  ;
}

export const useGetBalance = (
	network: IPactCommand['networkId'],
	chainId: IPactCommand['meta']['chainId'],
): TUseGetBalance => {
	
	const balance = ref('0')
	
	const getBalance = async (account: string) => {
		if (!account) return;
		const transaction = Pact.builder
			.execution((Pact.modules as any).coin['get-balance'](account))
			.setMeta({ sender: account, chainId })
			.setNetworkId(network)
			.createTransaction();
		
		const { dirtyRead, submit } = getClient();
		
		const response = await dirtyRead(transaction);
		balance.value = (response?.result as any)?.data || '0'
	}
	
	
	return {
		getBalance,
		balance: computed(() => balance.value)
	}
}
