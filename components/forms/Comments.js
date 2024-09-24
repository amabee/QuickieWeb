"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CommentValidation } from "@/lib/validation/validations";

function Comment({ threadId, currentUserImg, currentUserId }) {

  return (
    <Form>
      <form className="comment-form">
        {/* <FormField
          name="thread"
          render={() => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  //   src={currentUserImg}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
            </FormItem>
          )}
        /> */}

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;
