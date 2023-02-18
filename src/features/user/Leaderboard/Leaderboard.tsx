import {
  Loader,
  Title,
  Text,
  Paper,
  Table,
  Avatar,
  Group,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { api } from "../../../utils/api";

export const Leaderboard: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 576px)");
  const isDesktop = useMediaQuery("(min-width: 992px)");

  const {
    data: profiles,
    isLoading,
    isError,
    error,
  } = api.users.getTopPlayers.useQuery({});

  // TODO(marcelherd): Better loading state
  if (isLoading) {
    return <Loader />;
  }

  // TODO(marcelherd): Better error handling
  if (isError) {
    return <Text color="red">{error.message}</Text>;
  }

  const rows = profiles.map(({ user, computed }, index) => {
    const { id, name, rating } = user;
    const { games, wins, losses, draws } = computed;

    const winrate = (wins / games) * 100;

    return (
      <tr key={id}>
        <td>{index + 1}</td>
        <td>
          <Group>
            {!isMobile && <Avatar src={user.image} size="md" />}
            <Text variant="link" component="a" href={`/user/${id}`}>
              {name}
            </Text>
          </Group>
        </td>
        <td>{rating}</td>
        <td>{games}</td>
        {isDesktop && <td>{wins}</td>}
        {isDesktop && <td>{losses}</td>}
        {isDesktop && <td>{draws}</td>}
        <td>{isNaN(winrate) ? "N/A" : `${winrate}%`}</td>
      </tr>
    );
  });

  return (
    <>
      <Title size="h3" mb="lg">
        Leaderboard
      </Title>
      <Paper>
        <Table
          highlightOnHover
          withBorder
          verticalSpacing="sm"
          horizontalSpacing={isMobile ? "xs" : "sm"}
        >
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Rating</th>
              <th>Games</th>
              {isDesktop && <th>Wins</th>}
              {isDesktop && <th>Losses</th>}
              {isDesktop && <th>Draws</th>}
              <th>Winrate</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </>
  );
};
