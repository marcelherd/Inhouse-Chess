import { Card, Text, Group } from "@mantine/core";
import { type User } from "@prisma/client";
import { format } from "date-fns";
import { capitalize } from "../../../utils/string";
import { useStyles } from "./PlayerBiography.styles";

type Props = {
  user: User;
};

export const PlayerBiography: React.FC<Props> = ({ user }) => {
  const { classes } = useStyles();

  return (
    <Card withBorder p="xl" radius="md" className={classes.card}>
      <div className={classes.inner}>
        <div>
          <Text size="xl" className={classes.label}>
            Information
          </Text>
          <div>
            <Text className={classes.lead} mt={30}>
              {user.rating}
            </Text>
            <Text size="xs" color="dimmed">
              Rating
            </Text>
          </div>
          <Group mt="lg">
            <div>
              <Text className={classes.label}>
                {user.experience ? capitalize(user.experience) : "N/A"}
              </Text>
              <Text size="xs" color="dimmed">
                Experience
              </Text>
            </div>
            <div>
              <Text className={classes.label}>{user.location ?? "N/A"}</Text>
              <Text size="xs" color="dimmed">
                Location
              </Text>
            </div>
            <div>
              <Text className={classes.label}>
                {format(user.createdAt, "dd/MM/yyyy")}
              </Text>
              <Text size="xs" color="dimmed">
                Joined on
              </Text>
            </div>
          </Group>
        </div>
      </div>
    </Card>
  );
};
