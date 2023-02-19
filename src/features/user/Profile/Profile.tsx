import {
  Avatar,
  Group,
  Stack,
  Title,
  Text,
  Button,
  Flex,
  Box,
  MediaQuery,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconDotsVertical, IconPencil } from "@tabler/icons-react";
import ReactCountryFlag from "react-country-flag";
import { type UserProfile } from "../../../types/User";
import { MatchHistory } from "../MatchHistory";
import { PlayerStatistics } from "../PlayerStatistics";
import { PlayerBiography } from "../PlayerBiography";
import { countries } from "../RegistrationModal/CountrySelect";

type Props = {
  userProfile: UserProfile;
};

export const Profile: React.FC<Props> = ({ userProfile }) => {
  const { user, computed } = userProfile;

  const { data: session } = useSession();

  const countryName = countries.find(
    (country) => country.code === user.countryCode
  )?.name;

  return (
    <>
      <Flex mb="xl">
        <Avatar src={user.image} size="lg" mr="sm" />
        <Stack spacing={0}>
          <Text color="dimmed" size="xs">
            {user.email}
          </Text>
          <Title size="h2">
            {user.name}{" "}
            {user.countryCode && (
              <ReactCountryFlag
                svg
                countryCode={user.countryCode}
                style={{
                  width: "24px",
                  height: "24px",
                  marginLeft: "8px",
                }}
                title={countryName}
              />
            )}
          </Title>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        {session && session.user.id !== user.id && user.email && (
          <Button
            component="a"
            href={`mailto:${user.email}`}
            sx={{ alignSelf: "flex-end" }}
          >
            Challenge
          </Button>
        )}

        {session && session.user.id === user.id && (
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon sx={{ alignSelf: "flex-end" }}>
                <IconDotsVertical size={16} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconPencil size={16} stroke={1.5} />} disabled>
                Edit Profile
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Flex>

      <MediaQuery smallerThan="md" styles={{ flexDirection: "column" }}>
        <Group>
          <PlayerBiography user={user} />
          <PlayerStatistics statistics={computed} />
        </Group>
      </MediaQuery>

      <MatchHistory user={user} />
    </>
  );
};
