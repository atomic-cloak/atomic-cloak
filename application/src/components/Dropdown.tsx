import { Fragment, useState } from "react";
import Image from "next/image";
import { AiOutlineDown } from "react-icons/ai";
import { Listbox, Transition } from "@headlessui/react";

const style = {
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer`,
  buttonPadding: `p-2`,
  buttonIconContainer: `flex items-center justify-center w-8 h-8`,
};

const tokens = [
  { name: "Ethereum", logo: "/images/eth.png", alt: "eth logo" },
  { name: "Optimism", logo: "/images/op.png", alt: "op logo" },
];

const Dropdown: React.FC = () => {
  const [selected, setSelected] = useState(tokens[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative inline-block text-left">
        <Listbox.Button className={`${style.button} ${style.buttonPadding}`}>
          <div className={style.buttonIconContainer}>
            <Image
              src={selected.logo}
              alt={selected.alt}
              height={20}
              width={20}
            />
          </div>
          <span>{selected.name}</span>
          <span className={style.buttonIconContainer}>
            <AiOutlineDown />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#191B1F] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {tokens.map((token, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-amber-100 text-amber-900" : "text-white"
                  }`
                }
                value={token}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {token.name}
                    </span>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                      <Image
                        src={token.logo}
                        alt={token.alt}
                        height={20}
                        width={20}
                      />
                    </span>
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

export default Dropdown;
