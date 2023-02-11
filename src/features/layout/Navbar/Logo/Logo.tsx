import { Group, Title } from "@mantine/core";
import { IconBrandAppleArcade } from "@tabler/icons-react";

export const Logo: React.FC = () => {
  return (
    <Group mt={{ base: 20, sm: 0 }}>
      <IconBrandAppleArcade />
      <Title size="h4">Inhouse Chess</Title>
    </Group>
  );
};
