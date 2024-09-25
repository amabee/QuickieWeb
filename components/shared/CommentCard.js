"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { timeAgo } from "@/lib/utils";

const CommentCard = ({
  post_id,
  author,
  username,
  content,
  createdAt,
  authorImage,
  isSending,
}) => {
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="p-0 mb-2">
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
                  </span>
                  <span className="text-gray-400 text-xs">
                    {timeAgo(createdAt)}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">@{username}</span>
                <p className="text-sm text-gray-300">{content}</p>
                {!isSending && (
                  <div className="flex space-x-2 mt-2">
                    <Button variant="ghost" size="sm" className="p-0">
                      <Heart className="h-4 w-4 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0">
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      {isSending && (
        <p className="text-xs text-gray-400 mt-1 ml-11">Sending comment...</p>
      )}
    </Card>
  );
};

export default CommentCard;
