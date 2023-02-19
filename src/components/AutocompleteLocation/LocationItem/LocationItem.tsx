import { type ForwardedRef, forwardRef } from "react";
import { type SelectItemProps } from "@mantine/core";
import { Group, Text } from "@mantine/core";

type Props = SelectItemProps & {
  location: string;
  users: number;
};

const Item = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { value, id, location, users, ...others }: Props,
  ref: ForwardedRef<HTMLDivElement>
) => {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text>{location}</Text>
          <Text size="xs" color="dimmed">
            {users} other {users > 1 ? "players" : "player"} at this location
          </Text>
        </div>
      </Group>
    </div>
  );
};

export const LocationItem = forwardRef<HTMLDivElement, Props>(Item);
