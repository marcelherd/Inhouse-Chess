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
  Input,
  Chip,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { type Experience } from "@prisma/client";
import { CountrySelect } from "./CountrySelect";
import { api } from "../../../utils/api";
import { AutocompleteLocation } from "../../../components/AutocompleteLocation";
import { capitalize } from "../../../utils/string";
import { AutocompleteDepartment } from "../../../components/AutocompleteDepartment";

type ExperienceChoice = {
  value: Experience;
  label: string;
};

export const RegistrationModal: React.FC = () => {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  // TODO(marcelherd): Leverage Mantine's form library or react-hook-form
  const [experience, setExperience] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [debouncedLocation] = useDebouncedValue(locationInput, 250);
  const [departmentInput, setDepartmentInput] = useState("");
  const [debouncedDepartment] = useDebouncedValue(departmentInput, 250);

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
    data: departmentData,
    isLoading: isLoadingDepartmentData,
    error: errorDepartmentData,
  } = api.users.findDepartmentData.useQuery({ value: debouncedDepartment });

  const departmentSuggestions = departmentData
    ?.filter((departmentDatum) => departmentDatum.department)
    .map((departmentDatum) => ({
      ...departmentDatum,
      value: departmentDatum.department as string,
      users: departmentDatum._count.department,
    }));

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
      availability,
      experience,
      countryCode,
      department: departmentInput,
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
          <Input.Wrapper
            label="Availability"
            description="On which days are you in the office and available to play?"
          >
            <Chip.Group
              multiple
              value={availability}
              onChange={setAvailability}
              mt="xs"
              sx={{ gap: 4 }}
            >
              <Chip value="mon" variant="filled" size="sm" radius="sm">
                Mon
              </Chip>
              <Chip value="tue" variant="filled" size="sm" radius="sm">
                Tue
              </Chip>
              <Chip value="wed" variant="filled" size="sm" radius="sm">
                Wed
              </Chip>
              <Chip value="thu" variant="filled" size="sm" radius="sm">
                Thu
              </Chip>
              <Chip value="fri" variant="filled" size="sm" radius="sm">
                Fri
              </Chip>
            </Chip.Group>
          </Input.Wrapper>
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
          <AutocompleteDepartment
            required
            minLength={3}
            label="Department"
            placeholder="E.g. Cloud Services"
            description="Which department do you work in? Don't use codes!"
            data={departmentSuggestions ?? []}
            value={departmentInput}
            onChange={setDepartmentInput}
            onItemSubmit={(item) => {
              setDepartmentInput(item.value);
            }}
            error={errorDepartmentData?.message}
            isLoading={isLoadingDepartmentData}
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
