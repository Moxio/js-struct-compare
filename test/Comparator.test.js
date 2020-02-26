/*eslint-env node, jest */
const esmImport = require("esm")(module);
const Comparator = esmImport("../src/index.mjs").Comparator;
const Difference = esmImport("../src/index.mjs").Difference;

describe("Comparator", function () {
	let comparator = new Comparator();

	it("considers identical strings no difference", function () {
		let differences = comparator.compare("foo", "foo");
		expect(differences).toEqual([]);
	});
	it("considers identical integers no difference", function () {
		let differences = comparator.compare(42, 42);
		expect(differences).toEqual([]);
	});
	it("considers identical floats no diffeence", function () {
		let differences = comparator.compare(42.42, 42.42);
		expect(differences).toEqual([]);
	});
	it("considers identical booleans no difference", function () {
		let differences;

		differences = comparator.compare(true, true);
		expect(differences).toEqual([]);

		differences = comparator.compare(false, false);
		expect(differences).toEqual([]);
	});
	it("considers null and null no difference", function () {
		let differences = comparator.compare(null, null);
		expect(differences).toEqual([]);
	});
	it("considers different scalars a change", function () {
		let differences, difference;
		differences = comparator.compare("foo", "bar");
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_CHANGED);
		expect(difference.get_left_value()).toStrictEqual("foo");
		expect(difference.get_right_value()).toStrictEqual("bar");
	});
	it("considers scalars with different types a change", function () {
		let differences, difference;
		differences = comparator.compare(42, "42");
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_CHANGED);
		expect(difference.get_left_value()).toStrictEqual(42);
		expect(difference.get_right_value()).toStrictEqual("42");
	});
	it("considers objects with identical properties and values no difference", function () {
		let differences = comparator.compare({ "key": "value" }, { "key": "value" });
		expect(differences).toEqual([]);
	});
	it("considers arrays with identical values no difference", function () {
		let differences = comparator.compare([ "value" ], [ "value" ]);
		expect(differences).toEqual([]);
	});
	it("considers an object and an array to be incompatible", function () {
		let differences, difference;

		differences = comparator.compare({ "key": "value" }, [ "value" ]);
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_CHANGED);
		expect(difference.get_left_value()).toEqual({ "key": "value" });
		expect(difference.get_right_value()).toEqual([ "value" ]);

		differences = comparator.compare([ "value" ], { "key": "value" });
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_CHANGED);
		expect(difference.get_left_value()).toEqual([ "value" ]);
		expect(difference.get_right_value()).toEqual({ "key": "value" });
	});
	it("considers a scalar versus an object a change", function () {
		let differences, difference;

		differences = comparator.compare({ "key": "value" }, "value");
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_CHANGED);
		expect(difference.get_left_value()).toEqual({ "key": "value" });
		expect(difference.get_right_value()).toStrictEqual("value");

		differences = comparator.compare("value", { "key": "value" });
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_CHANGED);
		expect(difference.get_left_value()).toStrictEqual("value");
		expect(difference.get_right_value()).toEqual({ "key": "value" });
	});
	it("considers a scalar versus an array a change", function () {
		let differences, difference;

		differences = comparator.compare([ "value" ], "value");
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_CHANGED);
		expect(difference.get_left_value()).toEqual([ "value" ]);
		expect(difference.get_right_value()).toStrictEqual("value");

		differences = comparator.compare("value", [ "value" ]);
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_CHANGED);
		expect(difference.get_left_value()).toStrictEqual("value");
		expect(difference.get_right_value()).toEqual([ "value" ]);
	});
	it("compares items with identical keys in objects", function () {
		let differences, difference;
		differences = comparator.compare({ "key": "foo" }, { "key": "bar" });
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([ "key" ]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_CHANGED);
		expect(difference.get_left_value()).toStrictEqual("foo");
		expect(difference.get_right_value()).toStrictEqual("bar");
	});
	it("compares items with identical keys in arrays", function () {
		let differences, difference;
		differences = comparator.compare([ "foo" ], [ "bar" ]);
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([ 0 ]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_CHANGED);
		expect(difference.get_left_value()).toStrictEqual("foo");
		expect(difference.get_right_value()).toStrictEqual("bar");
	});
	it("considers an extra property in an object an addition", function () {
		let differences, difference;
		differences = comparator.compare({ "foo": "bar" }, { "foo": "bar", "baz": "qux" });
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([ "baz" ]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_ADDED);
		expect(difference.get_left_value()).toBeUndefined();
		expect(difference.get_right_value()).toStrictEqual("qux");
	});
	it("considers an extra element in an array an addition", function () {
		let differences, difference;
		differences = comparator.compare([ "bar" ], [ "bar", "qux" ]);
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([ 1 ]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_ADDED);
		expect(difference.get_left_value()).toBeUndefined();
		expect(difference.get_right_value()).toStrictEqual("qux");
	});
	it("considers a missing property in an object a deletion", function () {
		let differences, difference;
		differences = comparator.compare({ "foo": "bar", "baz": "qux" }, { "foo": "bar" });
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([ "baz" ]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_DELETED);
		expect(difference.get_left_value()).toStrictEqual("qux");
		expect(difference.get_right_value()).toBeUndefined();
	});
	it("considers a missing element in an array a deletion", function () {
		let differences, difference;
		differences = comparator.compare([ "bar", "qux" ], [ "bar" ]);
		expect(differences.length).toStrictEqual(1);

		difference = differences[0];
		expect(difference.get_path()).toEqual([ 1 ]);
		expect(difference.get_type()).toStrictEqual(Difference.TYPE_DELETED);
		expect(difference.get_left_value()).toStrictEqual("qux");
		expect(difference.get_right_value()).toBeUndefined();
	});
});
