import { Select } from "@mantine/core";
import { countries } from "./countries";
import { CountrySelectItem } from "./CountrySelectItem";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export const CountrySelect: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Select
      required
      searchable
      label="Country"
      description="Where are you from?"
      placeholder="Pick one"
      itemComponent={CountrySelectItem}
      data={countries.map((country) => ({
        value: country.code,
        label: country.name,
      }))}
      value={value}
      onChange={onChange}
    />
  );
};
