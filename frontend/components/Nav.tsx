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
    <div className="flex items-center my-4 p-3 text-left rounded-xl bg-secondary">
      <p className="mr-2">Enter wallet address of desired profile:</p>
      <input type="text" className="w-3/4 p-2 rounded-xl rounded-r-none" onChange={onChangeHandler}></input>
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
        className="flex flex-wrap text-center md:text-left md:flex flex-row w-full justify-between items-center py-4 ">
        <div className="flex items-center">
          <Link href="/">
            <a>
              {PUBLIC_SITE_ICON_URL.length > 0 ? (
                <Image
                  src={PUBLIC_SITE_ICON_URL}
                  height={32}
                  width={32}
                  alt="Logo"
                />
              ) : (
                <span className="text-2xl">⚛️ </span>
              )}
            </a>
          </Link>
          <Link href="/">
            <a className="ml-1 md:ml-2 link link-hover font-semibold text-xl md:text-2xl align-top">
              {NEXT_PUBLIC_SITE_TITLE}
            </a>
          </Link>
        </div>
        <div className="flex flex-grow lg:flex-grow-0 max-w-full">
          <RequestedProfileInput />
        </div>
        <div className="flex flex-grow lg:flex-grow-0 max-w-full">
          <button
            className="block btn btn-outline btn-primary w-full max-w-full truncate"
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
