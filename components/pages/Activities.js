"use client";
import { getNotifs } from "@/lib/actions/users";
import { useUser } from "@/lib/UserContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

function Activity() {
  const USER_IMAGE = process.env.NEXT_PUBLIC_USER_IMAGES_ENDPOINT;
  const currentUserID = useUser();
  const id = currentUserID?.user_id ?? null;

  const [notifications, setNotifications] = useState([]);

  const getNotifications = async () => {
    const response = await getNotifs(id);

    if (!response.success) {
      toast.error("?");
      return;
    }

    setNotifications(response.data);
  };

  useEffect(() => {
    if (id) {
      getNotifications();

      const intervalId = setInterval(() => {
        getNotifications();
      }, 2500);

      return () => clearInterval(intervalId);
    }
  }, [id]);
  return (
    <div>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <article
              key={notification.id}
              className="activity-card flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={
                    USER_IMAGE + notification.profile_image ||
                    "/images/pic1.jpg"
                  }
                  alt="user_logo"
                  width={50}
                  height={50}
                  className="rounded-full object-cover mr-4"
                />
                <p className="!text-small-regular text-light-2">
                  <span className="mr-1 text-primary-500">
                    {notification.first_name} {notification.last_name}
                  </span>
                  {notification.message}
                </p>
              </div>
              {notification.is_read === 0 && (
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full w-8 h-8 flex items-center justify-center"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </article>
          ))
        ) : (
          <p className="text-center text-gray-500 text-body1-bold ">
            No recent activity
          </p>
        )}
      </section>
    </div>
  );
}

export default Activity;
