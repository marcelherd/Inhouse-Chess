/**
 * Shuffles the provided array.
 *
 * @param array - the array that is to be shuffled in-place
 *
 * @see https://stackoverflow.com/a/12646864/4409162
 * @license CC BY-SA 3.0
 */
export const shuffleArray = (array: unknown[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
