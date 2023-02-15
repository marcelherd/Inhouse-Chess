import { type NextPage } from "next";
import { Text } from "@mantine/core";
import { Layout } from "../../../features/layout";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { ProfileSkeleton } from "../../../features/user/ProfileSkeleton";
import { Profile } from "../../../features/user/Profile";

const UserProfile: NextPage = () => {
  const router = useRouter();
  const userIdParam = router.query.userId;
  const userId = typeof userIdParam === "string" ? userIdParam : "";

  const {
    data: userProfile,
    isLoading,
    isError,
    error,
  } = api.users.getProfileData.useQuery(
    { id: userId },
    { enabled: userId.length > 0 }
  );

  if (isLoading) {
    return (
      <Layout>
        <ProfileSkeleton />
      </Layout>
    );
  }

  // TODO(marcelherd): Error handling
  if (isError) {
    return <Text color="red">{error.message}</Text>;
  }

  // TODO(marcelherd): Show 404 instead
  if (!userProfile) {
    return <Text color="red">Not found</Text>;
  }

  return (
    <Layout>
      <Profile userProfile={userProfile} />
    </Layout>
  );
};

export default UserProfile;
