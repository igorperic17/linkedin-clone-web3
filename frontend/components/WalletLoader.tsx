import { ReactNode } from 'react'
import { useWrappedClientContext } from 'contexts/client'
import Loader from './Loader'

function WalletLoader({
  children,
  loading = false,
}: {
  children: ReactNode
  loading?: boolean
}) {
  const {
    walletAddress,
    loading: clientLoading,
    error,
    connectWallet,
  } = useWrappedClientContext()

  if (loading || clientLoading) {
    return (
      <div className="justify-center">
        <Loader />
      </div>
    )
  }

  if (walletAddress === '') {
    return (
      <div className="max-w-full text-center flex flex-col items-center">
        <h1 className="mb-4 text-9xl font-bold">
          CoredIn
        </h1>

        <p className="text-md">
          PoC Social App for professionals with self-sovereign data access
        </p>

        <div className="flex flex-wrap rounded-xl items-center justify-around md:max-w-4xl mt-14 sm:w-full">
          <button
            className="p-6 text-left border border-primary text-primary hover:border-primary hover:bg-primary max-w-lg rounded-xl hover:text-secondary focus:text-primary-focus"
            onClick={connectWallet}
          >
            <h3 className="text-2xl font-bold">Connect your wallet &rarr;</h3>
            <p className="mt-4 text-xl">
              Get your Keplr wallet connected now and start using CoredIn.
            </p>
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return <code>{JSON.stringify(error)}</code>
  }

  return <>{children}</>
}

export default WalletLoader
