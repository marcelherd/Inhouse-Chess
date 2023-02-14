import { type User } from "@prisma/client";

export const calculateRatingAdjustment = (
  me: User,
  opponent: User,
  winner: User | null
) => {
  // TODO(marcelherd): This is really not working at all and needs to be re-written from scratch,
  //  ideally using Glicko or Glicko-2 instead of Elo.

  // 0 (Loss) or 0.5 (Draw) or 1 (Win)
  const result = !winner ? 0.5 : winner.id === me.id ? 1 : 0;
  const winLikelihood =
    1 / (1 + Math.pow(10, (opponent.rating - me.rating) / 400));
  return Math.abs(Math.round(32 * (result - winLikelihood)));
};
