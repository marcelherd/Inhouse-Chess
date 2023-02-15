import { Title, Text, Loader, Table } from "@mantine/core";
import { type User } from "@prisma/client";
import { format } from "date-fns";
import { api } from "../../../utils/api";

type Props = {
  user: User;
};

export const MatchHistory: React.FC<Props> = ({ user }) => {
  // FIXME(marcelherd): Doesn't seem to load the correct user's games.
  //    To reproduce: go to your own match history and click on another user
  const {
    data: games,
    isLoading,
    isError,
    error,
  } = api.games.findByUserId.useQuery({ userId: user.id, limit: 10 });

  // TODO(marcelherd): Better loading state
  if (isLoading) {
    return <Loader />;
  }

  // TODO(marcelherd): Better error handling
  if (isError) {
    return <Text color="red">{error.message}</Text>;
  }

  const rows = games.map((game) => (
    <tr key={game.id}>
      <td>{format(game.playedAt, "dd/MM/yyyy")}</td>
      <td>{game.playerColor}</td>
      <td>
        <a href={`/user/${game.opponent.id}`}>{game.opponent.name}</a>
      </td>
      <td>{game.winnerId === user.id ? "Win" : "Loss"}</td>
    </tr>
  ));

  return (
    <>
      <Title size="h3" mt="xl" mb="lg">
        Match history
      </Title>
      <Table>
        <thead>
          <tr>
            <th>Played at</th>
            <th>Played as</th>
            <th>Played against</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};
