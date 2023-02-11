import { Title, Text, Loader, SimpleGrid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { api } from "../../../utils/api";
import { GameCard } from "../GameCard";

export const LatestGames: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 1070px)");

  const {
    data: games,
    isLoading,
    isError,
    error,
  } = api.games.findLatest.useQuery({ limit: isMobile ? 3 : 6 });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Text color="red">{error.message}</Text>;
  }

  return (
    <>
      <Title size="h4" mb={8} mt={16}>
        Latest games
      </Title>
      <SimpleGrid cols={isMobile ? 1 : 2}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </SimpleGrid>
    </>
  );
};
