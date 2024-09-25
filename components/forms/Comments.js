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
      

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;
