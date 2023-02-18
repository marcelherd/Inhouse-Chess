import { Title, Text, Loader, Table, Paper, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { type User } from "@prisma/client";
import { format } from "date-fns";
import { api } from "../../../utils/api";
import { capitalize } from "../../../utils/string";

type Props = {
  user: User;
};

export const MatchHistory: React.FC<Props> = ({ user }) => {
  const isMobile = useMediaQuery("(max-width: 576px)");

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

  const rows = games.map((game) => {
    const player = user.id === game.playerId ? game.player : game.opponent;
    const playerRating =
      user.id === game.playerId ? game.playerRating : game.opponentRating;
    const playerColor =
      user.id === game.playerId ? game.playerColor : game.opponentColor;
    const opponent = user.id === game.playerId ? game.opponent : game.player;
    const opponentRating =
      user.id === game.playerId ? game.opponentRating : game.playerRating;
    const isDraw = game.winnerId === null;
    const result = isDraw ? "Draw" : user.id === game.winnerId ? "Win" : "Loss";
    const ratingAdjustment =
      user.id === game.playerId
        ? game.playerRatingAdjustment
        : game.opponentRatingAdjustment;
    const ratingAdjustmentPrefix = ratingAdjustment > 0 ? "+" : "";

    return (
      <tr key={game.id}>
        <td>
          <Tooltip label={format(game.playedAt, "dd/MM/yyyy hh:mm:ss aaaa")}>
            <span>{format(game.playedAt, "dd/MM/yyyy")}</span>
          </Tooltip>
        </td>
        <td>{capitalize(playerColor)}</td>
        {!isMobile && (
          <td>
            {player.name} ({playerRating})
          </td>
        )}
        <td>
          <Text variant="link" component="a" href={`/user/${opponent.id}`}>
            {opponent.name}
          </Text>{" "}
          ({opponentRating})
        </td>
        <td>
          {result} ({ratingAdjustmentPrefix}
          {ratingAdjustment})
        </td>
      </tr>
    );
  });

  return (
    <>
      <Title size="h3" mt="xl" mb="lg">
        Match History
      </Title>
      <Paper>
        <Table highlightOnHover withBorder verticalSpacing="md">
          <thead>
            <tr>
              <th>Date</th>
              <th>Color</th>
              {!isMobile && <th>Player</th>}
              <th>Opponent</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </>
  );
};
