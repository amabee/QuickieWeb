import Image from "next/image";
import { sidebarLinks } from "@/global/sidebar_links";
import { usePathname } from "next/navigation";

const LeftSidebar = ({ setCurrentView, currentView }) => {
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive = currentView === link.label;

          return (
            <button
              key={link.label}
              className={`leftsidebar_link ${isActive ? "bg-primary-500" : ""}`}
              onClick={() => setCurrentView(link.label)}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
