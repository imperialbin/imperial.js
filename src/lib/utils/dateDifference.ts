/**
 *  Little helper to get done with dates easier
 *  @param firstDate Current date or the creation date
 *  @param secondDate The deletion date
 *  @returns The difference in days
 *  @internal
 *  @example
 *  getDateDifference(new Date(), new Date())
 *  > 0
 *  getDateDifference(new Date("1-1-2019"), new Date("1-1-2020"))
 *  > 365
 */
export const getDateDifference = (firstDate: Date, secondDate: Date): number =>
	Math.round((secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
