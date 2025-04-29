import {
  IconBike,
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

export const DashboardRoutes = {
  adminNavMain,
  ownerNavMain,
  adminNavSecondary,
  ownerNavSecondary,
  adminRoute,
  ownerRoute,
};
