"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/lib/actions/users";

const AccountProfileDialog = ({ user, btnTitle, isOpen, onOpenChange }) => {
  const [files, setFiles] = useState([]);

  const form = useForm({
    defaultValues: {
      profile_photo: user?.imgUrl || "",
      first_name: user?.firstname || "",
      last_name: user?.lastname || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (values) => {
    const formData = new FormData();

    formData.append("operation", "updateProfile");
    formData.append(
      "json",
      JSON.stringify({
        user_id: user.accountId,
        profile_image: values.imgUrl,
        first_name: values.first_name,
        last_name: values.last_name,
        username: values.username,
        email: values.email,
        bio: values.bio ?? "",
      })
    );

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const profilePhotoFile = files[0];
    if (profilePhotoFile) {
      formData.append("profile_image", profilePhotoFile);
    }

    const { success, message, data } = await updateProfile({ formData });

    if (success) {
      alert("Profile updated successfully!");
    } else {
      alert(`Error: ${message}`);
    }

    window.location.reload();
  };

  const handleImage = (e, fieldChange) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-gray-950 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">
            {/* Left side - Image upload */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cursor-pointer">
                      {field.value ? (
                        <img
                          src={field.value}
                          alt="profile_icon"
                          width={150}
                          height={150}
                          className="rounded-full object-cover border-2 border-blue-500"
                        />
                      ) : (
                        <div className="w-[150px] h-[150px] rounded-full bg-gray-700 flex items-center justify-center">
                          <img
                            src="/assets/profile.svg"
                            alt="profile_icon"
                            width={50}
                            height={50}
                            className="object-contain"
                          />
                        </div>
                      )}
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImage(e, field.onChange)}
                          className="hidden"
                        />
                      </FormControl>
                    </FormLabel>
                    <Button
                      type="button"
                      onClick={() =>
                        document.querySelector('input[type="file"]').click()
                      }
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                      Upload Image
                    </Button>
                  </FormItem>
                )}
              />
            </div>

            {/* Right side - Input fields */}
            <div className="flex-1 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 rounded p-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 rounded p-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 rounded p-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 rounded p-2"
                        disabled
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 resize-none rounded p-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button
              type="button"
              className="w-full bg-destructive hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            className="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {btnTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountProfileDialog;
