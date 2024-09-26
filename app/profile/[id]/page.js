"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { profileTabs } from "@/global/sidebar_links";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "../../globals.css";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { useUser } from "@/lib/UserContext";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getCurrentUserFollowers,
  getCurrentUserPosts,
  getCurrentUserFollowings,
} from "@/lib/actions/users";
import toast, { Toaster } from "react-hot-toast";
import UserCard from "@/components/cards/UserCard";

function Profile() {
  const user_image_path = process.env.NEXT_PUBLIC_USER_IMAGES_ENDPOINT;
  const post_image_path = process.env.NEXT_PUBLIC_POST_IMAGES_ENDPOINT;

  const currentUserID = useUser();
  const id = currentUserID?.user_id ?? null;
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserPosts, setCurrentUserPosts] = useState([]);
  const [currentUserFollowers, setCurrentUserFollowers] = useState([]);
  const [currentUserFollowings, setCurrentUserFollowings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentUserData = async () => {
    if (id !== null) {
      setIsLoading(true);

      try {
        const { success, message, data } = await getCurrentUser(id);

        if (!success) {
          setCurrentUser(null);
          return toast.error(message);
        }

        setCurrentUser(data);
      } catch (error) {
        return toast.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchCurrentUserPosts = async () => {
    if (id !== null) {
      setIsLoading(true);

      try {
        const { success, message, data } = await getCurrentUserPosts(id);

        if (!success) {
          setCurrentUserPosts([]);
          return toast.error(message);
        }

        setCurrentUserPosts(data);
      } catch (error) {
        return toast.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchCurrentUserFollowers = async () => {
    if (id !== null) {
      setIsLoading(true);
      try {
        const { success, message, data } = await getCurrentUserFollowers(id);
        if (!success) {
          setCurrentUserFollowers([]);
          return toast.error(message);
        }
        setCurrentUserFollowers(data);
      } catch (error) {
        toast.error("Error fetching followers");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchCurrentUserFollowing = async () => {
    if (id !== null) {
      setIsLoading(true);
      try {
        const { success, message, data } = await getCurrentUserFollowings(id);
        if (!success) {
          setCurrentUserFollowings([]);
          return toast.error(message);
        }
        setCurrentUserFollowings(data);
      } catch (error) {
        toast.error("Error fetching following people");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (id !== null) {
      fetchCurrentUserData();
      fetchCurrentUserPosts();
      fetchCurrentUserFollowing();
      fetchCurrentUserFollowers();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <h1 className="head-text text-heading4-medium">Loading...</h1>
      </div>
    );
  }

  if (!currentUser) {
    return <div>No user data found</div>;
  }

  return (
    <section>
      <Toaster position="bottom-left" />
      <ProfileHeader
        accountId={currentUser.user_id}
        authUserId={currentUser.user_id}
        firstname={currentUser.first_name}
        lastname={currentUser.last_name}
        username={currentUser.username}
        email={currentUser.email}
        imgUrl={user_image_path + currentUser.profile_image}
        bio={currentUser.bio || "No bio available"}
      />

      <div className="mt-9">
        <Tabs defaultValue="snaps" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Recent Snaps" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {currentUserPosts.length}
                  </p>
                )}
                {tab.label === "Followers" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {currentUser.followers_count || 0}
                  </p>
                )}
                {tab.label === "Following" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {currentUser.following_count || 0}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="snaps" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={currentUser.user_id}
              accountId={currentUser.user_id}
              posts={currentUserPosts}
            />
          </TabsContent>

          <TabsContent value="followers" className="w-full text-light-1">
            {isLoading ? (
              <p>Loading followers...</p>
            ) : (
              currentUserFollowers.map((follower) => (
                <UserCard
                  key={follower.user_id}
                  id={follower.user_id}
                  name={`${follower.first_name} ${follower.last_name}`}
                  username={follower.username}
                  imgUrl={user_image_path + follower.profile_image}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="following" className="w-full text-light-1 mt-5">
            {isLoading ? (
              <p>Loading followers...</p>
            ) : (
              currentUserFollowings.map((following) => (
                <div className="mb-4">
                  <h1>{following.following_count}</h1>
                  <UserCard
                    key={following.following_id}
                    id={following.following_id}
                    name={`${following.first_name} ${following.last_name}`}
                    username={following.username}
                    imgUrl={user_image_path + following.profile_image}
                    isFollowing={following.is_following}
                  />
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Profile;
