import type { GetStaticProps, InferGetStaticPropsType } from "next";
import type { NextPageWithLayout } from "@/types";
import RootLayout from "@/layouts/_root-layout";
import { useLayout } from "@/lib/hooks/use-layout";
import MinimalScreen from "@/components/screens/minimal-screen";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

const HomePage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const { layout } = useLayout();

  return <MinimalScreen />;
};

HomePage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default HomePage;
