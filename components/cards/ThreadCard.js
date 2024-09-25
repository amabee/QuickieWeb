import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";
import lottie from "lottie-web";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { likePost } from "@/lib/actions/posts";
import toast, { Toaster } from "react-hot-toast";
import ThreadModal from "../shared/ThreadModal";
import { HoverProfileCard } from "../shared/HoverProfileCard";

const user_image_path = process.env.NEXT_PUBLIC_USER_IMAGES_ENDPOINT;
const post_images_path = process.env.NEXT_PUBLIC_POST_IMAGES_ENDPOINT;

function ThreadCard({
  id,
  currentUserId,
  content,
  author,
  createdAt,
  postExpiry,
  comments,
  isComment,
  username,
  creator_image,
  post_images,
  isLiked: initialIsLiked,
}) {
  const [isLiked, setIsLiked] = useState(initialIsLiked === 1);
  const [showAnimation, setShowAnimation] = useState(false);
  const lottieRef = useRef(null);
  const animationRef = useRef(null);
  const contentRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const handleThreadModalOpen = () => setIsOpen(true);
  const handleThreadModalClose = () => setIsOpen(false);

  const imageArray = post_images ? post_images.split(",") : [];

  const likePosts = async () => {
    const formData = new FormData();

    formData.append("operation", "likePost");
    formData.append(
      "json",
      JSON.stringify({
        user_id: currentUserId,
        post_id: id,
      })
    );
    const { success, message, data } = await likePost({ formData });

    if (!success) {
      return toast.error(message);
    }
  };

  const unlikePosts = async () => {
    const formData = new FormData();

    formData.append("operation", "dislikePost");
    formData.append(
      "json",
      JSON.stringify({
        user_id: currentUserId,
        post_id: id,
      })
    );
    const { success, message, data } = await likePost({ formData });

    if (!success) {
      return toast.error(message);
    }
  };

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      setShowAnimation(true);
      if (animationRef.current) {
        animationRef.current.goToAndPlay(0);
      }
      setTimeout(() => setShowAnimation(false), 1500);
      likePosts();
    } else {
      setIsLiked(false);
      unlikePosts();
    }

    // For example: updateLikeStatus(id, !isLiked);
  };

  const handleContentClick = (event) => {
    // Check if it's a double click
    if (event.detail === 2) {
      handleLike();
    }
  };

  useEffect(() => {
    if (lottieRef.current && showAnimation) {
      animationRef.current = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "/assets/heart-anim.json",
      });

      const timeoutId = setTimeout(() => {
        setShowAnimation(false);
      }, 1500);
      return () => {
        animationRef.current.destroy();
        clearTimeout(timeoutId);
      };
    }
  }, [showAnimation]);

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href="#" className="relative h-11 w-11">
              <img
                src={user_image_path + creator_image}
                alt="user_image"
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col relative" ref={contentRef}>
            <h3 className="cursor-pointer text-base-semibold text-light-1">
              <HoverProfileCard
                name={author}
                username={username}
                imgUrl={user_image_path + creator_image}
                // followers={followers}
                // following={following}
                // posts={posts}
              >
                {author}
              </HoverProfileCard>
            </h3>

            <h6 className="text-sm text-gray-1 disabled">@{username}</h6>
            <div
              className="relative mt-2 text-small-regular text-light-2"
              onClick={handleContentClick}
            >
              <p>{content}</p>
            </div>

            {/* Image Carousel */}
            {imageArray.length > 0 && (
              <div
                className="mt-3 max-w-full overflow-hidden rounded-lg"
                onClick={handleContentClick}
              >
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {imageArray.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <img
                            src={post_images_path + image.trim()}
                            alt={`Post image ${index + 1}`}
                            className="w-full object-cover rounded-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
              </div>
            )}

            {showAnimation && (
              <div
                ref={lottieRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none z-[9999]"
              />
            )}

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <button onClick={handleLike}>
                  <Image
                    src={
                      isLiked
                        ? "/assets/heart-filled.svg"
                        : "/assets/heart-gray.svg"
                    }
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </button>
                <button onClick={() => handleThreadModalOpen()}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </button>
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/thread/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && (
        <div>
          <p className="text-subtle-medium text-gray-1 mt-3">
            Posted At: {formatDateString(createdAt)}
          </p>
          <p className="text-subtle-medium text-gray-1 mt-3">
            Expires At: {formatDateString(postExpiry)}
          </p>
        </div>
      )}

      <Toaster position="bottom-left" reverseOrder={false} />
      <ThreadModal
        post={{
          id,
          content,
          author,
          createdAt,
          comments,
          isComment,
          username,
          creator_image,
          post_images,
        }}
        isOpen={isOpen}
        onClose={handleThreadModalClose}
      />
    </article>
  );
}

export default ThreadCard;
