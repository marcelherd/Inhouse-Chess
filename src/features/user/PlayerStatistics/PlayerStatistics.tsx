import {
  Card,
  Text,
  Group,
  RingProgress,
  type MantineColor,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { type UserProfile } from "../../../types/User";
import { useStyles } from "./PlayerStatistics.styles";

type Props = {
  statistics: UserProfile["computed"];
};

function getColorByWinrate(winrate: number): MantineColor {
  if (winrate >= 50) return "green";
  return "red";
}

export const PlayerStatistics: React.FC<Props> = ({ statistics }) => {
  const { classes } = useStyles();
  const showSmallWinrate = useMediaQuery(
    "(min-width: 992px) and (max-width: 1100px)"
  );

  const { games, wins, losses, draws } = statistics;
  const winrate = (wins / games) * 100;

  return (
    <Card withBorder p="xl" radius="md" className={classes.card}>
      <div className={classes.inner}>
        <div>
          <Text size="xl" className={classes.label}>
            Statistics
          </Text>
          <div>
            <Text className={classes.lead} mt={30}>
              {games}
            </Text>
            <Text size="xs" color="dimmed">
              {games === 1 ? "Game" : "Games"} played
            </Text>
          </div>
          <Group mt="lg">
            <div>
              <Text className={classes.label}>Wins</Text>
              <Text size="xs" color="dimmed">
                {wins}
              </Text>
            </div>
            <div>
              <Text className={classes.label}>Losses</Text>
              <Text size="xs" color="dimmed">
                {losses}
              </Text>
            </div>
            <div>
              <Text className={classes.label}>Draws</Text>
              <Text size="xs" color="dimmed">
                {draws}
              </Text>
            </div>
          </Group>
        </div>

        <div className={classes.ring}>
          <RingProgress
            roundCaps
            thickness={6}
            size={showSmallWinrate ? 100 : 150}
            sections={[{ value: winrate, color: getColorByWinrate(winrate) }]}
            label={
              <div>
                <Text
                  align="center"
                  size="lg"
                  className={classes.label}
                  sx={{ fontSize: showSmallWinrate ? 16 : 22 }}
                >
                  {isNaN(winrate) ? "N/A" : `${winrate.toFixed(0)}%`}
                </Text>
                <Text align="center" size="xs" color="dimmed">
                  Winrate
                </Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
};
