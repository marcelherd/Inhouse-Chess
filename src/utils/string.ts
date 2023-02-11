export const getInitials = (name: string) => {
  return name
    .trim()
    .split(" ")
    .map((str) => str.charAt(0).toUpperCase());
};
