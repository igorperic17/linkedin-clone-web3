import type { NextPage } from 'next'
import Link from 'next/link'
import WalletLoader from 'components/WalletLoader'
import { useWrappedClientContext } from 'contexts/client'
import {
  NEXT_PUBLIC_CHAIN_EXPLORER,
  NEXT_PUBLIC_CHAIN_NAME,
} from 'constants/constants'
import Profile from 'components/profile'

const Home: NextPage = () => {
  const { walletAddress } = useWrappedClientContext()

  return (
      <WalletLoader>
        <div className="text-2xl mb-8">
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
      <Profile />
    </WalletLoader>
  )
}

export default Home
