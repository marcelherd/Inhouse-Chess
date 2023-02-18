import { type ForwardedRef, forwardRef } from "react";
import { type SelectItemProps } from "@mantine/core";
import { Avatar, Group, Text } from "@mantine/core";
import { type User } from "@prisma/client";

type Props = SelectItemProps & User;

const Item = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { value, id, name, email, emailVerified, image, ...others }: Props,
  ref: ForwardedRef<HTMLDivElement>
) => {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text>{name}</Text>
          <Text size="xs" color="dimmed">
            {email}
          </Text>
        </div>
      </Group>
    </div>
  );
};

export const UserItem = forwardRef<HTMLDivElement, Props>(Item);
