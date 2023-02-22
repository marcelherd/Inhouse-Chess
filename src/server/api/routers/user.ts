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
      AND: [
        { NOT: { winner: null } },
        { NOT: { winnerId: id } },
        { OR: [{ playerId: id }, { opponentId: id }] },
      ],
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

      return assembleProfileData(user.id, ctx.prisma);
    }),
  finishRegistration: protectedProcedure
    .input(
      z.object({
        availability: z.array(z.string()),
        experience: z.union([
          z.literal("BEGINNER"),
          z.literal("ADVANCED"),
          z.literal("EXPERT"),
        ]),
        countryCode: z.string().length(2),
        location: z.string(),
        department: z.string(),
        tags: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx.session;
      const {
        availability,
        experience,
        countryCode,
        location,
        department,
        tags,
      } = input;

      return ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          availability,
          experience,
          countryCode,
          location,
          department,
          tags,
          registrationFinished: true,
        },
      });
    }),
  getTopPlayers: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;

      const users = await ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              playedGames: {
                some: {},
              },
            },
            {
              playedAgainstGames: {
                some: {},
              },
            },
          ],
        },
        orderBy: {
          rating: "desc",
        },
        take: limit ?? 10,
      });

      return Promise.all(
        users.map((user) => assembleProfileData(user.id, ctx.prisma))
      );
    }),
  getTopPlayersByDepartment: publicProcedure
    .input(z.object({ department: z.string() }))
    .query(async ({ ctx, input }) => {
      const { department } = input;

      const users = await ctx.prisma.user.findMany({
        where: {
          AND: [
            { department },
            {
              OR: [
                {
                  playedGames: {
                    some: {},
                  },
                },
                {
                  playedAgainstGames: {
                    some: {},
                  },
                },
              ],
            },
          ],
        },
        orderBy: {
          rating: "desc",
        },
      });

      return Promise.all(
        users.map((user) => assembleProfileData(user.id, ctx.prisma))
      );
    }),
  findOtherUsersByLocation: protectedProcedure
    .input(
      z.object({
        location: z.string(),
        availability: z.array(z.string()).optional(),
        limit: z.number().optional(),
        shuffleUsers: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { availability, location, limit, shuffleUsers } = input;

      // Count users at the given location other than self
      const total = await ctx.prisma.user.count({
        where: {
          AND: [{ location }, { NOT: { id: user.id } }],
        },
      });

      // Find users at the given location other than self with matching availability
      const users = await ctx.prisma.user.findMany({
        where: {
          AND: [
            { location },
            { NOT: { id: user.id } },
            { availability: { hasSome: availability } },
          ],
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

      return {
        users: limit
          ? usersWithGamesPlayed.slice(0, limit)
          : usersWithGamesPlayed,
        total: total,
      };
    }),
  findLocationData: protectedProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const { user } = ctx.session;
      const { value } = input;

      return ctx.prisma.user.groupBy({
        by: ["location"],
        where: {
          AND: [
            {
              location: {
                contains: value,
                mode: "insensitive",
              },
            },
            { NOT: { id: user.id } },
          ],
        },
        _count: {
          location: true,
        },
      });
    }),
  findDepartmentData: protectedProcedure
    .input(z.object({ value: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { value } = input;

      return ctx.prisma.user.groupBy({
        by: ["department"],
        _count: {
          department: true,
        },
        where: {
          AND: [
            {
              department: {
                contains: value,
                mode: "insensitive",
              },
            },
            { NOT: { id: user.id } },
          ],
        },
      });
    }),
});
