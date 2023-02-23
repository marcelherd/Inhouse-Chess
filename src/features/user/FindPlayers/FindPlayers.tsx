import { Title, Text, Loader, Button, Flex, Badge, Box } from "@mantine/core";
import { IconArrowsShuffle } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { api } from "../../../utils/api";
import { PlayerCard } from "../PlayerCard";

export const FindPlayers: React.FC = () => {
  const { data: session } = useSession();
  const location = session?.user.location ?? "";
  const availability = session?.user.availability ?? [];
  const limit = 4;

  const utils = api.useContext();

  // TODO(marcelherd): It would be great to also get the total number of users at this
  //    location, regardless of the provided limit. This would allow us to hide the
  //    shuffle button, if the number of users at this location is equal to the limit.
  const {
    data: usersByLocation,
    isLoading,
    isError,
    error,
  } = api.users.findOtherUsersByLocation.useQuery(
    { location, limit, availability, shuffleUsers: true },
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

  const { users, total } = usersByLocation;

  return (
    <>
      <Title size="h3" mb="lg">
        Find Players
      </Title>

      <Flex mb="md" wrap="wrap" gap="sm">
        <Badge>Location: {location}</Badge>
        <Badge>
          Availability:{" "}
          {availability.length > 0 ? availability.join(", ") : "none"}
        </Badge>
        <Box
          sx={{
            flexGrow: 1,
          }}
        />
        <Text color="dimmed" size="sm">
          {total} other {total === 1 ? "player" : "players"} at your location
        </Text>
      </Flex>

      <Flex gap="md" wrap="wrap">
        {users.map((user) => (
          <PlayerCard key={user.id} user={user} />
        ))}
      </Flex>

      {users.length === 0 && <Text>No results found</Text>}

      {users.length === limit && (
        <Button
          leftIcon={<IconArrowsShuffle />}
          mt="xl"
          onClick={() => {
            void utils.users.findOtherUsersByLocation.invalidate();
          }}
        >
          Shuffle
        </Button>
      )}
    </>
  );
};
