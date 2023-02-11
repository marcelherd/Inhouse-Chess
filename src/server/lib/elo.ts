import { type User } from "@prisma/client";

export const calculateRatingAdjustment = (
  me: User,
  opponent: User,
  winner: User | null
) => {
  // 0 (Loss) or 0.5 (Draw) or 1 (Win)
  const result = !winner ? 0.5 : winner.id === me.id ? 1 : 0;
  const winLikelihood =
    1 / (1 + Math.pow(10, (opponent.rating - me.rating) / 400));
  return Math.abs(Math.round(32 * (result - winLikelihood)));
};
