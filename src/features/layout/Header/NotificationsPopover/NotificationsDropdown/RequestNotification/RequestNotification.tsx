import {
  Text,
  Button,
  Divider,
  Group,
  Avatar,
  Box,
  Center,
  Flex,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import format from "date-fns/format";
import type { Request, User } from "@prisma/client";
import { CrownIndicator } from "../../../../../../components/CrownIndicator";
import { api } from "../../../../../../utils/api";

type RequestWithUsers = Request & {
  submittedBy: User;
  receivedBy: User;
};

type Props = {
  request: RequestWithUsers;
  withDivider?: boolean;
};

export const RequestNotification: React.FC<Props> = ({
  request,
  withDivider,
}) => {
  const isMobile = useMediaQuery("(max-width: 576px)");

  const utils = api.useContext();
  const approve = api.requests.approve.useMutation({
    onSuccess: () => {
      void utils.requests.findProcessables.invalidate();
      void utils.games.findLatest.invalidate();

      // TODO(marcelherd): Not quite sure that this is the correct way, but
      //    approving a request does cause the involved users elo to change.
      void utils.users.invalidate();
    },
  });
  const reject = api.requests.approve.useMutation({
    onSuccess: () => utils.requests.findProcessables.invalidate(),
  });

  const draw = request.proposedWinnerId === null;
  const submitterWon = request.proposedWinnerId === request.submittedById;
  const receiverWon = request.proposedWinnerId === request.receivedById;

  // TODO(marcelherd): Use <GameSummary />

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Group position="apart">
        <Text weight={500}>{request.submittedBy.name} submitted a game</Text>
        <Text size="xs" color="dimmed">
          {format(request.createdAt, "dd/MM/yyyy")}
        </Text>
      </Group>
      <Text size="sm" color="dimmed" mb={16}>
        Please review the request and approve or reject it.
      </Text>
      <Group sx={{ display: "flex", justifyContent: "space-between" }}>
        <Group>
          {receiverWon ? (
            <CrownIndicator position="top-start">
              <Avatar
                src={request.receivedBy.image}
                size={isMobile ? 48 : 64}
                alt={request.receivedBy.name ?? "?"}
              >
                {request.receivedBy.name ?? "?"}
              </Avatar>
            </CrownIndicator>
          ) : (
            <Avatar
              src={request.receivedBy.image}
              size={isMobile ? 48 : 64}
              alt={request.receivedBy.name ?? "?"}
            >
              {request.receivedBy.name ?? "?"}
            </Avatar>
          )}
          <Flex direction="column">
            <Text weight={500}>You</Text>
            <Center>
              <Text size="xs" color="dimmed">
                {draw ? "Draw" : receiverWon ? "Won" : "Lost"}
              </Text>
            </Center>
          </Flex>
        </Group>

        <Text color="dimmed">vs</Text>

        <Group>
          <Flex direction="column">
            <Text weight={500}>{request.submittedBy.name}</Text>
            <Center>
              <Text size="xs" color="dimmed">
                {draw ? "Draw" : submitterWon ? "Won" : "Lost"}
              </Text>
            </Center>
          </Flex>
          {submitterWon ? (
            <CrownIndicator>
              <Avatar
                src={request.submittedBy.image}
                size={isMobile ? 48 : 64}
                alt={request.submittedBy.name ?? "?"}
              >
                {request.submittedBy.name ?? "?"}
              </Avatar>
            </CrownIndicator>
          ) : (
            <Avatar
              src={request.submittedBy.image}
              size={isMobile ? 48 : 64}
              alt={request.submittedBy.name ?? "?"}
            >
              {request.submittedBy.name ?? "?"}
            </Avatar>
          )}
        </Group>
      </Group>
      <Group spacing={4} mt={24}>
        <Button
          size="sm"
          variant="light"
          onClick={() => approve.mutate({ requestId: request.id })}
        >
          Approve
        </Button>
        <Button
          size="sm"
          color="red"
          variant="subtle"
          onClick={() => reject.mutate({ requestId: request.id })}
        >
          Reject
        </Button>
      </Group>
      {withDivider && <Divider my={20} />}
    </Box>
  );
};
