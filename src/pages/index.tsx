import { type NextPage } from "next";
import { Title } from "@mantine/core";
import { Layout } from "../features/layout";
import { About } from "../features/info/About";

const Home: NextPage = () => {
  return (
    <Layout>
      <Title size="h2" mb="xl">
        Welcome to Inhouse Chess
      </Title>

      <About />

      {/* <Text>How to participate?</Text> */}
      {/* <LatestGames /> */}
    </Layout>
  );
};

export default Home;
