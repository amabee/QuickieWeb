"use client";
import React, { useEffect, useState } from "react";
import "../public/styles/tailwind.css";
import "./globals.css";
import Topbar from "@/components/shared/TopBar";
import RightSidebar from "@/components/shared/RightSidebar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/BottomBar";
import Search from "@/components/pages/SearchPage";
import Activity from "@/components/pages/Activities";
import Profile from "./profile/[id]/page";
import QuickSnap from "@/components/pages/QuickSnap";
import Home from "@/components/pages/Main";
import { getNotifs } from "@/lib/actions/users";
import { useUser } from "@/lib/UserContext";
import { logout } from "@/lib/lib";

const Page = () => {
  const currentUserID = useUser();
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState("Home");
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (currentUserID?.user_id) {
      setId(currentUserID.user_id);
      setIsLoading(false);
    }
  }, [currentUserID]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (id !== null) {
        await getNotifications();
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 2500);

    return () => clearInterval(interval);
  }, [id]);

  const getNotifications = async () => {
    const { success, message, data } = await getNotifs(id);

    if (!success) {
      console.log("Error? ", message);
      setNotifications([]);
      setHasNotifications(false);
    } else {
      setNotifications(data);

      const hasUnreadNotifications = data.some(
        (notification) => notification.is_read === 0
      );
      setHasNotifications(hasUnreadNotifications);
    }
  };

  const renderMainContent = () => {
    switch (currentView) {
      case "Home":
        return <Home />;
      case "Search":
        return <Search />;
      case "Activity":
        return <Activity />;
      case "Profile":
        return <Profile />;
      case "QuickSnap":
        return <QuickSnap />;
      case "Logout":
        return logout();
      default:
        return <Home />;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Topbar />
      <main className="flex flex-row">
        <LeftSidebar
          setCurrentView={setCurrentView}
          currentView={currentView}
          notifications={{ activity: hasNotifications }}
        />
        <section className="main-container">
          <div className="w-full max-w-4xl">{renderMainContent()}</div>
        </section>
        <RightSidebar />
      </main>
      <Bottombar setCurrentView={setCurrentView} />
    </div>
  );
};

export default Page;
