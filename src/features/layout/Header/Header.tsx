import {
  Header as MantineHeader,
  MediaQuery,
  Burger,
  useMantineTheme,
  Center,
  TextInput,
  Flex,
  Box,
  Button,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconSearch,
  IconBell,
  IconSettings,
  IconMoonStars,
  IconSun,
} from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NotificationsPopover } from "./NotificationsPopover";

type Props = {
  open: boolean;
  toggleOpen: () => void;
};

export const Header: React.FC<Props> = ({ open, toggleOpen }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 576px)");
  const theme = useMantineTheme();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <MantineHeader
      height={{ base: 70 }}
      p="md"
      styles={{
        root: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
    >
      <Flex>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={open}
            onClick={() => toggleOpen()}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Box sx={{ flexGrow: 1 }}>
          <Center>
            <TextInput
              placeholder="Search player"
              icon={<IconSearch size={12} stroke={1.5} />}
              mb="sm"
              styles={{
                input: {
                  width: isMobile ? 200 : 420,
                },
              }}
            />
          </Center>
        </Box>
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: theme.spacing.sm,
            marginBottom: "12px",
          })}
        >
          {session ? (
            <NotificationsPopover />
          ) : (
            <Button
              onClick={() => {
                void signIn();
              }}
            >
              Sign in
            </Button>
          )}
          <ActionIcon
            onClick={() => toggleColorScheme()}
            title={isDarkMode ? "Enable light mode" : "Enable dark mode"}
          >
            {isDarkMode ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
        </Box>
      </Flex>
    </MantineHeader>
  );
};
