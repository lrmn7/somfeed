import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useSocialContract } from "../hooks/useSocialContract";
import Link from "next/link";

import Layout from "../components/Layout";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";

const FeedPage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);
  const { posts, isLoadingPosts, refetchPosts, isConfirmed } =
    useSocialContract();
  const { isConnected } = useAccount();

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (isConfirmed) {
      console.log("Transaction confirmed, refetching posts...");
      refetchPosts();
    }
  }, [isConfirmed, refetchPosts]);
  const handlePostCreated = useCallback(() => {
    console.log(
      "CreatePostForm has finished its process. Waiting for blockchain confirmation..."
    );
  }, []);

  const renderFeedContent = () => {
    if (!isClient) {
      return (
        <div className="text-center text-gray-400 p-10">Loading Client...</div>
      );
    }
    if (!isConnected) {
      return (
        <div className="text-center bg-gray-900/50 p-10 m-4 rounded-xl border border-gray-800">
          {" "}
          <h2 className="text-2xl font-bold text-orange-500">
            Please Connect Your Wallet
          </h2>{" "}
          <p className="text-gray-400 mt-2">
            Connect your wallet to see the feed and interact with posts.
          </p>{" "}
        </div>
      );
    }
    if (isLoadingPosts && posts.length === 0) {
      return (
        <div className="text-center text-gray-400 p-10">Loading posts...</div>
      );
    }
    if (posts.length === 0 && isConnected) {
      return (
        <div className="text-center p-10">
          {" "}
          <h2 className="text-2xl font-bold text-white">No Posts Yet</h2>{" "}
          <p className="text-gray-400 mt-2">
            Be the first one to create a post!
          </p>{" "}
        </div>
      );
    }
    return posts.map((post) => (
      <PostCard key={post.id.toString()} post={post} onAction={refetchPosts} />
    ));
  };

  return (
    <Layout>
      {" "}
      <Head>
        <title>Feed - Som Feed</title>{" "}
        <meta
          name="description"
          content="Built on the Somnia Network Testnet. Every post, comment, and like is permanently stored on the blockchain. Your voice, immutable."
        />{" "}
      </Head>{" "}
      <div className="max-w-2xl mx-auto border-x border-gray-800 min-h-screen">
        {" "}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-800">
          <Link href="/" passHref legacyBehavior>
            <a className="text-xl font-bold hover:text-orange-500 transition-colors duration-200">
              ↩Home
            </a>
          </Link>{" "}
          {/* BARIS YANG DITAMBAHKAN DI BAWAH */}
          <p className="text-xs text-gray-500 mt-1">
            Note: If post/comment doesn't appear, please refresh the page.
          </p>
        </div>{" "}
        {isClient && isConnected && (
          <CreatePostForm onPostCreated={handlePostCreated} />
        )}
        <div>{renderFeedContent()}</div>{" "}
      </div>{" "}
    </Layout>
  );
};

export default FeedPage;