import { Loader, Title, Text, Paper, Table } from "@mantine/core";
import { api } from "../../../utils/api";

export const Leaderboard: React.FC = () => {
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
          <Text variant="link" component="a" href={`/user/${id}`}>
            {name}
          </Text>
        </td>
        <td>{rating}</td>
        <td>{games}</td>
        <td>{wins}</td>
        <td>{losses}</td>
        <td>{draws}</td>
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
        <Table highlightOnHover withBorder verticalSpacing="md">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Rating</th>
              <th>Games played</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Draws</th>
              <th>Winrate</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </>
  );
};
