import { type FormEventHandler, useState } from "react";
import {
  Modal,
  Button,
  SegmentedControl,
  Stack,
  Autocomplete,
  Text,
  Loader,
  Badge,
  Avatar,
  ActionIcon,
  Input,
  type MantineColor,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery, useDebouncedValue } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { type User } from "@prisma/client";
import { api } from "../../../utils/api";
import { showNotification } from "@mantine/notifications";
import { AutocompleteUser } from "../../../components/AutocompleteUser";

type Props = {
  opened: boolean;
  onClose?: () => void;
};

const getColorByResult = (result: string) => {
  if (result === "loss") return "red";
  if (result === "draw") return "gray";
  if (result === "win") return "green";

  return "gray";
};

const getColorByColor = (color: string, isDarkMode: boolean): MantineColor => {
  if (isDarkMode) {
    return color === "white" ? "gray" : "gray";
  }
  return color === "white" ? "gray" : "dark";
};

export const EnterResultsModal: React.FC<Props> = ({ opened, onClose }) => {
  const [opponent, setOpponent] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [outcome, setOutcome] = useState("loss");
  const [color, setColor] = useState("white");
  const [debouncedOpponent] = useDebouncedValue(inputValue, 250);

  const { colorScheme } = useMantineColorScheme();
  const isDarkMode = colorScheme === "dark";

  const isMobile = useMediaQuery("(max-width: 767px)");

  const {
    data: users,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = api.users.findOthersByNameOrEmail.useQuery({
    value: debouncedOpponent,
  });

  const createRequest = api.requests.create.useMutation({
    onSuccess: () => {
      onClose?.();

      // Restore initial state, as the component is not unmounted when the modal is closed
      setOpponent(null);
      setInputValue("");
      setColor("white");
      setOutcome("loss");

      showNotification({
        title: "Success",
        message:
          "A request to confirm this game has been sent to your opponent.",
        color: "green",
      });
    },
  });

  const userSuggestions = users
    ?.filter((user) => user.name)
    ?.map((user) => ({ ...user, value: user.name as string }));

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // TODO(marcelherd): Error handling
    if (!opponent) return;
    if (color !== "white" && color !== "black") return;
    if (outcome !== "win" && outcome !== "loss" && outcome !== "draw") return;

    createRequest.mutate({
      opponentId: opponent.id,
      color,
      outcome,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={() => onClose?.()}
      title="Submit game"
      size="md"
      fullScreen={isMobile}
      transition="fade"
      transitionDuration={600}
      transitionTimingFunction="ease"
    >
      <form onSubmit={onSubmit}>
        <Stack>
          {opponent ? (
            <Input.Wrapper
              withAsterisk
              label="Opponent"
              description="Who did you play against?"
            >
              <Badge
                size="xl"
                radius="xl"
                sx={{
                  paddingLeft: 0,
                  paddingRight: 3,
                  marginTop: 6,
                  textTransform: "none",
                }}
                leftSection={
                  <Avatar
                    alt={`Image of ${opponent.name ?? "Opponent"}`}
                    size={24}
                    mr={5}
                    src={opponent.image}
                  />
                }
                rightSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                    onClick={() => setOpponent(null)}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                }
              >
                {opponent.name}
              </Badge>
            </Input.Wrapper>
          ) : (
            <AutocompleteUser
              data-autofocus
              required
              label="Opponent"
              placeholder="Name or email"
              description="Who did you play against?"
              value={inputValue}
              onChange={setInputValue}
              onItemSubmit={(user) => {
                setOpponent(user);
                setInputValue("");
              }}
              data={userSuggestions ?? []}
              error={errorUsers?.message}
              isLoading={isLoadingUsers}
            />
          )}
          <Input.Wrapper
            required
            label="Color"
            description="Which color did you play?"
          >
            <SegmentedControl
              fullWidth
              size="md"
              radius="lg"
              sx={{ marginTop: 6 }}
              color={getColorByColor(color, isDarkMode)}
              transitionDuration={250}
              transitionTimingFunction="ease"
              value={color}
              onChange={setColor}
              data={[
                { label: "White", value: "white" },
                { label: "Black", value: "black" },
              ]}
            />
          </Input.Wrapper>
          <Input.Wrapper
            required
            label="Outcome"
            description="What was the outcome of your game?"
          >
            <SegmentedControl
              fullWidth
              size="md"
              radius="lg"
              sx={{ marginTop: 6 }}
              color={getColorByResult(outcome)}
              transitionDuration={250}
              transitionTimingFunction="ease"
              value={outcome}
              onChange={setOutcome}
              data={[
                { label: "I lost", value: "loss" },
                { label: "Draw", value: "draw" },
                { label: "I won", value: "win" },
              ]}
            />
          </Input.Wrapper>
          <Text fz="sm">
            Once you submit the game, a request to confirm it will be sent to
            your opponent.
          </Text>
          <Button type="submit" mt="sm">
            Submit
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
