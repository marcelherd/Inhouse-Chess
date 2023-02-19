import { useEffect, useState, type FormEventHandler } from "react";
import { useSession } from "next-auth/react";
import { Modal, Stack, Button, Text, Select } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { type Experience } from "@prisma/client";
import { CountrySelect } from "./CountrySelect";
import { api } from "../../../utils/api";
import { AutocompleteLocation } from "../../../components/AutocompleteLocation";

type ExperienceChoice = {
  value: Experience;
  label: string;
};

export const RegistrationModal: React.FC = () => {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [experience, setExperience] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [debouncedLocation] = useDebouncedValue(locationInput, 250);

  const utils = api.useContext();

  const finishRegistration = api.users.finishRegistration.useMutation({
    onSuccess: () => {
      void utils.users.invalidate();
      setOpened(false);
    },
  });

  const {
    data: locationData,
    isLoading: isLoadingLocationData,
    error: errorLocationData,
  } = api.users.findLocationData.useQuery({ value: debouncedLocation });

  const locationSuggestions = locationData
    ?.filter((locationDatum) => locationDatum.location)
    .map((locationDatum) => ({
      ...locationDatum,
      value: locationDatum.location as string,
      users: locationDatum._count.location,
    }));

  const experienceChoices: ExperienceChoice[] = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "ADVANCED", label: "Advanced" },
    { value: "EXPERT", label: "Expert" },
  ];

  useEffect(() => {
    if (status === "authenticated" && !session.user.registrationFinished) {
      setOpened(true);
    }
  }, [session?.user.registrationFinished, status]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // TODO(marcelherd): Error handling
    if (
      experience !== "BEGINNER" &&
      experience !== "ADVANCED" &&
      experience !== "EXPERT"
    )
      return;
    if (!countryCode) return;

    finishRegistration.mutate({
      experience,
      countryCode,
      location: locationInput,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
      }}
      trapFocus
      closeOnEscape={false}
      closeOnClickOutside={false}
      withCloseButton={false}
      title="Registration"
    >
      <form onSubmit={onSubmit}>
        <Stack>
          <Text>
            We need a few more details to finish setting up your profile.
          </Text>
          <Select
            required
            label="Experience"
            description="How much experience do you have with playing chess?"
            placeholder="Pick one"
            data={experienceChoices}
            value={experience}
            onChange={setExperience}
          />
          <CountrySelect value={countryCode} onChange={setCountryCode} />
          <AutocompleteLocation
            required
            label="Location"
            placeholder="E.g. the building you work in"
            description="Where would you play chess with others? This is used to find other players at your location."
            data={locationSuggestions ?? []}
            value={locationInput}
            onChange={setLocationInput}
            onItemSubmit={(item) => {
              setLocationInput(item.value);
            }}
            error={errorLocationData?.message}
            isLoading={isLoadingLocationData}
          />
          <Button type="submit" mt="sm">
            Finish registration
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
