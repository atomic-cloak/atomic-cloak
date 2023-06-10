import React from "react";
import Card from "@/components/Section";

export const Main: React.FC = () => {
  return (
    <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-2 xl:mx-0 xl:gap-x-8 place-items-center">
      <Card mode={"open"} />
      <Card mode={"closed"} />
    </div>
  );
};
