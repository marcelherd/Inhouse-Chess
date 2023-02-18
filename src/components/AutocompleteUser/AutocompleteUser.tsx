import {
  Autocomplete,
  Text,
  Loader,
  type AutocompleteProps,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { type User } from "@prisma/client";
import { UserItem } from "./UserItem";

type Props = Omit<AutocompleteProps, "onItemSubmit"> &
  React.RefAttributes<HTMLInputElement> & {
    limit?: number;
    isLoading?: boolean;
    onItemSubmit?: (user: User) => void;
  };

export const AutocompleteUser: React.FC<Props> = ({
  limit,
  isLoading,
  onItemSubmit,
  ...rest
}) => {
  return (
    <Autocomplete
      itemComponent={UserItem}
      icon={<IconSearch size={16} />}
      nothingFound={<Text>Not found</Text>}
      limit={limit ?? 5}
      rightSection={isLoading ? <Loader size={16} /> : null}
      filter={(value, item) => {
        const { name, email } = item as unknown as User;

        if (!name || !email) return false;

        return (
          name.toLowerCase().includes(value.toLowerCase().trim()) ||
          email.toLowerCase().includes(value.toLowerCase().trim())
        );
      }}
      // I can live with this ¯\_(ツ)_/¯
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onItemSubmit={onItemSubmit}
      {...rest}
    />
  );
};
