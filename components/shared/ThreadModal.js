"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "../ui/input";
import { formatDateString } from "@/lib/utils";
import CommentCard from "./CommentCard";
import { getComments, sendComment } from "@/lib/actions/posts";
import { useUser } from "@/lib/UserContext";

const ThreadModal = ({ post, isOpen, onClose }) => {
  const user_image_path = process.env.NEXT_PUBLIC_USER_IMAGES_ENDPOINT;
  const post_images_path = process.env.NEXT_PUBLIC_POST_IMAGES_ENDPOINT;
  const imageArray = post.post_images ? post.post_images.split(",") : [];

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const userID = useUser();

  const sendComments = async () => {
    if (isSending || !comment.trim()) return;

    setIsSending(true);
    const newComment = {
      id: Date.now(),
      post_id: post.id,
      user_id: userID.user_id,
      content: comment,
      author: post.author,
      username: post.username,
      createdAt: new Date().toISOString(),
      authorImage: post.profile_image,
      isSending: true,
    };

    setComments((prevComments) => [newComment, ...prevComments]);
    setComment("");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const formData = new FormData();
    formData.append("operation", "sendComment");
    formData.append(
      "json",
      JSON.stringify({
        post_id: post.id,
        user_id: userID.user_id,
        content: newComment.content,
      })
    );

    const { success, message, data } = await sendComment({ formData });

    if (!success) {
      console.log(message);
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== newComment.id)
      );
    } else {
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === newComment.id ? { ...c, isSending: false, ...data } : c
        )
      );
    }

    setIsSending(false);
    getCommentsByPOST();
  };

  const getCommentsByPOST = async () => {
    const { success, message, data } = await getComments(post.id);

    if (!success) {
      setComments([]);
      console.log(message);
      return;
    }

    setComments(data);
  };

  useEffect(() => {
    getCommentsByPOST();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[95vw] sm:max-h-[95vh] h-screen w-screen p-0 overflow-hidden">
        <div className="flex h-full bg-black text-white">
          {/* Left side - Post content */}
          <div className="w-[60%] bg-gray-900 flex items-center justify-center">
            {post.post_images && post.post_images.length > 0 ? (
              <Carousel className="w-full max-w-xl">
                <CarouselContent>
                  {imageArray.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="flex aspect-square items-center justify-center p-2">
                        <img
                          src={post_images_path + image}
                          alt={`Post image ${index + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="text-white">No image available</div>
            )}
          </div>

          {/* Right side - Comments and interactions */}
          <div className="w-[40%] flex flex-col bg-gray-900 border-l border-gray-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center">
              <img
                src={user_image_path + post.creator_image}
                alt={post.author}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{post.author}</span>
                <span className="text-gray-500 text-sm">@{post.username}</span>
              </div>
            </div>

            {/* Comments section */}
            <div className="p-4 border-b border-gray-800">
              <span>{post.content}</span>
            </div>
            <div
              className="flex-grow overflow-y-auto p-4 divide-y-2
               [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-gray-600
              [&::-webkit-scrollbar-thumb]:bg-gray-700"
              style={{ maxHeight: "calc(100vh - 330px)" }}
            >
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentCard
                    key={comment.id || comment.comment_id}
                    post_id={post.id}
                    author={
                      comment.first_name && comment.last_name
                        ? `${comment.first_name} ${comment.last_name}`
                        : "Loading..."
                    }
                    username={comment.username || post.username}
                    content={comment.content}
                    createdAt={comment.timestamp}
                    authorImage={user_image_path + comment.authorImage}
                    isSending={comment.isSending}
                  />
                ))
              ) : (
                <h3 className="text-center text-heading2-semibold translate-y-full">
                  No comments yet
                </h3>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
              <div className="mb-2 font-semibold">{post.likes || 0} likes</div>
              <div className="text-gray-400 text-xs">
                Posted On: {formatDateString(post.createdAt)}
              </div>
            </div>

            {/* Input section */}
            <div className="p-4 border-t border-gray-800">
              <div className="relative">
                <Input
                  placeholder="Add a comment..."
                  className="pr-10 py-3 text-base"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  disabled={isSending}
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-transparent rounded-md hover:bg-transparent"
                  onClick={sendComments}
                  disabled={isSending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThreadModal;
