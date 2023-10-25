import type { NextPage } from 'next'
import Link from 'next/link'
import WalletLoader from 'components/WalletLoader'
import { useWrappedClientContext } from 'contexts/client'
import {
  NEXT_PUBLIC_CHAIN_EXPLORER,
  NEXT_PUBLIC_CHAIN_NAME,
} from 'constants/constants'

const Home: NextPage = () => {
  const { walletAddress } = useWrappedClientContext()

  return (
    <WalletLoader>
      <h1 className="text-6xl font-bold mb-8">
        Welcome to {NEXT_PUBLIC_CHAIN_NAME} !
      </h1>

      <div className="text-2xl">
        Your wallet address is: <pre></pre>
        <Link
          href={NEXT_PUBLIC_CHAIN_EXPLORER + 'coreum/accounts/' + walletAddress}
          passHref
        >
          <a
            target="_blank"
            rel="noreferrer"
            className="font-mono break-all whitespace-pre-wrap hover:text-primary"
          >
            {walletAddress}
          </a>
        </Link>
      </div>
    </WalletLoader>
  )
}

export default Home
