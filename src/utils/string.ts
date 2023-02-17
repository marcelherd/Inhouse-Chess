export const getInitials = (name: string) => {
  return name
    .trim()
    .split(" ")
    .map((str) => str.charAt(0).toUpperCase());
};

export const capitalize = (str: string) => {
  if (str.length === 0) return str;
  if (str.length === 1) return str.toUpperCase();

  return str.charAt(0).toUpperCase() + str.slice(1, str.length).toLowerCase();
};
