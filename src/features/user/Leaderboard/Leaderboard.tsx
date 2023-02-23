import {
  Loader,
  Title,
  Text,
  Paper,
  Table,
  Avatar,
  Group,
  SegmentedControl,
  Center,
  Box,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCircles, IconUsers, IconWorld } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "../../../utils/api";

export const Leaderboard: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 576px)");
  const isDesktop = useMediaQuery("(min-width: 992px)");

  const [category, setCategory] = useState("global");

  const { data: session, status } = useSession();
  const department =
    typeof session?.user.department === "string" ? session.user.department : "";

  const {
    data: globalTopProfiles,
    isLoading: isLoadingGlobal,
    isError: isErrorGlobal,
    error: errorGlobal,
  } = api.users.getTopPlayers.useQuery({});

  const {
    data: departmentTopProfiles,
    isLoading: isLoadingDepartment,
    fetchStatus: fetchStatusDepartment,
    isError: isErrorDepartment,
    error: errorDepartment,
  } = api.users.getTopPlayersByDepartment.useQuery(
    { department },
    {
      enabled: department.length > 0,
    }
  );

  // TODO(marcelherd): Better loading state
  if (
    isLoadingGlobal ||
    (isLoadingDepartment && fetchStatusDepartment !== "idle") ||
    status === "loading"
  ) {
    return <Loader />;
  }

  // TODO(marcelherd): Better error handling
  if (isErrorGlobal) {
    return <Text color="red">{errorGlobal.message}</Text>;
  }

  if (isErrorDepartment) {
    return <Text color="red">{errorDepartment.message}</Text>;
  }

  // TODO(marcelherd): Split this up somehow, component seems bloated.
  const profiles =
    category === "global" ? globalTopProfiles : departmentTopProfiles ?? [];

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
        <td>{isNaN(winrate) ? "N/A" : `${winrate.toFixed(0)}%`}</td>
      </tr>
    );
  });

  return (
    <>
      <Title size="h3" mb="lg">
        Leaderboard
      </Title>

      {session && department.length > 0 && (
        <SegmentedControl
          radius="sm"
          mb="xs"
          value={category}
          onChange={setCategory}
          data={[
            {
              value: "global",
              label: (
                <Center>
                  <IconWorld size={16} />
                  <Box ml={10}>Global</Box>
                </Center>
              ),
            },
            {
              value: "department",
              label: (
                <Center>
                  <IconCircles size={16} />
                  <Box ml={10}>{session.user.department ?? "Department"}</Box>
                </Center>
              ),
            },
          ]}
        />
      )}

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
