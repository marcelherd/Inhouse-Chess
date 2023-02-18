import { Box, Flex, Group, MediaQuery, Skeleton, Stack } from "@mantine/core";

export const ProfileSkeleton: React.FC = () => {
  return (
    <>
      <Flex mb="xl">
        <Skeleton circle width={56} height={56} mr="sm" />
        <Stack spacing={0} sx={{ justifyContent: "space-between" }}>
          <Skeleton width={125} height={16} radius="xl" />
          <Skeleton width={100} height={28} radius="xl" />
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Skeleton width={100} height={35} radius="xl" />
        </Box>
      </Flex>

      <MediaQuery smallerThan="md" styles={{ flexDirection: "column" }}>
        <Group>
          <Skeleton height={200} radius="xl" sx={{ flex: 1 }} />
          <Skeleton height={200} radius="xl" sx={{ flex: 1 }} />
        </Group>
      </MediaQuery>

      <Skeleton
        width="100%"
        height={200}
        radius="xl"
        mt={74}
        sx={{ flex: 1 }}
      />
    </>
  );
};
