"use client";
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, CornerDownRight } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/lib/UserContext";
import { likeComment, unlikeComment } from "@/lib/actions/posts";
import { HeartFilledIcon } from "@radix-ui/react-icons";

const CommentCard = ({
  post_id,
  comment_id,
  author,
  username,
  content,
  createdAt,
  authorImage,
  isSending,
  isLikedByCurrentUser,
  depth = 0,
  replies = [],
}) => {
  const user_image_path = process.env.NEXT_PUBLIC_USER_IMAGES_ENDPOINT;
  const [isCommentLiked, setIsCommentLiked] = useState(isLikedByCurrentUser);
  const [showReplies, setShowReplies] = useState(false);

  const toggleReplies = () => setShowReplies(!showReplies);

  const userID = useUser();

  const likeComments = async () => {
    const formData = new FormData();
    formData.append("operation", "likeComment");
    formData.append(
      "json",
      JSON.stringify({
        user_id: userID.user_id,
        comment_id: comment_id,
      })
    );

    const { success, message, data } = await likeComment({ formData });

    if (!success) {
      return toast.error("Oops! something went wrong liking the comment");
    }

    toast.success("Comment Liked");
    setIsCommentLiked(1);
  };

  const unlikeComments = async () => {
    const formData = new FormData();
    formData.append("operation", "unlikeComment");
    formData.append(
      "json",
      JSON.stringify({
        user_id: userID.user_id,
        comment_id: comment_id,
      })
    );

    const { success, message, data } = await unlikeComment({ formData });

    if (!success) {
      return toast.error("Oops! something went wrong unliking the comment");
    }

    toast.success("Comment Unliked");
    setIsCommentLiked(0);
  };

  return (
    <div className={`relative ${depth > 0 ? "ml-8" : ""}`}>
      {depth > 0 && (
        <div className="absolute left-[-24px] top-0 h-full">
          <div className="absolute left-0 top-0 h-full w-px bg-gray-600"></div>
          <div className="absolute left-0 top-4 w-6 h-6 border-l border-b border-gray-600 rounded-bl-xl"></div>
        </div>
      )}
      <Card className="bg-transparent border-none shadow-none mb-2">
        <CardContent className="p-0">
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8 mt-1">
              <AvatarImage src={authorImage} alt={author} />
              <AvatarFallback className="bg-gray-600 text-white">
                {author[0]}
              </AvatarFallback>
            </Avatar>

            <Card
              className={`bg-gray-800 border-none shadow-none flex-grow ${
                isSending ? "opacity-50" : ""
              }`}
            >
              <CardContent className="p-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">
                      {author}
                      <span className="text-gray-300 text-md mx-1">·</span>
                      <span className="text-gray-400 text-xs">@{username}</span>
                    </span>
                    <span className="text-gray-400 text-xs">
                      {timeAgo(createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300">{content}</p>

                  {!isSending && (
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0"
                        onClick={isCommentLiked ? unlikeComments : likeComments}
                      >
                        {isCommentLiked ? (
                          <HeartFilledIcon className="h-5 w-5 text-red-500" />
                        ) : (
                          <Heart className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>

                      <Button variant="ghost" size="sm" className="p-0">
                        <MessageCircle className="h-5 w-5 text-gray-400" />
                      </Button>
                      {replies.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0"
                          onClick={toggleReplies}
                        >
                          <CornerDownRight className="h-5 w-5 text-gray-400" />
                          <span className="ml-1 text-gray-400">
                            {replies.length}
                          </span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {isSending && (
        <p className="text-xs text-gray-400 mt-1 ml-11">Sending comment...</p>
      )}

      {showReplies && replies.length > 0 && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showReplies ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {replies.map((reply) => (
            <CommentCard
              key={reply.reply_id}
              author={reply.first_name + " " + reply.last_name}
              username={reply.username}
              content={reply.content}
              createdAt={reply.timestamp}
              authorImage={user_image_path + reply.profile_image}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
