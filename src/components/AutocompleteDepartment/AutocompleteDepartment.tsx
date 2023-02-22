import {
  Autocomplete,
  Text,
  Loader,
  type AutocompleteProps,
} from "@mantine/core";
import { DepartmentItem } from "./DepartmentItem";

type Props = AutocompleteProps &
  React.RefAttributes<HTMLInputElement> & {
    limit?: number;
    isLoading?: boolean;
  };

export const AutocompleteDepartment: React.FC<Props> = ({
  limit,
  isLoading,
  ...rest
}) => {
  // TODO(marcelherd): This component and AutocompleteLocation are basically the same
  //    and should be implemented via a single component that can be adjusted via props.
  return (
    <Autocomplete
      itemComponent={DepartmentItem}
      nothingFound={<Text>No other players at this location</Text>}
      limit={limit ?? 5}
      rightSection={isLoading ? <Loader size={16} /> : null}
      {...rest}
    />
  );
};
