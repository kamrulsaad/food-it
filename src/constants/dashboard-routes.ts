import {
  IconBike,
  IconBuildingArch,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconClipboardPlus,
  IconDashboard,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

const adminRoute = "/dash/admin";
const ownerRoute = "/dash/owner";
const riderRoute = "/dash/rider";

const adminNavMain = [
  {
    title: "Dashboard",
    url: adminRoute,
    icon: IconDashboard,
  },
  {
    title: "Restaurants",
    url: adminRoute + "/restaurants",
    icon: IconBuildingStore,
  },
  {
    title: "Riders",
    url: adminRoute + "/riders",
    icon: IconBike,
  },
  {
    title: "Customers",
    url: adminRoute + "/customers",
    icon: IconUsers,
  },
  {
    title: "Orders",
    url: adminRoute + "/orders",
    icon: IconListDetails,
  },
  {
    title: "Categories",
    url: adminRoute + "/categories",
    icon: IconClipboardPlus,
  },
  {
    title: "Cities",
    url: adminRoute + "/cities",
    icon: IconBuildingArch,
  },
];

const ownerNavMain = [
  {
    title: "Dashboard",
    url: ownerRoute,
    icon: IconDashboard,
  },
  {
    title: "Menu",
    url: ownerRoute + "/menu",
    icon: IconClipboardPlus,
  },
  {
    title: "Restaurant Details",
    url: ownerRoute + "/restaurant-details",
    icon: IconBuildingWarehouse,
  },
  {
    title: "Orders",
    url: ownerRoute + "/orders",
    icon: IconListDetails,
  },
];

const riderNavMain = [
  {
    title: "Dashboard",
    url: riderRoute,
    icon: IconDashboard,
  },
  {
    title: "Orders",
    url: riderRoute + "/orders",
    icon: IconListDetails,
  },
  {
    title: "Profile",
    url: riderRoute + "/profile",
    icon: IconUsers,
  },
];

const adminNavSecondary = [
  {
    title: "Settings",
    url: "/dash/admin/settings",
    icon: IconSettings,
  },
];

const ownerNavSecondary = [
  {
    title: "Profile Settings",
    url: "/dash/owner/settings",
    icon: IconSettings,
  },
];

const riderNavSecondary = [
  {
    title: "Profile Settings",
    url: "/dash/rider/settings",
    icon: IconSettings,
  },
];

export const DashboardRoutes = {
  adminNavMain,
  ownerNavMain,
  riderNavMain,
  adminNavSecondary,
  ownerNavSecondary,
  riderNavSecondary,
  adminRoute,
  ownerRoute,
  riderRoute,
};
