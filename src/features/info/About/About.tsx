import {
  Title,
  List,
  Button,
  Container,
  Text,
  ThemeIcon,
  Group,
  Image,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useStyles } from "./About.styles";
import TeamChat from "./TeamChat.svg";
import Sharing from "./Sharing.svg";
import Collaboration from "./Collaboration.svg";

export const About: React.FC = () => {
  const { classes } = useStyles();

  return (
    <>
      <Text fz="lg">
        Despite the name, the purpose of this website is not just to play chess.
        Our goal is to use the game of chess as a <em>medium</em> in order to{" "}
        <span className={classes.highlightTight}>
          connect colleagues, share ideas and drive innovation.
        </span>
        You can read more about our core values below.
      </Text>
      <div className={classes.container}>
        <div className={classes.content}>
          <Title className={classes.title}>
            <span className={classes.highlight}>Connecting</span> colleagues
            face-to-face in an increasingly digital world
          </Title>
          <Text color="dimmed" mt="md">
            The need for social interaction with our coworkers has lessened as a
            result of the ever-increasing digitalization of services. This has
            made it more difficult to create meaningful and lasting connections
            between coworkers. And yet,{" "}
            <span className={classes.highlightTight}>
              not knowing the right people to talk to can often be the greatest
              hindrance to innovation.
            </span>
          </Text>
        </div>
        <Image src={TeamChat.src} alt="TeamChat" className={classes.image} />
      </div>

      <div className={classes.container}>
        <Image src={Sharing.src} alt="TeamChat" className={classes.image} />
        <div className={classes.contentReverse}>
          <Title className={classes.title}>
            <span className={classes.highlight}>Sharing ideas</span> and
            knowledge
          </Title>
          <Text color="dimmed" mt="md">
            Many of us face similar challenges in our working environment and
            have developed brilliant solutions.
            <span className={classes.highlightTight}>
              not knowing the right people to talk to can often be the greatest
              hindrance to innovation.
            </span>
          </Text>
        </div>
      </div>
    </>
  );
};
