import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Text, Group, Box, ThemeIcon } from "@mantine/core";
import type { Icon as TablerIcon } from "@tabler/icons-react";

import { useStyles } from "./Link.styles";

export type LinkProps = {
  icon: TablerIcon;
  label: string;
  href: string;
  requiresAuthentication?: boolean;
};

export const Link: React.FC<LinkProps> = ({
  icon: Icon,
  label,
  href,
  requiresAuthentication,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { classes, cx } = useStyles();

  // TODO(marcelherd): This is an ugly hack to avoid using getServerSideProps.
  //    See also: https://github.com/t3-oss/create-t3-app/issues/992#issuecomment-1404043116
  const url = href.replace(":id", session?.user.id ?? "");
  const active = url === router.pathname;

  if (requiresAuthentication && !session) return null;

  return (
    <Text<"a">
      component="a"
      className={cx(classes.link, { [classes.active]: active })}
      href={url}
      key={label}
    >
      <Icon className={classes.linkIcon} stroke={1.5} />
      <span>{label}</span>
    </Text>
  );
};
