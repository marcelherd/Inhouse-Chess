import { Card } from "@mantine/core";
import { type GameWithPlayers } from "../../../types/Game";
import { GameSummary } from "../GameSummary";

type Props = {
  game: GameWithPlayers;
};

export const GameCard: React.FC<Props> = ({ game }) => {
  const { player, opponent, winner, playedAt } = game;

  // TODO(marcelherd): These don't look good squished together (on smaller screens)
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <GameSummary
        player={player}
        opponent={opponent}
        winner={winner}
        playedAt={playedAt}
      />
    </Card>
  );
};
