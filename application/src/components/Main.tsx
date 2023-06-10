import { useContext } from "react";
import Card from "@/components/Section";
import Loader from "@/components/Loader";
import { TransactionContext } from "@/providers/TransactionProvider";

export const Main = () => {
  const { isLoading } = useContext(TransactionContext);

  return (
    <div className="-mx-4 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-2 xl:mx-0 xl:gap-x-8 place-items-center">
      <Card mode={"open"} />
      <Card mode={"closed"} />
      {isLoading ? <Loader /> : null}
    </div>
  );
};
