import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import Layout from '../components/Layout';
import { useSocialContract } from '../hooks/useSocialContract';
import { contractAddress } from '../lib/contract';

const AdminPage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);
  const { address, isConnected } = useAccount();
  
  const { owner, isLoadingOwner, withdrawFunds, isPending, isConfirming } = useSocialContract();
  
  const { data: contractBalance, isLoading: isLoadingBalance } = useBalance({
    address: contractAddress,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleWithdraw = () => {
    if (contractBalance?.value === 0n) {
        alert("Balance is zero, nothing to withdraw.");
        return;
    }
    withdrawFunds();
  }

  const AccessDenied = () => (
    <div className="text-center bg-red-900/50 p-10 rounded-xl border border-red-700">
      <h2 className="text-3xl font-bold text-red-400">🚫 Access Denied</h2>
      <p className="text-gray-300 mt-2">This page is for contract owners only.</p>
    </div>
  );

  const AdminDashboard = () => (
    <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-orange-500">Admin Panel</h2>
        <div className='p-4 bg-gray-800 rounded-lg'>
            <p className='text-sm text-gray-400'>Total Balance in Contract</p>
            {isLoadingBalance ? (
                <p className="text-2xl font-semibold text-white">Loading...</p>
            ) : (
                <p className="text-2xl font-semibold text-white">
                    {parseFloat(contractBalance?.formatted || '0').toFixed(4)} {contractBalance?.symbol}
                </p>
            )}
        </div>
        <button
            onClick={handleWithdraw}
            disabled={isPending || isConfirming || contractBalance?.value === 0n}
            className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-lg"
        >
            {isPending || isConfirming ? 'Processing...' : 'Withdraw All Funds'}
        </button>
    </div>
  );

  const renderContent = () => {
    if (!isClient || isLoadingOwner) {
      return <div className="text-center text-gray-400">Loading...</div>;
    }
    if (!isConnected) {
      return <div className="text-center text-gray-400">Please connect your wallet to continue.</div>;
    }
    if (address !== owner) {
      return <AccessDenied />;
    }
    return <AdminDashboard />;
  };

  return (
    <Layout>
    <div className="bg-black min-h-screen">
      <Head>
        <title>Admin Panel - Som Feed</title>
        <meta name="description" content="Admin panel for contract owner." />
      </Head>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl mx-auto">
          {renderContent()}
        </div>
      </main>
      </div>
      </Layout>
  );
};
export default AdminPage;