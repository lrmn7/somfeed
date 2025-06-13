import type { NextPage } from 'next';
import Head from 'next/head';
import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import Layout from '../components/Layout';
const Home: NextPage = () => {
  return (
    <Layout>
    <div className="bg-black min-h-screen">
      <Head>
        <title>SomFeed - On-Chain Conversations</title>
        <meta name="description" content="Built on the Somnia Network Testnet. Every post, comment, and like is permanently stored on the blockchain. Your voice, immutable." />
        <link rel="icon" type="image/png" href="/somfeed.png" />
      </Head>
      <main>
        <Hero />
        <FAQ />
      </main>

    </div>
      </Layout>
  );
};

export default Home;