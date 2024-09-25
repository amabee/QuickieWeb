import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck2 } from "lucide-react";

export const HoverProfileCard = ({
  name,
  username,
  imgUrl,
  followers,
  following,
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer font-medium text-gray-200 hover:underline">
          {name}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 p-0 bg-dark-2 shadow-2xl drop-shadow-xl rounded-lg ">
        <div className="relative pb-11">
          <div className="h-24 rounded-t-lg overflow-hidden">
            <img
              src={"/assets/bg.jpg"}
              alt="Profile background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-14 left-4">
            <Avatar className="w-20 h-20 border-4 border-gray-200">
              <AvatarImage src={imgUrl} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="px-3 pb-5">
          <h2 className="text-xl font-semibold text-gray-200">{name}</h2>
          <p className="text-sm text-gray-500">@{username}</p>
          <div className="mt-4 flex justify-around text-sm">
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-100">10k</span>
              <span className="text-xs text-gray-300">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-100">10k</span>
              <span className="text-xs text-gray-300">Following</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between space-x-2">
            <Button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800">
              Poke
            </Button>
            <Button className="flex-1 bg-gray-600 hover:bg-blue-600 text-white">
              <UserCheck2 size={16} /> Following
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
