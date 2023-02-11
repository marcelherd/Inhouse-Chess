import { Text, Title, Loader } from "@mantine/core";
import { api } from "../../../../../utils/api";
import { RequestNotification } from "./RequestNotification";

export const NotificationsDropdown: React.FC = () => {
  const {
    data: processables,
    isLoading,
    isError,
    error,
  } = api.requests.findProcessables.useQuery({ limit: 2 });

  // TODO(marcelherd): Better loading state
  if (isLoading) {
    return <Loader />;
  }

  // TODO(marcelherd): Better error handling
  if (isError) {
    return <Text color="red">{error.message}</Text>;
  }

  return (
    <>
      <Title order={2} size="h3" mb={16}>
        Notifications
      </Title>
      {processables.map((request, index) => (
        <RequestNotification
          key={request.id}
          request={request}
          withDivider={index !== processables.length - 1}
        />
      ))}
      {processables.length === 0 && (
        <Text>You don&apos;t have any notifications.</Text>
      )}
    </>
  );
};
