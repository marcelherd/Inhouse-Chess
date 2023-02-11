import type { Game, User } from "@prisma/client";

export type GameWithPlayers = Game & {
  opponent: User;
  player: User;
  winner: User | null;
};
