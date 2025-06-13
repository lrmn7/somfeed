import Link from 'next/link';

const Hero = () => {
  return (
    <section className="text-white bg-black">
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col text-center">
        <div className="lg:w-2/3 w-full">
          <h1 className="title-font sm:text-5xl text-4xl mb-4 font-bold text-white">
            Decentralized Conversations,{" "}
            <span className="text-orange-500">SOM FEED.</span>
          </h1>
          <p className="mb-8 leading-relaxed text-gray-400">
            Built on the <span className="text-orange-500">Somnia Network</span> Testnet. Every post, comment, and like is permanently stored on the blockchain. Your voice, immutable.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/feed"
              className="inline-flex text-white bg-orange-500 border-0 py-2 px-6 focus:outline-none hover:bg-orange-600 rounded-lg text-lg transition-colors"
            >
              Go to SomFeed
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;