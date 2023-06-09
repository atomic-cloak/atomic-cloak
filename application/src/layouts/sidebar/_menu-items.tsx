import routes from "@/config/routes";
import { HomeIcon } from "@/components/icons/home";
import { FarmIcon } from "@/components/icons/farm";
import { PoolIcon } from "@/components/icons/pool";
import { ExchangeIcon } from "@/components/icons/exchange";

export const menuItems = [
  {
    name: "Home",
    icon: <HomeIcon />,
    href: routes.home,
  },
  {
    name: "Farm",
    icon: <FarmIcon />,
    href: routes.farms,
  },
  {
    name: "Swap",
    icon: <ExchangeIcon />,
    href: routes.swap,
  },
];
