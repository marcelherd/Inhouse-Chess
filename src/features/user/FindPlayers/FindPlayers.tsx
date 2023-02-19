import { Title, Text, Loader, Button, Flex } from "@mantine/core";
import { IconArrowsShuffle } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { api } from "../../../utils/api";
import { PlayerCard } from "../PlayerCard";

export const FindPlayers: React.FC = () => {
  const { data: session } = useSession();
  const location = session?.user.location ?? "";

  const utils = api.useContext();

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = api.users.findOtherUsersByLocation.useQuery(
    { location, limit: 4, shuffleUsers: true },
    {
      enabled: location.length > 0,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  // TODO(marcelherd): Better loading state
  if (isLoading) {
    return <Loader />;
  }

  // TODO(marcelherd): Better error handling
  if (isError) {
    return <Text color="red">{error.message}</Text>;
  }

  return (
    <>
      <Title size="h3" mb="lg">
        Find Players
      </Title>
      <Flex gap="md" wrap="wrap">
        {users.map((user) => (
          <PlayerCard key={user.id} user={user} />
        ))}
      </Flex>
      <Button
        leftIcon={<IconArrowsShuffle />}
        mt="xl"
        onClick={() => {
          void utils.users.findOtherUsersByLocation.invalidate();
        }}
      >
        Shuffle
      </Button>
    </>
  );
};
