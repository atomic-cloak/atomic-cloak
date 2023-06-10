import React, { Fragment, useContext } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { AiOutlineDown, AiOutlineCheck } from "react-icons/ai";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  wrapper: `relative mt-1`,
  chevronArrow: `h-5 w-5 text-gray-400`,
  chainSelector: `block truncate cursor-pointer`,
  chevronContainer: `pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2`,
  container: `relative w-full cursor-default text-[#B2B9D2] border border-[#20242A] hover:border-[#41444F] rounded-2xl bg-[#20242A] py-4 pl-3 pr-10 text-left text-2xl`,
};

const chains = [
  { name: "Goerli", logo: "/images/eth.png", alt: "eth logo" },
  { name: "Sepolia", logo: "/images/eth.png", alt: "eth logo" },
  { name: "Mumbai", logo: "/images/matic.png", alt: "matic logo" },
];

const Chains: React.FC = () => {
  const { formData, handleChange } = useContext(TransactionContext);

  return (
    <Listbox
      value={formData.receivingChainID}
      onChange={(e) => handleChange(e.name, "receivingChainID")}
    >
      <div className={style.wrapper}>
        <Listbox.Button className={style.container}>
          <span className={style.chainSelector}>
            {formData.receivingChainID}
          </span>
          <span className={style.chevronContainer}>
            <AiOutlineDown className={style.chevronArrow} />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {chains.map((chain, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
                value={chain}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {chain.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <AiOutlineCheck className="h-5 w-5" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Chains;
