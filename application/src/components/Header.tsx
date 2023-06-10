import React, { useState, useContext } from "react";
import Dropdown from "@/components/Dropdown";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  wrapper: `p-4 w-screen flex justify-between items-center`,
  headerLogo: `flex w-1/4 items-center justify-start`,
  nav: `flex-1 flex justify-center items-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl`,
  activeNavItem: `bg-[#20242A]`,
  buttonsContainer: `flex w-1/4 justify-end items-center`,
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer`,
  buttonPadding: `p-2`,
  buttonTextContainer: `h-8 flex items-center`,
  buttonIconContainer: `flex items-center justify-center w-8 h-8`,
  buttonAccent: `bg-[#172A42] px-0 border border-[#163256] hover:border-[#234169] h-full rounded-2xl flex items-center justify-center text-[#4F90EA]`,
};

const tokens = [
  { name: "Ethereum", logo: "ethLogo", alt: "ethereum logo" },
  { name: "Optimism", logo: "ethLogo", alt: "optimism logo" },
];

const Header = () => {
  const navItems: string[] = ["Swap", "Pool", "Vote"];
  const [selectedNav, setSelectedNav] = useState("swap");
  const { connectWallet, currentAccount } = useContext<any>(TransactionContext);

  return (
    <div className={style.wrapper}>
      <div className={style.headerLogo}>
        {/* <Image src="/images/react.png" alt="react" height={40} width={40} /> */}
      </div>
      <div className={style.nav}>
        <div className={style.navItemsContainer}>
          {navItems.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => setSelectedNav(item)}
                className={`${style.navItem} ${
                  selectedNav === item && style.activeNavItem
                }`}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
      <div className={style.buttonsContainer}>
        <ConnectButton />
      </div>
    </div>
  );
};
export default Header;
