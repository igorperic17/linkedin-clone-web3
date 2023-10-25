import { useState } from 'react'
import { connectKeplr } from 'services/keplr'
import {
  createProtobufRpcClient,
  defaultRegistryTypes,
  GasPrice,
  QueryClient,
} from '@cosmjs/stargate'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { QueryClient as CoreumQueryClient } from '../coreum/query'
import { GeneratedType, Registry } from '@cosmjs/proto-signing'
import { coreumRegistryTypes } from '../coreum/tx'
import {
  NEXT_APP_CONTRACT_ADDRESS,
  NEXT_PUBLIC_CHAIN_ID,
  NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
  NEXT_PUBLIC_GAS_PRICE,
} from 'constants/constants'
import { MyProjectClient } from 'contracts/MyProject.client'
import { BackendService } from 'services/backendService'

export interface RequestedProfile {
  walletAddress: string | null
  setRequestedProfileWalletAddress: (walletAddress: string | null) => void
}

export interface IClientContext {
  walletAddress: string
  signingClient: SigningCosmWasmClient | null
  coreumQueryClient: CoreumQueryClient | null
  contractClient: MyProjectClient | null
  loading: boolean
  error: any
  connectWallet: any
  disconnect: Function
  requestedProfile: RequestedProfile
  backendService: BackendService
}

const PUBLIC_RPC_ENDPOINT = NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
const PUBLIC_CHAIN_ID = NEXT_PUBLIC_CHAIN_ID
const GAS_PRICE = NEXT_PUBLIC_GAS_PRICE || ''

export const useClientContext = (): IClientContext => {
  const [walletAddress, setWalletAddress] = useState('')
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null)
  const [tmClient, setTmClient] = useState<Tendermint34Client | null>(null)
  const [contractClient, setContractClient] = useState<MyProjectClient | null>(
    null
  )
  const [coreumQueryClient, setCoreumQueryClient] =
    useState<CoreumQueryClient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [requestedProfileWalletAddress, setRequestedProfileWalletAddress] =
    useState<string | null>(null)
  const [backendService,] = useState(new BackendService())

  const connectWallet = async () => {
    setLoading(true)

    try {
      await connectKeplr()

      // enable website to access keplr
      await (window as any).keplr.enable(PUBLIC_CHAIN_ID)

      // get offline signer for signing txs
      const offlineSigner = await (window as any).getOfflineSigner(
        PUBLIC_CHAIN_ID
      )

      // register default and custom messages
      let registryTypes: ReadonlyArray<[string, GeneratedType]> = [
        ...defaultRegistryTypes,
        ...coreumRegistryTypes,
      ]
      const registry = new Registry(registryTypes)

      // signing client
      const client = await SigningCosmWasmClient.connectWithSigner(
        PUBLIC_RPC_ENDPOINT,
        offlineSigner,
        {
          gasPrice: GasPrice.fromString(GAS_PRICE),
        }
      )
      setSigningClient(client)

      // rpc client
      const tendermintClient = await Tendermint34Client.connect(
        PUBLIC_RPC_ENDPOINT
      )

      const queryClient = new QueryClient(tendermintClient)
      setCoreumQueryClient(
        new CoreumQueryClient(createProtobufRpcClient(queryClient))
      )

      // get user address
      const [{ address }] = await offlineSigner.getAccounts()
      //   const senderClient = await SigningCosmWasmClient.connectWithSigner(
      //     PUBLIC_RPC_ENDPOINT,
      //     offlineSigner,
      //     { gasPrice: getGasPriceWithMultiplier(feemodelQueryClient) }
      // );
      console.log(address)
      setContractClient(
        new MyProjectClient(client, address, NEXT_APP_CONTRACT_ADDRESS)
      ) // TODO store address somewhere else
      setWalletAddress(address)
      setRequestedProfileWalletAddress(address)
      setLoading(false)
    } catch (error: any) {
      console.error(error)
      setError(error)
    }
  }

  const disconnect = () => {
    if (signingClient) {
      signingClient.disconnect()
    }
    if (tmClient) {
      tmClient.disconnect()
    }
    setWalletAddress('')
    setSigningClient(null)
    setLoading(false)
  }

  return {
    walletAddress,
    signingClient,
    contractClient,
    coreumQueryClient: coreumQueryClient,
    loading,
    error,
    connectWallet,
    disconnect,
    requestedProfile: {
      walletAddress: requestedProfileWalletAddress,
      setRequestedProfileWalletAddress,
    },
    backendService
  }
}
