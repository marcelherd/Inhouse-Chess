/**
 * A K factor of 20 is used by FIDE for rapid and blitz and therefore seems the most appropriate here.
 *
 * @see https://ratings.fide.com/calculator_rtd.phtml
 */
const DEVELOPMENT_COEFFICIENT = 20;

/**
 * Calculates the new ratings for both players given their current rating and the result of
 * their game.
 *
 * @param playerRating - the player's rating
 * @param opponentRating - the opponent's rating
 * @param result - 1 if the player won, 0.5 if it was a draw, 0 if the player lost
 * @returns new ratings for both players
 */
export const calculateRatingAdjustment = (
  playerRating: number,
  opponentRating: number,
  result: 0 | 0.5 | 1
) => {
  const winLikelihood =
    1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));

  const playerRatingAdjustment = Math.round(
    DEVELOPMENT_COEFFICIENT * (result - winLikelihood)
  );

  const opponentRatingAdjustment = -playerRatingAdjustment;

  return {
    newPlayerRating: playerRating + playerRatingAdjustment,
    playerRatingAdjustment,
    newOpponentRating: opponentRating + opponentRatingAdjustment,
    opponentRatingAdjustment,
  };
};
