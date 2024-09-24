"use client";
import React, { useState } from "react";
import "../public/styles/tailwind.css";
import "./globals.css";
import Topbar from "@/components/shared/TopBar";
import RightSidebar from "@/components/shared/RightSidebar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/BottomBar";
import Home from "@/components/shared/Main";
import Search from "@/components/shared/SearchPage";

const Page = () => {
  const [currentView, setCurrentView] = useState("Home");

  const renderMainContent = () => {
    switch (currentView) {
      case "Home":
        return <Home />;
      case "Search":
        return <Search />;
      // Add more cases as needed
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
