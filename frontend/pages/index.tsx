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
        <Profile />
    </WalletLoader>
  )
}

export default Home
