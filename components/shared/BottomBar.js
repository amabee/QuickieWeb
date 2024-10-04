"use client";

import Image from "next/image";
import Link from "next/link";

import { sidebarLinks } from "@/global/sidebar_links";

function Bottombar({ setCurrentView, currentView }) {
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive = currentView === link.label;

          return (
            <button
              onClick={() => setCurrentView(link.label)}
              key={link.label}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
              type="button"
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className="object-contain"
              />

              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
