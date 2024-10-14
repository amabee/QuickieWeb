import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import { toast, Toaster } from "react-hot-toast";
import { useUser } from "@/lib/UserContext";
import { createPost } from "@/lib/actions/posts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostValidation } from "@/lib/helper";
import { canPostAgainFunc } from "@/lib/actions/users";

const PostThread = () => {
  const [images, setImages] = useState([]);
  const [api, setApi] = useState();
  const [current, setCurrent] = useState();
  const [count, setCount] = useState(0);
  const [thread, setThread] = useState("");
  const [expirationTime, setExpirationTime] = useState("24Hours");
  const [loading, setLoading] = useState(false);
  const [isValidInput, setIsValidInput] = useState(false);
  const [canPostAgain, setCanPostAgain] = useState(false);

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
      setLoading(false); // Stop loading
    }
  };

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();

      img.onload = () => {
        const aspectRatio = img.width / img.height;

        // Check for aspect ratio between 1.91:1 and 4:5
        if (aspectRatio < 1.91 / 1 || aspectRatio > 4 / 5) {
          // Aspect ratio is not supported; allow upload but note it will be cropped
          console.warn("Aspect ratio not supported; image will be cropped.");
          setCount((prevCount) => prevCount + 1); // Increment the count for valid upload
          resolve(file); // Resolve the promise to allow upload
          return;
        }

        if (img.width < 320) {
          reject(new Error("Image width must be at least 320 pixels."));
          return;
        }

        // If the width is between 320 and 1080 pixels, allow it to retain its original resolution
        if (img.width >= 320 && img.width < 1080) {
          setCount((prevCount) => prevCount + 1); // Increment the count for valid upload
          resolve(file); // Resolve to allow upload at original resolution
          return;
        }

        // Check for original image validation (width >= 1080)
        if (img.width < 1080 || img.height < 1350) {
          reject(
            new Error(
              "Image must be at least 1080 pixels wide and 1350 pixels tall."
            )
          );
          return;
        }

        // If all conditions are met, resolve the file
        setCount((prevCount) => prevCount + 1); // Increment the count for valid upload
        resolve(file);
      };

      img.onerror = () => reject(new Error("Invalid image file"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        await validateImage(file);
        setImages((prevImages) => [...prevImages, file]);
      } catch (error) {
        toast.error(error.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setIsValidInput(PostValidation(thread));
  }, [thread]);

  useEffect(() => {
    const checkCanPost = async () => {
      const { success, message, data } = await canPostAgainFunc(currentUserID);

      if (!success) {
        setCanPostAgain(false);
        // toast.error(message, {
        //   style: {
        //     borderRadius: "10px",
        //     background: "#333",
        //     color: "#fff",
        //   },
        // });
      } else {
        setCanPostAgain(true);
      }
    };

    checkCanPost();
  }, [currentUserID]);

  // console.log("Can Post?: ", canPostAgain);

  const handleMenuItemClick = (expirationTime) => {
    setExpirationTime(expirationTime);
    console.log(expirationTime);

    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

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
                      onClick={() => {
                        removeImage(index);
                        setCount((index) => index - 1);
                      }}
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
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                className="bg-primary-500"
                disabled={loading || !isValidInput || !canPostAgain}
              >
                {loading ? <span>Loading...</span> : "Post Content"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-indigo-500">
              <DropdownMenuLabel className="text-white">
                Select Post Duration:
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {["24Hours", "12Hours", "5Hours", "1Hour", "30Mins"].map(
                (time) => (
                  <DropdownMenuItem
                    key={time}
                    className="hover:bg-indigo-600 cursor-pointer"
                    onClick={() => handleMenuItemClick(time)}
                  >
                    <button
                      type="button"
                      className="cursor-pointer bg-transparent text-secondary-background text-fuchsia-50
                      inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2"
                      disabled={loading}
                    >
                      {time.replace(/([A-Z])/g, " $1")}
                    </button>
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu> */}

          <Button
            type="button"
            className="bg-primary-500"
            disabled={loading || !isValidInput || !canPostAgain}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {loading ? <span>Loading...</span> : "Post Content"}
          </Button>
          <label
            htmlFor="image-upload"
            className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-indigo-600 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
          >
            <Camera className="mr-2 h-4 w-4" />
            Add Portrait Image
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
        </div>
      </form>
      <Toaster position="bottom-left" reverseOrder={false} />
    </Form>
  );
};

export default PostThread;
