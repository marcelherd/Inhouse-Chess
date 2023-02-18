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
} from "@mantine/core";
import { type UserProfile } from "../../../types/User";
import { MatchHistory } from "../MatchHistory";
import { PlayerStatistics } from "../PlayerStatistics";
import { PlayerBiography } from "../PlayerBiography";
import ReactCountryFlag from "react-country-flag";
import { countries } from "../Registration/CountrySelect";
import { useSession } from "next-auth/react";

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

        {session && user.email && (
          <Button
            component="a"
            href={`mailto:${user.email}`}
            sx={{ alignSelf: "flex-end" }}
          >
            Challenge
          </Button>
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
