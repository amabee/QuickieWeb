import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from "react-hot-toast";
import { useUser } from "@/lib/UserContext";
import { createPost } from "@/lib/actions/posts";
import { PostValidation } from "@/lib/helper";
import { canPostAgainFunc, updatePostCoolDown } from "@/lib/actions/users";

const PostThread = () => {
  const [images, setImages] = useState([]);
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [thread, setThread] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidInput, setIsValidInput] = useState(false);
  const [canPostAgain, setCanPostAgain] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeLeftFormatted, setTimeLeftFormatted] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const currentUserID = useUser();

  const form = useForm({
    defaultValues: {
      thread: "",
      accountId: currentUserID,
    },
  });

  const updateCooldown = async () => {
    const formData = new FormData();
    formData.append("operation", "updatePostTime");
    formData.append(
      "json",
      JSON.stringify({
        user_id: currentUserID.user_id,
      })
    );

    try {
      const { success, message, data } = await updatePostCoolDown({ formData });

      if (!success) {
        return toast.error(
          typeof message === "string" ? message : JSON.stringify(message)
        );
      }

      toast.success("Cooldown baby");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("operation", "createPost");
    formData.append(
      "json",
      JSON.stringify({
        user_id: currentUserID.user_id,
        content: thread,
        expiry_duration: "1Hour",
      })
    );

    images.forEach((image) => formData.append("images[]", image));

    setLoading(true);

    try {
      const { success, message } = await createPost({ formData });

      if (!success) {
        return toast.error(
          typeof message === "string" ? message : JSON.stringify(message)
        );
      }

      setThread("");
      setImages([]);
      setCanPostAgain(false);
      localStorage.removeItem("postTimerLimit");
      setTimeLeft("");
      setTimeLeftFormatted("");
      toast.success(
        typeof message === "string" ? message : "Post submitted successfully!"
      );
    } catch (error) {
      console.log("Error creating post:", error);
      toast.error("An error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setCount((prevCount) => prevCount - 1);
  };

  const openCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const takeSelfie = () => {
    if (canvasRef.current && videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        setImages((prevImages) => [...prevImages, file]);
        setCount((prevCount) => prevCount + 1);
        closeCamera();
      }, "image/jpeg");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  useEffect(() => {
    setIsValidInput(PostValidation(thread));
  }, [thread]);

  useEffect(() => {
    const checkCanPost = async () => {
      const { success, message } = await canPostAgainFunc(
        currentUserID.user_id
      );
      setCanPostAgain(success);

      console.log("Can Post? ", message);
    };
    checkCanPost();

    const storedCooldown = localStorage.getItem("postTimerLimit");
    const postTimerLimitDuration = 3 * 60 * 1000;

    if (canPostAgain) {
      if (!storedCooldown) {
        const postTimerLimit = Date.now() + postTimerLimitDuration;
        localStorage.setItem("postTimerLimit", postTimerLimit.toString());
        setTimeLeft(Math.floor(postTimerLimitDuration / 1000));
      }

      const timer = setInterval(() => {
        const now = Date.now();
        const cooldownEnd = parseInt(
          localStorage.getItem("postTimerLimit"),
          10
        );

        if (now < cooldownEnd) {
          const remainingTime = Math.floor((cooldownEnd - now) / 1000);
          setTimeLeft(remainingTime);
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          setTimeLeftFormatted(`${minutes}m ${seconds}s`);
        } else {
          clearInterval(timer);
          localStorage.removeItem("postTimerLimit");
          updateCooldown();
          setCanPostAgain(false);
          setTimeLeft(0);
          setTimeLeftFormatted("");
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      if (storedCooldown) {
        const postTimerLimitEnd = parseInt(storedCooldown, 10);
        const now = Date.now();
        if (now < postTimerLimitEnd) {
          const remainingTime = Math.max(0, postTimerLimitEnd - now);
          setTimeLeft(Math.floor(remainingTime / 1000));
          const minutes = Math.floor(remainingTime / 60000);
          const seconds = Math.floor((remainingTime % 60000) / 1000);
          setTimeLeftFormatted(`${minutes}m ${seconds}s`);
        } else {
          setCanPostAgain(true);
          localStorage.removeItem("postTimerLimit");
          setTimeLeftFormatted("");
        }
      }
    }
  }, [currentUserID, canPostAgain]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    return () => {
      closeCamera();
    };
  }, []);

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        encType="multipart/form-data"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {images.length > 0 && (
          <div className="mt-4">
            <Carousel className="w-full max-w-xs mx-auto" setApi={setApi}>
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded image ${index + 1}`}
                      width={300}
                      height={375}
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="py-2 text-center text-sm text-muted-foreground">
              Slide {current} of {count}
            </div>
          </div>
        )}
        <FormField
          control={form.control}
          name="thread"
          render={() => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <textarea
                  rows={8}
                  value={thread}
                  onChange={(e) => setThread(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button
            type="button"
            className="bg-primary-500"
            disabled={loading || !isValidInput || !canPostAgain}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              `Post Content (${timeLeftFormatted})`
            )}
          </Button>
          <Button
            type="button"
            className="bg-secondary text-secondary-foreground hover:bg-indigo-600"
            onClick={openCamera}
          >
            <Camera className="mr-2 h-4 w-4" />
            Take Selfie
          </Button>
        </div>

        {showCamera && (
          <Dialog open={showCamera} onOpenChange={closeCamera}>
            <DialogContent className="flex flex-col items-center">
              <DialogHeader>
                <DialogTitle>Camera</DialogTitle>
              </DialogHeader>
              <video
                ref={videoRef}
                autoPlay
                className="border border-gray-400 rounded-lg mb-4"
                style={{ width: "300px", height: "375px" }}
              />
              <Button onClick={takeSelfie}>Capture</Button>
              <Button type="button" onClick={closeCamera}>
                Close
              </Button>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </DialogContent>
          </Dialog>
        )}
      </form>
      <Toaster position="bottom-left" reverseOrder={false} />
    </Form>
  );
};

export default PostThread;
