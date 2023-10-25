import { useWrappedClientContext } from 'contexts/client'
import Link from 'next/link'
import Image from 'next/image'
import Router from 'next/router'
import { NEXT_PUBLIC_SITE_ICON_URL, NEXT_PUBLIC_SITE_TITLE } from 'constants/constants'

const RequestedProfileInput = () => {
  const { walletAddress, requestedProfile } = useWrappedClientContext();
  const { setRequestedProfileWalletAddress } = requestedProfile;
  const onChangeHandler = (e: any) => {
    setRequestedProfileWalletAddress(e.target.value || walletAddress);
  }
  return (
    <div className="flex items-center my-4 py-2 px-4 text-left rounded-xl bg-secondary">
      <p className="mx-2">Enter wallet address of desired profile:</p>
      <input type="text" className="w-full p-2 rounded-xl" onChange={onChangeHandler}></input>
    </div>
  )
}

function Nav() {
  const { walletAddress, connectWallet, disconnect } = useWrappedClientContext()
  const handleConnect = () => {
    if (walletAddress.length === 0) {
      connectWallet()
    } else {
      disconnect()
      Router.push('/')
    }
  }

  const PUBLIC_SITE_ICON_URL = NEXT_PUBLIC_SITE_ICON_URL || ''

  return (
    <div className="border-b w-screen px-8">
      <nav
        className="grid grid-cols-3 items-center text-center w-full py-2">
        <div className="flex items-center">
          <Link href="/">
            <a className="font-semibold text-xl md:text-2xl align-top">
              {NEXT_PUBLIC_SITE_TITLE}
            </a>
          </Link>
        </div>
        <div className="flex flex-grow lg:flex-grow-0 max-w-full">
          <RequestedProfileInput />
        </div>
        <div className="max-w-full justify-self-end">
          <button
            className="text-sm px-8 py-5 border border-neutral hover:border-primary hover:bg-primary hover:text-secondary rounded-xl"
            onClick={handleConnect}
          >
            {walletAddress || 'Connect Wallet'}
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Nav
