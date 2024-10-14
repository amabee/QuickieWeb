import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "../ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDateString } from "@/lib/utils";
import CommentCard from "./CommentCard";
import { getComments, sendComment, sendReply } from "@/lib/actions/posts";
import { useUser } from "@/lib/UserContext";

const ThreadModal = ({ post, isOpen, onClose }) => {
  const user_image_path = process.env.NEXT_PUBLIC_USER_IMAGES_ENDPOINT;
  const post_images_path = process.env.NEXT_PUBLIC_POST_IMAGES_ENDPOINT;
  const imageArray = post.post_images ? post.post_images.split(",") : [];

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [parentID, setParentID] = useState(null);
  const userID = useUser();

  const sendComments = async () => {
    if (isSending || !comment.trim()) return;

    setIsSending(true);

    

    if (replyingTo) {
      await handleReplyMessage(replyingToCommentId);
    } else {
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

      const formData = new FormData();
      formData.append("operation", "sendComment");
      formData.append(
        "json",
        JSON.stringify({
          post_id: post.id,
          user_id: userID.user_id,
          content: comment,
          target_id: post.creator_id,
        })
      );

      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const { success, message, data } = await sendComment({ formData });

      if (!success) {
        console.log(message);
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== newComment.id)
        );
      } else {
        console.log(message);
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === newComment.id ? { ...c, isSending: false, ...data } : c
          )
        );
      }
    }

    setIsSending(false);
    setComment("");
    setReplyingTo(null);
    setReplyingToCommentId(null);
    getCommentsByPOST();
  };

  const getCommentsByPOST = async () => {
    const { success, message, data } = await getComments(
      post.id,
      userID.user_id
    );

    if (!success) {
      setComments([]);
      console.log(message);
      return;
    }

    setComments(data);
  };

  useEffect(() => {
    console.log(post);
    getCommentsByPOST();
  }, []);

  const handleReply = (username, commentId) => {
    setReplyingTo(username);
    setReplyingToCommentId(commentId);
  };

  const handleReplyParentID = (parentID) => {
    setParentID(parentID);
  };

  const handleReplyMessage = async (replyingToCommentId) => {
    const formData = new FormData();
    formData.append("operation", "addCommentReply");
    formData.append(
      "json",
      JSON.stringify({
        user_id: userID.user_id,
        post_id: post.id,
        main_id: replyingToCommentId,
        content: comment,
        parent_id: parentID,
      })
    );

    const { success, message, data } = await sendReply({ formData });

    if (!success) {
      console.log(message);
    } else {
      setComments((prevComments) => {
        return prevComments.map((c) => {
          if (c.id === replyingToCommentId) {
            return {
              ...c,
              replies: [...(c.replies || []), data],
            };
          }
          return c;
        });
      });
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyingToCommentId(null);
  };

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
              style={{ maxHeight: "20rem" }}
            >
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentCard
                    key={comment.id || comment.comment_id}
                    comment_id={comment.id || comment.comment_id}
                    post_id={post.id}
                    author={
                      comment.first_name && comment.last_name
                        ? `${comment.first_name} ${comment.last_name}`
                        : "Loading..."
                    }
                    username={comment.username || post.username}
                    content={comment.content}
                    createdAt={comment.timestamp}
                    authorImage={user_image_path + comment.profile_image}
                    isSending={comment.isSending}
                    isLikedByCurrentUser={comment.liked_by_user}
                    replies={comment.replies}
                    onReply={(username) =>
                      handleReply(username, comment.comment_id)
                    }
                    onReplyParentID={(reply_id) =>
                      handleReplyParentID(reply_id)
                    }
                  />
                ))
              ) : (
                <h3 className="text-center text-heading2-semibold translate-y-full">
                  No comments yet
                </h3>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t h-20 border-gray-800">
              <div className="mb-1 font-semibold">{post.likes || 0} likes</div>
              <div className="text-gray-400 text-xs">
                Posted On: {formatDateString(post.createdAt)}
              </div>
            </div>

            {/* Input section */}
            <div className="p-4 border-t border-gray-800">
              <div className="relative flex items-center">
                {replyingTo && (
                  <Badge variant="secondary" className="mr-2 flex-shrink-0">
                    Replying to @{replyingTo}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-0 h-auto ml-1"
                      onClick={cancelReply}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                <Input
                  placeholder="Add a comment..."
                  className="flex-grow pr-10 py-3 h-12 text-base pl-3"
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
