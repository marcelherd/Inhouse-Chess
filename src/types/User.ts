import { type User } from "@prisma/client";

export type UserProfile = {
  user: User;
  computed: {
    games: number;
    wins: number;
    losses: number;
    draws: number;
  };
};
