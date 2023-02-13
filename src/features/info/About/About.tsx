import {
  Title,
  List,
  Text,
  ThemeIcon,
  Image,
  useMantineColorScheme,
  type MantineGradient,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useStyles } from "./About.styles";

export const About: React.FC = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const isDarkMode = colorScheme === "dark";

  const gradient: MantineGradient = {
    from: isDarkMode ? theme.colors.indigo[3] : "indigo",
    to: isDarkMode ? theme.colors.violet[3] : "violet",
  };

  return (
    <>
      <Text fz="lg">
        Despite the name, the purpose of this website is not just to play chess.
        Our goal is to use the game of chess as a <em>medium</em> in order to{" "}
        <Text
          sx={{ display: "inline" }}
          variant="gradient"
          fw={700}
          gradient={gradient}
        >
          connect colleagues, share ideas and drive innovation
        </Text>
        . You can read more about our core values below.
      </Text>

      <div className={classes.container}>
        <div className={classes.content}>
          <Title className={classes.title}>
            <span className={classes.highlight}>Connecting</span> colleagues
            face-to-face in an increasingly digital world
          </Title>
          <Text mt="md">
            With more and more services being digitalized, the need for social
            interaction with our coworkers has never been smaller. This has made
            it more difficult to create meaningful and lasting connections
            between coworkers. And yet,{" "}
            <Text
              sx={{ display: "inline" }}
              variant="gradient"
              fw={700}
              gradient={gradient}
            >
              not knowing the right people to talk to can often be the greatest
              hindrance to innovation
            </Text>
            .
          </Text>
        </div>
        <Image
          src="/images/TeamChat.svg"
          alt="Connecting colleagues"
          className={classes.image}
        />
      </div>

      <div className={classes.container}>
        <Image
          src="/images/Sharing.svg"
          alt="Sharing ideas"
          className={classes.image}
        />
        <div className={classes.contentReverse}>
          <Title className={classes.title}>
            <span className={classes.highlight}>Sharing ideas</span> and
            knowledge
          </Title>
          <Text mt="md">
            Many of us face similar challenges in our working environment and
            have developed brilliant solutions. By sharing these solutions with
            each other, we can come up with{" "}
            <Text
              sx={{ display: "inline" }}
              variant="gradient"
              fw={700}
              gradient={gradient}
            >
              new and innovative ideas
            </Text>{" "}
            that can be applied to our own use-cases.
          </Text>
        </div>
      </div>

      <div className={classes.container}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Finding opportunities to{" "}
            <span className={classes.highlight}>collaborate and innovate</span>
          </Title>
          <Text mt="md">
            By connecting with colleagues from different areas, we expose
            ourselves to completely new environments and technologies. We can
            use our colleagues fresh perspective on things to{" "}
            <Text
              sx={{ display: "inline" }}
              variant="gradient"
              fw={700}
              gradient={gradient}
            >
              foster a culture of innovation
            </Text>
            .
          </Text>
        </div>
        <Image
          src="/images/Collaboration.svg"
          alt="Collaborating and innovating"
          className={classes.image}
        />
      </div>

      <div className={classes.container}>
        <div>
          <Title className={classes.title}>
            So, are you on board so far? Let&apos;s sum it all up
          </Title>
          <Text color="dimmed" mt="md">
            Here is what we want you to do
          </Text>
          <List
            mt="xl"
            mb="xl"
            spacing="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck size={12} stroke={4} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <strong>Find colleagues to play with</strong> &#8212; by signing
              up on this website
            </List.Item>
            <List.Item>
              <strong>Meet your colleagues face-to-face</strong> &#8212; to
              build connections with your coworkers and increase your network
            </List.Item>
            <List.Item>
              <strong>Share what you&apos;ve been working on</strong> &#8212;
              while enjoying a game of chess
            </List.Item>
            <List.Item>
              <strong>Innovate together</strong> &#8212; create{" "}
              <Text
                italic
                fw={700}
                sx={{ display: "inline" }}
                variant="gradient"
                gradient={gradient}
              >
                magic
              </Text>
            </List.Item>
          </List>
        </div>
      </div>
    </>
  );
};
