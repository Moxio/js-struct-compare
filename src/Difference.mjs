/**
 * @param {Array} path
 * @param {String} type
 * @param {*} left_value
 * @param {*} right_value
 * @constructor
 */
export default function Difference(path, type, left_value, right_value) {
	/** @private */
	this.path = path;
	/** @private */
	this.type = type;
	/** @private */
	this.left_value = left_value;
	/** @private */
	this.right_value = right_value;
}

/**
 * Indicates that the element was added in the transition from 'left' to 'right' structure
 * @const {String}
 */
Difference.TYPE_ADDED = "added";

/**
 * Indicates that the element was deleted in the transition from 'left' to 'right' structure
 * @const {String}
 */
Difference.TYPE_DELETED = "deleted";

/**
 * Indicates that the element was changed in the transition from 'left' to 'right' structure
 * @const {String}
 */
Difference.TYPE_CHANGED = "changed";

/**
 * Returns the path to the element where the difference is located.
 *
 * @return {Array}
 */
Difference.prototype.get_path = function () {
	return this.path;
};

/**
 * Returns the type of difference. Should be one of the Difference.TYPE_*
 * constants.
 *
 * @return {String}
 */
Difference.prototype.get_type = function () {
	return this.type;
};

/**
 * Returns the value of the element in the 'left' structure, or undefined if the
 * element is missing there.
 *
 * @return {*}
 */
Difference.prototype.get_left_value = function () {
	return this.left_value;
};

/**
 * Returns the value of the element in the 'left' structure, or undefined if the
 * element is missing there.
 *
 * @return {*}
 */
Difference.prototype.get_right_value = function () {
	return this.right_value;
};
