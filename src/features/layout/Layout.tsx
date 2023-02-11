import { useState } from "react";
import { AppShell, Container, useMantineTheme } from "@mantine/core";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

type Props = {
  children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useMantineTheme();

  return (
    <AppShell
      layout="alt"
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      header={
        <Header
          open={menuOpen}
          toggleOpen={() => setMenuOpen((open) => !open)}
        />
      }
      navbar={
        <Navbar
          open={menuOpen}
          toggleOpen={() => setMenuOpen((open) => !open)}
        />
      }
      footer={menuOpen ? undefined : <Footer />}
    >
      <Container>{children}</Container>
    </AppShell>
  );
};
