import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image';
import DisplayUsername from './DisplayUsername';

const Navbar = () => {
  return (
    <nav className="bg-black/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/somfeed.png"
            alt="Somnia Social Logo"
            width={150}
            height={40}
            className="h-8 w-auto md:h-10"
            priority
          />
        </Link>

        <div className="flex items-center">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus || authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="bg-orange-500 text-white font-semibold hover:bg-orange-600 px-4 py-2 rounded-full text-sm transition-all shadow-lg hover:shadow-orange-500/50"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="bg-red-500 text-white font-semibold hover:bg-red-600 px-4 py-2 rounded-full text-sm transition-all shadow-lg flex items-center space-x-2"
                        >
                          <span>Wrong Network</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="flex items-center gap-2 bg-gray-800/70 hover:bg-gray-700 px-3 py-2 md:px-4 rounded-full transition-colors"
                        >
                          {chain.hasIcon && chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 20, height: 20, borderRadius: '50%' }}
                            />
                          )}
                          <span className="text-xs md:text-sm font-medium text-gray-200">{chain.name}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="bg-gray-800/70 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 md:px-4 rounded-full text-xs md:text-sm font-medium transition-colors"
                        >
                          {account && <DisplayUsername address={account.address as `0x${string}`} />}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;