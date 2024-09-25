"use client";
import { useUser } from "@/lib/UserContext";
import ThreadCard from "../cards/ThreadCard";
import { useEffect, useState, useRef } from "react";
import { getPosts } from "@/lib/actions/posts";
import toast, { Toaster } from "react-hot-toast";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const limit = 15;
  const currentUserID = useUser();
  const id = currentUserID?.user_id ?? null;
  const scrollPositionRef = useRef(0);

  const getPost = async (newOffset = 0) => {
    if (id !== null) {
      setLoading(newOffset === 0);
      setLoadingMore(newOffset !== 0);

      //await new Promise((resolve) => setTimeout(resolve, 3000));

      setIsLoading(false);
      try {
        const { success, message, data } = await getPosts(id, limit, newOffset);

        if (!success) {
          setPosts([]);
          toast.error(message || "Failed to load posts");
        } else {
          setPosts((prevPosts) =>
            newOffset === 0 ? data : [...prevPosts, ...data]
          );

          if (data.length < limit) {
            setHasMorePosts(false);
            if (newOffset !== 0) {
              toast.success("No more posts to load");
            }
          } else {
            setHasMorePosts(true);
          }
        }
      } catch (error) {
        toast.error("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setIsLoading(false);
      }
    } else if (id === null) {
      console.error("User ID not available");
      toast.error("User ID not available");
    }
  };

  useEffect(() => {
    if (id !== null) {
      getPost();
    }
  }, [id]);

  const handleScroll = () => {
    if (loading || loadingMore || !hasMorePosts) {
      return;
    }

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY + windowHeight >= documentHeight - 100) {
      scrollPositionRef.current = scrollY;
      setOffset((prevOffset) => prevOffset + limit);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (id !== null && !loading && !loadingMore && hasMorePosts) {
      getPost(offset);
    }
  }, [offset]);

  useEffect(() => {
    if (id !== null) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loading, loadingMore, hasMorePosts]);

  useEffect(() => {
    if (!loadingMore) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [posts]);

  if (id === null) {
    return <p>Loading user data...</p>;
  }

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <section className="mt-9 flex flex-col gap-10">
          {posts.length === 0 ? (
            <p className="no-result">No Quick Snaps found</p>
          ) : (
            <>
              <Toaster position="bottom-left" reverseOrder={false} />
              {posts.map((post) => (
                <ThreadCard
                  key={post.post_id}
                  id={post.post_id}
                  currentUserId={id}
                  creator_image={post.profile_image}
                  content={post.content}
                  author={post.first_name + " " + post.last_name}
                  username={post.username}
                  createdAt={post.timestamp}
                  postExpiry={post.expiry_duration}
                  comments={1}
                  post_images={post.post_images}
                  isLiked={post.liked_by_user}
                />
              ))}
              {isLoading && hasMorePosts && (
                <h1 className="head-text text-center">LOADING MORE POSTS...</h1>
              )}
              {!hasMorePosts && posts.length > 0 && (
                <p className="text-center text-gray-500">
                  No more posts to display
                </p>
              )}
            </>
          )}
        </section>
      )}
    </>
  );
}

export default Home;
