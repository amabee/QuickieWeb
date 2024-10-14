export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/search.svg",
    route: "/search",
    label: "Search",
  },
  {
    imgURL: "/assets/heart.svg",
    route: "/activity",
    label: "Activity",
    notificationKey: "activity",
  },
  {
    imgURL: "/assets/create.svg",
    route: "/create-thread",
    label: "QuickSnap",
  },
  {
    imgURL: "/assets/user.svg",
    route: "/profile",
    label: "Profile",
  },

  {
    imgURL: "/assets/logout.svg",
    route: "/",
    label: "Logout",
  },
];

export const profileTabs = [
  { value: "snaps", label: "Recent Snaps", icon: "/assets/reply.svg" },
  { value: "followers", label: "Followers", icon: "/assets/members.svg" },
  { value: "following", label: "Following", icon: "/assets/members.svg" },
];
