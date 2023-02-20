import { Paper, Avatar, Text, Button, Stack, Group } from "@mantine/core";
import { type User } from "@prisma/client";
import { capitalize } from "../../../utils/string";

type Props = {
  user: User & {
    gamesPlayed: number;
  };
};

export const PlayerCard: React.FC<Props> = ({ user }) => {
  return (
    <Paper
      radius="md"
      withBorder
      p="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
        flex: 1,
        flexBasis: 300,
      })}
    >
      <Avatar src={user.image} size={120} radius={120} mx="auto" />
      <Text align="center" size="lg" weight={500} mt="md">
        {user.name}
      </Text>
      <Text align="center" color="dimmed" size="sm">
        {user.department}
      </Text>

      <Group my="xl" spacing="xl" sx={{ justifyContent: "center" }}>
        <Stack spacing={0}>
          <Text align="center" size="lg" weight={500}>
            {user.gamesPlayed}
          </Text>
          <Text align="center" size="sm" color="dimmed">
            Games
          </Text>
        </Stack>

        <Stack spacing={0}>
          <Text align="center" size="lg" weight={500}>
            {user.rating}
          </Text>
          <Text align="center" size="sm" color="dimmed">
            Rating
          </Text>
        </Stack>

        {user.experience && (
          <Stack spacing={0}>
            <Text align="center" size="lg" weight={500}>
              {capitalize(user.experience)}
            </Text>
            <Text align="center" size="sm" color="dimmed">
              Experience
            </Text>
          </Stack>
        )}
      </Group>

      <Group>
        {user.email && (
          <Button
            component="a"
            variant="default"
            href={`mailto:${user.email}`}
            sx={{ flex: 1 }}
          >
            Challenge
          </Button>
        )}
        <Button
          component="a"
          variant="light"
          href={`/user/${user.id}`}
          sx={{ flex: 1 }}
        >
          View Profile
        </Button>
      </Group>
    </Paper>
  );
};
