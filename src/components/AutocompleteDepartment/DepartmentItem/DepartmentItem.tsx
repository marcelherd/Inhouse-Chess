import { type ForwardedRef, forwardRef } from "react";
import { type SelectItemProps } from "@mantine/core";
import { Group, Text } from "@mantine/core";

type Props = SelectItemProps & {
  department: string;
  users: number;
};

const Item = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { value, id, department, users, ...others }: Props,
  ref: ForwardedRef<HTMLDivElement>
) => {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text>{department}</Text>
          <Text size="xs" color="dimmed">
            {users} other {users > 1 ? "players" : "player"} in this department
          </Text>
        </div>
      </Group>
    </div>
  );
};

export const DepartmentItem = forwardRef<HTMLDivElement, Props>(Item);
