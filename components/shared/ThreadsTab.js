import ThreadCard from "../cards/ThreadCard";

function ThreadsTab({ currentUserId, accountId, posts }) {
  if (!posts || posts.length === 0) {
    return <p>No posts found.</p>;
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {posts.map((post) => (
        <ThreadCard
          key={post.id}
          id={post.post_id}
          currentUserId={currentUserId}
          content={post.content}
          author={`${post.first_name} ${post.last_name}`}
          createdAt={post.timestamp}
          postExpiry={post.expiry_duration}
          comments={[]}
          // isComment={false}
           username={post.username}
          creator_image={post.profile_image}
          post_images={post.post_images}
          isLiked={post.liked_by_user}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;
