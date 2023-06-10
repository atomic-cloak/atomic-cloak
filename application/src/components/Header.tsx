import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const style = {
  wrapper: `p-4 w-screen flex justify-between items-center`,
  headerLogo: `flex w-1/4 items-center justify-start`,
  nav: `flex-1 flex justify-center items-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl`,
  activeNavItem: `bg-[#20242A]`,
  buttonsContainer: `flex w-1/4 justify-end items-center`,
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] text-md font-semibold cursor-pointer`,
  buttonPadding: `p-1.5 px-1.5`,
  buttonTextContainer: `h-8 flex items-center`,
  buttonIconContainer: `flex items-center justify-center w-8 h-8`,
  buttonAccent: `bg-[#191B1F] px-0 border border-[#191B1F] hover:border-[#191B1F] h-full rounded-2xl flex items-center justify-center text-white`,
};

const tokens = [
  { name: "Ethereum", logo: "ethLogo", alt: "ethereum logo" },
  { name: "Optimism", logo: "ethLogo", alt: "optimism logo" },
];

const Header = () => {
  const navItems: string[] = ["Swap", "Pool", "Vote"];
  const [selectedNav, setSelectedNav] = useState("swap");

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
        <ConnectButton.Custom>
          {({
            chain,
            account,
            mounted,
            openChainModal,
            openAccountModal,
            openConnectModal,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;
            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <div
                        onClick={() => openConnectModal()}
                        className={`${style.button} ${style.buttonPadding}`}
                      >
                        <div
                          className={`${style.buttonAccent} ${style.buttonPadding}`}
                        >
                          Connect Wallet
                        </div>
                      </div>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className={`${style.buttonAccent} ${style.buttonPadding}`}
                      >
                        <div className={`${style.buttonTextContainer}`}>
                          Wrong Network
                        </div>
                      </button>
                    );
                  }

                  return (
                    <div style={{ display: "flex", gap: 12 }}>
                      <button
                        onClick={openChainModal}
                        type="button"
                        className={`${style.buttonAccent} ${style.buttonPadding}`}
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 20,
                              height: 20,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 10,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 20, height: 20 }}
                              />
                            )}
                          </div>
                        )}
                        <div className={`${style.buttonTextContainer}`}>
                          {chain.name}
                        </div>
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className={`${style.buttonAccent} ${style.buttonPadding}`}
                      >
                        <div className={`${style.buttonTextContainer}`}>
                          {account.displayName}
                        </div>
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};
export default Header;
