import { type NextPage } from "next";
import { Title } from "@mantine/core";
import { Layout } from "../features/layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Title size="h3">Preferences</Title>
    </Layout>
  );
};

export default Home;
