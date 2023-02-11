import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const gameRouter = createTRPCRouter({
  // Requests that have been sent to me, to which I have not yet responded
  findLatest: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
      })
    )
    .query(({ ctx, input }) => {
      const { limit } = input;

      return ctx.prisma.game.findMany({
        orderBy: {
          playedAt: "desc",
        },
        include: {
          player: true,
          opponent: true,
          winner: true,
        },
        take: limit,
      });
    }),
});
