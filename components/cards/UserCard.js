"use client";
import { Button } from "../ui/button";
import { IoMdPersonAdd } from "react-icons/io";
import { FaUserCheck } from "react-icons/fa";
import { followUser, unfollowUser } from "@/lib/actions/users";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/lib/UserContext";
import { useState } from "react";

function UserCard({ id, name, username, imgUrl, isFollowing, isCurrentUser }) {
  const [isFollowings, setIsFollowings] = useState(isFollowing);
  const currentUserID = useUser();
  const cuid = currentUserID?.user_id ?? null;

  const followUsers = async (following_id) => {
    const formData = new FormData();
    formData.append("operation", "followUser");
    formData.append(
      "json",
      JSON.stringify({
        follower_id: cuid,
        following_id: following_id,
      })
    );
    const { success, message } = await followUser({ formData });

    if (!success) {
      return toast.error(message);
    }

    toast.success("You are now following " + name);
    setIsFollowings(true);
  };

  const unfollowUsers = async (unFollowing_id) => {
    const formData = new FormData();
    formData.append("operation", "unfollowUser");
    formData.append(
      "json",
      JSON.stringify({
        follower_id: cuid,
        following_id: unFollowing_id,
      })
    );
    const { success, message } = await unfollowUser({ formData });

    if (!success) {
      return toast.error(message);
    }

    toast.success("You just unfollowed " + name);
    setIsFollowings(false);
  };

  return (
    <article className="user-card">
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="user-card_avatar">
        <div className="relative h-12 w-12">
          <img
            src={imgUrl}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1 cursor-pointer">
            {name}
          </h4>
          <p className="text-small-medium text-gray-1 cursor-pointer">
            @{username}
          </p>
        </div>
      </div>

      {!isCurrentUser && (
        <div>
          {isFollowings ? (
            <Button
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => unfollowUsers(id)}
            >
              <FaUserCheck size={18} className="mr-2" /> Following
            </Button>
          ) : (
            <Button
              className="bg-indigo-500 hover:bg-indigo-600"
              onClick={() => followUsers(id)}
            >
              <IoMdPersonAdd size={18} className="mr-2" /> Follow
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

export default UserCard;
