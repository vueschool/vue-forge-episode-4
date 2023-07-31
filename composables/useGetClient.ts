import { getClient } from '@kadena/client'

export const useGetClient = () => {
	return getClient(({ chainId }) =>
		`http://127.0.0.1:8080/chainweb/0.0/fast-development/chain/${ chainId }/pact`)
}

