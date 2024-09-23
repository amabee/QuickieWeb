import React from "react";
import "../public/styles/tailwind.css";
import "./globals.css";
import Topbar from "@/components/shared/TopBar";
import RightSidebar from "@/components/shared/RightSidebar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/BottomBar";
import Home from "@/components/shared/Main";

const page = () => {
  return (
    <div>
      <Topbar />

      <main className="flex flex-row">
        <LeftSidebar />
        <section className="main-container">
          <div className="w-full max-w-4xl">
            <Home />
          </div>
        </section>

        <RightSidebar />
      </main>

      <Bottombar />
    </div>
  );
};

export default page;
