import {
  Avatar,
  Group,
  Stack,
  Title,
  Text,
  Button,
  Flex,
  Box,
} from "@mantine/core";
import { type UserProfile } from "../../../types/User";
import { MatchHistory } from "../MatchHistory";
import { PlayerStatistics } from "../PlayerStatistics";

type Props = {
  userProfile: UserProfile;
};

export const Profile: React.FC<Props> = ({ userProfile }) => {
  const { user, computed } = userProfile;

  return (
    <>
      <Flex mb="xl">
        <Avatar src={user.image} size="lg" mr="sm" />
        <Stack spacing={0}>
          <Text color="dimmed" size="xs">
            {user.email}
          </Text>
          <Title size="h2">{user.name}</Title>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        {user.email && (
          <Button
            component="a"
            href={`mailto:${user.email}`}
            sx={{ alignSelf: "flex-end" }}
          >
            Challenge
          </Button>
        )}
      </Flex>

      <PlayerStatistics statistics={computed} />
      <MatchHistory user={user} />
    </>
  );
};
