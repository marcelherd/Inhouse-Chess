import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Loader, Text } from "@mantine/core";
import { Layout } from "../features/layout";
import { useRouter } from "next/router";
import { FindPlayers } from "../features/user/FindPlayers";

const Find: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();

  // TODO(marcelherd): Better loading state
  if (status === "loading") {
    return <Loader />;
  }

  // TODO(marcelherd): Evaluate this approach
  if (status === "unauthenticated") {
    void router.push("/api/auth/signin");
    return (
      <Text color="red">You must be signed in to use this functionality</Text>
    );
  }

  return (
    <Layout>
      <FindPlayers />
    </Layout>
  );
};

export default Find;
