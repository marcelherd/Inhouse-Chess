import { type NextPage } from "next";
import { Layout } from "../features/layout";
import { Leaderboard } from "../features/user/Leaderboard";

const LeaderboardPage: NextPage = () => {
  return (
    <Layout>
      <Leaderboard />
    </Layout>
  );
};

export default LeaderboardPage;
