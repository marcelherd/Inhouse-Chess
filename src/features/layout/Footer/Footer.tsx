import {
  Anchor,
  Flex,
  Footer as MantineFooter,
  Box,
  MediaQuery,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";

export const Footer: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 992px)");

  return (
    <MantineFooter
      height={45}
      p="md"
      withBorder={false}
      styles={{
        root: {
          // background: "transparent",
        },
      }}
    >
      <Flex>
        <MediaQuery smallerThan="md" styles={{ display: "none " }}>
          <Box w={150} />
        </MediaQuery>
        <Flex
          gap="lg"
          justify={isMobile ? "flex-start" : "center"}
          sx={{ flexGrow: 1 }}
        >
          <Anchor component={Link} href="/contribute" size="xs" color="dimmed">
            Contribute
          </Anchor>
          <Anchor component={Link} href="/feedback" size="xs" color="dimmed">
            Feedback
          </Anchor>
        </Flex>
        <Flex gap="lg" justify="flex-end" sx={{ width: 150 }}>
          <Anchor
            component={Link}
            href="https://www.linkedin.com/in/marcel-herd-656514259/"
            size="xs"
            color="dimmed"
          >
            Built by Marcel Herd
          </Anchor>
        </Flex>
      </Flex>
    </MantineFooter>
  );
};
