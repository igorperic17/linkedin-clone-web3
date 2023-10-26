import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import Profile from 'components/profile'

const Home: NextPage = () => (
  <WalletLoader>
    <Profile />
  </WalletLoader>
)

export default Home
