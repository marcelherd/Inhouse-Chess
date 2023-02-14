import type { GetServerSideProps, NextPage } from "next";
import { Title } from "@mantine/core";
import { Layout } from "../features/layout";
import { getServerAuthSession } from "../server/auth";

const Me: NextPage = () => {
  return (
    <Layout>
      <Title size="h3">You really shouldn&apos;t see this</Title>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  // TODO(marcelherd): Evaluate whether this is the right approach.
  //    It might be better to handle this client-side by simply linking
  //    directly to the signed in user's profile in the navbar.
  //    By using getServerSideProps, we're increasing page load time.
  if (session?.user) {
    return {
      redirect: {
        destination: `/user/${session.user.id}`,
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: `/api/auth/signin`,
      permanent: false,
    },
  };
};

export default Me;
