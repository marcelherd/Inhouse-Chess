import { Box, Group, Avatar, Text, Flex, Center } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { type User } from "@prisma/client";
import { CrownIndicator } from "../../../components/CrownIndicator";
import { getInitials } from "../../../utils/string";

type Props = {
  player: User;
  opponent: User;
  winner: User | null;
  playedAt?: Date;
  playerRating?: number;
  opponentRating?: number;
  ratingAdjustment?: number;
};

export const GameSummary: React.FC<Props> = ({
  player,
  opponent,
  winner,
  playedAt,
  playerRating,
  opponentRating,
  ratingAdjustment,
}) => {
  const isMobile = useMediaQuery("(max-width: 576px)");

  const draw = winner === null;
  const playerWon = !draw && player.id === winner.id;
  const opponentWon = !draw && opponent.id === winner.id;

  // TODO(marcelherd): Show ratings
  // TODO(marcelherd): "vs" text should always be centered

  return (
    <Box>
      <Group sx={{ display: "flex", justifyContent: "space-between" }}>
        <Group>
          <CrownIndicator position="top-start" visible={playerWon}>
            <Avatar
              src={player.image}
              size={isMobile ? 48 : 64}
              alt={player.name ?? "?"}
            >
              {player.name ? getInitials(player.name) : "?"}
            </Avatar>
          </CrownIndicator>

          <Flex direction="column">
            <Text weight={500}>{player.name ?? "?"}</Text>
            <Center>
              <Text size="xs" color="dimmed">
                {draw ? "Draw" : playerWon ? "Won" : "Lost"}
              </Text>
            </Center>
          </Flex>
        </Group>

        <Text color="dimmed">vs</Text>

        <Group>
          <Flex direction="column">
            <Text weight={500}>{opponent.name}</Text>
            <Center>
              <Text size="xs" color="dimmed">
                {draw ? "Draw" : opponentWon ? "Won" : "Lost"}
              </Text>
            </Center>
          </Flex>
          <CrownIndicator visible={opponentWon}>
            <Avatar
              src={opponent.image}
              size={isMobile ? 48 : 64}
              alt={opponent.name ?? "?"}
            >
              {opponent.name ? getInitials(opponent.name) : "?"}
            </Avatar>
          </CrownIndicator>
        </Group>
      </Group>
    </Box>
  );
};
