import {
  Autocomplete,
  Text,
  Loader,
  type AutocompleteProps,
} from "@mantine/core";
import { LocationItem } from "./LocationItem";

type Props = AutocompleteProps &
  React.RefAttributes<HTMLInputElement> & {
    limit?: number;
    isLoading?: boolean;
  };

export const AutocompleteLocation: React.FC<Props> = ({
  limit,
  isLoading,
  ...rest
}) => {
  return (
    <Autocomplete
      itemComponent={LocationItem}
      nothingFound={<Text>No other players at this location</Text>}
      limit={limit ?? 5}
      rightSection={isLoading ? <Loader size={16} /> : null}
      {...rest}
    />
  );
};
