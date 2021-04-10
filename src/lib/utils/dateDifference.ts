/**
 *  Little helper to get done with dates easier
 * @param firstDate Current date or the creation date
 * @param secondDate The deletion date
 */
export const getDateDifference = (firstDate: Date, secondDate: Date): number =>
	Math.round((secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
