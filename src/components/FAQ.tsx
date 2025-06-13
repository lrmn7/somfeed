import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Som Feed?",
      answer: (
        <>
          Som Feed is a decentralized social media application (dApp) where you
          can post text, images, comment, and like posts. This application is
          built entirely on the{" "}
          <a
            href="https://www.somnia.network/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline"
          >
            Somnia Network Testnet
          </a>
          . It's important to remember that this project was created for
          learning and portfolio purposes only.{" "}
          <code>No real assets are involved or traded here</code>
        </>
      ),
    },
    {
      question: "How does it work?",
      answer: (
        <>
          Every post, comment, and 'like' is permanently recorded on the
          blockchain. Creating a post requires a small transaction fee of{" "}
          <code>0.01 STT</code>. Uploaded images are stored decentrally on IPFS
          via Pinata to ensure their availability. User profile names are
          integrated with the{" "}
          <a
            href="https://somnia.domains/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline"
          >
            Somnia.Domains
          </a>{" "}
          service, displaying the domain name linked to your wallet address.
        </>
      ),
    },
    {
      question: "Is this application secure?",
      answer: (
        <>
          Security is a priority. The core application logic is governed by a{" "}
          <a
            href="https://shannon-explorer.somnia.network/address/0xd2Eb1b435f7A9d14865d9284822C1E8199bD9Ac1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline"
          >
            smart contract
          </a>{" "}
          with fully open-source code. You can review the entire codebase,
          including the smart contract, in our{" "}
          <a
            href="https://github.com/lrmn7/somfeed"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline"
          >
            GitHub
          </a>{" "}
          repository. As with any dApp, please proceed with caution and
          understand the risks when connecting your wallet. Always use a
          dedicated development wallet that does not contain real assets.
        </>
      ),
    },
    {
      question: "What do I need to get started?",
      answer: (
        <>
          You will need a web3 wallet like MetaMask. Ensure your wallet is
          connected to the Somnia Network Testnet and has a sufficient balance
          of STT (the testnet token) to cover transaction fees. You can get
          testnet tokens from our faucet here{" "}
          <a
            href="https://somcet.vercel.app/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline"
          >
            SomCet
          </a>
          . If you need a larger amount for extensive testing, you can also send
          a direct message on{" "}
          <a
            href="https://x.com/romanromannya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline"
          >
            X-Twitter
          </a>
          .
        </>
      ),
    },
  ];

  return (
    <section className="bg-black py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>
          <p className="text-gray-400 mt-2">
            Here are some common questions about the Som Feed dApp.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 transition-all hover:border-orange-500/50"
            >
              <h3 className="font-semibold text-lg text-orange-500 mb-3">
                {faq.question}
              </h3>
              <div className="text-gray-400 leading-relaxed">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
