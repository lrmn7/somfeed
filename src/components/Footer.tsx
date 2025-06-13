import React from 'react';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800 px-4 pt-16 pb-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row text-center md:text-left justify-between space-y-10 md:space-y-0">
          <div className="md:w-1/3">
            <h3 className="font-bold text-lg text-orange-500 mb-2">SOM FEED</h3>
            <p className="text-sm">
             Built on the Somnia Network Testnet. Decentralized Conversations.
            </p>
          </div>
          <div className="md:w-1/3">
            <h3 className="font-bold text-orange-500 uppercase tracking-wider text-sm mb-3">More dApps</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://auctsom.vercel.app" className="hover:text-orange-500 transition-colors">AuctSom</a>
              </li>
              <li>
                <a href="https://funquiz.vercel.app/" className="hover:text-orange-500 transition-colors">FunQuiz</a>
              </li>
              <li>
                <a href="https://funmint.vercel.app/" className="hover:text-orange-500 transition-colors">FunMint</a>
              </li>
              <li>
                <a href="https://yourbefun.vercel.app/" className="hover:text-orange-500 transition-colors">YourBeFun</a>
              </li>
              <li>
                <a href="https://somcet.vercel.app/" className="hover:text-orange-500 transition-colors">Somcet</a>
              </li>
            </ul>
          </div>
          <div className="md:w-1/3 flex flex-col items-center md:items-end">
             <h3 className="font-bold text-orange-500 uppercase tracking-wider text-sm mb-3">Follow Us</h3>
             <div className="flex space-x-6 mt-2">
                <a href="https://github.com/lrmn7/somfeed" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-2xl hover:text-orange-500 transition-colors">
                    <FaGithub />
                </a>
                <a href="https://x.com/romanromannya" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-2xl hover:text-orange-500 transition-colors">
                    <FaXTwitter />
                </a>
             </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
            <p>
                Built with 💛 by the Somnia Community.
            </p>
            <p className="mt-2">
                © {new Date().getFullYear()} Som Feed. All Rights Reserved.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;