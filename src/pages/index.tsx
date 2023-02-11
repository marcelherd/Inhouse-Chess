import { type NextPage } from "next";
import { Text, Title } from "@mantine/core";
import { Layout } from "../features/layout";
import { LatestGames } from "../features/games/LatestGames";
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
