import { useEffect, useState, type FormEventHandler } from "react";
import {
  Modal,
  Stack,
  Button,
  Text,
  Select,
  Autocomplete,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { CountrySelect } from "./CountrySelect";
import { type Experience } from "@prisma/client";
import { api } from "../../../utils/api";

type ExperienceChoice = {
  value: Experience;
  label: string;
};

export const Registration: React.FC = () => {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [experience, setExperience] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [location, setLocation] = useState<string | undefined>();

  const utils = api.useContext();

  const finishRegistration = api.users.finishRegistration.useMutation({
    onSuccess: () => {
      void utils.users.invalidate();
      setOpened(false);
    },
  });

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
    if (!countryCode || !location) return;

    finishRegistration.mutate({
      experience,
      countryCode,
      location,
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
          <Autocomplete
            required
            label="Location"
            placeholder="E.g. the building you work in"
            description="Where would you play chess with others? This is used to find other players at your location."
            data={[]}
            value={location}
            onChange={setLocation}
          />
          <Button type="submit" mt="sm">
            Finish registration
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
