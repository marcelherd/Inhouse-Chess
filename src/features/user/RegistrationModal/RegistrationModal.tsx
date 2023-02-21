import { useEffect, useState, type FormEventHandler } from "react";
import { useSession } from "next-auth/react";
import {
  Modal,
  Stack,
  Button,
  Text,
  Select,
  Autocomplete,
  MultiSelect,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { type Experience } from "@prisma/client";
import { CountrySelect } from "./CountrySelect";
import { api } from "../../../utils/api";
import { AutocompleteLocation } from "../../../components/AutocompleteLocation";
import { capitalize } from "../../../utils/string";

type ExperienceChoice = {
  value: Experience;
  label: string;
};

export const RegistrationModal: React.FC = () => {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [experience, setExperience] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [department, setDepartment] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [debouncedLocation] = useDebouncedValue(locationInput, 250);

  const utils = api.useContext();

  const finishRegistration = api.users.finishRegistration.useMutation({
    onSuccess: () => {
      void utils.users.invalidate();

      // Hacky way to update the session so we don't open up the modal again.
      // See also: https://stackoverflow.com/a/70405437/4409162
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);

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
      department,
      tags,
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
            placeholder="E.g. PGS"
            description="In which building do you work?"
            data={locationSuggestions ?? []}
            value={locationInput}
            onChange={setLocationInput}
            onItemSubmit={(item) => {
              setLocationInput(item.value);
            }}
            error={errorLocationData?.message}
            isLoading={isLoadingLocationData}
          />
          <TextInput
            required
            minLength={3}
            label="Department"
            placeholder="E.g. Cloud Services"
            description="Which department do you work in? Don't use codes!"
            value={department}
            onChange={(event) => setDepartment(event.currentTarget.value)}
          />
          <MultiSelect
            searchable
            creatable
            clearable
            maxSelectedValues={5}
            getCreateLabel={(query) => `Add "${query}"`}
            label="Skills & Technologies"
            description="What kind of skills and technologies can you share with your coworkers?"
            placeholder="E.g. Azure, Powershell, SQL"
            data={tags}
            onCreate={(tag) => {
              setTags((old) => [...old, tag]);
              return tag;
            }}
            value={tags}
            onChange={setTags}
          />
          <Button type="submit" mt="sm">
            Finish registration
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
