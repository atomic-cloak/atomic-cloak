import { Fragment, useContext } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { Listbox, Transition } from "@headlessui/react";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  wrapper: `relative mt-1`,
  chevronArrow: `h-5 w-5 text-gray-400`,
  quantitySelector: `block truncate cursor-pointer`,
  chevronContainer: `pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2`,
  container: `relative w-full cursor-default text-white border border-[#20242A] hover:border-[#41444F] rounded-2xl bg-[#20242A] py-4 pl-3 pr-10 text-left`,
};

const quantities = [{ amount: "0.001" }, { amount: "0.01" }, { amount: "0.1" }];

const Quantity = () => {
  const { formData, handleChange } = useContext(TransactionContext);

  return (
    <Listbox
      value={formData.amount}
      onChange={(e) => handleChange(e.amount, "amount")}
    >
      <div className={style.wrapper}>
        <Listbox.Button className={style.container}>
          <span className={style.quantitySelector}>{formData.amount}</span>
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
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {quantities.map((quantity, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
                value={quantity}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {quantity.amount}
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

export default Quantity;
