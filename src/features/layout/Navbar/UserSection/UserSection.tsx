import { Menu } from "@mantine/core";
import { UnstyledButton, Group, Avatar, Text, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronRight,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useStyles } from "./UserSection.styles";

export const UserSection: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { classes } = useStyles();

  if (!session) {
    return null;
  }

  // Menu is rendered within portal to avoid issues with the footer overlapping the menu items
  return (
    <Menu
      shadow="md"
      position={isMobile ? "top" : "right-end"}
      offset={2}
      withArrow
      arrowPosition="center"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar
              src={session.user?.image}
              alt={session.user?.name ?? undefined}
              radius="xl"
            />

            <Box className={classes.userInfo}>
              <Text size="sm" weight={500}>
                {session.user?.name ?? "Anonymous"}
              </Text>

              <Text color="dimmed" size="xs">
                {session.user?.email ?? ""}
              </Text>
            </Box>

            <IconChevronRight size={14} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={<IconUserCircle size={16} />}
          onClick={() => {
            void router.push("/profile");
          }}
        >
          View Profile
        </Menu.Item>
        <Menu.Item
          icon={<IconSettings size={16} />}
          onClick={() => {
            void router.push("/preferences");
          }}
        >
          Edit Preferences
        </Menu.Item>
        <Menu.Item
          icon={<IconLogout size={16} />}
          onClick={() => {
            void signOut();
          }}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
