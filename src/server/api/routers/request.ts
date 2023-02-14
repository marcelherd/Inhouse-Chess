import { Color } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { calculateRatingAdjustment } from "../../lib/elo";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const requestRouter = createTRPCRouter({
  // Requests that have been sent to me, to which I have not yet responded
  findProcessables: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
      })
    )
    .query(({ ctx, input }) => {
      const { user } = ctx.session;
      const { limit } = input;

      return ctx.prisma.request.findMany({
        where: {
          receivedById: user.id,
          processed: false,
        },
        include: {
          receivedBy: true,
          submittedBy: true,
        },
        take: limit,
      });
    }),
  // Requests that I have sent out
  findPending: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session;

    return ctx.prisma.request.findMany({
      where: {
        submittedById: user.id,
        processed: false,
      },
      include: {
        receivedBy: true,
        submittedBy: true,
      },
    });
  }),
  // Submit a request which has to be approved by my opponent
  create: protectedProcedure
    .input(
      z.object({
        opponentId: z.string(),
        color: z.union([z.literal("white"), z.literal("black")]),
        outcome: z.union([
          z.literal("win"),
          z.literal("draw"),
          z.literal("loss"),
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { opponentId, color, outcome } = input;

      const opponent = await ctx.prisma.user.findUnique({
        where: { id: opponentId },
      });

      if (!opponent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Opponent not found",
        });
      }

      const winner: string | null =
        outcome === "win" ? user.id : outcome === "loss" ? opponent.id : null;

      return ctx.prisma.request.create({
        data: {
          submittedById: user.id,
          submittedByColor: color === "white" ? Color.WHITE : Color.BLACK,
          receivedById: opponent.id,
          receivedByColor: color === "white" ? Color.BLACK : Color.WHITE,
          proposedWinnerId: winner,
        },
      });
    }),
  // Approve a request that I have received
  approve: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { requestId } = input;
      const { user } = ctx.session;

      const request = await ctx.prisma.request.findUnique({
        where: { id: requestId },
        include: {
          receivedBy: true,
          submittedBy: true,
        },
      });

      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Request not found",
        });
      }

      if (request.receivedById !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to reject this request",
        });
      }

      if (request.processed) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This request has already been processed",
        });
      }

      const {
        receivedBy,
        receivedByColor,
        submittedBy,
        submittedByColor,
        proposedWinnerId,
      } = request;

      // I know
      const winner =
        proposedWinnerId === null
          ? null
          : proposedWinnerId === receivedBy.id
          ? receivedBy
          : submittedBy;

      const ratingAdjustment = calculateRatingAdjustment(
        receivedBy,
        submittedBy,
        winner
      );

      // Commit the game
      const game = await ctx.prisma.game.create({
        data: {
          requestId: request.id,
          playerId: request.submittedById,
          playerColor: request.submittedByColor,
          opponentId: request.receivedById,
          opponentColor: request.receivedByColor,
          winnerId: request.proposedWinnerId,
          playedAt: request.createdAt,
          playerRating: request.submittedBy.rating,
          opponentRating: request.receivedBy.rating,
          ratingAdjustment,
        },
      });

      // Update the player's ratings
      await ctx.prisma.user.update({
        where: {
          id: request.submittedById,
        },
        data: {
          rating:
            request.submittedById === request.proposedWinnerId
              ? submittedBy.rating + ratingAdjustment
              : submittedBy.rating - ratingAdjustment,
          highestRating:
            request.submittedById === request.proposedWinnerId &&
            submittedBy.rating + ratingAdjustment > submittedBy.highestRating
              ? submittedBy.rating + ratingAdjustment
              : submittedBy.highestRating,
        },
      });

      await ctx.prisma.user.update({
        where: {
          id: request.receivedById,
        },
        data: {
          rating:
            request.receivedById === request.proposedWinnerId
              ? receivedBy.rating + ratingAdjustment
              : receivedBy.rating - ratingAdjustment,
          highestRating:
            request.receivedById === request.proposedWinnerId &&
            receivedBy.rating + ratingAdjustment > receivedBy.highestRating
              ? receivedBy.rating + ratingAdjustment
              : receivedBy.highestRating,
        },
      });

      // Attach the game to the request and close it
      return ctx.prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          processed: true,
          gameId: game.id,
        },
      });
    }),
  // Reject a request that I have received
  reject: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { requestId } = input;
      const { user } = ctx.session;

      const request = await ctx.prisma.request.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Request not found",
        });
      }

      if (request.receivedById !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to reject this request",
        });
      }

      if (request.processed) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This request has already been processed",
        });
      }

      return ctx.prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          processed: true,
        },
      });
    }),
});
