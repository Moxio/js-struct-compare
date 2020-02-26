js-struct-compare
=================
Javascript library to compare two (JSON-serializable) structures and return their
differences.

Installation
------------
This library can be installed from the NPM package registry. Using NPM:
```sh
npm install --save js-struct-compare
```
Or using Yarn:
```sh
yarn add js-struct-compare
```

Usage
-----
This package is meant to be consumed as an ES module. It's default export is a
comparison function that takes a _left_ and a _right_ instance and returns an
array of differences between them. These can be seen as the operations needed
to transform _left_ into _right_. An example:
```js
import compare from "js-struct-compare";

const left = {
    "foo": {
        "bar": [ 42, 0 ],
    },
    "qux": "quux",
    "corge": "grault",
    "garply": [],
};
const right = {
    "foo": {
        "bar": [ 43, 0 ],
        "baz": 99,
    },
    "corge": "grault",
    "garply": {},
};

const differences = compare(left, right);
// => [
//   Difference{path: ['foo', 'bar', 0], type: 'changed', left_value: 42, right_value: 43},
//   Difference{path: ['foo', 'baz'], type: 'added', left_value: undefined, right_value: 99},
//   Difference{path: ['qux'], type: 'deleted', left_value: 'quux', right_value: undefined}
//   Difference{path: ['garply'], type: 'changed', left_value: [], right_value: {}},
// ]
```

Each `Difference` object contains:

* A `path`: an array of path elements traversed to the location of the differences. The path
  elements are strings in case of object properties and numbers in case of array keys.
* A `type`: describes the kind of difference. Can be one of the following:
    * `Difference.TYPE_CHANGED = 'changed'`: both the _left_ and the _right_ instance have a
      value at the given path, but these values are different.
    * `Difference.TYPE_ADDED = 'added'`: the _left_ instance does not have a value at the
      given path, but the _right_ instance does, i.e. the value was added in the transition
      from _left_ to _right_.
    * `Difference.TYPE_DELETED = 'deleted'`: the _left_ instance has a value at the given
      path, but the _right_ instance does not, i.e. the value was deleted in the transition
      from _left_ to _right_.
* A `left_value`: the value the _left_ instance has at the given path. Is `undefined` in case
  of an addition. Can be a non-scalar value, i.e. a struct in itself.
* A `right_value`: the value the _right_ instance has at the given path. Is `undefined` in case
  of a deletion. Can be a non-scalar value, i.e. a struct in itself.

The `Difference` and `Comparator` classes can be accessed separately as named exports:
```js
import { Difference, Comparator } from "js-struct-compare";
```

Versioning
----------
This project adheres to [Semantic Versioning](http://semver.org/).

Contributing
------------
Contributions to this project are more than welcome.

License
-------
This project is released under the MIT license.

---
Made with love, coffee and fun by the [Moxio](https://www.moxio.com) team from
Delft, The Netherlands. Interested in joining our awesome team? Check out our
[vacancies](https://werkenbij.moxio.com/) (in Dutch).
