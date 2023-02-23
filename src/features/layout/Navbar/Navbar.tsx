import { useState } from "react";
import {
  Navbar as MantineNavbar,
  ScrollArea,
  MediaQuery,
  Burger,
  useMantineTheme,
  Box,
  Button,
  Center,
} from "@mantine/core";
import {
  IconHome2,
  IconUserCircle,
  IconUserSearch,
  IconWorld,
  IconWorldUpload,
} from "@tabler/icons-react";

import { Logo } from "./Logo";
import { useStyles } from "./Navbar.styles";
import { UserSection } from "./UserSection";
import { useSession } from "next-auth/react";
import { Link, type LinkProps } from "./Link";
import { EnterResultsModal } from "../../games/EnterResultsModal";

const routes: LinkProps[] = [
  {
    icon: IconHome2,
    label: "Home",
    href: "/",
  },
  {
    icon: IconUserCircle,
    label: "My Profile",
    href: "/user/:id",
    requiresAuthentication: true,
  },
  {
    icon: IconUserSearch,
    label: "Find Players",
    href: "/find",
    requiresAuthentication: true,
  },
  {
    icon: IconWorld,
    label: "Leaderboard",
    href: "/leaderboard",
  },
];

type Props = {
  open: boolean;
  toggleOpen: () => void;
};

export const Navbar: React.FC<Props> = ({ open, toggleOpen }) => {
  const { data: session } = useSession();
  const theme = useMantineTheme();
  const [resultsModalOpened, setResultsModalOpened] = useState(false);

  const { classes } = useStyles();

  // TODO(marcelherd): These can probably be Mantine NavLinks instead
  const links = routes.map((link) => <Link {...link} key={link.label} />);

  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!open}
      width={{ sm: 250, lg: 300 }}
      className={classes.navbar}
    >
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger
          opened={open}
          onClick={() => toggleOpen()}
          size="sm"
          color={theme.colors.gray[6]}
          mr="xl"
        />
      </MediaQuery>

      <MantineNavbar.Section className={classes.header}>
        <Logo />
      </MantineNavbar.Section>
      <MantineNavbar.Section
        grow
        component={ScrollArea}
        className={classes.main}
      >
        <Box className={classes.links}>{links}</Box>
      </MantineNavbar.Section>

      {session && (
        <>
          <EnterResultsModal
            opened={resultsModalOpened}
            onClose={() => setResultsModalOpened(false)}
          />
          <MantineNavbar.Section className={classes.actionButton}>
            <Center>
              <Button
                color="pink"
                size="md"
                leftIcon={<IconWorldUpload size={20} />}
                onClick={() => setResultsModalOpened(true)}
              >
                Submit game
              </Button>
            </Center>
          </MantineNavbar.Section>
          <MantineNavbar.Section className={classes.footer}>
            <UserSection />
          </MantineNavbar.Section>
        </>
      )}
    </MantineNavbar>
  );
};
