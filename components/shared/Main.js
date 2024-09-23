import ThreadCard from "../cards/ThreadCard";
import Pagination from "./Pagination";

const samplePosts = [
  {
    _id: "1",
    parentId: null,
    text: "This is the first thread post.",
    author: {
      id: "user1",
      name: "Alice",
      avatar: "/images/alice.png",
    },
    community: "General Discussion",
    createdAt: "2024-09-20T12:34:56Z",
    children: [
      {
        _id: "c1",
        text: "This is a comment on the first post.",
        author: {
          id: "user2",
          name: "Bob",
          avatar: "/images/bob.png",
        },
        createdAt: "2024-09-20T13:00:00Z",
      },
    ],
  },
  {
    _id: "2",
    parentId: null,
    text: "This is the second thread post.",
    author: {
      id: "user3",
      name: "Charlie",
      avatar: "/images/charlie.png",
    },
    community: "Tech Talk",
    createdAt: "2024-09-21T08:15:30Z",
    children: [],
  },
  {
    _id: "3",
    parentId: null,
    text: "Check out this interesting topic!",
    author: {
      id: "user1",
      name: "Alice",
      avatar: "/images/alice.png",
    },
    community: "News",
    createdAt: "2024-09-22T09:45:12Z",
    children: [
      {
        _id: "c2",
        text: "I find this very insightful!",
        author: {
          id: "user2",
          name: "Bob",
          avatar: "/images/bob.png",
        },
        createdAt: "2024-09-22T10:00:00Z",
      },
      {
        _id: "c3",
        text: "Can you provide more details?",
        author: {
          id: "user4",
          name: "Daisy",
          avatar: "/images/daisy.png",
        },
        createdAt: "2024-09-22T10:15:00Z",
      },
    ],
  },
];

const result = {
  posts: samplePosts,
  isNext: true, // Set to false if there are no more posts
};

// Usage in your Home component
async function Home({ searchParams }) {
  // Replace fetchPosts with the mock data
  const result = {
    posts: samplePosts,
    isNext: true, // Example: set to true if there are more pages
  };

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={1} 
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Home;
