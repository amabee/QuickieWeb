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
  const id = currentUserID?.user_id ?? null;

  const [currentView, setCurrentView] = useState("Home");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (id !== null) {
      getNotifications();
    } else {
      console.log("?");
    }
  }, [id]);

  const getNotifications = async () => {
    const { success, message, data } = await getNotifs(id);

    if (!success) {
      console.log("Error? ", message);
    }

    console.log("Hmmkay");
    setNotifications(data);
  };

  const logCookies = () => {
    console.log(document.cookie); // Log the current cookies
  };

  const deleteSessionCookie = () => {
    logCookies(); // Log cookies before deletion
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    logCookies();
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
  return (
    <div>
      <Topbar />
      <main className="flex flex-row">
        <LeftSidebar
          setCurrentView={setCurrentView}
          currentView={currentView}
          notifications={{ activity: true }}
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
