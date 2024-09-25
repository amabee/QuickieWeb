"use client";
import React, { useState } from "react";
import "../public/styles/tailwind.css";
import "./globals.css";
import Topbar from "@/components/shared/TopBar";
import RightSidebar from "@/components/shared/RightSidebar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/BottomBar";
import Search from "@/components/shared/SearchPage";
import Activity from "@/components/pages/Activities";
import Profile from "./profile/[id]/page";
import QuickSnap from "@/components/pages/QuickSnap";
import { UserProvider, useUser } from "@/lib/UserContext";
import Home from "@/components/pages/Main";

const Page = () => {
  const [currentView, setCurrentView] = useState("Home");

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

      default:
        return <Home />;
    }
  };
  return (
    <UserProvider>
      <div>
        <Topbar />
        <main className="flex flex-row">
          <LeftSidebar
            setCurrentView={setCurrentView}
            currentView={currentView}
          />
          <section className="main-container">
            <div className="w-full max-w-4xl">{renderMainContent()}</div>
          </section>
          <RightSidebar />
        </main>
        <Bottombar setCurrentView={setCurrentView} />
      </div>
    </UserProvider>
  );
};

export default Page;
