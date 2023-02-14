import { Title } from "@mantine/core";
import { type User } from "@prisma/client";

type Props = {
  user: User;
};

export const Profile: React.FC<Props> = ({ user }) => {
  return (
    <>
      <Title size="h3">{user.name}</Title>
    </>
  );
};
