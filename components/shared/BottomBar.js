"use client";

import Image from "next/image";
import { sidebarLinks } from "@/global/sidebar_links";
import { useRef, useEffect, useState } from "react";
import lottie from "lottie-web";

function Bottombar({ setCurrentView, currentView, notifications }) {
  const notificationRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
      setIsMediumScreen(window.innerWidth > 640 && window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive = currentView === link.label;
          const hasNotification =
            link.notificationKey && notifications[link.notificationKey];

          return (
            <button
              onClick={() => setCurrentView(link.label)}
              key={link.label}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
              type="button"
            >
              {/* Render Lottie animation on small screens */}
              {isSmallScreen && hasNotification ? (
                <div
                  ref={notificationRef}
                  className="absolute top-0 right-0 h-6 w-6"
                />
              ) : (
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={16}
                  height={16}
                  className="object-contain"
                />
              )}

              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
                {hasNotification && isMediumScreen &&(
                  <div
                    ref={notificationRef}
                    className="absolute top-0 right-0 h-6 w-6"
                  />
                )}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
