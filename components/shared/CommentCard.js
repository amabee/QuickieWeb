import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "../ui/card";

const CommentCard = ({ author, content, createdAt, authorImage }) => {
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="p-0">
        <div className="flex items-start space-x-3">
          <Avatar className="w-8 h-8 mt-1">
            <AvatarImage src={authorImage} alt={author} />
            <AvatarFallback className="bg-gray-600 text-white">
              {author[0]}
            </AvatarFallback>
          </Avatar>
          
          <Card className="bg-gray-800 border-none shadow-none flex-grow">
            <CardContent className="p-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white">
                    {author}
                  </span>
                  <span className="text-gray-400 text-xs">{createdAt}</span>
                </div>
                <p className="text-sm text-gray-300">{content}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;