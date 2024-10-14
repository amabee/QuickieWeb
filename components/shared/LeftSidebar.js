import Image from "next/image";
import { sidebarLinks } from "@/global/sidebar_links";
import lottie from "lottie-web";
import { useEffect, useRef } from "react";

const LeftSidebar = ({ setCurrentView, currentView, notifications }) => {
  const notificationRef = useRef(null);

  useEffect(() => {
    if (notificationRef.current) {
      const anim = lottie.loadAnimation({
        container: notificationRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/assets/notif-anim.json",
      });

      return () => anim.destroy();
    }
  }, [notifications]);


  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive = currentView === link.label;
          const hasNotification =
            link.notificationKey && notifications[link.notificationKey];

          return (
            <button
              key={link.label}
              className={`leftsidebar_link ${
                isActive ? "bg-primary-500" : ""
              } relative`}
              onClick={() => setCurrentView(link.label)}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
              {hasNotification && (
                <div
                  ref={notificationRef}
                  className="absolute top-0 right-0 h-6 w-6"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
