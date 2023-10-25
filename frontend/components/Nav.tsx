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
    <div className="flex items-center m-1 py-4 px-8 text-left rounded-xl bg-secondary ">
      <p className="mr-6">Enter wallet address of desired profile:</p>
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
    <div className="border-b w-screen px-2 md:px-16">
      <nav
        className="flex flex-wrap text-center md:text-left md:flex flex-row w-full justify-between items-center py-4">
        <div className="flex items-center">
          <Link href="/">
            <a className="link link-hover font-semibold text-xl md:text-2xl align-top">
              {NEXT_PUBLIC_SITE_TITLE}
            </a>
          </Link>
        </div>
        <div className="flex flex-grow lg:flex-grow-0 max-w-full">
          <RequestedProfileInput />
        </div>
        <div className="flex flex-grow lg:flex-grow-0 w-1/6">
          <button
            className="py-4 px-8 block border border-neutral hover:text-secondary hover:bg-primary w-full max-w-full rounded-xl"
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
