import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.lg,

    [theme.fn.smallerThan("md")]: {
      paddingTop: theme.spacing.xl * 2,
    },
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  contentReverse: {
    maxWidth: 480,
    marginLeft: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginLeft: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Signika, ${theme.fontFamily ?? "sans-serif"}`,
    fontSize: 42,
    lineHeight: 1.3,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
  highlight: {
    display: "inline-block",
    zIndex: 0,
    position: "relative",
    "::before": {
      backgroundColor: "rgba(108,99,255,0.5)",
      content: '""',
      position: "absolute",
      width: "calc(100% + 4px)",
      zIndex: -1,
      height: "40%",
      left: "-2px",
      bottom: 4,
      transform: "rotate(-1deg)",
    },
  },
  highlightTight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: "indigo",
    }).background,
    borderRadius: theme.radius.sm,
    padding: 2,
  },
}));
