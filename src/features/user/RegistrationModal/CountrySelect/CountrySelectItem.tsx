import { type ForwardedRef, forwardRef } from "react";
import { Group, Text, type SelectItemProps } from "@mantine/core";
import ReactCountryFlag from "react-country-flag";

type Props = SelectItemProps;

const Item = (
  { value, label, ...others }: Props,
  ref: ForwardedRef<HTMLDivElement>
) => {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        <ReactCountryFlag
          svg
          countryCode={value ?? ""}
          style={{
            width: "24px",
            height: "24px",
          }}
        />
        <div>
          <Text>{label}</Text>
        </div>
      </Group>
    </div>
  );
};

export const CountrySelectItem = forwardRef<HTMLDivElement, Props>(Item);
