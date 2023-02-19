import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { shuffleArray } from "../../../utils/array";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

async function assembleProfileData(id: string, prisma: PrismaClient) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  // Computed statistics
  const games = await prisma.game.count({
    where: {
      OR: [{ playerId: id }, { opponentId: id }],
    },
  });

  const wins = await prisma.game.count({
    where: {
      winnerId: id,
    },
  });

  const losses = await prisma.game.count({
    where: {
      AND: [{ NOT: { winner: null } }, { NOT: { winnerId: id } }],
    },
  });

  const draws = games - wins - losses;

  // TODO(marcelherd): Type this as UserProfile
  return {
    user,
    computed: {
      games,
      wins,
      losses,
      draws,
    },
  };
}

export const userRouter = createTRPCRouter({
  findById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });
    }),
  findByName: publicProcedure
    .input(z.object({ value: z.string() }))
    .query(({ ctx, input }) => {
      const { value } = input;

      return ctx.prisma.user.findMany({
        where: {
          name: {
            contains: value,
          },
        },
      });
    }),
  findByEmail: publicProcedure
    .input(z.object({ value: z.string() }))
    .query(({ ctx, input }) => {
      const { value } = input;

      return ctx.prisma.user.findMany({
        where: {
          email: {
            contains: value,
          },
        },
      });
    }),
  findByNameOrEmail: publicProcedure
    .input(z.object({ value: z.string() }))
    .query(({ ctx, input }) => {
      const { value } = input;

      return ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              email: {
                contains: value,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: value,
                mode: "insensitive",
              },
            },
          ],
        },
      });
    }),
  findOthersByNameOrEmail: protectedProcedure
    .input(z.object({ value: z.string() }))
    .query(({ ctx, input }) => {
      const { user } = ctx.session;
      const { value } = input;

      return ctx.prisma.user.findMany({
        where: {
          AND: [
            {
              NOT: {
                id: user.id,
              },
            },
            {
              OR: [
                {
                  email: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
                {
                  name: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
              ],
            },
          ],
        },
      });
    }),
  getProfileData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const user = await ctx.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Computed statistics
      const games = await ctx.prisma.game.count({
        where: {
          OR: [{ playerId: id }, { opponentId: id }],
        },
      });

      const wins = await ctx.prisma.game.count({
        where: {
          winnerId: id,
        },
      });

      const losses = await ctx.prisma.game.count({
        where: {
          AND: [{ NOT: { winner: null } }, { NOT: { winnerId: id } }],
        },
      });

      const draws = games - wins - losses;

      // TODO(marcelherd): Type this as UserProfile
      return {
        user,
        computed: {
          games,
          wins,
          losses,
          draws,
        },
      };
    }),
  finishRegistration: protectedProcedure
    .input(
      z.object({
        experience: z.union([
          z.literal("BEGINNER"),
          z.literal("ADVANCED"),
          z.literal("EXPERT"),
        ]),
        countryCode: z.string().length(2),
        location: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx.session;
      const { experience, countryCode, location } = input;

      return ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          experience,
          countryCode,
          location,
          registrationFinished: true,
        },
      });
    }),
  getTopPlayers: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;

      const users = await ctx.prisma.user.findMany({
        orderBy: {
          rating: "desc",
        },
        take: limit ?? 10,
      });

      return Promise.all(
        users.map((user) => assembleProfileData(user.id, ctx.prisma))
      );
    }),
  findOtherUsersByLocation: protectedProcedure
    .input(
      z.object({
        location: z.string(),
        limit: z.number().optional(),
        shuffleUsers: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { location, limit, shuffleUsers } = input;

      // Find users at the given location other than self
      const users = await ctx.prisma.user.findMany({
        where: {
          AND: [{ location }, { NOT: { id: user.id } }],
        },
      });

      const usersWithGamesPlayed = await Promise.all(
        users.map(async (user) => {
          const gamesPlayed = await ctx.prisma.game.count({
            where: { OR: [{ playerId: user.id }, { opponentId: user.id }] },
          });
          return {
            ...user,
            gamesPlayed,
          };
        })
      );

      // TODO(marcelherd): This shuffles the array in-place, but I prefer working
      //    with immutable data types.
      if (shuffleUsers) shuffleArray(usersWithGamesPlayed);

      if (limit) return usersWithGamesPlayed.slice(0, limit);

      return usersWithGamesPlayed;
    }),
});
