import { useState, useRef } from "react";
import { useSocialContract } from "../hooks/useSocialContract";
import { uploadToPinata } from "../lib/pinata";
import toast from "react-hot-toast";
import {
  PhotoIcon,
  XCircleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const MAX_CHARS = 280;

interface CommentFormProps {
  postId: bigint;
  onCommentAdded: () => void;
}

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addComment, isPending, isConfirming } = useSocialContract();

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverLimit || (!content.trim() && !imageFile)) return;

    let imageCid = "";

    if (imageFile) {
      const uploadPromise = uploadToPinata(imageFile);
      toast.promise(uploadPromise, {
        loading: "Uploading image to IPFS...",
        success: "Please wait!",
        error: "Failed to upload image.",
      });

      const cid = await uploadPromise;
      if (cid) {
        imageCid = cid;
      } else {
        console.error("Failed to upload image, comment not created.");
        return;
      }
    }

    await addComment(postId, content, imageCid);

    setContent("");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onCommentAdded();
  };

  const isLoading = isPending || isConfirming;
  const canReply =
    !isLoading && !isOverLimit && (!!content.trim() || !!imageFile);

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center space-x-2 md:space-x-3">
        <input
          type="text"
          placeholder="reply... but make it spicy 🌶️"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow bg-gray-800 border border-gray-700 rounded-full py-2 px-4 text-sm md:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          disabled={isLoading}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="text-gray-400 hover:text-orange-500 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <PhotoIcon className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 disabled:bg-gray-600 transition-all flex items-center justify-center p-2.5 md:px-4"
          disabled={!canReply}
          aria-label="Reply"
        >
          <span className="md:hidden">
            <PaperAirplaneIcon className="h-5 w-5" />
          </span>
          <span className="hidden md:block text-sm">
            {isLoading ? "..." : "Reply"}
          </span>
        </button>
      </div>

      {imageFile && (
        <div className="text-xs md:text-sm text-gray-400 mt-2 pl-4 flex items-center">
          {imageFile.name}
          <button
            type="button"
            onClick={() => setImageFile(null)}
            className="ml-2 text-red-500 hover:text-red-400"
          >
            <XCircleIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="text-right pr-4 mt-1">
        <span
          className={`text-xs md:text-sm ${
            isOverLimit ? "text-red-500" : "text-gray-500"
          }`}
        >
          {charCount}/{MAX_CHARS}
        </span>
      </div>
    </form>
  );
};

export default CommentForm;
