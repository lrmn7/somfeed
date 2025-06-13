import { useState, useRef } from "react";
import { useSocialContract } from "../hooks/useSocialContract";
import { useAccount } from "wagmi";
import { CustomAvatar } from "../lib/avatar";
import { uploadToPinata } from "../lib/pinata";
import { PhotoIcon, XCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
const MAX_CHARS = 280;

const CreatePostForm = ({ onPostCreated }: { onPostCreated: () => void }) => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPost, isPending, isConfirming } = useSocialContract();
  const { address, isConnected } = useAccount();

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || isOverLimit || (!content.trim() && !imageFile)) return;

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
    await createPost(content, imageCid);
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (onPostCreated) {
      onPostCreated();
    }
  };

  const isLoading = isPending || isConfirming;
  const canPost =
    !isLoading &&
    isConnected &&
    !isOverLimit &&
    (!!content.trim() || !!imageFile);

  return (
    <div className="flex space-x-4 p-4 border-b border-gray-800">
      <div className="flex-shrink-0">
        <CustomAvatar address={address ?? ""} size={48} />
      </div>
      <div className="flex-1">
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full bg-transparent text-xl text-white placeholder-gray-500 focus:outline-none resize-none"
            rows={3}
            placeholder="say gm or roast someone 🫣"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          ></textarea>
          {imagePreview && (
            <div className="relative mt-2">
              <img
                src={imagePreview}
                alt="Image preview"
                className="rounded-xl max-h-80 w-auto"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-1 right-1 bg-black bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-50"
                disabled={isLoading}
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2 text-orange-500">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <PhotoIcon className="h-6 w-6 hover:text-orange-400" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex items-center">
              <span
                className={`text-sm mr-4 ${
                  isOverLimit ? "text-red-500" : "text-gray-500"
                }`}
              >
                {charCount}/{MAX_CHARS}
              </span>
              <button
                type="submit"
                className="bg-orange-500 text-white font-bold py-2 px-6 rounded-full hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                disabled={!canPost}
              >
                {isLoading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
