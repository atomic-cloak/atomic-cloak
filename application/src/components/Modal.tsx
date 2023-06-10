import { Fragment, useEffect, useRef, useState, useContext } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import { TransactionContext } from "@/providers/TransactionProvider";

const Modal = () => {
  const cancelButtonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { swapDetails, isCreated } = useContext(TransactionContext);

  useEffect(() => {
    if (isCreated) setOpen(true);
  }, [isCreated]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#24262A] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <AiOutlineCheck
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-[#B2B9D2]"
                    >
                      Atomic Swap Created
                    </Dialog.Title>
                    <div className="mt-2">
                      {swapDetails.receivingChainName ? (
                        <div className="flex justify-between">
                          <dt className="flex">
                            Chain
                            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                              {swapDetails.receivingChainName}
                            </span>
                          </dt>
                        </div>
                      ) : null}
                      <br />
                      {swapDetails.timestamp ? (
                        <div className="flex justify-between">
                          <dt className="flex">
                            Timestamp
                            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                              {swapDetails.timestamp}
                            </span>
                          </dt>
                        </div>
                      ) : null}
                      <br />
                      {swapDetails.swapID ? (
                        <div className="flex justify-between">
                          <dt className="flex">
                            Swap ID
                            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                              {swapDetails.swapID}
                            </span>
                          </dt>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-[#3898FF] px-3 py-2 text-sm font-semibold text-white border border-[#2172E5] hover:border-[#234169] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
                    onClick={() => setOpen(false)}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-[#373A40] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#474950] sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
