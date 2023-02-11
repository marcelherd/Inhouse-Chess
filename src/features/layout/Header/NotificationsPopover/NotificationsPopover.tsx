import { Popover, ActionIcon, Indicator } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { IconBell } from "@tabler/icons-react";
import { api } from "../../../../utils/api";
import { NotificationsDropdown } from "./NotificationsDropdown";

export const NotificationsPopover: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 576px)");
  const { width } = useViewportSize();

  const { data: processables } = api.requests.findProcessables.useQuery({});
  const count = processables ? processables.length : 0;

  return (
    <Popover
      width={isMobile ? width : 450}
      position={isMobile ? "bottom" : "left-start"}
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <Indicator
          withBorder
          size={22}
          label={count}
          overflowCount={2}
          showZero={false}
          dot={false}
          inline
        >
          <NotificationsButton />
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        <NotificationsDropdown />
      </Popover.Dropdown>
    </Popover>
  );
};

const NotificationsButton: React.FC = () => (
  <ActionIcon title="View notifications">
    <IconBell size={18} />
  </ActionIcon>
);
