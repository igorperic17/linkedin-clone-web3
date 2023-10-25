import {createContext, ReactNode, useContext} from 'react'
import {IClientContext, useClientContext,} from 'hooks/client'

let ClientContext: any
let {Provider} = (ClientContext =
  createContext<IClientContext>({
    walletAddress: '',
    signingClient: null,
    coreumQueryClient: null,
    contractClient: null,
    loading: false,
    error: null,
    connectWallet: () => {},
    disconnect: () => {},
    requestedProfile: {
      walletAddress: null,
      setRequestedProfileWalletAddress: () => {}
    }
  }))

export const useWrappedClientContext = (): IClientContext =>
  useContext(ClientContext)

export const SigningClientProvider = ({children}: {
  children: ReactNode
}) => {
  const value = useClientContext()
  return <Provider value={value}>{children}</Provider>
}
