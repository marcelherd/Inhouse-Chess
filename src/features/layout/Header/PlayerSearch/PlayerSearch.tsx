import { useState } from "react";
import { useRouter } from "next/router";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { type User } from "@prisma/client";
import { api } from "../../../../utils/api";
import { AutocompleteUser } from "../../../../components/AutocompleteUser";

export const PlayerSearch: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 576px)");

  const [user, setUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [debouncedInput] = useDebouncedValue(inputValue, 250);

  const {
    data: users,
    isLoading,
    error,
  } = api.users.findByNameOrEmail.useQuery({
    value: debouncedInput,
  });

  const userSuggestions = users
    ?.filter((user) => user.name)
    ?.map((user) => ({ ...user, value: user.name as string }));

  return (
    <AutocompleteUser
      placeholder="Search player"
      icon={<IconSearch size={12} stroke={1.5} />}
      value={inputValue}
      onChange={setInputValue}
      onItemSubmit={(user) => {
        setInputValue("");
        void router.push(`/user/${user.id}`);
      }}
      data={userSuggestions ?? []}
      error={error?.message}
      isLoading={isLoading}
      mb="sm"
      styles={{
        input: {
          width: isMobile ? 200 : 420,
        },
      }}
    />
  );
};
