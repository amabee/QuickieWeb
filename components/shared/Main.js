"use client";
import { useUser } from "@/lib/UserContext";
import ThreadCard from "../cards/ThreadCard";
import { useEffect, useState } from "react";
import { getPosts } from "@/lib/actions/posts";
import toast, { Toaster } from "react-hot-toast";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const currentUserID = useUser();
  const id = currentUserID?.user_id ?? null;

  const getPost = async () => {
    if (id !== null) {
      setLoading(true);
      const { success, message, data } = await getPosts(id);

      if (!success) {
        console.log(message);
        setPosts([]);
      } else {
        setPosts(data);
        console.log(data);
      }
      console.log(id);
      setLoading(false);
    } else {
      toast.error("Wait what?");
    }
  };

  useEffect(() => {
    if (id !== null) {
      getPost();
    }
  }, [id]);

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
                  comments={1}
                  post_images={post.post_images}
                  isLiked={post.liked_by_user}
                />
              ))}
            </>
          )}
        </section>
      )}
    </>
  );
}

export default Home;
