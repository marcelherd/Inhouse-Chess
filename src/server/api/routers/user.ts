import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
              name: {
                contains: value,
              },
              email: {
                contains: value,
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
});
