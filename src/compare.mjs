import Comparator from "./Comparator.mjs";

const comparator = new Comparator();

/**
 * Compares two structures and returns an array of their differences.
 *
 * @param {*} left
 * @param {*} right
 * @return {Difference[]}
 */
export default function compare(left, right) {
	return comparator.compare(left, right);
};
