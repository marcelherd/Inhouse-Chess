import { type NextPage } from "next";
import { Title, Text } from "@mantine/core";
import { Layout } from "../features/layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Title size="h3">My profile</Title>
      <Text>Games, Wins, Losses, Draws, Win Rates, Statistics</Text>
      <Text>Match History</Text>
    </Layout>
  );
};

export default Home;
