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
    <div className="flex items-center my-4 text-left rounded-xl justify-self-start w-[400px] justify-self-end">
      <input type="text" className="p-2 rounded-xl bg-accent w-full" placeholder="Enter wallet address of desired profile" onChange={onChangeHandler}></input>
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
    <div className="border-b w-screen px-8 bg-white">
      <nav
        className="flex justify-between items-center m-auto text-center w-2/3 py-2">
        <div className="flex items-center">
          <Link href="/">
            <a className="font-semibold text-xl md:text-2xl align-top text-neutral">
              Cored<span className="bg-neutral text-white rounded-sm px-1 mx-0.5">in</span>
            </a>
          </Link>
        </div>
        <div className="flex flex-grow lg:flex-grow-0 max-w-full">
          <RequestedProfileInput />
        </div>
        <div className="max-w-full justify-self-end">
          <button
            className="text-lg px-4 py-2 text-sm border border-neutral rounded-full text-neutral hover:border-primary hover:bg-primary hover:text-secondary"
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
