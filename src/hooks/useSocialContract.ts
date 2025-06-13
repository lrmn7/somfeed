import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-hot-toast";
import { contractAbi, contractAddress } from "../lib/contract";
import { useEffect } from "react";

export interface Post {
  id: bigint;
  author: `0x${string}`;
  content: string;
  imageCID: string;
  timestamp: bigint;
  likes: bigint;
}

export interface Comment {
  author: `0x${string}`;
  content: string;
  imageCID: string;
  timestamp: bigint;
}

export const useGetComments = (postId: bigint) => {
  const { data, ...rest } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getComments",
    args: [postId],
  });

  return {
    data: data as Comment[] | undefined,
    ...rest,
  };
};

export const useSocialContract = () => {
  const {
    data: hash,
    error: writeError,
    isPending,
    writeContract,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction confirmed!");
    }
    if (writeError || receiptError) {
      const errorMessage = (writeError?.message ||
        receiptError?.message) as string;
      if (errorMessage && !errorMessage.includes("User rejected the request")) {
        toast.error(errorMessage || "Transaction failed!");
      }
    }
  }, [isConfirmed, writeError, receiptError]);

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "owner",
  });

  const {
    data: posts,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getAllPosts",
  });

  const createPost = async (content: string, imageCID: string) => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "createPost",
      args: [content, imageCID],
      value: parseEther("0.01"),
    });
  };

  const likePost = async (postId: bigint) => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "likePost",
      args: [postId],
    });
  };

  const addComment = async (
    postId: bigint,
    content: string,
    imageCID: string
  ) => {
    if (!content.trim() && !imageCID) {
      toast.error("Comment cannot be empty.");
      return;
    }
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "commentOnPost",
      args: [postId, content, imageCID],
    });
  };

  const withdrawFunds = () => {
    toast.loading("Initiating withdrawal...");
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "withdraw",
      args: [],
    });
  };

  return {
    owner: owner as `0x${string}` | undefined,
    isLoadingOwner,
    posts:
      (posts as Post[] | undefined)
        ?.filter(
          (p) => p.author !== "0x0000000000000000000000000000000000000000"
        )
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp)) || [],
    isLoadingPosts,
    refetchPosts,
    createPost,
    likePost,
    addComment,
    withdrawFunds,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  };
};
