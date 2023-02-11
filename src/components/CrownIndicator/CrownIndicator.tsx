import { Indicator, type IndicatorProps } from "@mantine/core";
import { IconCrown } from "@tabler/icons-react";

type Props = {
  children: React.ReactNode;
  visible?: boolean;
  position?: IndicatorProps["position"];
};

export const CrownIndicator: React.FC<Props> = ({
  children,
  visible = true,
  position,
}) => {
  return (
    <Indicator
      withBorder
      position={position}
      color="#232323"
      label={<IconCrown size={16} style={{ fill: "gold", stroke: "gold " }} />}
      radius="xl"
      size={24}
      styles={{
        common: {
          display: visible ? "flex" : "none",
          paddingLeft: 0,
          paddingRight: 0,
        },
        indicator: {
          zIndex: 99, // defaults to 100, which overlays the mobile menu
        },
      }}
    >
      {children}
    </Indicator>
  );
};
