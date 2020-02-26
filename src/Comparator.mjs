import Difference from "./Difference.mjs";
import { is_object } from "./utils.mjs";

/**
 * Compares two (JSON-serializable) structures and returns their differences.
 * @constructor
 */
export default function Comparator() {
}

/**
 * Compares two structures and returns an array of their differences.
 *
 * @param {*} left
 * @param {*} right
 * @return {Difference[]}
 */
Comparator.prototype.compare = function (left, right) {
	return this.compare_values(left, right, []);
};

/**
 * Compares two values at the same path.
 *
 * @param {*} left
 * @param {*} right
 * @param {Array} path
 * @return {Difference[]}
 * @private
 */
Comparator.prototype.compare_values = function (left, right, path) {
	let left_is_array, right_is_array, left_is_object, right_is_object;

	left_is_array = Array.isArray(left);
	right_is_array = Array.isArray(right);
	left_is_object = left_is_array === false && is_object(left);
	right_is_object = right_is_array === false && is_object(right);

	if (left_is_array && right_is_array) {
		return this.compare_arrays(left, right, path);
	} else if (left_is_object && right_is_object) {
		return this.compare_objects(left, right, path);
	}

	if (left !== right) {
		return [ new Difference(path, Difference.TYPE_CHANGED, left, right) ];
	} else {
		return [];
	}
};

/**
 * Compares the elements in two objects at the same path.
 *
 * @param {Object} left
 * @param {Object} right
 * @param {Array} path
 * @return {Difference[]}
 * @private
 */
Comparator.prototype.compare_objects = function (left, right, path) {
	let self = this, differences = [];

	for (let left_key in left) {
		if (left.hasOwnProperty(left_key)) {
			const element_path = path.concat(left_key);
			const left_value = left[left_key];
			if (typeof right[left_key] === "undefined") {
				differences.push(new Difference(element_path, Difference.TYPE_DELETED, left_value, undefined));
			} else {
				differences = differences.concat(self.compare_values(left_value, right[left_key], element_path));
			}
		}
	}

	for (let right_key in right) {
		if (right.hasOwnProperty(right_key)) {
			const element_path = path.concat(right_key);
			const right_value = right[right_key];
			if (typeof left[right_key] === "undefined") {
				differences.push(new Difference(element_path, Difference.TYPE_ADDED, undefined, right_value));
			}
		}
	}

	return differences;
};

/**
 * Compares the elements in two arrays at the same path.
 *
 * @param {Array} left
 * @param {Array} right
 * @param {Array} path
 * @return {Difference[]}
 * @private
 */
Comparator.prototype.compare_arrays = function (left, right, path) {
	let self = this, differences = [];

	left.forEach(function (left_value, left_index) {
		const element_path = path.concat(left_index);
		if (typeof right[left_index] === "undefined") {
			differences.push(new Difference(element_path, Difference.TYPE_DELETED, left_value, undefined));
		} else {
			differences = differences.concat(self.compare_values(left_value, right[left_index], element_path));
		}
	});

	right.forEach(function (right_value, right_index) {
		const element_path = path.concat(right_index);
		if (typeof left[right_index] === "undefined") {
			differences.push(new Difference(element_path, Difference.TYPE_ADDED, undefined, right_value));
		}
	});

	return differences;
};
