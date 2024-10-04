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
import { canPostAgainFunc } from "@/lib/actions/users";

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

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();

      img.onload = () => {
        const aspectRatio = img.width / img.height;

        if (aspectRatio < 1.91 / 1 || aspectRatio > 4 / 5) {
          console.warn("Aspect ratio not supported; image will be cropped.");
          setCount((prevCount) => prevCount + 1);
          resolve(file);
          return;
        }

        if (img.width < 320) {
          reject(new Error("Image width must be at least 320 pixels."));
          return;
        }

        if (img.width >= 320 && img.width < 1080) {
          setCount((prevCount) => prevCount + 1);
          resolve(file);
          return;
        }

        if (img.width < 1080 || img.height < 1350) {
          reject(
            new Error(
              "Image must be at least 1080 pixels wide and 1350 pixels tall."
            )
          );
          return;
        }

        setCount((prevCount) => prevCount + 1);
        resolve(file);
      };

      img.onerror = () => reject(new Error("Invalid image file"));
      img.src = URL.createObjectURL(file);
    });
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
      const { success, message, data } = await canPostAgainFunc(currentUserID);
      setCanPostAgain(success);
    };

    checkCanPost();
  }, [currentUserID]);

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

  useEffect(() => {
    console.log("showCamera state:", showCamera);
  }, [showCamera]);

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
            {loading ? <span>Loading...</span> : "Post Content"}
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

        <Dialog open={showCamera} onOpenChange={setShowCamera}>
          <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-none shadow-lg">
            <DialogHeader className="border-b border-gray-700 pb-4">
              <DialogTitle className="text-2xl font-bold text-center text-purple-400">
                Capture Your Moment
              </DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-80 mt-4 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <Button
                type="button"
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-all duration-300 ease-in-out flex items-center space-x-2"
                onClick={takeSelfie}
              >
                <Camera className="h-5 w-5" />
                <span>Capture</span>
              </Button>
            </div>
            <Button
              type="button"
              className="absolute top-2 right-2 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white rounded-full p-2 transition-colors duration-200"
              onClick={() => setShowCamera(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogContent>
        </Dialog>
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </form>
      <Toaster position="bottom-left" reverseOrder={false} />
    </Form>
  );
};

export default PostThread;
