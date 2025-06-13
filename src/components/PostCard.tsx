import { useState, useEffect } from "react";
import { useSocialContract, useGetComments } from "../hooks/useSocialContract";
import CommentForm from "./CommentForm";
import { CustomAvatar } from "../lib/avatar";
import { formatTimeAgo } from "../lib/time";
import DisplayUsername from "./DisplayUsername";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface Post {
  id: bigint;
  author: `0x${string}`;
  content: string;
  imageCID: string;
  timestamp: bigint;
  likes: bigint;
}

interface Comment {
  author: `0x${string}`;
  content: string;
  imageCID: string;
  timestamp: bigint;
}

interface PostCardProps {
  post: Post;
  onAction: () => void;
}

const PostCard = ({ post, onAction }: PostCardProps) => {
  const { likePost, isConfirmed } = useSocialContract();
  const { data: comments, refetch: refetchComments } = useGetComments(post.id);
  const [showComments, setShowComments] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const postAvatarSize = isDesktop ? 48 : 40;
  const commentAvatarSize = isDesktop ? 32 : 28;
  useEffect(() => {
    if (isConfirmed) {
      console.log(
        `PostCard ${post.id}: Transaction confirmed. Refetching comments and post data.`
      );
      refetchComments();
      onAction();
    }
  }, [isConfirmed, refetchComments, onAction, post.id]);
  const handleLike = async () => {
    await likePost(post.id);
  };
  const handleCommentAdded = () => {
    if (!showComments) {
      setShowComments(true);
    }
  };

  const postTimeAgo = formatTimeAgo(post.timestamp);
  const postImageUrl = post.imageCID
    ? `https://ipfs.io/ipfs/${post.imageCID}`
    : null;

  return (
    <article className="flex space-x-3 md:space-x-4 border-b border-gray-800 p-3 md:p-4 hover:bg-gray-900/30 transition-colors cursor-pointer">
      <div className="flex-shrink-0">
        <CustomAvatar address={post.author} size={postAvatarSize} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col items-start md:flex-row md:items-center md:space-x-2 text-gray-400">
          <div className="flex items-center space-x-2">
            <DisplayUsername address={post.author} />
          </div>
          <span className="hidden md:inline">·</span>
          <time
            dateTime={new Date(Number(post.timestamp) * 1000).toISOString()}
            className="text-sm text-gray-500"
          >
            {postTimeAgo}
          </time>
        </div>

        {post.content && (
          <p className="text-gray-200 mt-2 mb-4 whitespace-pre-wrap break-all text-base md:text-lg">
            {post.content}
          </p>
        )}

        {postImageUrl && (
          <div className="my-3">
            <img
              src={postImageUrl}
              alt="Post content"
              className="rounded-2xl border border-gray-700 w-full max-h-[50vh] md:max-h-[70vh] object-cover"
            />
          </div>
        )}

        <div className="flex items-center text-gray-500 space-x-6 md:space-x-10">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 hover:text-blue-400"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{comments ? comments.length : 0}</span>
          </button>
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 hover:text-pink-500"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.318-7.368a4.5 4.5 0 010-6.364z"
              />
            </svg>
            <span>{post.likes.toString()}</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-4">
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />

            <div className="mt-4 space-y-3">
              {comments && comments.length > 0 ? (
                comments.map((comment, index) => {
                  const commentImageUrl = comment.imageCID
                    ? `https://ipfs.io/ipfs/${comment.imageCID}`
                    : null;

                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-2 md:space-x-3 bg-gray-800/50 p-2 md:p-3 rounded-lg"
                    >
                      <div className="flex-shrink-0 pt-1">
                        <CustomAvatar
                          address={comment.author}
                          size={commentAvatarSize}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col items-start md:flex-row md:items-center md:space-x-2">
                          <div className="font-semibold text-sm text-orange-400/90">
                            <DisplayUsername address={comment.author} />
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.timestamp)}
                          </span>
                        </div>
                        {comment.content && (
                          <p className="text-gray-300 text-sm mt-1 break-all">
                            {comment.content}
                          </p>
                        )}

                        {commentImageUrl && (
                          <div className="mt-2">
                            <img
                              src={commentImageUrl}
                              alt="Comment content"
                              className="rounded-lg border border-gray-700 max-h-48 md:max-h-64 w-auto"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">
                  No comments yet. Be the first to reply!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
