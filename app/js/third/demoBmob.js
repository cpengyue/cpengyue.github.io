/**
 * Created by caopengyue on 2017/6/15.
 */
/*!
 * bmob JavaScript SDK
 * Version: 1.0.0
 * Built:  2014
 * http://www.bmob.cn
 *
 * Copyright 2014 Bmob, Inc.
 * The Bmob JavaScript SDK is freely distributable under the MIT license.
 *
 * Includes: Underscore.js
 * Copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 * Released under the MIT license.
 */
(function(root) {
    root.Bmob = root.Bmob || {};
    root.Bmob.VERSION = "js0.0.1";
}(this));
//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this;

    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;

    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var push             = ArrayProto.push,
        slice            = ArrayProto.slice,
        concat           = ArrayProto.concat,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
        nativeForEach      = ArrayProto.forEach,
        nativeMap          = ArrayProto.map,
        nativeReduce       = ArrayProto.reduce,
        nativeReduceRight  = ArrayProto.reduceRight,
        nativeFilter       = ArrayProto.filter,
        nativeEvery        = ArrayProto.every,
        nativeSome         = ArrayProto.some,
        nativeIndexOf      = ArrayProto.indexOf,
        nativeLastIndexOf  = ArrayProto.lastIndexOf,
        nativeIsArray      = Array.isArray,
        nativeKeys         = Object.keys,
        nativeBind         = FuncProto.bind;

    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '1.4.4';

    // Collection Functions
    // --------------------

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = _.each = _.forEach = function(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            for (var key in obj) {
                if (_.has(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) return;
                }
            }
        }
    };

    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = _.collect = function(obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
        each(obj, function(value, index, list) {
            results[results.length] = iterator.call(context, value, index, list);
        });
        return results;
    };

    var reduceError = 'Reduce of empty array with no initial value';

    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
    _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduce && obj.reduce === nativeReduce) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
        }
        each(obj, function(value, index, list) {
            if (!initial) {
                memo = value;
                initial = true;
            } else {
                memo = iterator.call(context, memo, value, index, list);
            }
        });
        if (!initial) throw new TypeError(reduceError);
        return memo;
    };

    // The right-associative version of reduce, also known as `foldr`.
    // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
    _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
        }
        var length = obj.length;
        if (length !== +length) {
            var keys = _.keys(obj);
            length = keys.length;
        }
        each(obj, function(value, index, list) {
            index = keys ? keys[--length] : --length;
            if (!initial) {
                memo = obj[index];
                initial = true;
            } else {
                memo = iterator.call(context, memo, obj[index], index, list);
            }
        });
        if (!initial) throw new TypeError(reduceError);
        return memo;
    };

    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function(obj, iterator, context) {
        var result;
        any(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) {
                result = value;
                return true;
            }
        });
        return result;
    };

    // Return all the elements that pass a truth test.
    // Delegates to **ECMAScript 5**'s native `filter` if available.
    // Aliased as `select`.
    _.filter = _.select = function(obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
        each(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) results[results.length] = value;
        });
        return results;
    };

    // Return all the elements for which a truth test fails.
    _.reject = function(obj, iterator, context) {
        return _.filter(obj, function(value, index, list) {
            return !iterator.call(context, value, index, list);
        }, context);
    };

    // Determine whether all of the elements match a truth test.
    // Delegates to **ECMAScript 5**'s native `every` if available.
    // Aliased as `all`.
    _.every = _.all = function(obj, iterator, context) {
        iterator || (iterator = _.identity);
        var result = true;
        if (obj == null) return result;
        if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
        each(obj, function(value, index, list) {
            if (!(result = result && iterator.call(context, value, index, list))) return breaker;
        });
        return !!result;
    };

    // Determine if at least one element in the object matches a truth test.
    // Delegates to **ECMAScript 5**'s native `some` if available.
    // Aliased as `any`.
    var any = _.some = _.any = function(obj, iterator, context) {
        iterator || (iterator = _.identity);
        var result = false;
        if (obj == null) return result;
        if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
        each(obj, function(value, index, list) {
            if (result || (result = iterator.call(context, value, index, list))) return breaker;
        });
        return !!result;
    };

    // Determine if the array or object contains a given value (using `===`).
    // Aliased as `include`.
    _.contains = _.include = function(obj, target) {
        if (obj == null) return false;
        if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
        return any(obj, function(value) {
            return value === target;
        });
    };

    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function(obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function(value) {
            return (isFunc ? method : value[method]).apply(value, args);
        });
    };

    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function(obj, key) {
        return _.map(obj, function(value){ return value[key]; });
    };

    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function(obj, attrs, first) {
        if (_.isEmpty(attrs)) return first ? null : [];
        return _[first ? 'find' : 'filter'](obj, function(value) {
            for (var key in attrs) {
                if (attrs[key] !== value[key]) return false;
            }
            return true;
        });
    };

    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function(obj, attrs) {
        return _.where(obj, attrs, true);
    };

    // Return the maximum element or (element-based computation).
    // Can't optimize arrays of integers longer than 65,535 elements.
    // See: https://bugs.webkit.org/show_bug.cgi?id=80797
    _.max = function(obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.max.apply(Math, obj);
        }
        if (!iterator && _.isEmpty(obj)) return -Infinity;
        var result = {computed : -Infinity, value: -Infinity};
        each(obj, function(value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            computed >= result.computed && (result = {value : value, computed : computed});
        });
        return result.value;
    };

    // Return the minimum element (or element-based computation).
    _.min = function(obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.min.apply(Math, obj);
        }
        if (!iterator && _.isEmpty(obj)) return Infinity;
        var result = {computed : Infinity, value: Infinity};
        each(obj, function(value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            computed < result.computed && (result = {value : value, computed : computed});
        });
        return result.value;
    };

    // Shuffle an array.
    _.shuffle = function(obj) {
        var rand;
        var index = 0;
        var shuffled = [];
        each(obj, function(value) {
            rand = _.random(index++);
            shuffled[index - 1] = shuffled[rand];
            shuffled[rand] = value;
        });
        return shuffled;
    };

    // An internal function to generate lookup iterators.
    var lookupIterator = function(value) {
        return _.isFunction(value) ? value : function(obj){ return obj[value]; };
    };

    // Sort the object's values by a criterion produced by an iterator.
    _.sortBy = function(obj, value, context) {
        var iterator = lookupIterator(value);
        return _.pluck(_.map(obj, function(value, index, list) {
            return {
                value : value,
                index : index,
                criteria : iterator.call(context, value, index, list)
            };
        }).sort(function(left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index < right.index ? -1 : 1;
        }), 'value');
    };

    // An internal function used for aggregate "group by" operations.
    var group = function(obj, value, context, behavior) {
        var result = {};
        var iterator = lookupIterator(value || _.identity);
        each(obj, function(value, index) {
            var key = iterator.call(context, value, index, obj);
            behavior(result, key, value);
        });
        return result;
    };

    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = function(obj, value, context) {
        return group(obj, value, context, function(result, key, value) {
            (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
        });
    };

    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = function(obj, value, context) {
        return group(obj, value, context, function(result, key) {
            if (!_.has(result, key)) result[key] = 0;
            result[key]++;
        });
    };

    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function(array, obj, iterator, context) {
        iterator = iterator == null ? _.identity : lookupIterator(iterator);
        var value = iterator.call(context, obj);
        var low = 0, high = array.length;
        while (low < high) {
            var mid = (low + high) >>> 1;
            iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
        }
        return low;
    };

    // Safely convert anything iterable into a real, live array.
    _.toArray = function(obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (obj.length === +obj.length) return _.map(obj, _.identity);
        return _.values(obj);
    };

    // Return the number of elements in an object.
    _.size = function(obj) {
        if (obj == null) return 0;
        return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
    };

    // Array Functions
    // ---------------

    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function(array, n, guard) {
        if (array == null) return void 0;
        return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
    };

    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N. The **guard** check allows it to work with
    // `_.map`.
    _.initial = function(array, n, guard) {
        return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
    };

    // Get the last element of an array. Passing **n** will return the last N
    // values in the array. The **guard** check allows it to work with `_.map`.
    _.last = function(array, n, guard) {
        if (array == null) return void 0;
        if ((n != null) && !guard) {
            return slice.call(array, Math.max(array.length - n, 0));
        } else {
            return array[array.length - 1];
        }
    };

    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array. The **guard**
    // check allows it to work with `_.map`.
    _.rest = _.tail = _.drop = function(array, n, guard) {
        return slice.call(array, (n == null) || guard ? 1 : n);
    };

    // Trim out all falsy values from an array.
    _.compact = function(array) {
        return _.filter(array, _.identity);
    };

    // Internal implementation of a recursive `flatten` function.
    var flatten = function(input, shallow, output) {
        each(input, function(value) {
            if (_.isArray(value)) {
                shallow ? push.apply(output, value) : flatten(value, shallow, output);
            } else {
                output.push(value);
            }
        });
        return output;
    };

    // Return a completely flattened version of an array.
    _.flatten = function(array, shallow) {
        return flatten(array, shallow, []);
    };

    // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
        return _.difference(array, slice.call(arguments, 1));
    };

    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function(array, isSorted, iterator, context) {
        if (_.isFunction(isSorted)) {
            context = iterator;
            iterator = isSorted;
            isSorted = false;
        }
        var initial = iterator ? _.map(array, iterator, context) : array;
        var results = [];
        var seen = [];
        each(initial, function(value, index) {
            if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
                seen.push(value);
                results.push(array[index]);
            }
        });
        return results;
    };

    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function() {
        return _.uniq(concat.apply(ArrayProto, arguments));
    };

    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function(array) {
        var rest = slice.call(arguments, 1);
        return _.filter(_.uniq(array), function(item) {
            return _.every(rest, function(other) {
                return _.indexOf(other, item) >= 0;
            });
        });
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function(array) {
        var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
        return _.filter(array, function(value){ return !_.contains(rest, value); });
    };

    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function() {
        var args = slice.call(arguments);
        var length = _.max(_.pluck(args, 'length'));
        var results = new Array(length);
        for (var i = 0; i < length; i++) {
            results[i] = _.pluck(args, "" + i);
        }
        return results;
    };

    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function(list, values) {
        if (list == null) return {};
        var result = {};
        for (var i = 0, l = list.length; i < l; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };

    // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
    // we need this function. Return the position of the first occurrence of an
    // item in an array, or -1 if the item is not included in the array.
    // Delegates to **ECMAScript 5**'s native `indexOf` if available.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = function(array, item, isSorted) {
        if (array == null) return -1;
        var i = 0, l = array.length;
        if (isSorted) {
            if (typeof isSorted == 'number') {
                i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
            } else {
                i = _.sortedIndex(array, item);
                return array[i] === item ? i : -1;
            }
        }
        if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
        for (; i < l; i++) if (array[i] === item) return i;
        return -1;
    };

    // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
    _.lastIndexOf = function(array, item, from) {
        if (array == null) return -1;
        var hasIndex = from != null;
        if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
            return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
        }
        var i = (hasIndex ? from : array.length);
        while (i--) if (array[i] === item) return i;
        return -1;
    };

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function(start, stop, step) {
        if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
        }
        step = arguments[2] || 1;

        var len = Math.max(Math.ceil((stop - start) / step), 0);
        var idx = 0;
        var range = new Array(len);

        while(idx < len) {
            range[idx++] = start;
            start += step;
        }

        return range;
    };

    // Function (ahem) Functions
    // ------------------

    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function(func, context) {
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        var args = slice.call(arguments, 2);
        return function() {
            return func.apply(context, args.concat(slice.call(arguments)));
        };
    };

    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context.
    _.partial = function(func) {
        var args = slice.call(arguments, 1);
        return function() {
            return func.apply(this, args.concat(slice.call(arguments)));
        };
    };

    // Bind all of an object's methods to that object. Useful for ensuring that
    // all callbacks defined on an object belong to it.
    _.bindAll = function(obj) {
        var funcs = slice.call(arguments, 1);
        if (funcs.length === 0) funcs = _.functions(obj);
        each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
        return obj;
    };

    // Memoize an expensive function by storing its results.
    _.memoize = function(func, hasher) {
        var memo = {};
        hasher || (hasher = _.identity);
        return function() {
            var key = hasher.apply(this, arguments);
            return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
        };
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function(func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function(){ return func.apply(null, args); }, wait);
    };

    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = function(func) {
        return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    _.throttle = function(func, wait) {
        var context, args, timeout, result;
        var previous = 0;
        var later = function() {
            previous = new Date;
            timeout = null;
            result = func.apply(context, args);
        };
        return function() {
            var now = new Date;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
            } else if (!timeout) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function(func, wait, immediate) {
        var timeout, result;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) result = func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };

    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = function(func) {
        var ran = false, memo;
        return function() {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };

    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function(func, wrapper) {
        return function() {
            var args = [func];
            push.apply(args, arguments);
            return wrapper.apply(this, args);
        };
    };

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function() {
        var funcs = arguments;
        return function() {
            var args = arguments;
            for (var i = funcs.length - 1; i >= 0; i--) {
                args = [funcs[i].apply(this, args)];
            }
            return args[0];
        };
    };

    // Returns a function that will only be executed after being called N times.
    _.after = function(times, func) {
        if (times <= 0) return func();
        return function() {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    // Object Functions
    // ----------------

    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = nativeKeys || function(obj) {
            if (obj !== Object(obj)) throw new TypeError('Invalid object');
            var keys = [];
            for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
            return keys;
        };

    // Retrieve the values of an object's properties.
    _.values = function(obj) {
        var values = [];
        for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
        return values;
    };

    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function(obj) {
        var pairs = [];
        for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
        return pairs;
    };

    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function(obj) {
        var result = {};
        for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
        return result;
    };

    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function(obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(obj) {
        var copy = {};
        var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        each(keys, function(key) {
            if (key in obj) copy[key] = obj[key];
        });
        return copy;
    };

    // Return a copy of the object without the blacklisted properties.
    _.omit = function(obj) {
        var copy = {};
        var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        for (var key in obj) {
            if (!_.contains(keys, key)) copy[key] = obj[key];
        }
        return copy;
    };

    // Fill in a given object with default properties.
    _.defaults = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    if (obj[prop] == null) obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function(obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function(obj, interceptor) {
        interceptor(obj);
        return obj;
    };

    // Internal recursive comparison function for `isEqual`.
    var eq = function(a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
        if (a === b) return a !== 0 || 1 / a == 1 / b;
        // A strict comparison is necessary because `null == undefined`.
        if (a == null || b == null) return a === b;
        // Unwrap any wrapped objects.
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className != toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, dates, and booleans are compared by value.
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return a == String(b);
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
                // other numeric values.
                return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a == +b;
            // RegExps are compared by their source patterns and flags.
            case '[object RegExp]':
                return a.source == b.source &&
                    a.global == b.global &&
                    a.multiline == b.multiline &&
                    a.ignoreCase == b.ignoreCase;
        }
        if (typeof a != 'object' || typeof b != 'object') return false;
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] == a) return bStack[length] == b;
        }
        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);
        var size = 0, result = true;
        // Recursively compare objects and arrays.
        if (className == '[object Array]') {
            // Compare array lengths to determine if a deep comparison is necessary.
            size = a.length;
            result = size == b.length;
            if (result) {
                // Deep compare the contents, ignoring non-numeric properties.
                while (size--) {
                    if (!(result = eq(a[size], b[size], aStack, bStack))) break;
                }
            }
        } else {
            // Objects with different constructors are not equivalent, but `Object`s
            // from different frames are.
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
                return false;
            }
            // Deep compare objects.
            for (var key in a) {
                if (_.has(a, key)) {
                    // Count the expected number of properties.
                    size++;
                    // Deep compare each member.
                    if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
                }
            }
            // Ensure that both objects contain the same number of properties.
            if (result) {
                for (key in b) {
                    if (_.has(b, key) && !(size--)) break;
                }
                result = !size;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return result;
    };

    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function(a, b) {
        return eq(a, b, [], []);
    };

    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function(obj) {
        if (obj == null) return true;
        if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
        for (var key in obj) if (_.has(obj, key)) return false;
        return true;
    };

    // Is a given value a DOM element?
    _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
    };

    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function(obj) {
            return toString.call(obj) == '[object Array]';
        };

    // Is a given variable an object?
    _.isObject = function(obj) {
        return obj === Object(obj);
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });

    // Define a fallback version of the method in browsers (ahem, IE), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
        _.isArguments = function(obj) {
            return !!(obj && _.has(obj, 'callee'));
        };
    }

    // Optimize `isFunction` if appropriate.
    if (typeof (/./) !== 'function') {
        _.isFunction = function(obj) {
            return typeof obj === 'function';
        };
    }

    // Is a given object a finite number?
    _.isFinite = function(obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };

    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function(obj) {
        return _.isNumber(obj) && obj != +obj;
    };

    // Is a given value a boolean?
    _.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    };

    // Is a given value equal to null?
    _.isNull = function(obj) {
        return obj === null;
    };

    // Is a given variable undefined?
    _.isUndefined = function(obj) {
        return obj === void 0;
    };

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };

    // Utility Functions
    // -----------------

    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function() {
        root._ = previousUnderscore;
        return this;
    };

    // Keep the identity function around for default iterators.
    _.identity = function(value) {
        return value;
    };

    // Run a function **n** times.
    _.times = function(n, iterator, context) {
        var accum = Array(n);
        for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
        return accum;
    };

    // Return a random integer between min and max (inclusive).
    _.random = function(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    // List of HTML entities for escaping.
    var entityMap = {
        escape: {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        }
    };
    entityMap.unescape = _.invert(entityMap.escape);

    // Regexes containing the keys and values listed immediately above.
    var entityRegexes = {
        escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
        unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
    };

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    _.each(['escape', 'unescape'], function(method) {
        _[method] = function(string) {
            if (string == null) return '';
            return ('' + string).replace(entityRegexes[method], function(match) {
                return entityMap[method][match];
            });
        };
    });

    // If the value of the named property is a function then invoke it;
    // otherwise, return it.
    _.result = function(object, property) {
        if (object == null) return null;
        var value = object[property];
        return _.isFunction(value) ? value.call(object) : value;
    };

    // Add your own custom functions to the Underscore object.
    _.mixin = function(obj) {
        each(_.functions(obj), function(name){
            var func = _[name] = obj[name];
            _.prototype[name] = function() {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return result.call(this, func.apply(_, args));
            };
        });
    };

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,
        escape      : /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\t':     't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    _.template = function(text, data, settings) {
        var render;
        settings = _.defaults({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
                (settings.escape || noMatch).source,
                (settings.interpolate || noMatch).source,
                (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function(match) { return '\\' + escapes[match]; });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, _);
        var template = function(data) {
            return render.call(this, data, _);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };

    // Add a "chain" function, which will delegate to the wrapper.
    _.chain = function(obj) {
        return _(obj).chain();
    };

    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var result = function(obj) {
        return this._chain ? _(obj).chain() : obj;
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
            return result.call(this, obj);
        };
    });

    // Add all accessor Array functions to the wrapper.
    each(['concat', 'join', 'slice'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            return result.call(this, method.apply(this._wrapped, arguments));
        };
    });

    _.extend(_.prototype, {

        // Start chaining a wrapped Underscore object.
        chain: function() {
            this._chain = true;
            return this;
        },

        // Extracts the result from a wrapped and chained object.
        value: function() {
            return this._wrapped;
        }

    });

}).call(this);

/*global _: false, $: false, localStorage: false, process: true,
 XMLHttpRequest: false, XDomainRequest: false, exports: false,
 require: false */
(function(root) {
    root.Bmob = root.Bmob || {};
    /**
     * åŒ…å«äº†æ‰€æœ‰bmobçš„apiå’Œå‡½æ•°
     *
     * åŒ…å«äº†æ‰€æœ‰bmobçš„apiå’Œå‡½æ•°
     */
    var Bmob = root.Bmob;

    // Import Bmob's local copy of underscore.
    if (typeof(exports) !== "undefined" && exports._) {
        // We're running in Node.js.  Pull in the dependencies.
        Bmob._ = exports._.noConflict();
        try{
            Bmob.localStorage = require('localStorage');
        }catch(error){
            Bmob.localStorage = require('./localStorage.js').localStorage;
        }
        Bmob.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
        exports.Bmob = Bmob;
    } else {
        Bmob._ = _.noConflict();
        if (typeof(localStorage) !== "undefined") {
            Bmob.localStorage = localStorage;
        }
        if (typeof(XMLHttpRequest) !== "undefined") {
            Bmob.XMLHttpRequest = XMLHttpRequest;
        }
    }

    // If jQuery or Zepto has been included, grab a reference to it.
    if (typeof($) !== "undefined") {
        Bmob.$ = $;
    }

    // Helpers
    // -------

    // Shared empty constructor function to aid in prototype-chain creation.
    var EmptyConstructor = function() {};


    // Helper function to correctly set up the prototype chain, for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    var inherits = function(parent, protoProps, staticProps) {
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            /** @ignore */
            child = function(){ parent.apply(this, arguments); };
        }

        // Inherit class (static) properties from parent.
        Bmob._.extend(child, parent);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        EmptyConstructor.prototype = parent.prototype;
        child.prototype = new EmptyConstructor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) {
            Bmob._.extend(child.prototype, protoProps);
        }

        // Add static properties to the constructor function, if supplied.
        if (staticProps) {
            Bmob._.extend(child, staticProps);
        }

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is
        // needed later.
        child.__super__ = parent.prototype;

        return child;
    };

    // Set the server for Bmob to talk to.
    Bmob.serverURL = "https://api.bmob.cn";
    Bmob.fileURL = "http://file.bmob.cn";

    // Check whether we are running in Node.js.
    if (typeof(process) !== "undefined" &&
        process.versions &&
        process.versions.node) {
        Bmob._isNode = true;
    }

    /**
     * åˆå§‹åŒ–æ—¶éœ€è¦è°ƒç”¨è¿™ä¸ªå‡½æ•°ã€‚å¯ä»¥ä»Žbmobä¸­èŽ·å–æ‰€éœ€çš„key
     *
     * @param {String} applicationId ä½ çš„ Application ID.
     * @param {String} applicationKey ä½ çš„ restful api Key.
     * @param {String} masterKey (optional) ä½ çš„ bmob Master Key.
     */
    Bmob.initialize = function(applicationId, applicationKey, masterKey) {
        if (masterKey) {
            throw "Bmob.initialize() was passed a Master Key, which is only " +
            "allowed from within Node.js.";
        }
        Bmob._initialize(applicationId, applicationKey,masterKey);
    };

    /**
     * Call this method first to set up authentication tokens for Bmob.
     * This method is for Bmob's own private use.
     * @param {String} applicationId Your Bmob Application ID.
     * @param {String} applicationKey Your Bmob Application Key

     */
    Bmob._initialize = function(applicationId, applicationKey, masterKey) {
        Bmob.applicationId = applicationId;
        Bmob.applicationKey = applicationKey;
        Bmob.masterKey = masterKey;
        Bmob._useMasterKey = false;
    };


    if (Bmob._isNode) {
        Bmob.initialize = Bmob._initialize;

    }



    /**
     * Returns prefix for localStorage keys used by this instance of Bmob.
     * @param {String} path The relative suffix to append to it.
     *     null or undefined is treated as the empty string.
     * @return {String} The full key name.
     */
    Bmob._getBmobPath = function(path) {
        if (!Bmob.applicationId) {
            throw "You need to call Bmob.initialize before using Bmob.";
        }
        if (!path) {
            path = "";
        }
        if (!Bmob._.isString(path)) {
            throw "Tried to get a localStorage path that wasn't a String.";
        }
        if (path[0] === "/") {
            path = path.substring(1);
        }
        return "Bmob/" + Bmob.applicationId + "/" + path;
    };

    /**
     * Returns the unique string for this app on this machine.
     * Gets reset when localStorage is cleared.
     */
    Bmob._installationId = null;
    Bmob._getInstallationId = function() {
        // See if it's cached in RAM.
        if (Bmob._installationId) {
            return Bmob._installationId;
        }

        // Try to get it from localStorage.
        var path = Bmob._getBmobPath("installationId");
        Bmob._installationId = Bmob.localStorage.getItem(path);

        if (!Bmob._installationId || Bmob._installationId === "") {
            // It wasn't in localStorage, so create a new one.
            var hexOctet = function() {
                return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
            };
            Bmob._installationId = (
            hexOctet() + hexOctet() + "-" +
            hexOctet() + "-" +
            hexOctet() + "-" +
            hexOctet() + "-" +
            hexOctet() + hexOctet() + hexOctet());
            Bmob.localStorage.setItem(path, Bmob._installationId);
        }

        return Bmob._installationId;
    };

    Bmob._parseDate = function(iso8601) {
        var regexp = new RegExp(
            "^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})" + "T" +
            "([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})" +
            "(.([0-9]+))?" + "Z$");
        var match = regexp.exec(iso8601);
        if (!match) {
            return null;
        }

        var year = match[1] || 0;
        var month = (match[2] || 1) - 1;
        var day = match[3] || 0;
        var hour = match[4] || 0;
        var minute = match[5] || 0;
        var second = match[6] || 0;
        var milli = match[8] || 0;

        return new Date(Date.UTC(year, month, day, hour, minute, second, milli));
    };

    Bmob._ajaxIE8 = function(method, url, data) {
        var promise = new Bmob.Promise();
        var xdr = new XDomainRequest();
        xdr.onload = function() {
            var response;
            try {
                response = JSON.parse(xdr.responseText);
            } catch (e) {
                promise.reject(e);
            }
            if (response) {
                promise.resolve(response);
            }
        };
        xdr.onerror = xdr.ontimeout = function() {
            promise.reject(xdr);
        };
        xdr.onprogress = function() {};
        xdr.open(method, url);
        xdr.send(data);
        return promise;
    };


    Bmob._ajax = function(method, url, data, success, error) {
        var options = {
            success: success,
            error: error
        };

        if (typeof(XDomainRequest) !== "undefined") {
            return Bmob._ajaxIE8(method, url, data)._thenRunCallbacks(options);
        }

        var promise = new Bmob.Promise();
        var handled = false;

        var xhr = new Bmob.XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (handled) {
                    return;
                }
                handled = true;

                if (xhr.status >= 200 && xhr.status < 300) {
                    var response;
                    try {
                        response = JSON.parse(xhr.responseText);
                    } catch (e) {
                        promise.reject(e);
                    }
                    if (response) {
                        promise.resolve(response, xhr.status, xhr);
                    }
                } else {
                    promise.reject(xhr);
                }
            }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "text/plain");  // avoid pre-flight.
        //xhr.setRequestHeader("Content-Type", "text/plain");  // avoid pre-flight.
        //xhr.setRequestHeader("212312313", "32432342");  // avoid pre-flight.
        if (Bmob._isNode) {
            // Add a special user agent just for request from node.js.
            xhr.setRequestHeader("User-Agent",
                "Bmob/" + Bmob.VERSION +
                " (NodeJS " + process.versions.node + ")");
        }
        xhr.send(data);
        return promise._thenRunCallbacks(options);
    };

    // A self-propagating extend function.
    Bmob._extend = function(protoProps, classProps) {
        var child = inherits(this, protoProps, classProps);
        child.extend = this.extend;
        return child;
    };

    /**
     * route is classes, users, login, etc.
     * objectId is null if there is no associated objectId.
     * method is the http method for the REST API.
     * dataObject is the payload as an object, or null if there is none.
     * @ignore
     */
    Bmob._request = function(route, className, objectId, method, dataObject) {
        if (!Bmob.applicationId) {
            throw "You must specify your applicationId using Bmob.initialize";
        }

        if (!Bmob.applicationKey && !Bmob.masterKey) {
            throw "You must specify a key using Bmob.initialize";
        }


        if (route !== "batch" &&
            route !== "classes" &&
            route !== "files" &&
            route !== "functions" &&
            route !== "login" &&
            route !== "push" &&
            route !== "search/select" &&
            route !== "images/thumbnail" &&
            route !== "images/watermark" &&
            route !== "requestPasswordReset" &&
            route !== "requestEmailVerify" &&
            route !== "users" &&
            !(/users\/[^\/]+\/friendship\/[^\/]+/.test(route))) {
            throw "Bad route: '" + route + "'.";
        }

        var url = Bmob.serverURL;
        if (url.charAt(url.length - 1) !== "/") {
            url += "/";
        }
        url += "1/" + route;
        if (className) {
            url += "/" + className;
        }
        if (objectId) {
            url += "/" + objectId;
        }
        if((route ==='users' || route === 'classes') && method === 'PUT' && dataObject._fetchWhenSave){
            delete dataObject._fetchWhenSave;
            url += '?new=true';
        }

        dataObject = Bmob._.clone(dataObject || {});
        if (method !== "POST") {
            dataObject._Method = method;
            method = "POST";
        }


        dataObject._ApplicationId = Bmob.applicationId;
        dataObject._RestKey = Bmob.applicationKey;
        if(Bmob._useMasterKey)
            dataObject._MasterKey = Bmob.masterKey;
        dataObject._ClientVersion = Bmob.VERSION;
        dataObject._InstallationId = Bmob._getInstallationId();


        // Pass the session token on every request.
        var currentUser = Bmob.User.current();
        if (currentUser && currentUser._sessionToken) {
            dataObject._SessionToken = currentUser._sessionToken;
        }
        var data = JSON.stringify(dataObject);

        return Bmob._ajax(method, url, data).then(null, function(response) {
            // Transform the error into an instance of Bmob.Error by trying to parse
            // the error string as JSON.
            var error;
            if (response && response.responseText) {
                try {
                    var errorJSON = JSON.parse(response.responseText);
                    if (errorJSON) {
                        error = new Bmob.Error(errorJSON.code, errorJSON.error);
                    }
                } catch (e) {
                    // If we fail to parse the error text, that's okay.
                }
            }
            error = error || new Bmob.Error(-1, response.responseText);
            // By explicitly returning a rejected Promise, this will work with
            // either jQuery or Promises/A semantics.
            return Bmob.Promise.error(error);
        });
    };

    // Helper function to get a value from a Backbone object as a property
    // or as a function.
    Bmob._getValue = function(object, prop) {
        if (!(object && object[prop])) {
            return null;
        }
        return Bmob._.isFunction(object[prop]) ? object[prop]() : object[prop];
    };

    /**
     * Converts a value in a Bmob Object into the appropriate representation.
     * This is the JS equivalent of Java's Bmob.maybeReferenceAndEncode(Object)
     * if seenObjects is falsey. Otherwise any Bmob.Objects not in
     * seenObjects will be fully embedded rather than encoded
     * as a pointer.  This array will be used to prevent going into an infinite
     * loop because we have circular references.  If <seenObjects>
     * is set, then none of the Bmob Objects that are serialized can be dirty.
     */
    Bmob._encode = function(value, seenObjects, disallowObjects) {
        var _ = Bmob._;
        if (value instanceof Bmob.Object) {
            if (disallowObjects) {
                throw "Bmob.Objects not allowed here";
            }
            if (!seenObjects || _.include(seenObjects, value) || !value._hasData) {
                return value._toPointer();
            }
            if (!value.dirty()) {
                seenObjects = seenObjects.concat(value);
                return Bmob._encode(value._toFullJSON(seenObjects),
                    seenObjects,
                    disallowObjects);
            }
            throw "Tried to save an object with a pointer to a new, unsaved object.";
        }
        if (value instanceof Bmob.ACL) {
            return value.toJSON();
        }
        if (_.isDate(value)) {
            return { "__type": "Date", "iso": value.toJSON() };
        }
        if (value instanceof Bmob.GeoPoint) {
            return value.toJSON();
        }
        if (_.isArray(value)) {
            return _.map(value, function(x) {
                return Bmob._encode(x, seenObjects, disallowObjects);
            });
        }
        if (_.isRegExp(value)) {
            return value.source;
        }
        if (value instanceof Bmob.Relation) {
            return value.toJSON();
        }
        if (value instanceof Bmob.Op) {
            return value.toJSON();
        }
        if (value instanceof Bmob.File) {
            if (!value.url()) {
                throw "Tried to save an object containing an unsaved file.";
            }
            return {
                __type: "File",
                id:  value.id,
                name: value.name(),
                url: value.url()
            };
        }
        if (_.isObject(value)) {
            var output = {};
            Bmob._objectEach(value, function(v, k) {
                output[k] = Bmob._encode(v, seenObjects, disallowObjects);
            });
            return output;
        }
        return value;
    };

    /**
     * The inverse function of Bmob._encode.
     * TODO: make decode not mutate value.
     */
    Bmob._decode = function(key, value) {
        var _ = Bmob._;
        if (!_.isObject(value)) {
            return value;
        }
        if (_.isArray(value)) {
            Bmob._arrayEach(value, function(v, k) {
                value[k] = Bmob._decode(k, v);
            });
            return value;
        }
        if (value instanceof Bmob.Object) {
            return value;
        }
        if (value instanceof Bmob.File) {
            return value;
        }
        if (value instanceof Bmob.Op) {
            return value;
        }
        if (value.__op) {
            return Bmob.Op._decode(value);
        }
        if (value.__type === "Pointer") {
            var className = value.className;
            var pointer = Bmob.Object._create(className);
            if(value.createdAt){
                delete value.__type;
                delete value.className;
                pointer._finishFetch(value, true);
            }else{
                pointer._finishFetch({ objectId: value.objectId }, false);
            }
            return pointer;
        }
        if (value.__type === "Object") {
            // It's an Object included in a query result.
            var className = value.className;
            delete value.__type;
            delete value.className;
            var object = Bmob.Object._create(className);
            object._finishFetch(value, true);
            return object;
        }
        if (value.__type === "Date") {
            return value.iso;
        }
        if (value.__type === "GeoPoint") {
            return new Bmob.GeoPoint({
                latitude: value.latitude,
                longitude: value.longitude
            });
        }
        if (key === "ACL") {
            if (value instanceof Bmob.ACL) {
                return value;
            }
            return new Bmob.ACL(value);
        }
        if (value.__type === "Relation") {
            var relation = new Bmob.Relation(null, key);
            relation.targetClassName = value.className;
            return relation;
        }
        if (value.__type === "File") {
            // var file = new Bmob.File(value.name);
            // file._metaData = value.metaData || {};
            // file._url = value.url;
            // file.id = value.objectId;

            var file={"_name":value.filename,"_url":Bmob.fileURL+"/"+value.url,"_group":value.group};

            return file;
        }
        Bmob._objectEach(value, function(v, k) {
            value[k] = Bmob._decode(k, v);
        });
        return value;
    };

    Bmob._arrayEach = Bmob._.each;

    /**
     * Does a deep traversal of every item in object, calling func on every one.
     * @param {Object} object The object or array to traverse deeply.
     * @param {Function} func The function to call for every item. It will
     *     be passed the item as an argument. If it returns a truthy value, that
     *     value will replace the item in its parent container.
     * @returns {} the result of calling func on the top-level object itself.
     */
    Bmob._traverse = function(object, func, seen) {
        if (object instanceof Bmob.Object) {
            seen = seen || [];
            if (Bmob._.indexOf(seen, object) >= 0) {
                // We've already visited this object in this call.
                return;
            }
            seen.push(object);
            Bmob._traverse(object.attributes, func, seen);
            return func(object);
        }
        if (object instanceof Bmob.Relation || object instanceof Bmob.File) {
            // Nothing needs to be done, but we don't want to recurse into the
            // object's parent infinitely, so we catch this case.
            return func(object);
        }
        if (Bmob._.isArray(object)) {
            Bmob._.each(object, function(child, index) {
                var newChild = Bmob._traverse(child, func, seen);
                if (newChild) {
                    object[index] = newChild;
                }
            });
            return func(object);
        }
        if (Bmob._.isObject(object)) {
            Bmob._each(object, function(child, key) {
                var newChild = Bmob._traverse(child, func, seen);
                if (newChild) {
                    object[key] = newChild;
                }
            });
            return func(object);
        }
        return func(object);
    };

    /**
     * This is like _.each, except:
     * * it doesn't work for so-called array-like objects,
     * * it does work for dictionaries with a "length" attribute.
     */
    Bmob._objectEach = Bmob._each = function(obj, callback) {
        var _ = Bmob._;
        if (_.isObject(obj)) {
            _.each(_.keys(obj), function(key) {
                callback(obj[key], key);
            });
        } else {
            _.each(obj, callback);
        }
    };

    // Helper function to check null or undefined.
    Bmob._isNullOrUndefined = function(x) {
        return Bmob._.isNull(x) || Bmob._.isUndefined(x);
    };
}(this));

(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * Constructs a new Bmob.Error object with the given code and message.
     * @param {Number} code An error code constant from <code>Bmob.Error</code>.
     * @param {String} message A detailed description of the error.
     *
     * <p>Class used for all objects passed to error callbacks.</p>
     */
    Bmob.Error = function(code, message) {
        this.code = code;
        this.message = message;
    };

    _.extend(Bmob.Error, /** @lends Bmob.Error */ {


        /**
         * Error code indicating some error other than those enumerated here.
         * @constant
         */
        OTHER_CAUSE: -1,

        /**
         * Error code indicating the specified object doesn't exist.
         * @constant
         */
        OBJECT_NOT_FOUND: 101,

        /**
         * Error code indicating you tried to query with a datatype that doesn't
         * support it, like exact matching an array or object.
         * @constant
         */
        INVALID_QUERY: 102,

        /**
         * Error code indicating a missing or invalid classname. Classnames are
         * case-sensitive. They must start with a letter, and a-zA-Z0-9_ are the
         * only valid characters.
         * @constant
         */
        INVALID_CLASS_NAME: 103,

        /**
         * Error code relation className  not exists
         * @constant
         */
        RELATIONDOCNOTEXISTS: 104,

        /**
         * Error code invalid field name
         * @constant
         */
        INVALID_KEY_NAME: 105,

        /**
         * Error code indicating a malformed pointer. You should not see this unless
         * you have been mucking about changing internal Bmob code.
         * @constant
         */
        INVALID_POINTER: 106,

        /**
         * Error code indicating that badly formed JSON was received upstream. This
         * either indicates you have done something unusual with modifying how
         * things encode to JSON, or the network is failing badly.
         * @constant
         */
        INVALID_JSON: 107,

        /**
         * Error code username and password required
         * @constant
         */
        USERNAME_PASSWORD_REQUIRED: 108,



        /**
         * Error code indicating that a field was set to an inconsistent type.
         * @constant
         */
        INCORRECT_TYPE: 111,

        /**
         * Error code requests must be an array
         * @constant
         */
        REQUEST_MUST_ARRAY: 112,

        /**
         * Error code requests must be LIKE OBJECT
         * @constant
         */
        REQUEST_MUST_OBJECT: 113,



        /**
         * Error code indicating that the object is too large.
         * @constant
         */
        OBJECT_TOO_LARGE: 114,

        /**
         * Error code geo error
         * @constant
         */
        GEO_ERROR: 117,

        /**
         * Error code Email verify should be opened in your app setup page of bmob
         * @constant
         */
        EMAIL_VERIFY_MUST_OPEN: 120,

        /**
         * Error code indicating the result was not found in the cache.
         * @constant
         */
        CACHE_MISS: 120,

        /**
         * Error code Invalid device token
         * @constant
         */
        INVALID_DEVICE_TOKEN: 131,

        /**
         * Error code Invalid installation ID
         * @constant
         */
        INVALID_INSTALLID: 132,

        /**
         * Error code Invalid device type
         * @constant
         */
        INVALID_DEVICE_TYPE: 133,

        /**
         * Error code device token EXIST
         * @constant
         */
        DEVICE_TOKEN_EXIST: 134,

        /**
         * Error code indicating that the email address was invalid.
         * @constant
         */
        INSTALLID_EXIST: 135,

        /**
         * Error code DEVICE_TOKEN_NOT_FOR_ANDROID
         * @constant
         */
        DEVICE_TOKEN_NOT_FOR_ANDROID: 136,

        /**
         * Error code indicating a missing content length.
         * @constant
         */
        INVALID_INSTALL_OPERATE: 137,

        /**
         * Error code READ_ONLY
         * @constant
         */
        READ_ONLY: 138,

        /**
         * Error code Role names must be restricted to alphanumeric characters, dashes(-), underscores(_), and spaces
         * @constant
         */
        INVALID_ROLE_NAME: 139,

        /**
         * Error code MISS_PUSH_DATA
         * @constant
         */
        MISS_PUSH_DATA: 141,

        /**
         * Error code INVALID_PUSH_TIME
         * @constant
         */
        INVALID_PUSH_TIME: 142,

        /**
         * Error code INVALID_PUSH_EXPIRE
         * @constant
         */
        INVALID_PUSH_EXPIRE: 143,

        /**
         * Error code PUSHTIME cannot before now
         * @constant
         */
        PUSH_TIME_MUST_BEFORE_NOW: 144,

        /**
         * Error code file size error
         * @constant
         */
        FILE_SIZE_ERROR: 145,

        /**
         * Error code file name error
         * @constant
         */
        FILE_NAME_ERROR: 146,
        FILE_NAME_ERROR: 147,

        /**
         * Error code file len error
         * @constant
         */
        FILE_LEN_ERROR: 148,

        /**
         * Error code file delete error
         * @constant
         */
        FILE_UPLOAD_ERROR: 150,

        /**
         * Error code indicating an unsaved file.
         * @constant
         */
        FILE_DELETE_ERROR: 151,

        /**
         * Error code image error
         */
        IMAGE_ERROR: 160,

        /**
         * Error code image mode error
         * @constant
         */
        IMAGE_MODE_ERROR: 161,

        /**
         * Error code image width error
         * @constant
         */
        IMAGE_WIDTH_ERROR: 162,

        /**
         * Error code image height error
         * @constant
         */
        IMAGE_HEIGHT_ERROR: 163,

        /**
         * Error code image longEdge error
         * @constant
         */
        IMAGE_LONGEDGE_ERROR: 164,

        /**
         * Error code image shortgEdge error
         * @constant
         */
        IMAGE_SHORTEDGE_ERROR: 165,

        /**
         * Error code missing
         * @constant
         */
        USER_MISSING: 201,

        /**
         * Error code username '%s' already taken
         * not be altered.
         * @constant
         */
        USER_NAME_TOKEN: 202,

        /**
         * Error code EMAIL already taken
         * @constant
         */
        EMAIL_EXIST: 203,

        /**
         * Error code you must provide an email
         * @constant
         */
        NO_EMAIL: 204,

        /**
         * Error code no user found with email
         * @constant
         */
        NOT_FOUND_EMAIL: 205,

        /**
         * Error code sessionToken Erro
         * @constant
         */
        SESSIONTOKEN_ERROR: 206,

        /**
         * Error code valid error
         * @constant
         */
        VALID_ERROR: 301
    });

}(this));

/*global _: false */
(function() {
    var root = this;
    var Bmob = (root.Bmob || (root.Bmob = {}));
    var eventSplitter = /\s+/;
    var slice = Array.prototype.slice;

    /**
     *
     * <p>Bmob.Events æ˜¯ fork of Backbone's Events module</p>
     *
     * <p>A module that can be mixed in to any object in order to provide
     * it with custom events. You may bind callback functions to an event
     * with `on`, or remove these functions with `off`.
     * Triggering an event fires all callbacks in the order that `on` was
     * called.
     *
     * <pre>
     *     var object = {};
     *     _.extend(object, Bmob.Events);
     *     object.on('expand', function(){ alert('expanded'); });
     *     object.trigger('expand');</pre></p>
     *
     * <p>For more information, see the
     * <a href="http://documentcloud.github.com/backbone/#Events">Backbone
     * documentation</a>.</p>
     */
    Bmob.Events = {
        /**
         * Bind one or more space separated events, `events`, to a `callback`
         * function. Passing `"all"` will bind the callback to all events fired.
         */
        on: function(events, callback, context) {

            var calls, event, node, tail, list;
            if (!callback) {
                return this;
            }
            events = events.split(eventSplitter);
            calls = this._callbacks || (this._callbacks = {});

            // Create an immutable callback list, allowing traversal during
            // modification.  The tail is an empty object that will always be used
            // as the next node.
            event = events.shift();
            while (event) {
                list = calls[event];
                node = list ? list.tail : {};
                node.next = tail = {};
                node.context = context;
                node.callback = callback;
                calls[event] = {tail: tail, next: list ? list.next : node};
                event = events.shift();
            }

            return this;
        },

        /**
         * Remove one or many callbacks. If `context` is null, removes all callbacks
         * with that function. If `callback` is null, removes all callbacks for the
         * event. If `events` is null, removes all bound callbacks for all events.
         */
        off: function(events, callback, context) {
            var event, calls, node, tail, cb, ctx;

            // No events, or removing *all* events.
            if (!(calls = this._callbacks)) {
                return;
            }
            if (!(events || callback || context)) {
                delete this._callbacks;
                return this;
            }

            // Loop through the listed events and contexts, splicing them out of the
            // linked list of callbacks if appropriate.
            events = events ? events.split(eventSplitter) : _.keys(calls);
            event = events.shift();
            while (event) {
                node = calls[event];
                delete calls[event];
                if (!node || !(callback || context)) {
                    continue;
                }
                // Create a new list, omitting the indicated callbacks.
                tail = node.tail;
                node = node.next;
                while (node !== tail) {
                    cb = node.callback;
                    ctx = node.context;
                    if ((callback && cb !== callback) || (context && ctx !== context)) {
                        this.on(event, cb, ctx);
                    }
                    node = node.next;
                }
                event = events.shift();
            }

            return this;
        },

        /**
         * Trigger one or many events, firing all bound callbacks. Callbacks are
         * passed the same arguments as `trigger` is, apart from the event name
         * (unless you're listening on `"all"`, which will cause your callback to
         * receive the true name of the event as the first argument).
         */
        trigger: function(events) {
            var event, node, calls, tail, args, all, rest;
            if (!(calls = this._callbacks)) {
                return this;
            }
            all = calls.all;
            events = events.split(eventSplitter);
            rest = slice.call(arguments, 1);

            // For each event, walk through the linked list of callbacks twice,
            // first to trigger the event, then to trigger any `"all"` callbacks.
            event = events.shift();
            while (event) {
                node = calls[event];
                if (node) {
                    tail = node.tail;
                    while ((node = node.next) !== tail) {
                        node.callback.apply(node.context || this, rest);
                    }
                }
                node = all;
                if (node) {
                    tail = node.tail;
                    args = [event].concat(rest);
                    while ((node = node.next) !== tail) {
                        node.callback.apply(node.context || this, args);
                    }
                }
                event = events.shift();
            }

            return this;
        }
    };

    /**
     * @function
     */
    Bmob.Events.bind = Bmob.Events.on;

    /**
     * @function
     */
    Bmob.Events.unbind = Bmob.Events.off;
}.call(this));


/*global navigator: false */
(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * é€šè¿‡ä¸‹é¢çš„ä»»æ„ä¸€ç§å½¢å¼å¯ä»¥åˆ›å»ºGeoPoint<br>
     *   <pre>
     *   new GeoPoint(otherGeoPoint)
     *   new GeoPoint(30, 30)
     *   new GeoPoint([30, 30])
     *   new GeoPoint({latitude: 30, longitude: 30})
     *   new GeoPoint()  // defaults to (0, 0)
     *   </pre>
     * @class
     *
     * <p>åœ¨BmobObjectä¸­ä½¿ç”¨åæ ‡ç‚¹ï¼Œæˆ–è€…åœ¨geoæŸ¥è¯¢ä¸­ä½¿ç”¨</p>
     * <p>åœ¨ä¸€ä¸ªè¡¨ä¸­åªæœ‰ä¸€ä¸ªå­—æ®µèƒ½ä½¿ç”¨GeoPoint.</p>
     *
     * <p>Example:<pre>
     *   var point = new Bmob.GeoPoint(30.0, -20.0);
     *   var object = new Bmob.Object("PlaceObject");
     *   object.set("location", point);
     *   object.save();</pre></p>
     */
    Bmob.GeoPoint = function(arg1, arg2) {
        if (_.isArray(arg1)) {
            Bmob.GeoPoint._validate(arg1[0], arg1[1]);
            this.latitude = arg1[0];
            this.longitude = arg1[1];
        } else if (_.isObject(arg1)) {
            Bmob.GeoPoint._validate(arg1.latitude, arg1.longitude);
            this.latitude = arg1.latitude;
            this.longitude = arg1.longitude;
        } else if (_.isNumber(arg1) && _.isNumber(arg2)) {
            Bmob.GeoPoint._validate(arg1, arg2);
            this.latitude = arg1;
            this.longitude = arg2;
        } else {
            this.latitude = 0;
            this.longitude = 0;
        }

        // Add properties so that anyone using Webkit or Mozilla will get an error
        // if they try to set values that are out of bounds.
        var self = this;
        if (this.__defineGetter__ && this.__defineSetter__) {
            // Use _latitude and _longitude to actually store the values, and add
            // getters and setters for latitude and longitude.
            this._latitude = this.latitude;
            this._longitude = this.longitude;
            this.__defineGetter__("latitude", function() {
                return self._latitude;
            });
            this.__defineGetter__("longitude", function() {
                return self._longitude;
            });
            this.__defineSetter__("latitude", function(val) {
                Bmob.GeoPoint._validate(val, self.longitude);
                self._latitude = val;
            });
            this.__defineSetter__("longitude", function(val) {
                Bmob.GeoPoint._validate(self.latitude, val);
                self._longitude = val;
            });
        }
    };

    /**
     * @lends Bmob.GeoPoint.prototype
     * @property {float} latitude North-south portion of the coordinate, in range
     *   [-90, 90].  Throws an exception if set out of range in a modern browser.
     * @property {float} longitude East-west portion of the coordinate, in range
     *   [-180, 180].  Throws if set out of range in a modern browser.
     */

    /**
     * Throws an exception if the given lat-long is out of bounds.
     */
    Bmob.GeoPoint._validate = function(latitude, longitude) {
        if (latitude < -90.0) {
            throw "Bmob.GeoPoint latitude " + latitude + " < -90.0.";
        }
        if (latitude > 90.0) {
            throw "Bmob.GeoPoint latitude " + latitude + " > 90.0.";
        }
        if (longitude < -180.0) {
            throw "Bmob.GeoPoint longitude " + longitude + " < -180.0.";
        }
        if (longitude > 180.0) {
            throw "Bmob.GeoPoint longitude " + longitude + " > 180.0.";
        }
    };

    /**
     * ä½¿ç”¨ç”¨æˆ·å½“å‰çš„ä½ç½®åˆ›å»ºGeoPointå¯¹è±¡ã€‚
     * æˆåŠŸæ—¶è°ƒç”¨options.successï¼Œæˆ–è€…options.errorã€‚
     * @param {Object} options è°ƒç”¨æˆåŠŸæˆ–å¤±è´¥çš„å›žè°ƒ
     */
    Bmob.GeoPoint.current = function(options) {
        var promise = new Bmob.Promise();
        navigator.geolocation.getCurrentPosition(function(location) {
            promise.resolve(new Bmob.GeoPoint({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }));

        }, function(error) {
            promise.reject(error);
        });

        return promise._thenRunCallbacks(options);
    };

    Bmob.GeoPoint.prototype = {
        /**
         * è¿”å›žgeopointçš„json
         * @return {Object}
         */
        toJSON: function() {
            Bmob.GeoPoint._validate(this.latitude, this.longitude);
            return {
                "__type": "GeoPoint",
                latitude: this.latitude,
                longitude: this.longitude
            };
        },

        /**
         * è¿”å›žä¸¤ä¸ªgeopointä¹‹é—´çš„å¼§åº¦
         * @param {Bmob.GeoPoint} point å¦ä¸€ä¸ªBmob.GeoPoint.
         * @return {Number}
         */
        radiansTo: function(point) {
            var d2r = Math.PI / 180.0;
            var lat1rad = this.latitude * d2r;
            var long1rad = this.longitude * d2r;
            var lat2rad = point.latitude * d2r;
            var long2rad = point.longitude * d2r;
            var deltaLat = lat1rad - lat2rad;
            var deltaLong = long1rad - long2rad;
            var sinDeltaLatDiv2 = Math.sin(deltaLat / 2);
            var sinDeltaLongDiv2 = Math.sin(deltaLong / 2);
            // Square of half the straight line chord distance between both points.
            var a = ((sinDeltaLatDiv2 * sinDeltaLatDiv2) +
            (Math.cos(lat1rad) * Math.cos(lat2rad) *
            sinDeltaLongDiv2 * sinDeltaLongDiv2));
            a = Math.min(1.0, a);
            return 2 * Math.asin(Math.sqrt(a));
        },

        /**
         * è¿”å›žä¸¤ä¸ªgeopointä¹‹é—´çš„åƒç±³æ•°
         * @param {Bmob.GeoPoint} point å¦ä¸€ä¸ªBmob.GeoPoint.
         * @return {Number}
         */
        kilometersTo: function(point) {
            return this.radiansTo(point) * 6371.0;
        },

        /**
         * è¿”å›žä¸¤ä¸ªgeopointä¹‹é—´çš„ç±³æ•°
         * @param {Bmob.GeoPoint} point å¦ä¸€ä¸ªBmob.GeoPoint.
         * @return {Number}
         */
        milesTo: function(point) {
            return this.radiansTo(point) * 3958.8;
        }
    };
}(this));

/*global navigator: false */
(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    var PUBLIC_KEY = "*";

    /**
     * åˆ›å»ºACL
     * å¦‚æžœä¼ ä»»ä½•å‚æ•°ï¼Œåˆ™ä»»ä½•äººéƒ½æ²¡æœ‰æƒé™
     * å¦‚æžœä¼ å…¥çš„å‚æ•°æ˜¯Bmob.Userï¼Œé‚£ä¸ªusrä¼šæœ‰è¯»å†™æƒé™ã€‚
     * å¦‚æžœä¼ å…¥çš„å‚æ•°æ˜¯jsonå¯¹è±¡ï¼Œåˆ™ä¼šæœ‰ç›¸åº”çš„aclæƒé™ã€‚
     *
     * @see Bmob.Object#setACL
     * @class
     *
     * <p>æƒé™æŽ§åˆ¶å¯ä»¥è¢«æ·»åŠ åˆ°ä»»ä½•
     * <code>Bmob.Object</code>ï¼Œç”¨æ¥æŽ§åˆ¶ç”¨æˆ·çš„è®¿é—®æƒé™
     * </p>
     */
    Bmob.ACL = function(arg1) {
        var self = this;
        self.permissionsById = {};
        if (_.isObject(arg1)) {
            if (arg1 instanceof Bmob.User) {
                self.setReadAccess(arg1, true);
                self.setWriteAccess(arg1, true);
            } else {
                if (_.isFunction(arg1)) {
                    throw "Bmob.ACL() called with a function.  Did you forget ()?";
                }
                Bmob._objectEach(arg1, function(accessList, userId) {
                    if (!_.isString(userId)) {
                        throw "Tried to create an ACL with an invalid userId.";
                    }
                    self.permissionsById[userId] = {};
                    Bmob._objectEach(accessList, function(allowed, permission) {
                        if (permission !== "read" && permission !== "write") {
                            throw "Tried to create an ACL with an invalid permission type.";
                        }
                        if (!_.isBoolean(allowed)) {
                            throw "Tried to create an ACL with an invalid permission value.";
                        }
                        self.permissionsById[userId][permission] = allowed;
                    });
                });
            }
        }
    };

    /**
     * è¿”å›žaclçš„jsonå¯¹è±¡
     * @return {Object}
     */
    Bmob.ACL.prototype.toJSON = function() {
        return _.clone(this.permissionsById);
    };

    Bmob.ACL.prototype._setAccess = function(accessType, userId, allowed) {
        if (userId instanceof Bmob.User) {
            userId = userId.id;
        } else if (userId instanceof Bmob.Role) {
            userId = "role:" + userId.getName();
        }
        if (!_.isString(userId)) {
            throw "userId must be a string.";
        }
        if (!_.isBoolean(allowed)) {
            throw "allowed must be either true or false.";
        }
        var permissions = this.permissionsById[userId];
        if (!permissions) {
            if (!allowed) {
                // The user already doesn't have this permission, so no action needed.
                return;
            } else {
                permissions = {};
                this.permissionsById[userId] = permissions;
            }
        }

        if (allowed) {
            this.permissionsById[userId][accessType] = true;
        } else {
            delete permissions[accessType];
            if (_.isEmpty(permissions)) {
                delete permissions[userId];
            }
        }
    };

    Bmob.ACL.prototype._getAccess = function(accessType, userId) {
        if (userId instanceof Bmob.User) {
            userId = userId.id;
        } else if (userId instanceof Bmob.Role) {
            userId = "role:" + userId.getName();
        }
        var permissions = this.permissionsById[userId];
        if (!permissions) {
            return false;
        }
        return permissions[accessType] ? true : false;
    };

    /**
     * è®¾ç½®æ˜¯å¦å…è®¸ç”¨æˆ·è¯»å–è¿™ä¸ªå¯¹è±¡
     * @param ç”¨æˆ·idæˆ–å¯¹è±¡idï¼Œæˆ–Bmob.Role
     * @param {Boolean} ç”¨æˆ·æ˜¯å¦æœ‰è¯»çš„æƒé™
     */
    Bmob.ACL.prototype.setReadAccess = function(userId, allowed) {
        this._setAccess("read", userId, allowed);
    };

    /**
     * ç”¨æˆ·æ˜¯å¦æœ‰è¯»çš„æƒé™ã€‚
     * å°±ç®—æ˜¯è¿”å›žfalseï¼Œç”¨æˆ·æˆ–è®¸å¯ä»¥è®¿é—®å¯¹è±¡ï¼Œå¦‚æžœgetPublicReadAccessè¿”å›žtureï¼Œæˆ–è€…ç”¨æˆ·çš„è§’è‰²æœ‰å†™çš„æƒé™ã€‚
     * @param userId æˆ·idæˆ–å¯¹è±¡id, æˆ–è€…Bmob.Role.
     * @return {Boolean}
     */
    Bmob.ACL.prototype.getReadAccess = function(userId) {
        return this._getAccess("read", userId);
    };

    /**
     * è®¾ç½®æ˜¯å¦å…è®¸ç”¨æˆ·æœ‰å†™çš„æƒé™
     * @param userId ç”¨æˆ·idæˆ–å¯¹è±¡idï¼Œæˆ–Bmob.Role
     * @param {Boolean} ç”¨æˆ·æ˜¯å¦æœ‰å†™çš„æƒé™
     */
    Bmob.ACL.prototype.setWriteAccess = function(userId, allowed) {
        this._setAccess("write", userId, allowed);
    };

    /**
     * ç”¨æˆ·æ˜¯å¦æœ‰å†™çš„æƒé™ã€‚
     * å°±ç®—æ˜¯è¿”å›žfalseï¼Œç”¨æˆ·æˆ–è®¸å¯ä»¥è®¿é—®å¯¹è±¡ï¼Œå¦‚æžœgetPublicReadAccessè¿”å›žtureï¼Œæˆ–è€…ç”¨æˆ·çš„è§’è‰²æœ‰å†™çš„æƒé™ã€‚
     * @param userId ç”¨æˆ·idæˆ–å¯¹è±¡idï¼Œæˆ–Bmob.Role
     * @return {Boolean}
     */
    Bmob.ACL.prototype.getWriteAccess = function(userId) {
        return this._getAccess("write", userId);
    };

    /**
     * è®¾ç½®æ‰€æœ‰ç”¨æˆ·æœ‰è¯»çš„æƒé™ã€‚
     * @param {Boolean} allowed
     */
    Bmob.ACL.prototype.setPublicReadAccess = function(allowed) {
        this.setReadAccess(PUBLIC_KEY, allowed);
    };

    /**
     * æ˜¯å¦æ‰€æœ‰ç”¨æˆ·æœ‰è¯»çš„æƒé™ã€‚
     * @return {Boolean}
     */
    Bmob.ACL.prototype.getPublicReadAccess = function() {
        return this.getReadAccess(PUBLIC_KEY);
    };

    /**
     * è®¾ç½®æ‰€æœ‰ç”¨æˆ·æœ‰å†™çš„æƒé™ã€‚
     * @param {Boolean} allowed
     */
    Bmob.ACL.prototype.setPublicWriteAccess = function(allowed) {
        this.setWriteAccess(PUBLIC_KEY, allowed);
    };

    /**
     * æ˜¯å¦æ‰€æœ‰ç”¨æˆ·æœ‰å†™çš„æƒé™ã€‚
     * @return {Boolean}
     */
    Bmob.ACL.prototype.getPublicWriteAccess = function() {
        return this.getWriteAccess(PUBLIC_KEY);
    };

    /**
     * ç”¨æˆ·æ‰€å±žçš„è§’è‰²æ˜¯å¦å…è®¸è¯»è¿™ä¸ªå¯¹è±¡ã€‚å°±ç®—è¿”å›žfalseï¼Œè¿™ä¸ªè§’è‰²æˆ–è®¸æœ‰è¯»çš„æƒé™ï¼Œå¦‚æžœä»–çš„çˆ¶è§’è‰²æœ‰è¯»çš„æƒé™ã€‚
     * @param role è§’è‰²åç§°ï¼Œæˆ–è€… Bmob.Roleã€‚
     * @return {Boolean} æœ‰è¯»çš„æƒé™è¿”å›žtrueã€‚
     * @throws {String} roleä¸æ˜¯Bmob.Roleæˆ–å­—ç¬¦ä¸²ã€‚
     */
    Bmob.ACL.prototype.getRoleReadAccess = function(role) {
        if (role instanceof Bmob.Role) {
            // Normalize to the String name
            role = role.getName();
        }
        if (_.isString(role)) {
            return this.getReadAccess("role:" + role);
        }
        throw "role must be a Bmob.Role or a String";
    };

    /**
     * ç”¨æˆ·æ‰€å±žçš„è§’è‰²æ˜¯å¦å…è®¸å†™è¿™ä¸ªå¯¹è±¡ã€‚å°±ç®—è¿”å›žfalseï¼Œè¿™ä¸ªè§’è‰²æˆ–è®¸æœ‰å†™çš„æƒé™ï¼Œå¦‚æžœä»–çš„çˆ¶è§’è‰²æœ‰å†™çš„æƒé™ã€‚
     * @param role è§’è‰²åç§°ï¼Œæˆ–è€… Bmob.Roleã€‚
     * @return {Boolean} æœ‰å†™çš„æƒé™è¿”å›žtrueã€‚
     * @throws {String} roleä¸æ˜¯Bmob.Roleæˆ–å­—ç¬¦ä¸²ã€‚
     */
    Bmob.ACL.prototype.getRoleWriteAccess = function(role) {
        if (role instanceof Bmob.Role) {
            // Normalize to the String name
            role = role.getName();
        }
        if (_.isString(role)) {
            return this.getWriteAccess("role:" + role);
        }
        throw "role must be a Bmob.Role or a String";
    };

    /**
     * è®¾ç½®ç”¨æˆ·æ‰€å±žçš„è§’è‰²æœ‰è¯»çš„æƒé™
     * @param role è§’è‰²åç§°ï¼Œæˆ–è€… Bmob.Roleã€‚
     * @param {Boolean} å…è®¸è§’è‰²è¯»è¿™ä¸ªå¯¹è±¡
     * @throws {String}  roleä¸æ˜¯Bmob.Roleæˆ–å­—ç¬¦ä¸²ã€‚
     */
    Bmob.ACL.prototype.setRoleReadAccess = function(role, allowed) {
        if (role instanceof Bmob.Role) {
            // Normalize to the String name
            role = role.getName();
        }
        if (_.isString(role)) {
            this.setReadAccess("role:" + role, allowed);
            return;
        }
        throw "role must be a Bmob.Role or a String";
    };

    /**
     * è®¾ç½®ç”¨æˆ·æ‰€å±žçš„è§’è‰²æœ‰å†™çš„æƒé™
     * @param role è§’è‰²åç§°ï¼Œæˆ–è€… Bmob.Roleã€‚
     * @param {Boolean} å…è®¸è§’è‰²å†™è¿™ä¸ªå¯¹è±¡
     * @throws {String}  roleä¸æ˜¯Bmob.Roleæˆ–å­—ç¬¦ä¸²ã€‚
     */
    Bmob.ACL.prototype.setRoleWriteAccess = function(role, allowed) {
        if (role instanceof Bmob.Role) {
            // Normalize to the String name
            role = role.getName();
        }
        if (_.isString(role)) {
            this.setWriteAccess("role:" + role, allowed);
            return;
        }
        throw "role must be a Bmob.Role or a String";
    };

}(this));

(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * A Bmob.Op is an atomic operation that can be applied to a field in a
     * Bmob.Object. For example, calling <code>object.set("foo", "bar")</code>
     * is an example of a Bmob.Op.Set. Calling <code>object.unset("foo")</code>
     * is a Bmob.Op.Unset. These operations are stored in a Bmob.Object and
     * sent to the server as part of <code>object.save()</code> operations.
     * Instances of Bmob.Op should be immutable.
     *
     * You should not create subclasses of Bmob.Op or instantiate Bmob.Op
     * directly.
     */
    Bmob.Op = function() {
        this._initialize.apply(this, arguments);
    };

    Bmob.Op.prototype = {
        _initialize: function() {}
    };

    _.extend(Bmob.Op, {
        /**
         * To create a new Op, call Bmob.Op._extend();
         */
        _extend: Bmob._extend,

        // A map of __op string to decoder function.
        _opDecoderMap: {},

        /**
         * Registers a function to convert a json object with an __op field into an
         * instance of a subclass of Bmob.Op.
         */
        _registerDecoder: function(opName, decoder) {
            Bmob.Op._opDecoderMap[opName] = decoder;
        },

        /**
         * Converts a json object into an instance of a subclass of Bmob.Op.
         */
        _decode: function(json) {
            var decoder = Bmob.Op._opDecoderMap[json.__op];
            if (decoder) {
                return decoder(json);
            } else {
                return undefined;
            }
        }
    });

    /*
     * Add a handler for Batch ops.
     */
    Bmob.Op._registerDecoder("Batch", function(json) {
        var op = null;
        Bmob._arrayEach(json.ops, function(nextOp) {
            nextOp = Bmob.Op._decode(nextOp);
            op = nextOp._mergeWithPrevious(op);
        });
        return op;
    });

    /**
     * @class
     * setæ“ä½œæ˜¯è¡¨æ˜Žå­—æ®µçš„å€¼ä¼šåœ¨Bmob.Object.setä¸­æ”¹å˜ï¼Œæˆ–è€…è¿™ç¡®å®šè¦ä¿®æ”¹å€¼ã€‚
     */
    Bmob.Op.Set = Bmob.Op._extend(/** @lends Bmob.Op.Set.prototype */ {
        _initialize: function(value) {
            this._value = value;
        },

        /**
         * è¿”å›žè®¾ç½®åŽçš„æ–°å€¼
         */
        value: function() {
            return this._value;
        },

        /**
         * è¿”å›žå‘é€åˆ°bmobçš„json
         * @return {Object}
         */
        toJSON: function() {
            return Bmob._encode(this.value());
        },

        _mergeWithPrevious: function(previous) {
            return this;
        },

        _estimate: function(oldValue) {
            return this.value();
        }
    });

    /**
     * A sentinel value that is returned by Bmob.Op.Unset._estimate to
     * indicate the field should be deleted. Basically, if you find _UNSET as a
     * value in your object, you should remove that key.
     */
    Bmob.Op._UNSET = {};

    /**
     * @class
     * Unset æ“ä½œè¡¨æ˜Žå­—æ®µå°†ä¼šä»Žå¯¹è±¡ä¸­åˆ é™¤ã€‚
     */
    Bmob.Op.Unset = Bmob.Op._extend(/** @lends Bmob.Op.Unset.prototype */ {
        /**
         * è¿”å›žå‘é€åˆ°bmobçš„json
         * @return {Object}
         */
        toJSON: function() {
            return { __op: "Delete" };
        },

        _mergeWithPrevious: function(previous) {
            return this;
        },

        _estimate: function(oldValue) {
            return Bmob.Op._UNSET;
        }
    });

    Bmob.Op._registerDecoder("Delete", function(json) {
        return new Bmob.Op.Unset();
    });

    /**
     * @class
     * å°†å­—æ®µçš„å€¼è‡ªå¢žæˆ–è‡ªå‡
     */
    Bmob.Op.Increment = Bmob.Op._extend(
        /** @lends Bmob.Op.Increment.prototype */ {

            _initialize: function(amount) {
                this._amount = amount;
            },

            /**
             * è¿”å›žæ·»åŠ çš„æ•°ç›®ã€‚
             * @return {Number} å¢žåŠ æˆ–å‡å°‘çš„æ•°ç›®ã€‚
             */
            amount: function() {
                return this._amount;
            },

            /**
             * è¿”å›žå‘é€åˆ°bmobçš„json
             * @return {Object}
             */
            toJSON: function() {
                return { __op: "Increment", amount: this._amount };
            },

            _mergeWithPrevious: function(previous) {
                if (!previous) {
                    return this;
                } else if (previous instanceof Bmob.Op.Unset) {
                    return new Bmob.Op.Set(this.amount());
                } else if (previous instanceof Bmob.Op.Set) {
                    return new Bmob.Op.Set(previous.value() + this.amount());
                } else if (previous instanceof Bmob.Op.Increment) {
                    return new Bmob.Op.Increment(this.amount() + previous.amount());
                } else {
                    throw "Op is invalid after previous op.";
                }
            },

            _estimate: function(oldValue) {
                if (!oldValue) {
                    return this.amount();
                }
                return oldValue + this.amount();
            }
        });

    Bmob.Op._registerDecoder("Increment", function(json) {
        return new Bmob.Op.Increment(json.amount);
    });

    /**
     * @class
     * æ·»åŠ ä¸€ä¸ªå¯¹è±¡åˆ°æ•°ç»„ä¸­ï¼Œä¸ç®¡å…ƒç´ æ˜¯å¦å­˜åœ¨ã€‚
     */
    Bmob.Op.Add = Bmob.Op._extend(/** @lends Bmob.Op.Add.prototype */ {
        _initialize: function(objects) {
            this._objects = objects;
        },

        /**
         * è¿”å›žæ·»åŠ åˆ°æ•°ç»„ä¸­çš„å¯¹è±¡
         * @return {Array} æ·»åŠ åˆ°æ•°ç»„ä¸­çš„å¯¹è±¡
         */
        objects: function() {
            return this._objects;
        },

        /**
         * è¿”å›žå‘é€åˆ°bmobçš„json
         * @return {Object}
         */
        toJSON: function() {
            return { __op: "Add", objects: Bmob._encode(this.objects()) };
        },

        _mergeWithPrevious: function(previous) {
            if (!previous) {
                return this;
            } else if (previous instanceof Bmob.Op.Unset) {
                return new Bmob.Op.Set(this.objects());
            } else if (previous instanceof Bmob.Op.Set) {
                return new Bmob.Op.Set(this._estimate(previous.value()));
            } else if (previous instanceof Bmob.Op.Add) {
                return new Bmob.Op.Add(previous.objects().concat(this.objects()));
            } else {
                throw "Op is invalid after previous op.";
            }
        },

        _estimate: function(oldValue) {
            if (!oldValue) {
                return _.clone(this.objects());
            } else {
                return oldValue.concat(this.objects());
            }
        }
    });

    Bmob.Op._registerDecoder("Add", function(json) {
        return new Bmob.Op.Add(Bmob._decode(undefined, json.objects));
    });

    /**
     * @class
     * æ·»åŠ ä¸€ä¸ªå…ƒç´ åˆ°æ•°ç»„ä¸­ï¼Œå½“å…ƒç´ å·²ç»å­˜åœ¨ï¼Œå°†ä¸ä¼šé‡å¤æ·»åŠ ã€‚
     */
    Bmob.Op.AddUnique = Bmob.Op._extend(
        /** @lends Bmob.Op.AddUnique.prototype */ {

            _initialize: function(objects) {
                this._objects = _.uniq(objects);
            },

            /**
             * è¿”å›žæ·»åŠ åˆ°æ•°ç»„ä¸­çš„å¯¹è±¡
             * @return {Array} æ·»åŠ åˆ°æ•°ç»„ä¸­çš„å¯¹è±¡
             */
            objects: function() {
                return this._objects;
            },

            /**
             * è¿”å›žå‘é€åˆ°bmobçš„json
             * @return {Object}
             */
            toJSON: function() {
                return { __op: "AddUnique", objects: Bmob._encode(this.objects()) };
            },

            _mergeWithPrevious: function(previous) {
                if (!previous) {
                    return this;
                } else if (previous instanceof Bmob.Op.Unset) {
                    return new Bmob.Op.Set(this.objects());
                } else if (previous instanceof Bmob.Op.Set) {
                    return new Bmob.Op.Set(this._estimate(previous.value()));
                } else if (previous instanceof Bmob.Op.AddUnique) {
                    return new Bmob.Op.AddUnique(this._estimate(previous.objects()));
                } else {
                    throw "Op is invalid after previous op.";
                }
            },

            _estimate: function(oldValue) {
                if (!oldValue) {
                    return _.clone(this.objects());
                } else {
                    // We can't just take the _.uniq(_.union(...)) of oldValue and
                    // this.objects, because the uniqueness may not apply to oldValue
                    // (especially if the oldValue was set via .set())
                    var newValue = _.clone(oldValue);
                    Bmob._arrayEach(this.objects(), function(obj) {
                        if (obj instanceof Bmob.Object && obj.id) {
                            var matchingObj = _.find(newValue, function(anObj) {
                                return (anObj instanceof Bmob.Object) && (anObj.id === obj.id);
                            });
                            if (!matchingObj) {
                                newValue.push(obj);
                            } else {
                                var index = _.indexOf(newValue, matchingObj);
                                newValue[index] = obj;
                            }
                        } else if (!_.contains(newValue, obj)) {
                            newValue.push(obj);
                        }
                    });
                    return newValue;
                }
            }
        });

    Bmob.Op._registerDecoder("AddUnique", function(json) {
        return new Bmob.Op.AddUnique(Bmob._decode(undefined, json.objects));
    });

    /**
     * @class
     * ä»Žæ•°ç»„ä¸­ç§»é™¤ä¸€ä¸ªå…ƒç´ ã€‚
     */
    Bmob.Op.Remove = Bmob.Op._extend(/** @lends Bmob.Op.Remove.prototype */ {
        _initialize: function(objects) {
            this._objects = _.uniq(objects);
        },

        /**
         * è¿”å›žç§»é™¤å‡ºæ•°ç»„çš„å¯¹è±¡
         * @return {Array} ç§»é™¤å‡ºæ•°ç»„çš„å¯¹è±¡
         */
        objects: function() {
            return this._objects;
        },

        /**
         * è¿”å›žå‘é€åˆ°bmobçš„json
         * @return {Object}
         */
        toJSON: function() {
            return { __op: "Remove", objects: Bmob._encode(this.objects()) };
        },

        _mergeWithPrevious: function(previous) {
            if (!previous) {
                return this;
            } else if (previous instanceof Bmob.Op.Unset) {
                return previous;
            } else if (previous instanceof Bmob.Op.Set) {
                return new Bmob.Op.Set(this._estimate(previous.value()));
            } else if (previous instanceof Bmob.Op.Remove) {
                return new Bmob.Op.Remove(_.union(previous.objects(), this.objects()));
            } else {
                throw "Op is invalid after previous op.";
            }
        },

        _estimate: function(oldValue) {
            if (!oldValue) {
                return [];
            } else {
                var newValue = _.difference(oldValue, this.objects());
                // If there are saved Bmob Objects being removed, also remove them.
                Bmob._arrayEach(this.objects(), function(obj) {
                    if (obj instanceof Bmob.Object && obj.id) {
                        newValue = _.reject(newValue, function(other) {
                            return (other instanceof Bmob.Object) && (other.id === obj.id);
                        });
                    }
                });
                return newValue;
            }
        }
    });

    Bmob.Op._registerDecoder("Remove", function(json) {
        return new Bmob.Op.Remove(Bmob._decode(undefined, json.objects));
    });

    /**
     * @class
     * å…³ç³»æ“ä½œæ ‡æ˜Žè¿™ä¸ªå­—æ®µæ˜¯Bmob.Relationçš„å®žä½“ï¼ŒåŒæ—¶å¯¹è±¡å¯ä»¥ä»Žå…³ç³»ä¸­æ·»åŠ æˆ–ç§»é™¤
     */
    Bmob.Op.Relation = Bmob.Op._extend(
        /** @lends Bmob.Op.Relation.prototype */ {

            _initialize: function(adds, removes) {
                this._targetClassName = null;

                var self = this;

                var pointerToId = function(object) {
                    if (object instanceof Bmob.Object) {
                        if (!object.id) {
                            throw "You can't add an unsaved Bmob.Object to a relation.";
                        }
                        if (!self._targetClassName) {
                            self._targetClassName = object.className;
                        }
                        if (self._targetClassName !== object.className) {
                            throw "Tried to create a Bmob.Relation with 2 different types: " +
                            self._targetClassName + " and " + object.className + ".";
                        }
                        return object.id;
                    }
                    return object;
                };

                this.relationsToAdd = _.uniq(_.map(adds, pointerToId));
                this.relationsToRemove = _.uniq(_.map(removes, pointerToId));
            },

            /**
             * è¿”å›žæ·»åŠ åˆ°å…³ç³»ä¸­çš„Bmob.Objectçš„æ•°ç»„å¯¹è±¡
             * @return {Array}
             */
            added: function() {
                var self = this;
                return _.map(this.relationsToAdd, function(objectId) {
                    var object = Bmob.Object._create(self._targetClassName);
                    object.id = objectId;
                    return object;
                });
            },

            /**
             * è¿”å›žç§»é™¤çš„Bmob.Objectçš„æ•°ç»„å¯¹è±¡
             * @return {Array}
             */
            removed: function() {
                var self = this;
                return _.map(this.relationsToRemove, function(objectId) {
                    var object = Bmob.Object._create(self._targetClassName);
                    object.id = objectId;
                    return object;
                });
            },

            /**
             * è¿”å›žå‘é€åˆ°bmobçš„json
             * @return {Object}
             */
            toJSON: function() {
                var adds = null;
                var removes = null;
                var self = this;
                var idToPointer = function(id) {
                    return { __type: 'Pointer',
                        className: self._targetClassName,
                        objectId: id };
                };
                var pointers = null;
                if (this.relationsToAdd.length > 0) {
                    pointers = _.map(this.relationsToAdd, idToPointer);
                    adds = { "__op": "AddRelation", "objects": pointers };
                }

                if (this.relationsToRemove.length > 0) {
                    pointers = _.map(this.relationsToRemove, idToPointer);
                    removes = { "__op": "RemoveRelation", "objects": pointers };
                }

                if (adds && removes) {
                    return { "__op": "Batch", "ops": [adds, removes]};
                }

                return adds || removes || {};
            },

            _mergeWithPrevious: function(previous) {
                if (!previous) {
                    return this;
                } else if (previous instanceof Bmob.Op.Unset) {
                    throw "You can't modify a relation after deleting it.";
                } else if (previous instanceof Bmob.Op.Relation) {
                    if (previous._targetClassName &&
                        previous._targetClassName !== this._targetClassName) {
                        throw "Related object must be of class " + previous._targetClassName +
                        ", but " + this._targetClassName + " was passed in.";
                    }
                    var newAdd = _.union(_.difference(previous.relationsToAdd,
                        this.relationsToRemove),
                        this.relationsToAdd);
                    var newRemove = _.union(_.difference(previous.relationsToRemove,
                        this.relationsToAdd),
                        this.relationsToRemove);

                    var newRelation = new Bmob.Op.Relation(newAdd, newRemove);
                    newRelation._targetClassName = this._targetClassName;
                    return newRelation;
                } else {
                    throw "Op is invalid after previous op.";
                }
            },

            _estimate: function(oldValue, object, key) {
                if (!oldValue) {
                    var relation = new Bmob.Relation(object, key);
                    relation.targetClassName = this._targetClassName;
                } else if (oldValue instanceof Bmob.Relation) {
                    if (this._targetClassName) {
                        if (oldValue.targetClassName) {
                            if (oldValue.targetClassName !== this._targetClassName) {
                                throw "Related object must be a " + oldValue.targetClassName +
                                ", but a " + this._targetClassName + " was passed in.";
                            }
                        } else {
                            oldValue.targetClassName = this._targetClassName;
                        }
                    }
                    return oldValue;
                } else {
                    throw "Op is invalid after previous op.";
                }
            }
        });

    Bmob.Op._registerDecoder("AddRelation", function(json) {
        return new Bmob.Op.Relation(Bmob._decode(undefined, json.objects), []);
    });
    Bmob.Op._registerDecoder("RemoveRelation", function(json) {
        return new Bmob.Op.Relation([], Bmob._decode(undefined, json.objects));
    });

}(this));

(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * Creates a new Relation for the given parent object and key. This
     * constructor should rarely be used directly, but rather created by
     * Bmob.Object.relation.
     * @param {Bmob.Object} parent The parent of this relation.
     * @param {String} key The key for this relation on the parent.
     * @see Bmob.Object#relation
     *
     * <p>
     * A class that is used to access all of the children of a many-to-many
     * relationship.  Each instance of Bmob.Relation is associated with a
     * particular parent object and key.
     * </p>
     */
    Bmob.Relation = function(parent, key) {
        this.parent = parent;
        this.key = key;
        this.targetClassName = null;
    };

    /**
     * Creates a query that can be used to query the parent objects in this relation.
     * @param {String} parentClass The parent class or name.
     * @param {String} relationKey The relation field key in parent.
     * @param {Bmob.Object} child The child object.
     * @return {Bmob.Query}
     */
    Bmob.Relation.reverseQuery = function(parentClass, relationKey, child){
        var query = new Bmob.Query(parentClass);
        query.equalTo(relationKey, child._toPointer());
        return query;
    };

    Bmob.Relation.prototype = {
        /**
         * Makes sure that this relation has the right parent and key.
         */
        _ensureParentAndKey: function(parent, key) {
            this.parent = this.parent || parent;
            this.key = this.key || key;
            if (this.parent !== parent) {
                throw "Internal Error. Relation retrieved from two different Objects.";
            }
            if (this.key !== key) {
                throw "Internal Error. Relation retrieved from two different keys.";
            }
        },

        /**
         * Adds a Bmob.Object or an array of Bmob.Objects to the relation.
         * @param {} objects The item or items to add.
         */
        add: function(objects) {
            if (!_.isArray(objects)) {
                objects = [objects];
            }

            var change = new Bmob.Op.Relation(objects, []);
            this.parent.set(this.key, change);
            this.targetClassName = change._targetClassName;
        },

        /**
         * Removes a Bmob.Object or an array of Bmob.Objects from this relation.
         * @param {} objects The item or items to remove.
         */
        remove: function(objects) {
            if (!_.isArray(objects)) {
                objects = [objects];
            }

            var change = new Bmob.Op.Relation([], objects);
            this.parent.set(this.key, change);
            this.targetClassName = change._targetClassName;
        },

        /**
         * Returns a JSON version of the object suitable for saving to disk.
         * @return {Object}
         */
        toJSON: function() {
            return { "__type": "Relation", "className": this.targetClassName };
        },

        /**
         * Returns a Bmob.Query that is limited to objects in this
         * relation.
         * @return {Bmob.Query}
         */
        query: function() {
            var targetClass;
            var query;
            if (!this.targetClassName) {
                targetClass = Bmob.Object._getSubclass(this.parent.className);
                query = new Bmob.Query(targetClass);
                query._extraOptions.redirectClassNameForKey = this.key;
            } else {
                targetClass = Bmob.Object._getSubclass(this.targetClassName);
                query = new Bmob.Query(targetClass);
            }
            query._addCondition("$relatedTo", "object", this.parent._toPointer());
            query._addCondition("$relatedTo", "key", this.key);

            return query;
        }
    };
}(this));

(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * A Promise is returned by async methods as a hook to provide callbacks to be
     * called when the async task is fulfilled.
     *
     * <p>Typical usage would be like:<pre>
     *    query.findAsync().then(function(results) {
   *      results[0].set("foo", "bar");
   *      return results[0].saveAsync();
   *    }).then(function(result) {
   *      console.log("Updated " + result.id);
   *    });
     * </pre></p>
     *
     * @see Bmob.Promise.prototype.next
     */
    Bmob.Promise = function() {
        this._resolved = false;
        this._rejected = false;
        this._resolvedCallbacks = [];
        this._rejectedCallbacks = [];
    };

    _.extend(Bmob.Promise, /** @lends Bmob.Promise */ {

        /**
         * Returns true iff the given object fulfils the Promise interface.
         * @return {Boolean}
         */
        is: function(promise) {
            return promise && promise.then && _.isFunction(promise.then);
        },

        /**
         * Returns a new promise that is resolved with a given value.
         * @return {Bmob.Promise} the new promise.
         */
        as: function() {
            var promise = new Bmob.Promise();
            promise.resolve.apply(promise, arguments);
            return promise;
        },

        /**
         * Returns a new promise that is rejected with a given error.
         * @return {Bmob.Promise} the new promise.
         */
        error: function() {
            var promise = new Bmob.Promise();
            promise.reject.apply(promise, arguments);
            return promise;
        },

        /**
         * Returns a new promise that is fulfilled when all of the input promises
         * are resolved. If any promise in the list fails, then the returned promise
         * will fail with the last error. If they all succeed, then the returned
         * promise will succeed, with the result being an array with the results of
         * all the input promises.
         * @param {Array} promises a list of promises to wait for.
         * @return {Bmob.Promise} the new promise.
         */
        when: function(promises) {
            // Allow passing in Promises as separate arguments instead of an Array.
            var objects;
            if (promises && Bmob._isNullOrUndefined(promises.length)) {
                objects = arguments;
            } else {
                objects = promises;
            }

            var total = objects.length;
            var hadError = false;
            var results = [];
            var errors = [];
            results.length = objects.length;
            errors.length = objects.length;

            if (total === 0) {
                return Bmob.Promise.as.apply(this, results);
            }

            var promise = new Bmob.Promise();

            var resolveOne = function() {
                total = total - 1;
                if (total === 0) {
                    if (hadError) {
                        promise.reject(errors);
                    } else {
                        promise.resolve.apply(promise, results);
                    }
                }
            };

            Bmob._arrayEach(objects, function(object, i) {
                if (Bmob.Promise.is(object)) {
                    object.then(function(result) {
                        results[i] = result;
                        resolveOne();
                    }, function(error) {
                        errors[i] = error;
                        hadError = true;
                        resolveOne();
                    });
                } else {
                    results[i] = object;
                    resolveOne();
                }
            });

            return promise;
        },

        /**
         * Runs the given asyncFunction repeatedly, as long as the predicate
         * function returns a truthy value. Stops repeating if asyncFunction returns
         * a rejected promise.
         * @param {Function} predicate should return false when ready to stop.
         * @param {Function} asyncFunction should return a Promise.
         */
        _continueWhile: function(predicate, asyncFunction) {
            if (predicate()) {
                return asyncFunction().then(function() {
                    return Bmob.Promise._continueWhile(predicate, asyncFunction);
                });
            }
            return Bmob.Promise.as();
        }
    });

    _.extend(Bmob.Promise.prototype, /** @lends Bmob.Promise.prototype */ {

        /**
         * Marks this promise as fulfilled, firing any callbacks waiting on it.
         * @param {Object} result the result to pass to the callbacks.
         */
        resolve: function(result) {
            if (this._resolved || this._rejected) {
                throw "A promise was resolved even though it had already been " +
                (this._resolved ? "resolved" : "rejected") + ".";
            }
            this._resolved = true;
            this._result = arguments;
            var results = arguments;
            Bmob._arrayEach(this._resolvedCallbacks, function(resolvedCallback) {
                resolvedCallback.apply(this, results);
            });
            this._resolvedCallbacks = [];
            this._rejectedCallbacks = [];
        },

        /**
         * Marks this promise as fulfilled, firing any callbacks waiting on it.
         * @param {Object} error the error to pass to the callbacks.
         */
        reject: function(error) {
            if (this._resolved || this._rejected) {
                throw "A promise was rejected even though it had already been " +
                (this._resolved ? "resolved" : "rejected") + ".";
            }
            this._rejected = true;
            this._error = error;
            Bmob._arrayEach(this._rejectedCallbacks, function(rejectedCallback) {
                rejectedCallback(error);
            });
            this._resolvedCallbacks = [];
            this._rejectedCallbacks = [];
        },

        /**
         * Adds callbacks to be called when this promise is fulfilled. Returns a new
         * Promise that will be fulfilled when the callback is complete. It allows
         * chaining. If the callback itself returns a Promise, then the one returned
         * by "then" will not be fulfilled until that one returned by the callback
         * is fulfilled.
         * @param {Function} resolvedCallback Function that is called when this
         * Promise is resolved. Once the callback is complete, then the Promise
         * returned by "then" will also be fulfilled.
         * @param {Function} rejectedCallback Function that is called when this
         * Promise is rejected with an error. Once the callback is complete, then
         * the promise returned by "then" with be resolved successfully. If
         * rejectedCallback is null, or it returns a rejected Promise, then the
         * Promise returned by "then" will be rejected with that error.
         * @return {Bmob.Promise} A new Promise that will be fulfilled after this
         * Promise is fulfilled and either callback has completed. If the callback
         * returned a Promise, then this Promise will not be fulfilled until that
         * one is.
         */
        then: function(resolvedCallback, rejectedCallback) {
            var promise = new Bmob.Promise();

            var wrappedResolvedCallback = function() {
                var result = arguments;
                if (resolvedCallback) {
                    result = [resolvedCallback.apply(this, result)];
                }
                if (result.length === 1 && Bmob.Promise.is(result[0])) {
                    result[0].then(function() {
                        promise.resolve.apply(promise, arguments);
                    }, function(error) {
                        promise.reject(error);
                    });
                } else {
                    promise.resolve.apply(promise, result);
                }
            };

            var wrappedRejectedCallback = function(error) {
                var result = [];
                if (rejectedCallback) {
                    result = [rejectedCallback(error)];
                    if (result.length === 1 && Bmob.Promise.is(result[0])) {
                        result[0].then(function() {
                            promise.resolve.apply(promise, arguments);
                        }, function(error) {
                            promise.reject(error);
                        });
                    } else {
                        // A Promises/A+ compliant implementation would call:
                        // promise.resolve.apply(promise, result);
                        promise.reject(result[0]);
                    }
                } else {
                    promise.reject(error);
                }
            };

            if (this._resolved) {
                wrappedResolvedCallback.apply(this, this._result);
            } else if (this._rejected) {
                wrappedRejectedCallback(this._error);
            } else {
                this._resolvedCallbacks.push(wrappedResolvedCallback);
                this._rejectedCallbacks.push(wrappedRejectedCallback);
            }

            return promise;
        },

        /**
         * Run the given callbacks after this promise is fulfilled.
         * @param optionsOrCallback {} A Backbone-style options callback, or a
         * callback function. If this is an options object and contains a "model"
         * attributes, that will be passed to error callbacks as the first argument.
         * @param model {} If truthy, this will be passed as the first result of
         * error callbacks. This is for Backbone-compatability.
         * @return {Bmob.Promise} A promise that will be resolved after the
         * callbacks are run, with the same result as this.
         */
        _thenRunCallbacks: function(optionsOrCallback, model) {
            var options;
            if (_.isFunction(optionsOrCallback)) {
                var callback = optionsOrCallback;
                options = {
                    success: function(result) {
                        callback(result, null);
                    },
                    error: function(error) {
                        callback(null, error);
                    }
                };
            } else {
                options = _.clone(optionsOrCallback);
            }
            options = options || {};

            return this.then(function(result) {
                if (options.success) {
                    options.success.apply(this, arguments);
                } else if (model) {
                    // When there's no callback, a sync event should be triggered.
                    model.trigger('sync', model, result, options);
                }
                return Bmob.Promise.as.apply(Bmob.Promise, arguments);
            }, function(error) {
                if (options.error) {
                    if (!_.isUndefined(model)) {
                        options.error(model, error);
                    } else {
                        options.error(error);
                    }
                } else if (model) {
                    // When there's no error callback, an error event should be triggered.
                    model.trigger('error', model, error, options);
                }
                // By explicitly returning a rejected Promise, this will work with
                // either jQuery or Promises/A semantics.
                return Bmob.Promise.error(error);
            });
        },

        /**
         * Adds a callback function that should be called regardless of whether
         * this promise failed or succeeded. The callback will be given either the
         * array of results for its first argument, or the error as its second,
         * depending on whether this Promise was rejected or resolved. Returns a
         * new Promise, like "then" would.
         * @param {Function} continuation the callback.
         */
        _continueWith: function(continuation) {
            return this.then(function() {
                return continuation(arguments, null);
            }, function(error) {
                return continuation(null, error);
            });
        }

    });

}(this));

/*jshint bitwise:false *//*global FileReader: true, File: true */
(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    var b64Digit = function(number) {
        if (number < 26) {
            return String.fromCharCode(65 + number);
        }
        if (number < 52) {
            return String.fromCharCode(97 + (number - 26));
        }
        if (number < 62) {
            return String.fromCharCode(48 + (number - 52));
        }
        if (number === 62) {
            return "+";
        }
        if (number === 63) {
            return "/";
        }
        throw "Tried to encode large digit " + number + " in base64.";
    };


    var encodeBase64 = function(str) {
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while(i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if(i == len)
            {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if(i == len)
            {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;


    };


    // A list of file extensions to mime types as found here:
    // http://stackoverflow.com/questions/58510/using-net-how-can-you-find-the-
    //     mime-type-of-a-file-based-on-the-file-signature
    var mimeTypes = {
        ai: "application/postscript",
        aif: "audio/x-aiff",
        aifc: "audio/x-aiff",
        aiff: "audio/x-aiff",
        asc: "text/plain",
        atom: "application/atom+xml",
        au: "audio/basic",
        avi: "video/x-msvideo",
        bcpio: "application/x-bcpio",
        bin: "application/octet-stream",
        bmp: "image/bmp",
        cdf: "application/x-netcdf",
        cgm: "image/cgm",
        "class": "application/octet-stream",
        cpio: "application/x-cpio",
        cpt: "application/mac-compactpro",
        csh: "application/x-csh",
        css: "text/css",
        dcr: "application/x-director",
        dif: "video/x-dv",
        dir: "application/x-director",
        djv: "image/vnd.djvu",
        djvu: "image/vnd.djvu",
        dll: "application/octet-stream",
        dmg: "application/octet-stream",
        dms: "application/octet-stream",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml." +
        "document",
        dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml." +
        "template",
        docm: "application/vnd.ms-word.document.macroEnabled.12",
        dotm: "application/vnd.ms-word.template.macroEnabled.12",
        dtd: "application/xml-dtd",
        dv: "video/x-dv",
        dvi: "application/x-dvi",
        dxr: "application/x-director",
        eps: "application/postscript",
        etx: "text/x-setext",
        exe: "application/octet-stream",
        ez: "application/andrew-inset",
        gif: "image/gif",
        gram: "application/srgs",
        grxml: "application/srgs+xml",
        gtar: "application/x-gtar",
        hdf: "application/x-hdf",
        hqx: "application/mac-binhex40",
        htm: "text/html",
        html: "text/html",
        ice: "x-conference/x-cooltalk",
        ico: "image/x-icon",
        ics: "text/calendar",
        ief: "image/ief",
        ifb: "text/calendar",
        iges: "model/iges",
        igs: "model/iges",
        jnlp: "application/x-java-jnlp-file",
        jp2: "image/jp2",
        jpe: "image/jpeg",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        js: "application/x-javascript",
        kar: "audio/midi",
        latex: "application/x-latex",
        lha: "application/octet-stream",
        lzh: "application/octet-stream",
        m3u: "audio/x-mpegurl",
        m4a: "audio/mp4a-latm",
        m4b: "audio/mp4a-latm",
        m4p: "audio/mp4a-latm",
        m4u: "video/vnd.mpegurl",
        m4v: "video/x-m4v",
        mac: "image/x-macpaint",
        man: "application/x-troff-man",
        mathml: "application/mathml+xml",
        me: "application/x-troff-me",
        mesh: "model/mesh",
        mid: "audio/midi",
        midi: "audio/midi",
        mif: "application/vnd.mif",
        mov: "video/quicktime",
        movie: "video/x-sgi-movie",
        mp2: "audio/mpeg",
        mp3: "audio/mpeg",
        mp4: "video/mp4",
        mpe: "video/mpeg",
        mpeg: "video/mpeg",
        mpg: "video/mpeg",
        mpga: "audio/mpeg",
        ms: "application/x-troff-ms",
        msh: "model/mesh",
        mxu: "video/vnd.mpegurl",
        nc: "application/x-netcdf",
        oda: "application/oda",
        ogg: "application/ogg",
        pbm: "image/x-portable-bitmap",
        pct: "image/pict",
        pdb: "chemical/x-pdb",
        pdf: "application/pdf",
        pgm: "image/x-portable-graymap",
        pgn: "application/x-chess-pgn",
        pic: "image/pict",
        pict: "image/pict",
        png: "image/png",
        pnm: "image/x-portable-anymap",
        pnt: "image/x-macpaint",
        pntg: "image/x-macpaint",
        ppm: "image/x-portable-pixmap",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml." +
        "presentation",
        potx: "application/vnd.openxmlformats-officedocument.presentationml." +
        "template",
        ppsx: "application/vnd.openxmlformats-officedocument.presentationml." +
        "slideshow",
        ppam: "application/vnd.ms-powerpoint.addin.macroEnabled.12",
        pptm: "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
        potm: "application/vnd.ms-powerpoint.template.macroEnabled.12",
        ppsm: "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
        ps: "application/postscript",
        qt: "video/quicktime",
        qti: "image/x-quicktime",
        qtif: "image/x-quicktime",
        ra: "audio/x-pn-realaudio",
        ram: "audio/x-pn-realaudio",
        ras: "image/x-cmu-raster",
        rdf: "application/rdf+xml",
        rgb: "image/x-rgb",
        rm: "application/vnd.rn-realmedia",
        roff: "application/x-troff",
        rtf: "text/rtf",
        rtx: "text/richtext",
        sgm: "text/sgml",
        sgml: "text/sgml",
        sh: "application/x-sh",
        shar: "application/x-shar",
        silo: "model/mesh",
        sit: "application/x-stuffit",
        skd: "application/x-koan",
        skm: "application/x-koan",
        skp: "application/x-koan",
        skt: "application/x-koan",
        smi: "application/smil",
        smil: "application/smil",
        snd: "audio/basic",
        so: "application/octet-stream",
        spl: "application/x-futuresplash",
        src: "application/x-wais-source",
        sv4cpio: "application/x-sv4cpio",
        sv4crc: "application/x-sv4crc",
        svg: "image/svg+xml",
        swf: "application/x-shockwave-flash",
        t: "application/x-troff",
        tar: "application/x-tar",
        tcl: "application/x-tcl",
        tex: "application/x-tex",
        texi: "application/x-texinfo",
        texinfo: "application/x-texinfo",
        tif: "image/tiff",
        tiff: "image/tiff",
        tr: "application/x-troff",
        tsv: "text/tab-separated-values",
        txt: "text/plain",
        ustar: "application/x-ustar",
        vcd: "application/x-cdlink",
        vrml: "model/vrml",
        vxml: "application/voicexml+xml",
        wav: "audio/x-wav",
        wbmp: "image/vnd.wap.wbmp",
        wbmxl: "application/vnd.wap.wbxml",
        wml: "text/vnd.wap.wml",
        wmlc: "application/vnd.wap.wmlc",
        wmls: "text/vnd.wap.wmlscript",
        wmlsc: "application/vnd.wap.wmlscriptc",
        wrl: "model/vrml",
        xbm: "image/x-xbitmap",
        xht: "application/xhtml+xml",
        xhtml: "application/xhtml+xml",
        xls: "application/vnd.ms-excel",
        xml: "application/xml",
        xpm: "image/x-xpixmap",
        xsl: "application/xml",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml." +
        "template",
        xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
        xltm: "application/vnd.ms-excel.template.macroEnabled.12",
        xlam: "application/vnd.ms-excel.addin.macroEnabled.12",
        xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
        xslt: "application/xslt+xml",
        xul: "application/vnd.mozilla.xul+xml",
        xwd: "image/x-xwindowdump",
        xyz: "chemical/x-xyz",
        zip: "application/zip"
    };

    /**
     * Reads a File using a FileReader.
     * @param file {File} the File to read.
     * @param type {String} (optional) the mimetype to override with.
     * @return {Bmob.Promise} A Promise that will be fulfilled with a
     *     base64-encoded string of the data and its mime type.
     */
    var readAsync = function(file, type) {
        var promise = new Bmob.Promise();

        if (typeof(FileReader) === "undefined") {
            return Bmob.Promise.error(new Bmob.Error(
                -1, "Attempted to use a FileReader on an unsupported browser."));
        }

        var reader = new FileReader();
        reader.onloadend = function() {


            promise.resolve(reader.result);
        };
        reader.readAsBinaryString(file);
        return promise;
    };

    /**
     *  Bmob.File ä¿å­˜æ–‡ä»¶åˆ°bmob
     * cloud.
     * @param name {String} æ–‡ä»¶åã€‚åœ¨æœåŠ¡å™¨ä¸­ï¼Œè¿™ä¼šæ”¹ä¸ºå”¯ä¸€çš„æ–‡ä»¶å
     * @param data {file} æ–‡ä»¶çš„æ•°æ®
     *
     *     æ–‡ä»¶å¯¹è±¡æ˜¯åœ¨" file upload control"ä¸­è¢«é€‰ä¸­ï¼Œåªèƒ½åœ¨ä¸‹é¢çš„æµè§ˆå™¨ä½¿ç”¨
     *        in Firefox 3.6+, Safari 6.0.2+, Chrome 7+, and IE 10+.
     *        ä¾‹å¦‚:<pre>
     *
     * var fileUploadControl = $("#profilePhotoFileUpload")[0];
     * if (fileUploadControl.files.length > 0) {
   *   var file = fileUploadControl.files[0];
   *   var name = "photo.jpg";
   *   var bmobFile = new Bmob.File(name, file);
   *   bmobFile.save().then(function() {
   *     // The file has been saved to Bmob.
   *   }, function(error) {
   *     // The file either could not be read, or could not be saved to Bmob.
   *   });
   * }</pre>
     * @param type {String} æ–‡ä»¶çš„ç±»åž‹.
     */
    Bmob.File = function(name, data, type) {
        // this._name = name;
        this._name = encodeBase64(name);
        // this._name = "aGVsbG8udHh0";
        var currentUser = Bmob.User.current();
        this._metaData = {
            owner: (currentUser !=null ? currentUser.id : 'unknown')
        };

        // Guess the content type from the extension if we need to.
        var extension = /\.([^.]*)$/.exec(name);
        if (extension) {
            extension = extension[1].toLowerCase();
        }
        var guessedType = type || mimeTypes[extension] || "text/plain";
        this._guessedType = guessedType;

        if (typeof(File) !== "undefined" && data instanceof File) {
            this._source = readAsync(data, type);
        } else {
            // throw "Creating a Bmob.File from a String is not yet supported.";
            this._source = Bmob.Promise.as(data, guessedType);
            this._metaData.size = data.length;
        }
    };



    Bmob.File.prototype = {

        /**
         * Gets the name of the file. Before save is called, this is the filename
         * given by the user. After save is called, that name gets prefixed with a
         * unique identifier.
         */
        name: function() {
            return this._name;
        },

        /**
         * Gets the url of the file. It is only available after you save the file or
         * after you get the file from a Bmob.Object.
         * @return {String}
         */
        url: function() {
            return Bmob.fileURL+"/"+this._url;
        },

        /**
         * Gets the group of the file. It is only available after you save the file or
         * after you get the file from a Bmob.Object.
         * @return {String}
         */
        group: function() {
            return this._group;
        },

        /**
         * <p>Returns the file's metadata JSON object if no arguments is given.Returns the
         * metadata value if a key is given.Set metadata value if key and value are both given.</p>
         * <p><pre>
         *  var metadata = file.metaData(); //Get metadata JSON object.
         *  var size = file.metaData('size');  // Get the size metadata value.
         *  file.metaData('format', 'jpeg'); //set metadata attribute and value.
         *</pre></p>
         * @return {Object} The file's metadata JSON object.
         * @param {String} attr an optional metadata key.
         * @param {Object} value an optional metadata value.
         **/
        metaData: function(attr, value) {
            if(attr != null && value != null){
                this._metaData[attr] = value;
                return this;
            }else if(attr != null){
                return this._metaData[attr];
            }else{
                return this._metaData;
            }
        },


        /**
         * Destroy the file.
         * @return {Bmob.Promise} A promise that is fulfilled when the destroy
         *     completes.
         */
        destroy: function(options){
            if(!this._url && !this._group )
                return Bmob.Promise.error('The file url and group is not eixsts.')._thenRunCallbacks(options);

            var data = {
                group: this._group,
                _ContentType: "application/json",
                url: this._url,
                metaData: self._metaData,
            };
            var request = Bmob._request("files", null, null, 'DELETE',data);
            return request._thenRunCallbacks(options);
        },

        /**
         * Saves the file to the Bmob cloud.
         * @param {Object} options A Backbone-style options object.
         * @return {Bmob.Promise} Promise that is resolved when the save finishes.
         */
        save: function(options) {
            var self = this;
            if (!self._previousSave) {
                if(self._source){
                    self._previousSave = self._source.then(function(base64, type) {
                        var data = {
                            base64: encodeBase64(base64),
                            _ContentType: "text/plain",
                            mime_type: "text/plain",
                            metaData: self._metaData,
                        };
                        if(!self._metaData.size){
                            self._metaData.size = base64.length;
                        }
                        return Bmob._request("files", self._name, null, 'POST', data);
                    }).then(function(response) {

                        self._name = response.filename;
                        self._url = response.url;
                        self._group = response.group;

                        return self;
                    });
                } else  {
                    throw "not source file"
                }
            }
            return self._previousSave._thenRunCallbacks(options);
        }
    };

}(this));

// Bmob.Object is analogous to the Java BmobObject.
// It also implements the same interface as a Backbone model.

(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * Creates a new model with defined attributes. A client id (cid) is
     * automatically generated and assigned for you.
     *
     * <p>You won't normally call this method directly.  It is recommended that
     * you use a subclass of <code>Bmob.Object</code> instead, created by calling
     * <code>extend</code>.</p>
     *
     * <p>However, if you don't want to use a subclass, or aren't sure which
     * subclass is appropriate, you can use this form:<pre>
     *     var object = new Bmob.Object("ClassName");
     * </pre>
     * That is basically equivalent to:<pre>
     *     var MyClass = Bmob.Object.extend("ClassName");
     *     var object = new MyClass();
     * </pre></p>
     *
     * @param {Object} attributes The initial set of data to store in the object.
     * @param {Object} options A set of Backbone-like options for creating the
     *     object.  The only option currently supported is "collection".
     * @see Bmob.Object.extend
     *
     *
     * <p>The fundamental unit of Bmob data, which implements the Backbone Model
     * interface.</p>
     */
    Bmob.Object = function(attributes, options) {
        // Allow new Bmob.Object("ClassName") as a shortcut to _create.
        if (_.isString(attributes)) {
            return Bmob.Object._create.apply(this, arguments);
        }

        attributes = attributes || {};
        if (options && options.parse) {
            attributes = this.parse(attributes);
        }
        var defaults = Bmob._getValue(this, 'defaults');
        if (defaults) {
            attributes = _.extend({}, defaults, attributes);
        }
        if (options && options.collection) {
            this.collection = options.collection;
        }

        this._serverData = {};  // The last known data for this object from cloud.
        this._opSetQueue = [{}];  // List of sets of changes to the data.
        this.attributes = {};  // The best estimate of this's current data.

        this._hashedJSON = {};  // Hash of values of containers at last save.
        this._escapedAttributes = {};
        this.cid = _.uniqueId('c');
        this.changed = {};
        this._silent = {};
        this._pending = {};
        if (!this.set(attributes, {silent: true})) {
            throw new Error("Can't create an invalid Bmob.Object");
        }
        this.changed = {};
        this._silent = {};
        this._pending = {};
        this._hasData = true;
        this._previousAttributes = _.clone(this.attributes);
        this.initialize.apply(this, arguments);
    };

    /**
     * @lends Bmob.Object.prototype
     * @property {String} id The objectId of the Bmob Object.
     */

    /**
     * Saves the given list of Bmob.Object.
     * If any error is encountered, stops and calls the error handler.
     * There are two ways you can call this function.
     *
     * The Backbone way:<pre>
     *   Bmob.Object.saveAll([object1, object2, ...], {
   *     success: function(list) {
   *       // All the objects were saved.
   *     },
   *     error: function(error) {
   *       // An error occurred while saving one of the objects.
   *     },
   *   });
     * </pre>
     * A simplified syntax:<pre>
     *   Bmob.Object.saveAll([object1, object2, ...], function(list, error) {
   *     if (list) {
   *       // All the objects were saved.
   *     } else {
   *       // An error occurred.
   *     }
   *   });
     * </pre>
     *
     * @param {Array} list A list of <code>Bmob.Object</code>.
     * @param {Object} options A Backbone-style callback object.
     */
    Bmob.Object.saveAll = function(list, options) {
        return Bmob.Object._deepSaveAsync(list)._thenRunCallbacks(options);
    };

    // Attach all inheritable methods to the Bmob.Object prototype.
    _.extend(Bmob.Object.prototype, Bmob.Events,
        /** @lends Bmob.Object.prototype */ {
            _existed: false,
            _fetchWhenSave: false,

            /**
             * Initialize is an empty function by default. Override it with your own
             * initialization logic.
             */
            initialize: function(){},

            /**
             * Set whether to enable fetchWhenSave option when updating object.
             * When set true, SDK would fetch the latest object after saving.
             * Default is false.
             * @param {boolean} enable  true to enable fetchWhenSave option.
             */
            fetchWhenSave: function(enable){
                if (typeof enable !== 'boolean'){
                    throw "Expect boolean value for fetchWhenSave";
                }
                this._fetchWhenSave = enable;
            },

            /**
             * Returns a JSON version of the object suitable for saving to Bmob.
             * @return {Object}
             */
            toJSON: function() {
                var json = this._toFullJSON();
                Bmob._arrayEach(["__type", "className"],
                    function(key) { delete json[key]; });
                return json;
            },

            _toFullJSON: function(seenObjects) {
                var json = _.clone(this.attributes);
                Bmob._objectEach(json, function(val, key) {
                    json[key] = Bmob._encode(val, seenObjects);
                });
                Bmob._objectEach(this._operations, function(val, key) {
                    json[key] = val;
                });

                if (_.has(this, "id")) {
                    json.objectId = this.id;
                }
                if (_.has(this, "createdAt")) {
                    if (_.isDate(this.createdAt)) {
                        json.createdAt = this.createdAt.toJSON();
                    } else {
                        json.createdAt = this.createdAt;
                    }
                }

                if (_.has(this, "updatedAt")) {
                    if (_.isDate(this.updatedAt)) {
                        json.updatedAt = this.updatedAt.toJSON();
                    } else {
                        json.updatedAt = this.updatedAt;
                    }
                }
                json.__type = "Object";
                json.className = this.className;
                return json;
            },

            /**
             * Updates _hashedJSON to reflect the current state of this object.
             * Adds any changed hash values to the set of pending changes.
             */
            _refreshCache: function() {
                var self = this;
                if (self._refreshingCache) {
                    return;
                }
                self._refreshingCache = true;
                Bmob._objectEach(this.attributes, function(value, key) {
                    if (value instanceof Bmob.Object) {
                        value._refreshCache();
                    } else if (_.isObject(value)) {
                        if (self._resetCacheForKey(key)) {
                            self.set(key, new Bmob.Op.Set(value), { silent: true });
                        }
                    }
                });
                delete self._refreshingCache;
            },

            /**
             * Returns true if this object has been modified since its last
             * save/refresh.  If an attribute is specified, it returns true only if that
             * particular attribute has been modified since the last save/refresh.
             * @param {String} attr An attribute name (optional).
             * @return {Boolean}
             */
            dirty: function(attr) {
                this._refreshCache();

                var currentChanges = _.last(this._opSetQueue);

                if (attr) {
                    return (currentChanges[attr] ? true : false);
                }
                if (!this.id) {
                    return true;
                }
                if (_.keys(currentChanges).length > 0) {
                    return true;
                }
                return false;
            },

            /**
             * Gets a Pointer referencing this Object.
             */
            _toPointer: function() {
                // if (!this.id) {
                //   throw new Error("Can't serialize an unsaved Bmob.Object");
                // }
                return { __type: "Pointer",
                    className: this.className,
                    objectId: this.id };
            },

            /**
             * Gets the value of an attribute.
             * @param {String} attr The string name of an attribute.
             */
            get: function(attr) {
                return this.attributes[attr];
            },

            /**
             * Gets a relation on the given class for the attribute.
             * @param String attr The attribute to get the relation for.
             */
            relation: function(attr) {
                var value = this.get(attr);
                if (value) {
                    if (!(value instanceof Bmob.Relation)) {
                        throw "Called relation() on non-relation field " + attr;
                    }
                    value._ensureParentAndKey(this, attr);
                    return value;
                } else {
                    return new Bmob.Relation(this, attr);
                }
            },

            /**
             * Gets the HTML-escaped value of an attribute.
             */
            escape: function(attr) {
                var html = this._escapedAttributes[attr];
                if (html) {
                    return html;
                }
                var val = this.attributes[attr];
                var escaped;
                if (Bmob._isNullOrUndefined(val)) {
                    escaped = '';
                } else {
                    escaped = _.escape(val.toString());
                }
                this._escapedAttributes[attr] = escaped;
                return escaped;
            },

            /**
             * Returns <code>true</code> if the attribute contains a value that is not
             * null or undefined.
             * @param {String} attr The string name of the attribute.
             * @return {Boolean}
             */
            has: function(attr) {
                return !Bmob._isNullOrUndefined(this.attributes[attr]);
            },

            /**
             * Pulls "special" fields like objectId, createdAt, etc. out of attrs
             * and puts them on "this" directly.  Removes them from attrs.
             * @param attrs - A dictionary with the data for this Bmob.Object.
             */
            _mergeMagicFields: function(attrs) {
                // Check for changes of magic fields.
                var model = this;
                var specialFields = ["id", "objectId", "createdAt", "updatedAt"];
                Bmob._arrayEach(specialFields, function(attr) {
                    if (attrs[attr]) {
                        if (attr === "objectId") {
                            model.id = attrs[attr];
                        } else {
                            model[attr] = attrs[attr];
                        }
                        delete attrs[attr];
                    }
                });
            },

            /**
             * Returns the json to be sent to the server.
             */
            _startSave: function() {
                this._opSetQueue.push({});
            },

            /**
             * Called when a save fails because of an error. Any changes that were part
             * of the save need to be merged with changes made after the save. This
             * might throw an exception is you do conflicting operations. For example,
             * if you do:
             *   object.set("foo", "bar");
             *   object.set("invalid field name", "baz");
             *   object.save();
             *   object.increment("foo");
             * then this will throw when the save fails and the client tries to merge
             * "bar" with the +1.
             */
            _cancelSave: function() {
                var self = this;
                var failedChanges = _.first(this._opSetQueue);
                this._opSetQueue = _.rest(this._opSetQueue);
                var nextChanges = _.first(this._opSetQueue);
                Bmob._objectEach(failedChanges, function(op, key) {
                    var op1 = failedChanges[key];
                    var op2 = nextChanges[key];
                    if (op1 && op2) {
                        nextChanges[key] = op2._mergeWithPrevious(op1);
                    } else if (op1) {
                        nextChanges[key] = op1;
                    }
                });
                this._saving = this._saving - 1;
            },

            /**
             * Called when a save completes successfully. This merges the changes that
             * were saved into the known server data, and overrides it with any data
             * sent directly from the server.
             */
            _finishSave: function(serverData) {
                // Grab a copy of any object referenced by this object. These instances
                // may have already been fetched, and we don't want to lose their data.
                // Note that doing it like this means we will unify separate copies of the
                // same object, but that's a risk we have to take.
                var fetchedObjects = {};
                Bmob._traverse(this.attributes, function(object) {
                    if (object instanceof Bmob.Object && object.id && object._hasData) {
                        fetchedObjects[object.id] = object;
                    }
                });

                var savedChanges = _.first(this._opSetQueue);
                this._opSetQueue = _.rest(this._opSetQueue);
                this._applyOpSet(savedChanges, this._serverData);
                this._mergeMagicFields(serverData);
                var self = this;
                Bmob._objectEach(serverData, function(value, key) {
                    self._serverData[key] = Bmob._decode(key, value);

                    // Look for any objects that might have become unfetched and fix them
                    // by replacing their values with the previously observed values.
                    var fetched = Bmob._traverse(self._serverData[key], function(object) {
                        if (object instanceof Bmob.Object && fetchedObjects[object.id]) {
                            return fetchedObjects[object.id];
                        }
                    });
                    if (fetched) {
                        self._serverData[key] = fetched;
                    }
                });
                this._rebuildAllEstimatedData();
                this._saving = this._saving - 1;
            },

            /**
             * Called when a fetch or login is complete to set the known server data to
             * the given object.
             */
            _finishFetch: function(serverData, hasData) {
                // Clear out any changes the user might have made previously.
                this._opSetQueue = [{}];

                // Bring in all the new server data.
                this._mergeMagicFields(serverData);
                var self = this;
                Bmob._objectEach(serverData, function(value, key) {
                    self._serverData[key] = Bmob._decode(key, value);
                });

                // Refresh the attributes.
                this._rebuildAllEstimatedData();

                // Clear out the cache of mutable containers.
                this._refreshCache();
                this._opSetQueue = [{}];

                this._hasData = hasData;
            },

            /**
             * Applies the set of Bmob.Op in opSet to the object target.
             */
            _applyOpSet: function(opSet, target) {
                var self = this;
                Bmob._objectEach(opSet, function(change, key) {
                    target[key] = change._estimate(target[key], self, key);
                    if (target[key] === Bmob.Op._UNSET) {
                        delete target[key];
                    }
                });
            },

            /**
             * Replaces the cached value for key with the current value.
             * Returns true if the new value is different than the old value.
             */
            _resetCacheForKey: function(key) {
                var value = this.attributes[key];
                if (_.isObject(value) &&
                    !(value instanceof Bmob.Object) &&
                    !(value instanceof Bmob.File)) {
                    value = value.toJSON ? value.toJSON() : value;
                    var json = JSON.stringify(value);
                    if (this._hashedJSON[key] !== json) {
                        this._hashedJSON[key] = json;
                        return true;
                    }
                }
                return false;
            },

            /**
             * Populates attributes[key] by starting with the last known data from the
             * server, and applying all of the local changes that have been made to that
             * key since then.
             */
            _rebuildEstimatedDataForKey: function(key) {
                var self = this;
                delete this.attributes[key];
                if (this._serverData[key]) {
                    this.attributes[key] = this._serverData[key];
                }
                Bmob._arrayEach(this._opSetQueue, function(opSet) {
                    var op = opSet[key];
                    if (op) {
                        self.attributes[key] = op._estimate(self.attributes[key], self, key);
                        if (self.attributes[key] === Bmob.Op._UNSET) {
                            delete self.attributes[key];
                        } else {
                            self._resetCacheForKey(key);
                        }
                    }
                });
            },

            /**
             * Populates attributes by starting with the last known data from the
             * server, and applying all of the local changes that have been made since
             * then.
             */
            _rebuildAllEstimatedData: function() {
                var self = this;

                var previousAttributes = _.clone(this.attributes);

                this.attributes = _.clone(this._serverData);
                Bmob._arrayEach(this._opSetQueue, function(opSet) {
                    self._applyOpSet(opSet, self.attributes);
                    Bmob._objectEach(opSet, function(op, key) {
                        self._resetCacheForKey(key);
                    });
                });

                // Trigger change events for anything that changed because of the fetch.
                Bmob._objectEach(previousAttributes, function(oldValue, key) {
                    if (self.attributes[key] !== oldValue) {
                        self.trigger('change:' + key, self, self.attributes[key], {});
                    }
                });
                Bmob._objectEach(this.attributes, function(newValue, key) {
                    if (!_.has(previousAttributes, key)) {
                        self.trigger('change:' + key, self, newValue, {});
                    }
                });
            },

            /**
             * Sets a hash of model attributes on the object, firing
             * <code>"change"</code> unless you choose to silence it.
             *
             * <p>You can call it with an object containing keys and values, or with one
             * key and value.  For example:<pre>
             *   gameTurn.set({
     *     player: player1,
     *     diceRoll: 2
     *   }, {
     *     error: function(gameTurnAgain, error) {
     *       // The set failed validation.
     *     }
     *   });
             *
             *   game.set("currentPlayer", player2, {
     *     error: function(gameTurnAgain, error) {
     *       // The set failed validation.
     *     }
     *   });
             *
             *   game.set("finished", true);</pre></p>
             *
             * @param {String} key The key to set.
             * @param {} value The value to give it.
             * @param {Object} options A set of Backbone-like options for the set.
             *     The only supported options are <code>silent</code>,
             *     <code>error</code>, and <code>promise</code>.
             * @return {Boolean} true if the set succeeded.
             * @see Bmob.Object#validate
             * @see Bmob.Error
             */
            set: function(key, value, options) {
                var attrs, attr;
                if (_.isObject(key) || Bmob._isNullOrUndefined(key)) {
                    attrs = key;
                    Bmob._objectEach(attrs, function(v, k) {
                        attrs[k] = Bmob._decode(k, v);
                    });
                    options = value;
                } else {
                    attrs = {};
                    attrs[key] = Bmob._decode(key, value);
                }

                // Extract attributes and options.
                options = options || {};
                if (!attrs) {
                    return this;
                }
                if (attrs instanceof Bmob.Object) {
                    attrs = attrs.attributes;
                }

                // If the unset option is used, every attribute should be a Unset.
                if (options.unset) {
                    Bmob._objectEach(attrs, function(unused_value, key) {
                        attrs[key] = new Bmob.Op.Unset();
                    });
                }

                // Apply all the attributes to get the estimated values.
                var dataToValidate = _.clone(attrs);
                var self = this;
                Bmob._objectEach(dataToValidate, function(value, key) {
                    if (value instanceof Bmob.Op) {
                        dataToValidate[key] = value._estimate(self.attributes[key],
                            self, key);
                        if (dataToValidate[key] === Bmob.Op._UNSET) {
                            delete dataToValidate[key];
                        }
                    }
                });

                // Run validation.
                if (!this._validate(attrs, options)) {
                    return false;
                }

                this._mergeMagicFields(attrs);

                options.changes = {};
                var escaped = this._escapedAttributes;
                var prev = this._previousAttributes || {};

                // Update attributes.
                Bmob._arrayEach(_.keys(attrs), function(attr) {
                    var val = attrs[attr];

                    // If this is a relation object we need to set the parent correctly,
                    // since the location where it was parsed does not have access to
                    // this object.
                    if (val instanceof Bmob.Relation) {
                        val.parent = self;
                    }

                    if (!(val instanceof Bmob.Op)) {
                        val = new Bmob.Op.Set(val);
                    }

                    // See if this change will actually have any effect.
                    var isRealChange = true;
                    if (val instanceof Bmob.Op.Set &&
                        _.isEqual(self.attributes[attr], val.value)) {
                        isRealChange = false;
                    }

                    if (isRealChange) {
                        delete escaped[attr];
                        if (options.silent) {
                            self._silent[attr] = true;
                        } else {
                            options.changes[attr] = true;
                        }
                    }

                    var currentChanges = _.last(self._opSetQueue);
                    currentChanges[attr] = val._mergeWithPrevious(currentChanges[attr]);
                    self._rebuildEstimatedDataForKey(attr);

                    if (isRealChange) {
                        self.changed[attr] = self.attributes[attr];
                        if (!options.silent) {
                            self._pending[attr] = true;
                        }
                    } else {
                        delete self.changed[attr];
                        delete self._pending[attr];
                    }
                });

                if (!options.silent) {
                    this.change(options);
                }
                return this;
            },

            /**
             * Remove an attribute from the model, firing <code>"change"</code> unless
             * you choose to silence it. This is a noop if the attribute doesn't
             * exist.
             */
            unset: function(attr, options) {
                options = options || {};
                options.unset = true;
                return this.set(attr, null, options);
            },

            /**
             * Atomically increments the value of the given attribute the next time the
             * object is saved. If no amount is specified, 1 is used by default.
             *
             * @param attr {String} The key.
             * @param amount {Number} The amount to increment by.
             */
            increment: function(attr, amount) {
                if (_.isUndefined(amount) || _.isNull(amount)) {
                    amount = 1;
                }
                return this.set(attr, new Bmob.Op.Increment(amount));
            },

            /**
             * Atomically add an object to the end of the array associated with a given
             * key.
             * @param attr {String} The key.
             * @param item {} The item to add.
             */
            add: function(attr, item) {
                return this.set(attr, new Bmob.Op.Add([item]));
            },

            /**
             * Atomically add an object to the array associated with a given key, only
             * if it is not already present in the array. The position of the insert is
             * not guaranteed.
             *
             * @param attr {String} The key.
             * @param item {} The object to add.
             */
            addUnique: function(attr, item) {
                return this.set(attr, new Bmob.Op.AddUnique([item]));
            },

            /**
             * Atomically remove all instances of an object from the array associated
             * with a given key.
             *
             * @param attr {String} The key.
             * @param item {} The object to remove.
             */
            remove: function(attr, item) {
                return this.set(attr, new Bmob.Op.Remove([item]));
            },

            /**
             * Returns an instance of a subclass of Bmob.Op describing what kind of
             * modification has been performed on this field since the last time it was
             * saved. For example, after calling object.increment("x"), calling
             * object.op("x") would return an instance of Bmob.Op.Increment.
             *
             * @param attr {String} The key.
             * @returns {Bmob.Op} The operation, or undefined if none.
             */
            op: function(attr) {
                return _.last(this._opSetQueue)[attr];
            },

            /**
             * Clear all attributes on the model, firing <code>"change"</code> unless
             * you choose to silence it.
             */
            clear: function(options) {
                options = options || {};
                options.unset = true;
                var keysToClear = _.extend(this.attributes, this._operations);
                return this.set(keysToClear, options);
            },

            /**
             * Returns a JSON-encoded set of operations to be sent with the next save
             * request.
             */
            _getSaveJSON: function() {
                var json = _.clone(_.first(this._opSetQueue));
                Bmob._objectEach(json, function(op, key) {
                    json[key] = op.toJSON();
                });
                return json;
            },

            /**
             * Returns true if this object can be serialized for saving.
             */
            _canBeSerialized: function() {
                return Bmob.Object._canBeSerializedAsValue(this.attributes);
            },

            /**
             * Fetch the model from the server. If the server's representation of the
             * model differs from its current attributes, they will be overriden,
             * triggering a <code>"change"</code> event.
             * @return {Bmob.Promise} A promise that is fulfilled when the fetch
             *     completes.
             */
            fetch: function(options) {
                var self = this;
                var request = Bmob._request("classes", this.className, this.id, 'GET');
                return request.then(function(response, status, xhr) {
                    self._finishFetch(self.parse(response, status, xhr), true);
                    return self;
                })._thenRunCallbacks(options, this);
            },

            /**
             * Set a hash of model attributes, and save the model to the server.
             * updatedAt will be updated when the request returns.
             * You can either call it as:<pre>
             *   object.save();</pre>
             * or<pre>
             *   object.save(null, options);</pre>
             * or<pre>
             *   object.save(attrs, options);</pre>
             * or<pre>
             *   object.save(key, value, options);</pre>
             *
             * For example, <pre>
             *   gameTurn.save({
     *     player: "Jake Cutter",
     *     diceRoll: 2
     *   }, {
     *     success: function(gameTurnAgain) {
     *       // The save was successful.
     *     },
     *     error: function(gameTurnAgain, error) {
     *       // The save failed.  Error is an instance of Bmob.Error.
     *     }
     *   });</pre>
             * or with promises:<pre>
             *   gameTurn.save({
     *     player: "Jake Cutter",
     *     diceRoll: 2
     *   }).then(function(gameTurnAgain) {
     *     // The save was successful.
     *   }, function(error) {
     *     // The save failed.  Error is an instance of Bmob.Error.
     *   });</pre>
             *
             * @return {Bmob.Promise} A promise that is fulfilled when the save
             *     completes.
             * @see Bmob.Error
             */
            save: function(arg1, arg2, arg3) {
                var i, attrs, current, options, saved;
                if (_.isObject(arg1) || Bmob._isNullOrUndefined(arg1)) {
                    attrs = arg1;
                    options = arg2;
                } else {
                    attrs = {};
                    attrs[arg1] = arg2;
                    options = arg3;
                }

                // Make save({ success: function() {} }) work.
                if (!options && attrs) {
                    var extra_keys = _.reject(attrs, function(value, key) {
                        return _.include(["success", "error", "wait"], key);
                    });
                    if (extra_keys.length === 0) {
                        var all_functions = true;
                        if (_.has(attrs, "success") && !_.isFunction(attrs.success)) {
                            all_functions = false;
                        }
                        if (_.has(attrs, "error") && !_.isFunction(attrs.error)) {
                            all_functions = false;
                        }
                        if (all_functions) {
                            // This attrs object looks like it's really an options object,
                            // and there's no other options object, so let's just use it.
                            return this.save(null, attrs);
                        }
                    }
                }

                options = _.clone(options) || {};
                if (options.wait) {
                    current = _.clone(this.attributes);
                }

                var setOptions = _.clone(options) || {};
                if (setOptions.wait) {
                    setOptions.silent = true;
                }
                var setError;
                setOptions.error = function(model, error) {
                    setError = error;
                };
                if (attrs && !this.set(attrs, setOptions)) {
                    return Bmob.Promise.error(setError)._thenRunCallbacks(options, this);
                }

                var model = this;

                // If there is any unsaved child, save it first.
                model._refreshCache();



                var unsavedChildren = [];
                var unsavedFiles = [];
                Bmob.Object._findUnsavedChildren(model.attributes,
                    unsavedChildren,
                    unsavedFiles);
                if (unsavedChildren.length + unsavedFiles.length > 0) {
                    return Bmob.Object._deepSaveAsync(this.attributes).then(function() {
                        return model.save(null, options);
                    }, function(error) {
                        return Bmob.Promise.error(error)._thenRunCallbacks(options, model);
                    });
                }

                this._startSave();
                this._saving = (this._saving || 0) + 1;

                this._allPreviousSaves = this._allPreviousSaves || Bmob.Promise.as();
                this._allPreviousSaves = this._allPreviousSaves._continueWith(function() {
                    var method = model.id ? 'PUT' : 'POST';

                    var json = model._getSaveJSON();

                    if(method === 'PUT' && model._fetchWhenSave){
                        //Sepcial-case fetchWhenSave when updating object.
                        json._fetchWhenSave = true;
                    }

                    var route = "classes";
                    var className = model.className;
                    if (model.className === "_User" && !model.id) {
                        // Special-case user sign-up.
                        route = "users";
                        className = null;
                    }
                    var request = Bmob._request(route, className, model.id, method, json);

                    request = request.then(function(resp, status, xhr) {
                        var serverAttrs = model.parse(resp, status, xhr);
                        if (options.wait) {
                            serverAttrs = _.extend(attrs || {}, serverAttrs);
                        }
                        model._finishSave(serverAttrs);
                        if (options.wait) {
                            model.set(current, setOptions);
                        }
                        return model;

                    }, function(error) {
                        model._cancelSave();
                        return Bmob.Promise.error(error);

                    })._thenRunCallbacks(options, model);

                    return request;
                });
                return this._allPreviousSaves;
            },

            /**
             * Destroy this model on the server if it was already persisted.
             * Optimistically removes the model from its collection, if it has one.
             * If `wait: true` is passed, waits for the server to respond
             * before removal.
             *
             * @return {Bmob.Promise} A promise that is fulfilled when the destroy
             *     completes.
             */
            destroy: function(options) {
                options = options || {};
                var model = this;

                var triggerDestroy = function() {
                    model.trigger('destroy', model, model.collection, options);
                };

                if (!this.id) {
                    return triggerDestroy();
                }

                if (!options.wait) {
                    triggerDestroy();
                }

                var request =
                    Bmob._request("classes", this.className, this.id, 'DELETE');
                return request.then(function() {
                    if (options.wait) {
                        triggerDestroy();
                    }
                    return model;
                })._thenRunCallbacks(options, this);
            },

            /**
             * Converts a response into the hash of attributes to be set on the model.
             * @ignore
             */
            parse: function(resp, status, xhr) {
                var output = _.clone(resp);
                _(["createdAt", "updatedAt"]).each(function(key) {
                    if (output[key]) {
                        output[key] = output[key];
                    }
                });
                if (!output.updatedAt) {
                    output.updatedAt = output.createdAt;
                }
                if (status) {
                    this._existed = (status !== 201);
                }
                return output;
            },

            /**
             * Creates a new model with identical attributes to this one.
             * @return {Bmob.Object}
             */
            clone: function() {
                return new this.constructor(this.attributes);
            },

            /**
             * Returns true if this object has never been saved to Bmob.
             * @return {Boolean}
             */
            isNew: function() {
                return !this.id;
            },

            /**
             * Call this method to manually fire a `"change"` event for this model and
             * a `"change:attribute"` event for each changed attribute.
             * Calling this will cause all objects observing the model to update.
             */
            change: function(options) {
                options = options || {};
                var changing = this._changing;
                this._changing = true;

                // Silent changes become pending changes.
                var self = this;
                Bmob._objectEach(this._silent, function(attr) {
                    self._pending[attr] = true;
                });

                // Silent changes are triggered.
                var changes = _.extend({}, options.changes, this._silent);
                this._silent = {};
                Bmob._objectEach(changes, function(unused_value, attr) {
                    self.trigger('change:' + attr, self, self.get(attr), options);
                });
                if (changing) {
                    return this;
                }

                // This is to get around lint not letting us make a function in a loop.
                var deleteChanged = function(value, attr) {
                    if (!self._pending[attr] && !self._silent[attr]) {
                        delete self.changed[attr];
                    }
                };

                // Continue firing `"change"` events while there are pending changes.
                while (!_.isEmpty(this._pending)) {
                    this._pending = {};
                    this.trigger('change', this, options);
                    // Pending and silent changes still remain.
                    Bmob._objectEach(this.changed, deleteChanged);
                    self._previousAttributes = _.clone(this.attributes);
                }

                this._changing = false;
                return this;
            },

            /**
             * Returns true if this object was created by the Bmob server when the
             * object might have already been there (e.g. in the case of a Facebook
             * login)
             */
            existed: function() {
                return this._existed;
            },

            /**
             * Determine if the model has changed since the last <code>"change"</code>
             * event.  If you specify an attribute name, determine if that attribute
             * has changed.
             * @param {String} attr Optional attribute name
             * @return {Boolean}
             */
            hasChanged: function(attr) {
                if (!arguments.length) {
                    return !_.isEmpty(this.changed);
                }
                return this.changed && _.has(this.changed, attr);
            },

            /**
             * Returns an object containing all the attributes that have changed, or
             * false if there are no changed attributes. Useful for determining what
             * parts of a view need to be updated and/or what attributes need to be
             * persisted to the server. Unset attributes will be set to undefined.
             * You can also pass an attributes object to diff against the model,
             * determining if there *would be* a change.
             */
            changedAttributes: function(diff) {
                if (!diff) {
                    return this.hasChanged() ? _.clone(this.changed) : false;
                }
                var changed = {};
                var old = this._previousAttributes;
                Bmob._objectEach(diff, function(diffVal, attr) {
                    if (!_.isEqual(old[attr], diffVal)) {
                        changed[attr] = diffVal;
                    }
                });
                return changed;
            },

            /**
             * Gets the previous value of an attribute, recorded at the time the last
             * <code>"change"</code> event was fired.
             * @param {String} attr Name of the attribute to get.
             */
            previous: function(attr) {
                if (!arguments.length || !this._previousAttributes) {
                    return null;
                }
                return this._previousAttributes[attr];
            },

            /**
             * Gets all of the attributes of the model at the time of the previous
             * <code>"change"</code> event.
             * @return {Object}
             */
            previousAttributes: function() {
                return _.clone(this._previousAttributes);
            },

            /**
             * Checks if the model is currently in a valid state. It's only possible to
             * get into an *invalid* state if you're using silent changes.
             * @return {Boolean}
             */
            isValid: function() {
                return !this.validate(this.attributes);
            },

            /**
             * You should not call this function directly unless you subclass
             * <code>Bmob.Object</code>, in which case you can override this method
             * to provide additional validation on <code>set</code> and
             * <code>save</code>.  Your implementation should return
             *
             * @param {Object} attrs The current data to validate.
             * @param {Object} options A Backbone-like options object.
             * @return {} False if the data is valid.  An error object otherwise.
             * @see Bmob.Object#set
             */
            validate: function(attrs, options) {
                if (_.has(attrs, "ACL") && !(attrs.ACL instanceof Bmob.ACL)) {
                    return new Bmob.Error(Bmob.Error.OTHER_CAUSE,
                        "ACL must be a Bmob.ACL.");
                }
                return false;
            },

            /**
             * Run validation against a set of incoming attributes, returning `true`
             * if all is well. If a specific `error` callback has been passed,
             * call that instead of firing the general `"error"` event.
             */
            _validate: function(attrs, options) {
                if (options.silent || !this.validate) {
                    return true;
                }
                attrs = _.extend({}, this.attributes, attrs);
                var error = this.validate(attrs, options);
                if (!error) {
                    return true;
                }
                if (options && options.error) {
                    options.error(this, error, options);
                } else {
                    this.trigger('error', this, error, options);
                }
                return false;
            },

            /**
             * Returns the ACL for this object.
             * @returns {Bmob.ACL} An instance of Bmob.ACL.
             * @see Bmob.Object#get
             */
            getACL: function() {
                return this.get("ACL");
            },

            /**
             * Sets the ACL to be used for this object.
             * @param {Bmob.ACL} acl An instance of Bmob.ACL.
             * @param {Object} options Optional Backbone-like options object to be
             *     passed in to set.
             * @return {Boolean} Whether the set passed validation.
             * @see Bmob.Object#set
             */
            setACL: function(acl, options) {
                return this.set("ACL", acl, options);
            }

        });

    /**
     * Creates an instance of a subclass of Bmob.Object for the give classname
     * and id.
     * @param  {String} className The name of the Bmob class backing this model.
     * @param {String} id The object id of this model.
     * @return {Bmob.Object} A new subclass instance of Bmob.Object.
     */
    Bmob.Object.createWithoutData = function(className, id, hasData){
        var result = new Bmob.Object(className);
        result.id = id
        result._hasData = hasData;
        return result;
    };
    /**
     * Delete objects in batch.The objects className must be the same.
     * @param {Array} The ParseObject array to be deleted.
     * @param {Object} options Standard options object with success and error
     *     callbacks.
     * @return {Bmob.Promise} A promise that is fulfilled when the save
     *     completes.
     */
    Bmob.Object.destroyAll = function(objects, options){
        if(objects == null || objects.length == 0){
            return Bmob.Promise.as()._thenRunCallbacks(options);
        }
        var className = objects[0].className;
        var id = "";
        var wasFirst = true;
        objects.forEach(function(obj){
            if(obj.className != className)
                throw "Bmob.Object.destroyAll requires the argument object array's classNames must be the same";
            if(!obj.id)
                throw "Could not delete unsaved object";
            if(wasFirst){
                id = obj.id;
                wasFirst = false;
            }else{
                id = id + ',' + obj.id;
            }
        });
        var request =
            Bmob._request("classes", className, id, 'DELETE');
        return request._thenRunCallbacks(options);
    };

    /**
     * Returns the appropriate subclass for making new instances of the given
     * className string.
     */
    Bmob.Object._getSubclass = function(className) {
        if (!_.isString(className)) {
            throw "Bmob.Object._getSubclass requires a string argument.";
        }
        var ObjectClass = Bmob.Object._classMap[className];
        if (!ObjectClass) {
            ObjectClass = Bmob.Object.extend(className);
            Bmob.Object._classMap[className] = ObjectClass;
        }
        return ObjectClass;
    };

    /**
     * Creates an instance of a subclass of Bmob.Object for the given classname.
     */
    Bmob.Object._create = function(className, attributes, options) {
        var ObjectClass = Bmob.Object._getSubclass(className);
        return new ObjectClass(attributes, options);
    };

    // Set up a map of className to class so that we can create new instances of
    // Bmob Objects from JSON automatically.
    Bmob.Object._classMap = {};

    Bmob.Object._extend = Bmob._extend;

    /**
     * Creates a new subclass of Bmob.Object for the given Bmob class name.
     *
     * <p>Every extension of a Bmob class will inherit from the most recent
     * previous extension of that class. When a Bmob.Object is automatically
     * created by parsing JSON, it will use the most recent extension of that
     * class.</p>
     *
     * <p>You should call either:<pre>
     *     var MyClass = Bmob.Object.extend("MyClass", {
   *         <i>Instance properties</i>
   *     }, {
   *         <i>Class properties</i>
   *     });</pre>
     * or, for Backbone compatibility:<pre>
     *     var MyClass = Bmob.Object.extend({
   *         className: "MyClass",
   *         <i>Other instance properties</i>
   *     }, {
   *         <i>Class properties</i>
   *     });</pre></p>
     *
     * @param {String} className The name of the Bmob class backing this model.
     * @param {Object} protoProps Instance properties to add to instances of the
     *     class returned from this method.
     * @param {Object} classProps Class properties to add the class returned from
     *     this method.
     * @return {Class} A new subclass of Bmob.Object.
     */
    Bmob.Object.extend = function(className, protoProps, classProps) {
        // Handle the case with only two args.
        if (!_.isString(className)) {
            if (className && _.has(className, "className")) {
                return Bmob.Object.extend(className.className, className, protoProps);
            } else {
                throw new Error(
                    "Bmob.Object.extend's first argument should be the className.");
            }
        }

        // If someone tries to subclass "User", coerce it to the right type.
        if (className === "User") {
            className = "_User";
        }

        var NewClassObject = null;
        if (_.has(Bmob.Object._classMap, className)) {
            var OldClassObject = Bmob.Object._classMap[className];
            // This new subclass has been told to extend both from "this" and from
            // OldClassObject. This is multiple inheritance, which isn't supported.
            // For now, let's just pick one.
            NewClassObject = OldClassObject._extend(protoProps, classProps);
        } else {
            protoProps = protoProps || {};
            protoProps.className = className;
            NewClassObject = this._extend(protoProps, classProps);
        }
        // Extending a subclass should reuse the classname automatically.
        NewClassObject.extend = function(arg0) {
            if (_.isString(arg0) || (arg0 && _.has(arg0, "className"))) {
                return Bmob.Object.extend.apply(NewClassObject, arguments);
            }
            var newArguments = [className].concat(Bmob._.toArray(arguments));
            return Bmob.Object.extend.apply(NewClassObject, newArguments);
        };
        Bmob.Object._classMap[className] = NewClassObject;
        return NewClassObject;
    };

    Bmob.Object._findUnsavedChildren = function(object, children, files) {
        Bmob._traverse(object, function(object) {
            if (object instanceof Bmob.Object) {
                object._refreshCache();
                if (object.dirty()) {
                    children.push(object);
                }
                return;
            }

            if (object instanceof Bmob.File) {
                if (!object.url()) {
                    files.push(object);
                }
                return;
            }
        });
    };

    Bmob.Object._canBeSerializedAsValue = function(object) {
        var canBeSerializedAsValue = true;

        if (object instanceof Bmob.Object) {
            canBeSerializedAsValue = !!object.id;

        } else if (_.isArray(object)) {
            Bmob._arrayEach(object, function(child) {
                if (!Bmob.Object._canBeSerializedAsValue(child)) {
                    canBeSerializedAsValue = false;
                }
            });

        } else if (_.isObject(object)) {
            Bmob._objectEach(object, function(child) {
                if (!Bmob.Object._canBeSerializedAsValue(child)) {
                    canBeSerializedAsValue = false;
                }
            });
        }

        return canBeSerializedAsValue;
    };

    Bmob.Object._deepSaveAsync = function(object) {
        var unsavedChildren = [];
        var unsavedFiles = [];
        Bmob.Object._findUnsavedChildren(object, unsavedChildren, unsavedFiles);

        var promise = Bmob.Promise.as();
        _.each(unsavedFiles, function(file) {
            promise = promise.then(function() {
                return file.save();
            });
        });

        var objects = _.uniq(unsavedChildren);
        var remaining = _.uniq(objects);

        return promise.then(function() {
            return Bmob.Promise._continueWhile(function() {
                return remaining.length > 0;
            }, function() {

                // Gather up all the objects that can be saved in this batch.
                var batch = [];
                var newRemaining = [];
                Bmob._arrayEach(remaining, function(object) {
                    // Limit batches to 20 objects.
                    if (batch.length > 20) {
                        newRemaining.push(object);
                        return;
                    }

                    if (object._canBeSerialized()) {
                        batch.push(object);
                    } else {
                        newRemaining.push(object);
                    }
                });
                remaining = newRemaining;

                // If we can't save any objects, there must be a circular reference.
                if (batch.length === 0) {
                    return Bmob.Promise.error(
                        new Bmob.Error(Bmob.Error.OTHER_CAUSE,
                            "Tried to save a batch with a cycle."));
                }

                // Reserve a spot in every object's save queue.
                var readyToStart = Bmob.Promise.when(_.map(batch, function(object) {
                    return object._allPreviousSaves || Bmob.Promise.as();
                }));
                var batchFinished = new Bmob.Promise();
                Bmob._arrayEach(batch, function(object) {
                    object._allPreviousSaves = batchFinished;
                });

                // Save a single batch, whether previous saves succeeded or failed.
                return readyToStart._continueWith(function() {
                    return Bmob._request("batch", null, null, "POST", {
                        requests: _.map(batch, function(object) {
                            var json = object._getSaveJSON();
                            var method = "POST";

                            var path = "/1/classes/" + object.className;
                            if (object.id) {
                                path = path + "/" + object.id;
                                method = "PUT";
                            }

                            object._startSave();

                            return {
                                method: method,
                                path: path,
                                body: json
                            };
                        })

                    }).then(function(response, status, xhr) {
                        var error;
                        Bmob._arrayEach(batch, function(object, i) {
                            if (response[i].success) {
                                object._finishSave(
                                    object.parse(response[i].success, status, xhr));
                            } else {
                                error = error || response[i].error;
                                object._cancelSave();
                            }
                        });
                        if (error) {
                            return Bmob.Promise.error(
                                new Bmob.Error(error.code, error.error));
                        }

                    }).then(function(results) {
                        batchFinished.resolve(results);
                        return results;
                    }, function(error) {
                        batchFinished.reject(error);
                        return Bmob.Promise.error(error);
                    });
                });
            });
        }).then(function() {
            return object;
        });
    };

}(this));

(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * Bmob.Role aclæƒé™æŽ§åˆ¶ä¸­çš„ç”¨æˆ·è§’è‰²ç±»
     *
     * <p>è§’è‰²å¿…é¡»è¦æœ‰åç§°(åç§°åˆ›å»ºåŽä¸èƒ½ä¿®æ”¹), åŒæ—¶å¿…é¡»æŒ‡å®šACL</p>
     * @class
     * @namespace aclæƒé™æŽ§åˆ¶ä¸­çš„ç”¨æˆ·è§’è‰²ç±»
     */
    Bmob.Role = Bmob.Object.extend("_Role", /** @lends Bmob.Role.prototype */ {
        // Instance Methods

        /**
         * é€šè¿‡åç§°å’ŒACLæž„é€ ä¸€ä¸ªBmobRole
         * @param {String} name åˆ›å»ºroleçš„åç§°
         * @param {Bmob.ACL} acl è¿™ä¸ªè§’è‰²çš„aclï¼Œè§’è‰²å¿…é¡»è¦æœ‰ä¸€ä¸ªACLã€‚
         */
        constructor: function(name, acl) {
            if (_.isString(name) && (acl instanceof Bmob.ACL)) {
                Bmob.Object.prototype.constructor.call(this, null, null);
                this.setName(name);
                this.setACL(acl);
            } else {
                Bmob.Object.prototype.constructor.call(this, name, acl);
            }
        },

        /**
         * èŽ·å–è§’è‰²çš„nameã€‚åŒæ—¶å¯ä»¥ä½¿ç”¨role.get("name")
         * @return {String} è§’è‰²çš„åç§°
         */
        getName: function() {
            return this.get("name");
        },

        /**
         * è®¾ç½®è§’è‰²çš„åç§°ã€‚è¿™ä¸ªå€¼å¿…é¡»è¦åœ¨ä¿å­˜å‰è®¾ç½®ï¼Œè€Œä¸”åªèƒ½è®¾ç½®ä¸€æ¬¡
         * <p>
         *   è§’è‰²çš„åç§°åªèƒ½åŒ…å«æ•°å­—ï¼Œå­—æ¯ï¼Œ _, -ã€‚
         * </p>
         *
         * <p>ç­‰åŒäºŽä½¿ç”¨ role.set("name", name)</p>
         * @param {String} name è§’è‰²çš„åç§°
         * @param {Object} options æ ‡å‡†optionså¯¹è±¡
         */
        setName: function(name, options) {
            return this.set("name", name, options);
        },

        /**
         * èŽ·å–è¿™ä¸ªè§’è‰²å¯¹åº”çš„ç”¨æˆ·Bmob.Usersã€‚è¿™äº›ç”¨æˆ·å·²ç»è¢«åˆ†é…äº†æƒé™ï¼ˆä¾‹å¦‚è¯»å†™çš„æƒé™ï¼‰ã€‚
         * ä½ èƒ½é€šè¿‡relationæ·»åŠ å’Œç§»é™¤è¿™äº›ç”¨æˆ·
         * <p>è¿™ç­‰åŒäºŽä½¿ç”¨ role.relation("users")</p>
         *
         * @return {Bmob.Relation} the relation for the users belonging to this
         *     role.
         */
        getUsers: function() {
            return this.relation("users");
        },

        /**
         * èŽ·å–è¿™ä¸ªè§’è‰²å¯¹åº”çš„è§’è‰²Bmob.Rolesã€‚è¿™äº›ç”¨æˆ·å·²ç»è¢«åˆ†é…äº†æƒé™ï¼ˆä¾‹å¦‚è¯»å†™çš„æƒé™ï¼‰ã€‚
         * ä½ èƒ½é€šè¿‡relationæ·»åŠ å’Œç§»é™¤è¿™äº›ç”¨æˆ·
         * <p>è¿™ç­‰åŒäºŽä½¿ç”¨ role.relation("roles")</p>
         *
         * @return {Bmob.Relation} the relation for the roles belonging to this
         *     role.
         */
        getRoles: function() {
            return this.relation("roles");
        },

        /**
         * @ignore
         */
        validate: function(attrs, options) {
            if ("name" in attrs && attrs.name !== this.getName()) {
                var newName = attrs.name;
                if (this.id && this.id !== attrs.objectId) {
                    // Check to see if the objectId being set matches this.id.
                    // This happens during a fetch -- the id is set before calling fetch.
                    // Let the name be set in this case.
                    return new Bmob.Error(Bmob.Error.OTHER_CAUSE,
                        "A role's name can only be set before it has been saved.");
                }
                if (!_.isString(newName)) {
                    return new Bmob.Error(Bmob.Error.OTHER_CAUSE,
                        "A role's name must be a String.");
                }
                if (!(/^[0-9a-zA-Z\-_ ]+$/).test(newName)) {
                    return new Bmob.Error(Bmob.Error.OTHER_CAUSE,
                        "A role's name can only contain alphanumeric characters, _," +
                        " -, and spaces.");
                }
            }
            if (Bmob.Object.prototype.validate) {
                return Bmob.Object.prototype.validate.call(this, attrs, options);
            }
            return false;
        }
    });
}(this));


/*global _: false */
(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     *åˆ›å»ºmodelå’Œoptionsçš„å®žä½“ã€‚ç‰¹åˆ«åœ°ï¼Œä½ ä¸ä¼šç›´æŽ¥è°ƒç”¨è¿™ä¸ªæ–¹æ³•ï¼Œä½ ä¼š<code>Bmob.Collection.extend</code>é€šè¿‡åˆ›å»ºä¸€*ä¸ªå­ç±»ã€‚
     * @param {Array} <code>Bmob.Object</code>æ•°ç»„.
     *
     * @param {Object} options  Backbone-style options çš„å¯é€‰options object.
     * æœ‰æ•ˆçš„ options<ul>
     *   <li>model: Bmob.Object
     *   <li>query: Bmob.Query
     *   <li>comparator: å±žæ€§åç§°æˆ–æŽ’åºå‡½æ•°
     * </ul>
     *
     * @see Bmob.Collection.extend
     *
     *
     * <p>æä¾›æ ‡å‡†çš„ collection classã€‚ æ›´è¯¦ç»†çš„ä¿¡æ¯è¯·çœ‹
     * <a href="http://documentcloud.github.com/backbone/#Collection">Backbone
     * documentation</a>.</p>
     */
    Bmob.Collection = function(models, options) {
        options = options || {};
        if (options.comparator) {
            this.comparator = options.comparator;
        }
        if (options.model) {
            this.model = options.model;
        }
        if (options.query) {
            this.query = options.query;
        }
        this._reset();
        this.initialize.apply(this, arguments);
        if (models) {
            this.reset(models, {silent: true, parse: options.parse});
        }
    };

    // Define the Collection's inheritable methods.
    _.extend(Bmob.Collection.prototype, Bmob.Events,
        /** @lends Bmob.Collection.prototype */ {

            // The default model for a collection is just a Bmob.Object.
            // This should be overridden in most cases.

            model: Bmob.Object,

            /**
             * Initialize é»˜è®¤æ˜¯ç©ºå‡½æ•°. è¯·æ ¹æ®è‡ªèº«çš„é€»è¾‘é‡å†™è¿™ä¸ªæ–¹æ³•
             */
            initialize: function(){},

            /**
             *
             * json æ ¼å¼çš„models'å±žæ€§æ•°ç»„
             */
            toJSON: function() {
                return this.map(function(model){ return model.toJSON(); });
            },

            /**
             * æ·»åŠ modelï¼Œæˆ–è€…ä¸€ç³»åˆ—çš„å¯¹è±¡é›†åˆã€‚ä¼ å…¥**silent**é¿å…è§¦å‘`add`äº‹ä»¶ã€‚
             */
            add: function(models, options) {
                var i, index, length, model, cid, id, cids = {}, ids = {};
                options = options || {};
                models = _.isArray(models) ? models.slice() : [models];

                // Begin by turning bare objects into model references, and preventing
                // invalid models or duplicate models from being added.
                for (i = 0, length = models.length; i < length; i++) {
                    models[i] = this._prepareModel(models[i], options);
                    model = models[i];
                    if (!model) {
                        throw new Error("Can't add an invalid model to a collection");
                    }
                    cid = model.cid;
                    if (cids[cid] || this._byCid[cid]) {
                        throw new Error("Duplicate cid: can't add the same model " +
                            "to a collection twice");
                    }
                    id = model.id;
                    if (!Bmob._isNullOrUndefined(id) && (ids[id] || this._byId[id])) {
                        throw new Error("Duplicate id: can't add the same model " +
                            "to a collection twice");
                    }
                    ids[id] = model;
                    cids[cid] = model;
                }

                // Listen to added models' events, and index models for lookup by
                // `id` and by `cid`.
                for (i = 0; i < length; i++) {
                    (model = models[i]).on('all', this._onModelEvent, this);
                    this._byCid[model.cid] = model;
                    if (model.id) {
                        this._byId[model.id] = model;
                    }
                }

                // Insert models into the collection, re-sorting if needed, and triggering
                // `add` events unless silenced.
                this.length += length;
                index = Bmob._isNullOrUndefined(options.at) ?
                    this.models.length : options.at;
                this.models.splice.apply(this.models, [index, 0].concat(models));
                if (this.comparator) {
                    this.sort({silent: true});
                }
                if (options.silent) {
                    return this;
                }
                for (i = 0, length = this.models.length; i < length; i++) {
                    model = this.models[i];
                    if (cids[model.cid]) {
                        options.index = i;
                        model.trigger('add', model, this, options);
                    }
                }
                return this;
            },

            /**
             * ç§»é™¤ä¸€ä¸ªmodelï¼Œæˆ–è€…ä»Žé›†åˆä¸­ç§»é™¤ä¸€ç³»åˆ—modelsã€‚å½“ç§»é™¤å¯¹è±¡æ—¶ï¼Œä¼ å…¥silenté¿å…è§¦å‘<code>remove</code>äº‹ä»¶ã€‚
             */
            remove: function(models, options) {
                var i, l, index, model;
                options = options || {};
                models = _.isArray(models) ? models.slice() : [models];
                for (i = 0, l = models.length; i < l; i++) {
                    model = this.getByCid(models[i]) || this.get(models[i]);
                    if (!model) {
                        continue;
                    }
                    delete this._byId[model.id];
                    delete this._byCid[model.cid];
                    index = this.indexOf(model);
                    this.models.splice(index, 1);
                    this.length--;
                    if (!options.silent) {
                        options.index = index;
                        model.trigger('remove', model, this, options);
                    }
                    this._removeReference(model);
                }
                return this;
            },

            /**
             * é€šè¿‡idèŽ·å–ä¸€ä¸ªmodel
             */
            get: function(id) {
                return id && this._byId[id.id || id];
            },

            /**
             * é€šè¿‡client idèŽ·å–ä¸€ä¸ªmodel
             */
            getByCid: function(cid) {
                return cid && this._byCid[cid.cid || cid];
            },

            /**
             * é€šè¿‡ä¸‹æ ‡èŽ·å–ä¸€ä¸ªmodel
             */
            at: function(index) {
                return this.models[index];
            },

            /**
             * å¼ºåˆ¶collectionå¯¹è‡ªèº«çš„å…ƒç´ è¿›è¡Œé‡æ–°æŽ’åºã€‚ä¸€èˆ¬æƒ…å†µä¸‹ä½ ä¸éœ€è¦è°ƒç”¨è¿™ä¸ªå‡½æ•°ï¼Œå› ä¸ºå½“æ·»åŠ å¯¹è±¡æ—¶è¿™ä¸ªå‡½æ•°ä¼šè‡ªåŠ¨è°ƒç”¨
             */
            sort: function(options) {
                options = options || {};
                if (!this.comparator) {
                    throw new Error('Cannot sort a set without a comparator');
                }
                var boundComparator = _.bind(this.comparator, this);
                if (this.comparator.length === 1) {
                    this.models = this.sortBy(boundComparator);
                } else {
                    this.models.sort(boundComparator);
                }
                if (!options.silent) {
                    this.trigger('reset', this, options);
                }
                return this;
            },

            /**
             * é‡‡é›†é›†åˆä¸­æ¯ä¸ªå¯¹è±¡çš„å±žæ€§
             */
            pluck: function(attr) {
                return _.map(this.models, function(model){ return model.get(attr); });
            },

            /**
             * When you have more items than you want to add or remove individually,
             * you can reset the entire set with a new list of models, without firing
             * any `add` or `remove` events. Fires `reset` when finished.
             */
            reset: function(models, options) {
                var self = this;
                models = models || [];
                options = options || {};
                Bmob._arrayEach(this.models, function(model) {
                    self._removeReference(model);
                });
                this._reset();
                this.add(models, {silent: true, parse: options.parse});
                if (!options.silent) {
                    this.trigger('reset', this, options);
                }
                return this;
            },

            /**
             * Fetches the default set of models for this collection, resetting the
             * collection when they arrive. If `add: true` is passed, appends the
             * models to the collection instead of resetting.
             */
            fetch: function(options) {
                options = _.clone(options) || {};
                if (options.parse === undefined) {
                    options.parse = true;
                }
                var collection = this;
                var query = this.query || new Bmob.Query(this.model);
                return query.find().then(function(results) {
                    if (options.add) {
                        collection.add(results, options);
                    } else {
                        collection.reset(results, options);
                    }
                    return collection;
                })._thenRunCallbacks(options, this);
            },

            /**
             * Creates a new instance of a model in this collection. Add the model to
             * the collection immediately, unless `wait: true` is passed, in which case
             * we wait for the server to agree.
             */
            create: function(model, options) {
                var coll = this;
                options = options ? _.clone(options) : {};
                model = this._prepareModel(model, options);
                if (!model) {
                    return false;
                }
                if (!options.wait) {
                    coll.add(model, options);
                }
                var success = options.success;
                options.success = function(nextModel, resp, xhr) {
                    if (options.wait) {
                        coll.add(nextModel, options);
                    }
                    if (success) {
                        success(nextModel, resp);
                    } else {
                        nextModel.trigger('sync', model, resp, options);
                    }
                };
                model.save(null, options);
                return model;
            },

            /**
             * Converts a response into a list of models to be added to the collection.
             * The default implementation is just to pass it through.
             * @ignore
             */
            parse: function(resp, xhr) {
                return resp;
            },

            /**
             * Proxy to _'s chain. Can't be proxied the same way the rest of the
             * underscore methods are proxied because it relies on the underscore
             * constructor.
             */
            chain: function() {
                return _(this.models).chain();
            },

            /**
             * Reset all internal state. Called when the collection is reset.
             */
            _reset: function(options) {
                this.length = 0;
                this.models = [];
                this._byId  = {};
                this._byCid = {};
            },

            /**
             * Prepare a model or hash of attributes to be added to this collection.
             */
            _prepareModel: function(model, options) {
                if (!(model instanceof Bmob.Object)) {
                    var attrs = model;
                    options.collection = this;
                    model = new this.model(attrs, options);
                    if (!model._validate(model.attributes, options)) {
                        model = false;
                    }
                } else if (!model.collection) {
                    model.collection = this;
                }
                return model;
            },

            /**
             * Internal method to remove a model's ties to a collection.
             */
            _removeReference: function(model) {
                if (this === model.collection) {
                    delete model.collection;
                }
                model.off('all', this._onModelEvent, this);
            },

            /**
             * Internal method called every time a model in the set fires an event.
             * Sets need to update their indexes when models change ids. All other
             * events simply proxy through. "add" and "remove" events that originate
             * in other collections are ignored.
             */
            _onModelEvent: function(ev, model, collection, options) {
                if ((ev === 'add' || ev === 'remove') && collection !== this) {
                    return;
                }
                if (ev === 'destroy') {
                    this.remove(model, options);
                }
                if (model && ev === 'change:objectId') {
                    delete this._byId[model.previous("objectId")];
                    this._byId[model.id] = model;
                }
                this.trigger.apply(this, arguments);
            }

        });

    // Underscore methods that we want to implement on the Collection.
    var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
        'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
        'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
        'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
        'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

    // Mix in each Underscore method as a proxy to `Collection#models`.
    Bmob._arrayEach(methods, function(method) {
        Bmob.Collection.prototype[method] = function() {
            return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
        };
    });

    /**
     * Creates a new subclass of <code>Bmob.Collection</code>.  For example,<pre>
     *   var MyCollection = Bmob.Collection.extend({
   *     // Instance properties
   *
   *     model: MyClass,
   *     query: MyQuery,
   *
   *     getFirst: function() {
   *       return this.at(0);
   *     }
   *   }, {
   *     // Class properties
   *
   *     makeOne: function() {
   *       return new MyCollection();
   *     }
   *   });
     *
     *   var collection = new MyCollection();
     * </pre>
     *
     * @function
     * @param {Object} instanceProps Instance properties for the collection.
     * @param {Object} classProps Class properies for the collection.
     * @return {Class} A new subclass of <code>Bmob.Collection</code>.
     */
    Bmob.Collection.extend = Bmob._extend;

}(this));

/*global _: false, document: false */
(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * Creating a Bmob.View creates its initial element outside of the DOM,
     * if an existing element is not provided...
     *
     * <p>A fork of Backbone.View, provided for your convenience.  If you use this
     * class, you must also include jQuery, or another library that provides a
     * jQuery-compatible $ function.  For more information, see the
     * <a href="http://documentcloud.github.com/backbone/#View">Backbone
     * documentation</a>.</p>
     * <p><strong><em>Available in the client SDK only.</em></strong></p>
     */
    Bmob.View = function(options) {
        this.cid = _.uniqueId('view');
        this._configure(options || {});
        this._ensureElement();
        this.initialize.apply(this, arguments);
        this.delegateEvents();
    };

    // Cached regex to split keys for `delegate`.
    var eventSplitter = /^(\S+)\s*(.*)$/;

    // List of view options to be merged as properties.

    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes',
        'className', 'tagName'];

    // Set up all inheritable **Bmob.View** properties and methods.
    _.extend(Bmob.View.prototype, Bmob.Events,
        /** @lends Bmob.View.prototype */ {

            // The default `tagName` of a View's element is `"div"`.
            tagName: 'div',

            /**
             * jQuery delegate for element lookup, scoped to DOM elements within the
             * current view. This should be prefered to global lookups where possible.
             */
            $: function(selector) {
                return this.$el.find(selector);
            },

            /**
             * Initialize is an empty function by default. Override it with your own
             * initialization logic.
             */
            initialize: function(){},

            /**
             * The core function that your view should override, in order
             * to populate its element (`this.el`), with the appropriate HTML. The
             * convention is for **render** to always return `this`.
             */
            render: function() {
                return this;
            },

            /**
             * Remove this view from the DOM. Note that the view isn't present in the
             * DOM by default, so calling this method may be a no-op.
             */
            remove: function() {
                this.$el.remove();
                return this;
            },

            /**
             * For small amounts of DOM Elements, where a full-blown template isn't
             * needed, use **make** to manufacture elements, one at a time.
             * <pre>
             *     var el = this.make('li', {'class': 'row'},
             *                        this.model.escape('title'));</pre>
             */
            make: function(tagName, attributes, content) {
                var el = document.createElement(tagName);
                if (attributes) {
                    Bmob.$(el).attr(attributes);
                }
                if (content) {
                    Bmob.$(el).html(content);
                }
                return el;
            },

            /**
             * Changes the view's element (`this.el` property), including event
             * re-delegation.
             */
            setElement: function(element, delegate) {
                this.$el = Bmob.$(element);
                this.el = this.$el[0];
                if (delegate !== false) {
                    this.delegateEvents();
                }
                return this;
            },

            /**
             * Set callbacks.  <code>this.events</code> is a hash of
             * <pre>
             * *{"event selector": "callback"}*
             *
             *     {
     *       'mousedown .title':  'edit',
     *       'click .button':     'save'
     *       'click .open':       function(e) { ... }
     *     }
             * </pre>
             * pairs. Callbacks will be bound to the view, with `this` set properly.
             * Uses event delegation for efficiency.
             * Omitting the selector binds the event to `this.el`.
             * This only works for delegate-able events: not `focus`, `blur`, and
             * not `change`, `submit`, and `reset` in Internet Explorer.
             */
            delegateEvents: function(events) {
                events = events || Bmob._getValue(this, 'events');
                if (!events) {
                    return;
                }
                this.undelegateEvents();
                var self = this;
                Bmob._objectEach(events, function(method, key) {
                    if (!_.isFunction(method)) {
                        method = self[events[key]];
                    }
                    if (!method) {
                        throw new Error('Event "' + events[key] + '" does not exist');
                    }
                    var match = key.match(eventSplitter);
                    var eventName = match[1], selector = match[2];
                    method = _.bind(method, self);
                    eventName += '.delegateEvents' + self.cid;
                    if (selector === '') {
                        self.$el.bind(eventName, method);
                    } else {
                        self.$el.delegate(selector, eventName, method);
                    }
                });
            },

            /**
             * Clears all callbacks previously bound to the view with `delegateEvents`.
             * You usually don't need to use this, but may wish to if you have multiple
             * Backbone views attached to the same DOM element.
             */
            undelegateEvents: function() {
                this.$el.unbind('.delegateEvents' + this.cid);
            },

            /**
             * Performs the initial configuration of a View with a set of options.
             * Keys with special meaning *(model, collection, id, className)*, are
             * attached directly to the view.
             */
            _configure: function(options) {
                if (this.options) {
                    options = _.extend({}, this.options, options);
                }
                var self = this;
                _.each(viewOptions, function(attr) {
                    if (options[attr]) {
                        self[attr] = options[attr];
                    }
                });
                this.options = options;
            },

            /**
             * Ensure that the View has a DOM element to render into.
             * If `this.el` is a string, pass it through `$()`, take the first
             * matching element, and re-assign it to `el`. Otherwise, create
             * an element from the `id`, `className` and `tagName` properties.
             */
            _ensureElement: function() {
                if (!this.el) {
                    var attrs = Bmob._getValue(this, 'attributes') || {};
                    if (this.id) {
                        attrs.id = this.id;
                    }
                    if (this.className) {
                        attrs['class'] = this.className;
                    }
                    this.setElement(this.make(this.tagName, attrs), false);
                } else {
                    this.setElement(this.el, false);
                }
            }

        });

    /**
     * @function
     * @param {Object} instanceProps Instance properties for the view.
     * @param {Object} classProps Class properies for the view.
     * @return {Class} A new subclass of <code>Bmob.View</code>.
     */
    Bmob.View.extend = Bmob._extend;

}(this));

(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * @class
     *
     * <p>è¿™ä¸ªç±»æ˜¯Bmob.Objectçš„å­ç±»ï¼ŒåŒæ—¶æ‹¥æœ‰Bmob.Objectçš„æ‰€æœ‰å‡½æ•°ï¼Œä½†æ˜¯æ‰©å±•äº†ç”¨æˆ·çš„ç‰¹æ®Šå‡½æ•°ï¼Œä¾‹å¦‚éªŒè¯ï¼Œç™»å½•ç­‰</p>
     */
    Bmob.User = Bmob.Object.extend("_User", /** @lends Bmob.User.prototype */ {
        // Instance Variables
        _isCurrentUser: false,


        // Instance Methods

        /**
         * Internal method to handle special fields in a _User response.
         */
        _mergeMagicFields: function(attrs) {
            if (attrs.sessionToken) {
                this._sessionToken = attrs.sessionToken;
                delete attrs.sessionToken;
            }
            Bmob.User.__super__._mergeMagicFields.call(this, attrs);
        },

        /**
         * Removes null values from authData (which exist temporarily for
         * unlinking)
         */
        _cleanupAuthData: function() {
            if (!this.isCurrent()) {
                return;
            }
            var authData = this.get('authData');
            if (!authData) {
                return;
            }
            Bmob._objectEach(this.get('authData'), function(value, key) {
                if (!authData[key]) {
                    delete authData[key];
                }
            });
        },

        /**
         * Synchronizes authData for all providers.
         */
        _synchronizeAllAuthData: function() {
            var authData = this.get('authData');
            if (!authData) {
                return;
            }

            var self = this;
            Bmob._objectEach(this.get('authData'), function(value, key) {
                self._synchronizeAuthData(key);
            });
        },

        /**
         * Synchronizes auth data for a provider (e.g. puts the access token in the
         * right place to be used by the Facebook SDK).
         */
        _synchronizeAuthData: function(provider) {
            if (!this.isCurrent()) {
                return;
            }
            var authType;
            if (_.isString(provider)) {
                authType = provider;
                provider = Bmob.User._authProviders[authType];
            } else {
                authType = provider.getAuthType();
            }
            var authData = this.get('authData');
            if (!authData || !provider) {
                return;
            }
            var success = provider.restoreAuthentication(authData[authType]);
            if (!success) {
                this._unlinkFrom(provider);
            }
        },

        _handleSaveResult: function(makeCurrent) {
            // Clean up and synchronize the authData object, removing any unset values
            if (makeCurrent) {
                this._isCurrentUser = true;
            }
            this._cleanupAuthData();
            this._synchronizeAllAuthData();
            // Don't keep the password around.
            delete this._serverData.password;
            this._rebuildEstimatedDataForKey("password");
            this._refreshCache();
            if (makeCurrent || this.isCurrent()) {
                Bmob.User._saveCurrentUser(this);
            }
        },

        /**
         * Unlike in the Android/iOS SDKs, logInWith is unnecessary, since you can
         * call linkWith on the user (even if it doesn't exist yet on the server).
         */
        _linkWith: function(provider, options) {
            var authType;
            if (_.isString(provider)) {
                authType = provider;
                provider = Bmob.User._authProviders[provider];
            } else {
                authType = provider.getAuthType();
            }
            if (_.has(options, 'authData')) {
                var authData = this.get('authData') || {};
                authData[authType] = options.authData;
                this.set('authData', authData);

                // Overridden so that the user can be made the current user.
                var newOptions = _.clone(options) || {};
                newOptions.success = function(model) {
                    model._handleSaveResult(true);
                    if (options.success) {
                        options.success.apply(this, arguments);
                    }
                };
                return this.save({'authData': authData}, newOptions);
            } else {
                var self = this;
                var promise = new Bmob.Promise();
                provider.authenticate({
                    success: function(provider, result) {
                        self._linkWith(provider, {
                            authData: result,
                            success: options.success,
                            error: options.error
                        }).then(function() {
                            promise.resolve(self);
                        });
                    },
                    error: function(provider, error) {
                        if (options.error) {
                            options.error(self, error);
                        }
                        promise.reject(error);
                    }
                });
                return promise;
            }
        },

        /**
         * Unlinks a user from a service.
         */
        _unlinkFrom: function(provider, options) {
            var authType;
            if (_.isString(provider)) {
                authType = provider;
                provider = Bmob.User._authProviders[provider];
            } else {
                authType = provider.getAuthType();
            }
            var newOptions = _.clone(options);
            var self = this;
            newOptions.authData = null;
            newOptions.success = function(model) {
                self._synchronizeAuthData(provider);
                if (options.success) {
                    options.success.apply(this, arguments);
                }
            };
            return this._linkWith(provider, newOptions);
        },

        /**
         * Checks whether a user is linked to a service.
         */
        _isLinked: function(provider) {
            var authType;
            if (_.isString(provider)) {
                authType = provider;
            } else {
                authType = provider.getAuthType();
            }
            var authData = this.get('authData') || {};
            return !!authData[authType];
        },

        /**
         * Deauthenticates all providers.
         */
        _logOutWithAll: function() {
            var authData = this.get('authData');
            if (!authData) {
                return;
            }
            var self = this;
            Bmob._objectEach(this.get('authData'), function(value, key) {
                self._logOutWith(key);
            });
        },

        /**
         * Deauthenticates a single provider (e.g. removing access tokens from the
         * Facebook SDK).
         */
        _logOutWith: function(provider) {
            if (!this.isCurrent()) {
                return;
            }
            if (_.isString(provider)) {
                provider = Bmob.User._authProviders[provider];
            }
            if (provider && provider.deauthenticate) {
                provider.deauthenticate();
            }
        },

        /**
         * æ³¨å†Œä¸€ä¸ªæ–°ç”¨æˆ·ã€‚å½“åˆ›å»ºä¸€ä¸ªæ–°ç”¨æˆ·æ—¶ï¼Œåº”è¯¥è°ƒç”¨è¿™ä¸ªæ–¹æ³•è€Œä¸æ˜¯saveæ–¹æ³•ã€‚è¿™ä¸ªæ–¹æ³•ä¼šåˆ›å»º
         * ä¸€ä¸ªæ–°çš„Bmob.Useråœ¨æœåŠ¡å™¨ä¸Šï¼ŒåŒæ—¶ä¿å­˜sessionåœ¨æœ¬åœ°ç£ç›˜å› æ­¤ä½ å¯ä»¥é€šè¿‡<code>current</code>è®¿é—®user
         * <p>åœ¨æ³¨å†Œå‰å¿…é¡»è®¾ç½®usernameå’Œpassword</p>
         * <p>å®ŒæˆåŽè°ƒç”¨options.success æˆ–è€… options.error</p>
         *
         * @param {Object} attrs ç”¨æˆ·çš„é¢å¤–çš„å±žæ€§ï¼Œæˆ–è€…null
         * @param {Object} options Backbone-style options å¯¹è±¡ã€‚
         * @return {Bmob.Promise} å½“è°ƒç”¨ç»“æŸå°†ä¼šè¿”å›žpromiseã€‚
         * @see Bmob.User.signUp
         */
        signUp: function(attrs, options) {
            var error;
            options = options || {};

            var username = (attrs && attrs.username) || this.get("username");
            if (!username || (username === "")) {
                error = new Bmob.Error(
                    Bmob.Error.OTHER_CAUSE,
                    "Cannot sign up user with an empty name.");
                if (options && options.error) {
                    options.error(this, error);
                }
                return Bmob.Promise.error(error);
            }

            var password = (attrs && attrs.password) || this.get("password");
            if (!password || (password === "")) {
                error = new Bmob.Error(
                    Bmob.Error.OTHER_CAUSE,
                    "Cannot sign up user with an empty password.");
                if (options && options.error) {
                    options.error(this, error);
                }
                return Bmob.Promise.error(error);
            }

            // Overridden so that the user can be made the current user.
            var newOptions = _.clone(options);
            newOptions.success = function(model) {
                model._handleSaveResult(true);
                if (options.success) {
                    options.success.apply(this, arguments);
                }
            };
            return this.save(attrs, newOptions);
        },

        /**
         * ç”¨æˆ·ç™»å½•ã€‚å½“ç™»å½•æˆåŠŸï¼Œå°†ä¼šä¿å­˜sessionåœ¨æœ¬åœ°ï¼Œå¯ä»¥é€šè¿‡<code>current</code>èŽ·å–ç”¨æˆ·å¯¹è±¡ã€‚
         * <p>åœ¨æ³¨å†Œå‰å¿…é¡»è®¾ç½®usernameå’Œpassword</p>
         * <p>å®ŒæˆåŽè°ƒç”¨options.success æˆ–è€… options.error</p>
         *
         * @param {Object} options  Backbone-style options å¯¹è±¡ã€‚
         * @see Bmob.User.logIn
         * @return {Bmob.Promise} å½“è°ƒç”¨ç»“æŸå°†ä¼šè¿”å›žpromiseã€‚
         */
        logIn: function(options) {
            var model = this;
            var request = Bmob._request("login", null, null, "GET", this.toJSON());
            return request.then(function(resp, status, xhr) {
                var serverAttrs = model.parse(resp, status, xhr);
                model._finishFetch(serverAttrs);
                model._handleSaveResult(true);
                return model;
            })._thenRunCallbacks(options, this);
        },

        /**
         * ä¿å­˜å¯¹è±¡
         * @see Bmob.Object#save
         */
        save: function(arg1, arg2, arg3) {
            var i, attrs, current, options, saved;
            if (_.isObject(arg1) || _.isNull(arg1) || _.isUndefined(arg1)) {
                attrs = arg1;
                options = arg2;
            } else {
                attrs = {};
                attrs[arg1] = arg2;
                options = arg3;
            }
            options = options || {};

            var newOptions = _.clone(options);
            newOptions.success = function(model) {
                model._handleSaveResult(false);
                if (options.success) {
                    options.success.apply(this, arguments);
                }
            };
            return Bmob.Object.prototype.save.call(this, attrs, newOptions);
        },


        /**
         * èŽ·å–ä¸€ä¸ªå¯¹è±¡
         * @see Bmob.Object#fetch
         */
        fetch: function(options) {
            var newOptions = options ? _.clone(options) : {};
            newOptions.success = function(model) {
                model._handleSaveResult(false);
                if (options && options.success) {
                    options.success.apply(this, arguments);
                }
            };
            return Bmob.Object.prototype.fetch.call(this, newOptions);
        },

        /**
         * è¿”å›žtrue å¦‚æžœ<code>current</code>å¯ä»¥è¿”å›žè¿™ä¸ªuserã€‚
         * @see Bmob.User#cu ä½ ä¸èƒ½æ·»åŠ ä¸€ä¸ªæ²¡ä¿å­˜çš„Bmob.Objectåˆ°å…³ç³»ä¸­
         */
        isCurrent: function() {
            return this._isCurrentUser;
        },

        /**
         * è¿”å›ž get("username").
         * @return {String}
         * @see Bmob.Object#get
         */
        getUsername: function() {
            return this.get("username");
        },

        /**
         * è°ƒç”¨ set("username", username, options) åŒæ—¶è¿”å›žç»“æžœ
         * @param {String} username
         * @param {Object} options Backbone-style options å¯¹è±¡ã€‚
         * @return {Boolean}
         * @see Bmob.Object.set
         */
        setUsername: function(username, options) {
            return this.set("username", username, options);
        },

        /**
         * è°ƒç”¨ set("password", password, options) åŒæ—¶è¿”å›žç»“æžœ
         * @param {String} password
         * @param {Object} options Backbone-style options å¯¹è±¡ã€‚
         * @return {Boolean}
         * @see Bmob.Object.set
         */
        setPassword: function(password, options) {
            return this.set("password", password, options);
        },

        /**
         * è¿”å›ž get("email").
         * @return {String}
         * @see Bmob.Object#get
         */
        getEmail: function() {
            return this.get("email");
        },

        /**
         * è°ƒç”¨ set("email", email, options) åŒæ—¶è¿”å›žç»“æžœ
         * @param {String} email
         * @param {Object} options Backbone-style options å¯¹è±¡ã€‚
         * @return {Boolean}
         * @see Bmob.Object.set
         */
        setEmail: function(email, options) {
            return this.set("email", email, options);
        },

        /**
         * æ£€æŸ¥è¿™ä¸ªç”¨æˆ·æ˜¯å¦å½“å‰ç”¨æˆ·å¹¶ä¸”å·²ç»ç™»å½•ã€‚
         * @return (Boolean) è¿™ä¸ªç”¨æˆ·æ˜¯å¦å½“å‰ç”¨æˆ·å¹¶ä¸”å·²ç»ç™»å½•ã€‚
         */
        authenticated: function() {
            return !!this._sessionToken &&
                (Bmob.User.current() && Bmob.User.current().id === this.id);
        }

    }, /** @lends Bmob.User */ {
        // Class Variables

        // The currently logged-in user.
        _currentUser: null,

        // Whether currentUser is known to match the serialized version on disk.
        // This is useful for saving a localstorage check if you try to load
        // _currentUser frequently while there is none stored.
        _currentUserMatchesDisk: false,

        // The localStorage key suffix that the current user is stored under.
        _CURRENT_USER_KEY: "currentUser",

        // The mapping of auth provider names to actual providers
        _authProviders: {},


        // Class Methods

        /**
         * æ³¨å†Œä¸€ä¸ªæ–°ç”¨æˆ·ã€‚å½“åˆ›å»ºä¸€ä¸ªæ–°ç”¨æˆ·æ—¶ï¼Œåº”è¯¥è°ƒç”¨è¿™ä¸ªæ–¹æ³•è€Œä¸æ˜¯saveæ–¹æ³•ã€‚è¿™ä¸ªæ–¹æ³•ä¼šåˆ›å»º
         * ä¸€ä¸ªæ–°çš„Bmob.Useråœ¨æœåŠ¡å™¨ä¸Šï¼ŒåŒæ—¶ä¿å­˜sessionåœ¨æœ¬åœ°ç£ç›˜å› æ­¤ä½ å¯ä»¥é€šè¿‡<code>current</code>è®¿é—®user
         *
         * <p>å®ŒæˆåŽè°ƒç”¨options.success æˆ–è€… options.error</p>
         *
         * @param {String} username æ³¨å†Œçš„ç”¨æˆ·åæˆ–email
         * @param {String} password æ³¨å†Œçš„å¯†ç 
         * @param {Object} attrs æ–°ç”¨æˆ·æ‰€éœ€è¦çš„é¢å¤–æ•°æ®
         * @param {Object} options Backbone-style options å¯¹è±¡ã€‚
         * @return {Bmob.Promise} å½“è°ƒç”¨ç»“æŸå°†ä¼šè¿”å›žpromiseã€‚
         * @see Bmob.User#signUp
         */
        signUp: function(username, password, attrs, options) {
            attrs = attrs || {};
            attrs.username = username;
            attrs.password = password;
            var user = Bmob.Object._create("_User");
            return user.signUp(attrs, options);
        },

        /**
         * ç”¨æˆ·ç™»å½•ã€‚å½“ç™»å½•æˆåŠŸï¼Œå°†ä¼šä¿å­˜sessionåœ¨æœ¬åœ°ï¼Œå¯ä»¥é€šè¿‡<code>current</code>èŽ·å–ç”¨æˆ·å¯¹è±¡ã€‚
         *
         * <p>å®ŒæˆåŽè°ƒç”¨options.success æˆ–è€… options.error</p>
         *
         * @param {String} username æ³¨å†Œçš„ç”¨æˆ·åæˆ–email
         * @param {String} password æ³¨å†Œçš„å¯†ç 
         * @param {Object} options æ–°ç”¨æˆ·æ‰€éœ€è¦çš„é¢å¤–æ•°æ®
         * @return {Bmob.Promise} Backbone-style options å¯¹è±¡ã€‚
         * @see Bmob.User#logIn
         */
        logIn: function(username, password, options) {
            var user = Bmob.Object._create("_User");
            user._finishFetch({ username: username, password: password });
            return user.logIn(options);
        },

        /**
         * é€€å‡ºå½“å‰ç™»å½•çš„ç”¨æˆ·ã€‚ç£ç›˜ä¸­çš„sessionå°†ä¼šè¢«ç§»é™¤ï¼Œè°ƒç”¨<code>current</code>å°†ä¼š
         * è¿”å›ž<code>null</code>ã€‚
         */
        logOut: function() {
            if (Bmob.User._currentUser !== null) {
                Bmob.User._currentUser._logOutWithAll();
                Bmob.User._currentUser._isCurrentUser = false;
            }
            Bmob.User._currentUserMatchesDisk = true;
            Bmob.User._currentUser = null;
            Bmob.localStorage.removeItem(
                Bmob._getBmobPath(Bmob.User._CURRENT_USER_KEY));
        },


        /**

         * æŠŠé‡è®¾å¯†ç çš„é‚®ä»¶å‘é€åˆ°ç”¨æˆ·çš„æ³¨å†Œé‚®ç®±ã€‚é‚®ä»¶å…è®¸ç”¨æˆ·åœ¨bmobç½‘ç«™ä¸Šé‡è®¾å¯†ç ã€‚
         * <p>å®ŒæˆåŽè°ƒç”¨options.success æˆ–è€… options.error</p>
         *
         * @param {String} email ç”¨æˆ·æ³¨å†Œçš„é‚®ç®±
         * @param {Object} options Backbone-style options å¯¹è±¡ã€‚
         */
        requestPasswordReset: function(email, options) {
            var json = { email: email };
            var request = Bmob._request("requestPasswordReset", null, null, "POST",
                json);
            return request._thenRunCallbacks(options);
        },

        /**
         * è¯·æ±‚éªŒè¯email
         * <p>å®ŒæˆåŽè°ƒç”¨options.success æˆ–è€… options.error</p>
         *
         * @param {String} email éœ€è¦éªŒè¯emailçš„emailçš„åœ°å€
         * @param {Object} options Backbone-style options å¯¹è±¡ã€‚
         */
        requestEmailVerify: function(email, options) {
            var json = { email: email };
            var request = Bmob._request("requestEmailVerify", null, null, "POST",
                json);
            return request._thenRunCallbacks(options);
        },

        /**
         * è¿”å›žå½“å‰å·²ç»ç™»é™†çš„ç”¨æˆ·ã€‚
         * @return {Bmob.Object} å·²ç»ç™»å½•çš„Bmob.User.
         */
        current: function() {
            if (Bmob.User._currentUser) {
                return Bmob.User._currentUser;
            }

            if (Bmob.User._currentUserMatchesDisk) {

                return Bmob.User._currentUser;
            }

            // Load the user from local storage.
            Bmob.User._currentUserMatchesDisk = true;

            var userData = Bmob.localStorage.getItem(Bmob._getBmobPath(
                Bmob.User._CURRENT_USER_KEY));
            if (!userData) {

                return null;
            }
            Bmob.User._currentUser = Bmob.Object._create("_User");
            Bmob.User._currentUser._isCurrentUser = true;

            var json = JSON.parse(userData);
            Bmob.User._currentUser.id = json._id;
            delete json._id;
            Bmob.User._currentUser._sessionToken = json._sessionToken;
            delete json._sessionToken;
            Bmob.User._currentUser.set(json);

            Bmob.User._currentUser._synchronizeAllAuthData();
            Bmob.User._currentUser._refreshCache();
            Bmob.User._currentUser._opSetQueue = [{}];
            return Bmob.User._currentUser;
        },

        /**
         * Persists a user as currentUser to localStorage, and into the singleton.
         */
        _saveCurrentUser: function(user) {
            if (Bmob.User._currentUser !== user) {
                Bmob.User.logOut();
            }
            user._isCurrentUser = true;
            Bmob.User._currentUser = user;
            Bmob.User._currentUserMatchesDisk = true;

            var json = user.toJSON();
            json._id = user.id;
            json._sessionToken = user._sessionToken;
            Bmob.localStorage.setItem(
                Bmob._getBmobPath(Bmob.User._CURRENT_USER_KEY),
                JSON.stringify(json));
        },

        _registerAuthenticationProvider: function(provider) {
            Bmob.User._authProviders[provider.getAuthType()] = provider;
            // Synchronize the current user with the auth provider.
            if (Bmob.User.current()) {
                Bmob.User.current()._synchronizeAuthData(provider.getAuthType());
            }
        },

        _logInWith: function(provider, options) {
            var user = Bmob.Object._create("_User");
            return user._linkWith(provider, options);
        }

    });
}(this));


// Bmob.Query is a way to create a list of Bmob.Objects.
(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * ä¸ºBmob.Objectç±»åˆ›å»ºä¸€ä¸ªæ–°çš„bmob Bmob.Query ã€‚
     * @param objectClass -
     *   Bmob.Objectçš„å®žä¾‹ï¼Œæˆ–è€…Bmobç±»å
     *
     *
     * <p>Bmob.Query ä¸ºBmob.Objectså®šä¹‰äº†queryæ“ä½œã€‚æœ€å¸¸ç”¨çš„æ“ä½œå°±æ˜¯ç”¨query<code>find</code>
     * æ“ä½œåŽ»èŽ·å–æ‰€æœ‰çš„å¯¹è±¡ã€‚ä¾‹å¦‚ï¼Œä¸‹é¢ç®€å•çš„æ“ä½œæ˜¯èŽ·å–æ‰€æœ‰çš„<code>MyClass</code>ã€‚æ ¹æ®æ“ä½œçš„æˆåŠŸæˆ–å¤±è´¥ï¼Œ
     * ä¼šå›žè°ƒä¸åŒçš„å‡½æ•°ã€‚
     * <pre>
     * var query = new Bmob.Query(MyClass);
     * query.find({
   *   success: function(results) {
   *     // results is an array of Bmob.Object.
   *   },
   *
   *   error: function(error) {
   *     // error is an instance of Bmob.Error.
   *   }
   * });</pre></p>
     *
     * <p>Bmob.Queryä¹Ÿå¯ä»¥ç”¨æ¥èŽ·å–ä¸€ä¸ªidå·²çŸ¥çš„å¯¹è±¡ã€‚ä¾‹å¦‚ï¼Œä¸‹é¢çš„ä¾‹å­èŽ·å–äº†<code>MyClass</code> å’Œ id <code>myId</code>
     * æ ¹æ®æ“ä½œçš„æˆåŠŸæˆ–å¤±è´¥ï¼Œä¼šå›žè°ƒä¸åŒçš„å‡½æ•°ã€‚
     * <pre>
     * var query = new Bmob.Query(MyClass);
     * query.get(myId, {
   *   success: function(object) {
   *     // object is an instance of Bmob.Object.
   *   },
   *
   *   error: function(object, error) {
   *     // error is an instance of Bmob.Error.
   *   }
   * });</pre></p>
     *
     * <p>Bmob.Query åŒæ—¶ä¹Ÿèƒ½èŽ·å–æŸ¥è¯¢ç»“æžœçš„æ•°ç›®ã€‚ä¾‹å¦‚ï¼Œä¸‹é¢çš„ä¾‹å­èŽ·å–äº†<code>MyClass</code>çš„æ•°ç›®<pre>
     * var query = new Bmob.Query(MyClass);
     * query.count({
   *   success: function(number) {
   *     // There are number instances of MyClass.
   *   },
   *
   *   error: function(error) {
   *     // error is an instance of Bmob.Error.
   *   }
   * });</pre></p>

     * @class Bmob.Query ä¸ºBmob.Objectså®šä¹‰äº†queryæ“ä½œ
     */
    Bmob.Query = function(objectClass) {
        if (_.isString(objectClass)) {
            objectClass = Bmob.Object._getSubclass(objectClass);
        }

        this.objectClass = objectClass;

        this.className = objectClass.prototype.className;

        this._where = {};
        this._include = [];
        this._limit = -1; // negative limit means, do not send a limit
        this._skip = 0;
        this._extraOptions = {};
    };

    /**
     * é€šè¿‡ä¼ é€’queryæž„é€ orçš„Bmob.Queryå¯¹è±¡ã€‚  For
     * example:
     * <pre>var compoundQuery = Bmob.Query.or(query1, query2, query3);</pre>
     * é€šè¿‡query1, query2, å’Œ query3åˆ›å»ºä¸€ä¸ªoræŸ¥è¯¢
     * @param {...Bmob.Query} var_args orçš„queryæŸ¥è¯¢.
     * @return {Bmob.Query} æŸ¥è¯¢ç»“æžœ.
     */
    Bmob.Query.or = function() {
        var queries = _.toArray(arguments);
        var className = null;
        Bmob._arrayEach(queries, function(q) {
            if (_.isNull(className)) {
                className = q.className;
            }

            if (className !== q.className) {
                throw "All queries must be for the same class";
            }
        });
        var query = new Bmob.Query(className);
        query._orQuery(queries);
        return query;
    };

    Bmob.Query._extend = Bmob._extend;

    Bmob.Query.prototype = {
        //hook to iterate result. Added by dennis<xzhuang@bmob.cn>.
        _processResult: function(obj){
            return obj;
        },

        /**
         * èŽ·å–Bmob.Objectï¼Œé€‚ç”¨äºŽidå·²ç»çŸ¥é“çš„æƒ…å†µã€‚å½“æŸ¥è¯¢å®Œæˆä¼šè°ƒç”¨options.success æˆ– options.errorã€‚
         * @param {} objectId è¦èŽ·å–çš„å¯¹è±¡id
         * @param {Object} options  Backbone-style options å¯¹è±¡.
         */
        get: function(objectId, options) {
            var self = this;
            self.equalTo('objectId', objectId);

            return self.first().then(function(response) {
                if (response) {
                    return response;
                }

                var errorObject = new Bmob.Error(Bmob.Error.OBJECT_NOT_FOUND,
                    "Object not found.");
                return Bmob.Promise.error(errorObject);

            })._thenRunCallbacks(options, null);
        },

        /**
         * è¿”å›žjsonçš„ç»“å±€
         * @return {Object}
         */
        toJSON: function() {
            var params = {
                where: this._where
            };

            if (this._include.length > 0) {
                params.include = this._include.join(",");
            }
            if (this._select) {
                params.keys = this._select.join(",");
            }
            if (this._limit >= 0) {
                params.limit = this._limit;
            }
            if (this._skip > 0) {
                params.skip = this._skip;
            }
            if (this._order !== undefined) {
                params.order = this._order;
            }

            Bmob._objectEach(this._extraOptions, function(v, k) {
                params[k] = v;
            });

            return params;
        },

        _newObject: function(response){
            if (response && response.className) {
                obj = new Bmob.Object(response.className);
            } else {
                obj = new this.objectClass();
            }
            return obj;
        },
        _createRequest: function(params){
            return Bmob._request("classes", this.className, null, "GET",
                params || this.toJSON());
        },

        /**
         * æŸ¥æ‰¾æ»¡è¶³æŸ¥è¯¢æ¡ä»¶çš„å¯¹è±¡ã€‚å®ŒæˆåŽï¼Œoptions.success æˆ– options.error ä¼šè¢«è°ƒç”¨ã€‚
         * @param {Object} options A Backbone-style options å¯¹è±¡.
         * @return {Bmob.Promise} å½“æŸ¥è¯¢å®ŒæˆåŽï¼Œç»“æžœçš„ promise ä¼šè¢«è°ƒç”¨ã€‚
         */
        find: function(options) {
            var self = this;

            var request = this._createRequest();

            return request.then(function(response) {
                return _.map(response.results, function(json) {
                    var obj = self._newObject(response);
                    obj._finishFetch(self._processResult(json), true);
                    return obj;
                });
            })._thenRunCallbacks(options);
        },

        /**
         * 	æŠŠæŸ¥è¯¢åˆ°çš„æ‰€æœ‰å¯¹è±¡åˆ é™¤ã€‚
         * @param {Object} options æ ‡å‡†çš„å¸¦ success and errorå›žè°ƒçš„optionså¯¹è±¡ã€‚
         * @return {Bmob.Promise}  å½“å®ŒæˆåŽï¼Œç»“æžœçš„ promise ä¼šè¢«è°ƒç”¨ã€‚
         */
        destroyAll: function(options){
            var self = this;
            return self.find().then(function(objects){
                return Bmob.Object.destroyAll(objects);
            })._thenRunCallbacks(options);
        },

        /**
         * æŸ¥è¯¢ç»“æžœçš„æ•°ç›®ã€‚
         * å®ŒæˆåŽï¼Œoptions.success æˆ– options.error ä¼šè¢«è°ƒç”¨ã€‚
         *
         * @param {Object} options A Backbone-style options å¯¹è±¡.
         * @return {Bmob.Promise} å®ŒæˆåŽï¼Œç»“æžœçš„ promise ä¼šè¢«è°ƒç”¨ã€‚
         */
        count: function(options) {
            var params = this.toJSON();
            params.limit = 0;
            params.count = 1;
            var request = this._createRequest(params);

            return request.then(function(response) {
                return response.count;
            })._thenRunCallbacks(options);
        },

        /**
         * åœ¨è¿”å›žçš„ç»“æžœä¸­ï¼Œè¿”å›žç¬¬ä¸€ä¸ªå¯¹è±¡
         * å®ŒæˆåŽï¼Œoptions.success æˆ– options.error ä¼šè¢«è°ƒç”¨ã€‚
         *
         * @param {Object} options A Backbone-style options å¯¹è±¡.
         * @return {Bmob.Promise} å®ŒæˆåŽï¼Œç»“æžœçš„ promise ä¼šè¢«è°ƒç”¨ã€‚
         */
        first: function(options) {
            var self = this;

            var params = this.toJSON();
            params.limit = 1;
            var request = this._createRequest(params);

            return request.then(function(response) {
                return _.map(response.results, function(json) {
                    var obj = self._newObject();
                    obj._finishFetch(self._processResult(json), true);
                    return obj;
                })[0];
            })._thenRunCallbacks(options);
        },

        /**
         * æŸ¥è¯¢åŽè¿”å›žä¸€ä¸ªBmob.Collection
         * @return {Bmob.Collection}
         */
        collection: function(items, options) {
            options = options || {};
            return new Bmob.Collection(items, _.extend(options, {
                model: this._objectClass || this.objectClass,
                query: this
            }));
        },

        /**
         * åœ¨è¿”å›žç»“æžœå‰è®¾ç½®è·³è¿‡çš„ç»“æžœæ•°ç›®ã€‚æ˜¯åœ¨åˆ†é¡µæ—¶ä½¿ç”¨çš„ã€‚é»˜è®¤æ˜¯è·³è¿‡0æ¡ç»“æžœã€‚
         * @param {Number} n è·³è¿‡çš„æ•°ç›®ã€‚
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        skip: function(n) {
            this._skip = n;
            return this;
        },

        /**
         * é™åˆ¶è¿”å›žç»“æžœçš„æ•°ç›®ã€‚é»˜è®¤é™åˆ¶æ˜¯100ï¼Œæœ€å¤§é™åˆ¶æ•°æ˜¯1000.
         * @param {Number} n é™åˆ¶çš„æ•°ç›®ã€‚
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        limit: function(n) {
            this._limit = n;
            return this;
        },

        /**
         * æ·»åŠ ä¸€ä¸ªequalæŸ¥è¯¢ï¼ˆkey value å½¢å¼ï¼‰ã€‚
         * @param {String} key key
         * @param value  keyå¯¹åº”çš„å€¼
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        equalTo: function(key, value) {
            this._where[key] = Bmob._encode(value);
            return this;
        },

        /**
         * Helper for condition queries
         */
        _addCondition: function(key, condition, value) {
            // Check if we already have a condition
            if (!this._where[key]) {
                this._where[key] = {};
            }
            this._where[key][condition] = Bmob._encode(value);
            return this;
        },

        /**
         * æ·»åŠ ä¸€ä¸ªnot equalæŸ¥è¯¢ï¼ˆkey value å½¢å¼ï¼‰ã€‚
         * @param {String} key key
         * @param value  keyå¯¹åº”çš„å€¼
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        notEqualTo: function(key, value) {
            this._addCondition(key, "$ne", value);
            return this;
        },

        /**
         * æ·»åŠ ä¸€ä¸ªå°äºŽæŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥çš„key.
         * @param value keyæ‰€å¯¹åº”çš„å¿…é¡»å°‘äºŽçš„å€¼
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        lessThan: function(key, value) {
            this._addCondition(key, "$lt", value);
            return this;
        },

        /**
         * æ·»åŠ ä¸€ä¸ªå¤§äºŽæŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥çš„key.
         * @param value keyæ‰€å¯¹åº”çš„å¿…é¡»å¤§äºŽçš„å€¼
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        greaterThan: function(key, value) {
            this._addCondition(key, "$gt", value);
            return this;
        },

        /**
         * æ·»åŠ ä¸€ä¸ªå°äºŽç­‰äºŽæŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥çš„key.
         * @param value keyæ‰€å¯¹åº”çš„å¿…é¡»å°‘äºŽç­‰äºŽçš„å€¼
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        lessThanOrEqualTo: function(key, value) {
            this._addCondition(key, "$lte", value);
            return this;
        },

        /**
         * æ·»åŠ ä¸€ä¸ªå¤§äºŽç­‰äºŽæŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥çš„key.
         * @param value keyæ‰€å¯¹åº”çš„å¿…é¡»å¤§äºŽç­‰äºŽçš„å€¼
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        greaterThanOrEqualTo: function(key, value) {
            this._addCondition(key, "$gte", value);
            return this;
        },

        /**
         * æ·»åŠ keyä¸­åŒ…å«ä»»æ„ä¸€ä¸ªå€¼æŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥çš„key.
         * @param {Array} values éœ€è¦åŒ…å«çš„å€¼çš„æ•°ç»„
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        containedIn: function(key, values) {
            this._addCondition(key, "$in", values);
            return this;
        },

        /**
         * æ·»åŠ keyä¸­ä¸åŒ…å«ä»»æ„ä¸€ä¸ªå€¼æŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥çš„key.
         * @param {Array} values ä¸éœ€è¦åŒ…å«çš„å€¼çš„æ•°ç»„
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        notContainedIn: function(key, values) {
            this._addCondition(key, "$nin", values);
            return this;
        },

        /**
         * æ·»åŠ keyä¸­åŒ…å«å…¨éƒ¨å€¼æŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥çš„key
         * @param {Array} values éœ€è¦åŒ…å«çš„å…¨éƒ¨å€¼çš„æ•°ç»„
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        containsAll: function(key, values) {
            this._addCondition(key, "$all", values);
            return this;
        },


        /**
         * æ·»åŠ keyæ˜¯å¦å­˜åœ¨çš„æŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥æ˜¯å¦å­˜åœ¨çš„keyã€‚
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        exists: function(key) {
            this._addCondition(key, "$exists", true);
            return this;
        },

        /**
         * æ·»åŠ keyæ˜¯å¦ä¸å­˜åœ¨çš„æŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥æ˜¯å¦ä¸å­˜åœ¨çš„keyã€‚
         * @return {Bmob.Query}è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        doesNotExist: function(key) {
            this._addCondition(key, "$exists", false);
            return this;
        },

        /**
         * æ·»åŠ æ­£åˆ™è¡¨è¾¾å¼çš„æŸ¥è¯¢ã€‚
         * å½“æ•°æ®å¾ˆå¤§çš„æ—¶å€™è¿™ä¸ªæ“ä½œå¯èƒ½å¾ˆæ…¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥çš„key
         * @param {RegExp} regex éœ€è¦åŒ¹é…çš„æ­£åˆ™è¡¨è¾¾å¼
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        matches: function(key, regex, modifiers) {
            this._addCondition(key, "$regex", regex);
            if (!modifiers) { modifiers = ""; }
            // Javascript regex options support mig as inline options but store them
            // as properties of the object. We support mi & should migrate them to
            // modifiers
            if (regex.ignoreCase) { modifiers += 'i'; }
            if (regex.multiline) { modifiers += 'm'; }

            if (modifiers && modifiers.length) {
                this._addCondition(key, "$options", modifiers);
            }
            return this;
        },

        /**
         * æ·»åŠ ä¸€ä¸ªBmob.Queryçš„åŒ¹é…æŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥çš„keyã€‚
         * @param {Bmob.Query} query éœ€è¦åŒ¹é…çš„query
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        matchesQuery: function(key, query) {
            var queryJSON = query.toJSON();
            queryJSON.className = query.className;
            this._addCondition(key, "$inQuery", queryJSON);
            return this;
        },

        /**
         * æ·»åŠ ä¸€ä¸ªBmob.Queryçš„ä¸åŒ¹é…æŸ¥è¯¢ã€‚
         * @param {String} key éœ€è¦æ£€æŸ¥çš„keyã€‚
         * @param {Bmob.Query} ä¸éœ€è¦åŒ¹é…çš„query
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        doesNotMatchQuery: function(key, query) {
            var queryJSON = query.toJSON();
            queryJSON.className = query.className;
            this._addCondition(key, "$notInQuery", queryJSON);
            return this;
        },


        /**
         * æ·»åŠ æŸ¥è¯¢ï¼š key's value åŒ¹é…ä¸€ä¸ªå¯¹è±¡ï¼Œè¿™ä¸ªå¯¹è±¡é€šè¿‡ä¸åŒçš„Bmob.Queryè¿”å›žã€‚
         * @param {String} key éœ€è¦åŒ¹é…çš„keyå€¼
         * @param {String} queryKey è¿”å›žé€šè¿‡åŒ¹é…çš„æŸ¥è¯¢çš„å¯¹è±¡çš„é”®
         * @param {Bmob.Query} query éœ€è¦è¿è¡Œçš„æŸ¥è¯¢
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        matchesKeyInQuery: function(key, queryKey, query) {
            var queryJSON = query.toJSON();
            queryJSON.className = query.className;
            this._addCondition(key, "$select",
                { key: queryKey, query: queryJSON });
            return this;
        },

        /**
         * æ·»åŠ æŸ¥è¯¢ï¼š key's value ä¸åŒ¹é…ä¸€ä¸ªå¯¹è±¡ï¼Œè¿™ä¸ªå¯¹è±¡é€šè¿‡ä¸åŒçš„Bmob.Queryè¿”å›žã€‚
         * @param {String} key éœ€è¦åŒ¹é…çš„keyå€¼
         *                     excluded.
         * @param {String} queryKey è¿”å›žé€šè¿‡ä¸åŒ¹é…çš„æŸ¥è¯¢çš„å¯¹è±¡çš„é”®
         * @param {Bmob.Query} query éœ€è¦è¿è¡Œçš„æŸ¥è¯¢
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        doesNotMatchKeyInQuery: function(key, queryKey, query) {
            var queryJSON = query.toJSON();
            queryJSON.className = query.className;
            this._addCondition(key, "$dontSelect",
                { key: queryKey, query: queryJSON });
            return this;
        },

        /**
         * Add constraint that at least one of the passed in queries matches.
         * @param {Array} queries
         * @return {Bmob.Query} Returns the query, so you can chain this call.
         */
        _orQuery: function(queries) {
            var queryJSON = _.map(queries, function(q) {
                return q.toJSON().where;
            });

            this._where.$or = queryJSON;
            return this;
        },

        /**
         * Converts a string into a regex that matches it.
         * Surrounding with \Q .. \E does this, we just need to escape \E's in
         * the text separately.
         */
        _quote: function(s) {
            return "\\Q" + s.replace("\\E", "\\E\\\\E\\Q") + "\\E";
        },

        /**
         * æŸ¥æ‰¾ä¸€ä¸ªå€¼ä¸­æ˜¯å¦åŒ…å«æŸä¸ªå­ä¸²ã€‚åœ¨å¤§é‡çš„æ•°æ®ä¸­ï¼Œè¿™ä¸ªæ“ä½œå¯èƒ½å¾ˆæ…¢ã€‚
         * @param {String} key éœ€è¦æŸ¥æ‰¾çš„å€¼
         * @param {String} substring éœ€è¦åŒ¹é…å­ä¸²
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        contains: function(key, value) {
            this._addCondition(key, "$regex", this._quote(value));
            return this;
        },

        /**
         * æ£€æŸ¥æŸä¸ªå€¼æ˜¯å¦ä»¥ç‰¹æ®Šçš„å­—ç¬¦ä¸²å¼€å¤´ã€‚ è¿™æŸ¥è¯¢ä½¿ç”¨äº†backend indexï¼Œå› æ­¤åœ¨å¤§æ•°æ®ä¸­ä¹Ÿå¾ˆå¿«ã€‚
         * @param {String} key éœ€è¦æŸ¥æ‰¾çš„å€¼
         * @param {String} prefix éœ€è¦åŒ¹é…å­ä¸²
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        startsWith: function(key, value) {
            this._addCondition(key, "$regex", "^" + this._quote(value));
            return this;
        },

        /**
         * æ£€æŸ¥æŸä¸ªå€¼æ˜¯å¦ä»¥ç‰¹æ®Šçš„å­—ç¬¦ä¸²ç»“å°¾ã€‚åœ¨å¤§é‡çš„æ•°æ®ä¸­ï¼Œè¿™ä¸ªæ“ä½œå¯èƒ½å¾ˆæ…¢ã€‚
         * @param {String} key éœ€è¦æŸ¥æ‰¾çš„å€¼
         * @param {String} suffix éœ€è¦åŒ¹é…å­ä¸²
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        endsWith: function(key, value) {
            this._addCondition(key, "$regex", this._quote(value) + "$");
            return this;
        },

        /**
         * æ ¹æ®keyå¯¹ç»“æžœè¿›è¡Œå‡åºã€‚
         *
         * @param {String} key æŽ’åºçš„key
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        ascending: function(key) {
            this._order = key;
            return this;
        },

        /**
         * æ ¹æ®keyå¯¹ç»“æžœè¿›è¡Œé™åºã€‚
         *
         * @param {String} key æŽ’åºçš„key
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        descending: function(key) {
            this._order = "-" + key;
            return this;
        },

        /**
         * æŸ¥æ‰¾ä¸€ä¸ªgeo point é™„è¿‘çš„åæ ‡ã€‚
         * @param {String} key Bmob.GeoPointçš„key
         * @param {Bmob.GeoPoint} point æŒ‡å‘ä¸€ä¸ª Bmob.GeoPoint
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        near: function(key, point) {
            if (!(point instanceof Bmob.GeoPoint)) {
                // Try to cast it to a GeoPoint, so that near("loc", [20,30]) works.
                point = new Bmob.GeoPoint(point);
            }
            this._addCondition(key, "$nearSphere", point);
            return this;
        },

        /**
         * æ·»åŠ ç”¨äºŽæŸ¥æ‰¾é™„è¿‘çš„å¯¹è±¡ï¼Œå¹¶åŸºäºŽå¼§åº¦ç»™å‡ºæœ€å¤§è·ç¦»å†…çš„ç‚¹ã€‚
         * @param {String} key Bmob.GeoPointçš„key
         * @param {Bmob.GeoPoint} point æŒ‡å‘ä¸€ä¸ª Bmob.GeoPoint
         * @param maxDistance è¿”å›žçš„æœ€å¤§è·ç¦»ï¼ŒåŸºäºŽå¼§åº¦.
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        withinRadians: function(key, point, distance) {
            this.near(key, point);
            this._addCondition(key, "$maxDistance", distance);
            return this;
        },

        /**
         * æ·»åŠ ç”¨äºŽæŸ¥æ‰¾é™„è¿‘çš„å¯¹è±¡ï¼Œå¹¶åŸºäºŽç±³ç»™å‡ºæœ€å¤§è·ç¦»å†…çš„ç‚¹ã€‚
         * @param {String} key Bmob.GeoPointçš„key
         * @param {Bmob.GeoPoint} point æŒ‡å‘ä¸€ä¸ª Bmob.GeoPoint
         * @param maxDistance è¿”å›žçš„æœ€å¤§è·ç¦»ï¼ŒåŸºäºŽå¼§åº¦.
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        withinMiles: function(key, point, distance) {
            return this.withinRadians(key, point, distance / 3958.8);
        },

        /**
         * æ·»åŠ ç”¨äºŽæŸ¥æ‰¾é™„è¿‘çš„å¯¹è±¡ï¼Œå¹¶åŸºäºŽåƒç±³ç»™å‡ºæœ€å¤§è·ç¦»å†…çš„ç‚¹ã€‚
         * @param {String} key Bmob.GeoPointçš„key
         * @param {Bmob.GeoPoint} point æŒ‡å‘ä¸€ä¸ª Bmob.GeoPoint
         * @param maxDistance è¿”å›žçš„æœ€å¤§è·ç¦»ï¼ŒåŸºäºŽå¼§åº¦.
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        withinKilometers: function(key, point, distance) {
            return this.withinRadians(key, point, distance / 6371.0);
        },

        /**
         * åœ¨ä¸€ä¸ªå››è¾¹å½¢èŒƒå›´å†…ï¼ŒæŸ¥æ‰¾æŸä¸ªç‚¹é™„è¿‘çš„å¯¹è±¡
         * @param {String} key The key to be constrained.
         * @param {Bmob.GeoPoint} southwest è¿™ä¸ªå››è¾¹å½¢çš„å—è¥¿æ–¹å‘
         * @param {Bmob.GeoPoint} northeast è¿™ä¸ªå››è¾¹å½¢çš„ä¸œåŒ—æ–¹å‘
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        withinGeoBox: function(key, southwest, northeast) {
            if (!(southwest instanceof Bmob.GeoPoint)) {
                southwest = new Bmob.GeoPoint(southwest);
            }
            if (!(northeast instanceof Bmob.GeoPoint)) {
                northeast = new Bmob.GeoPoint(northeast);
            }
            this._addCondition(key, '$within', { '$box': [southwest, northeast] });
            return this;
        },

        /**
         * å½“èŽ·å–çš„Bmob.Objectsæœ‰æŒ‡å‘å…¶å­å¯¹è±¡çš„Pointerç±»åž‹æŒ‡é’ˆKeyæ—¶ï¼Œä½ å¯ä»¥åŠ å…¥inclueé€‰é¡¹æ¥èŽ·å–æŒ‡é’ˆæŒ‡å‘çš„å­å¯¹è±¡
         * @param {String} key éœ€è¦åŒ…å«çš„keyçš„å€¼
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        include: function() {
            var self = this;
            Bmob._arrayEach(arguments, function(key) {
                if (_.isArray(key)) {
                    self._include = self._include.concat(key);
                } else {
                    self._include.push(key);
                }
            });
            return this;
        },

        /**
         * åŒ¹é…å¦ä¸€ä¸ªæŸ¥è¯¢çš„è¿”å›žå€¼ï¼Œå¦‚æžœè¿™ä¸ªå‡½æ•°è¢«è°ƒç”¨å¤šæ¬¡ï¼Œæ¯æ¬¡è°ƒç”¨æ—¶æ‰€æœ‰çš„keyså°†ä¼šè¢«åŒ…å«ã€‚
         * @param {Array} keys éœ€è¦åŒ…å«çš„keyçš„å€¼
         * @return {Bmob.Query} è¿”å›žæŸ¥è¯¢å¯¹è±¡ï¼Œå› æ­¤å¯ä»¥ä½¿ç”¨é“¾å¼è°ƒç”¨ã€‚
         */
        select: function() {
            var self = this;
            this._select = this._select || [];
            Bmob._arrayEach(arguments, function(key) {
                if (_.isArray(key)) {
                    self._select = self._select.concat(key);
                } else {
                    self._select.push(key);
                }
            });
            return this;
        },

        /**
         * å¯¹æŸ¥è¯¢çš„æ¯ä¸ªç»“æžœè°ƒç”¨å›žè°ƒå‡½æ•°ã€‚
         * å¦‚æžœcallbackè¿”å›žpromiseï¼Œè¿™ä¸ªè¿­ä»£å™¨ä¸ä¼šç»§ç»­ç›´åˆ°æ‰€æœ‰çš„promiseè°ƒç”¨å®Œæ¯•ã€‚
         * å¦‚æžœå›žè°ƒè¿”å›žæ‹’ç»promiseï¼Œè¿­ä»£ä¼šåœæ­¢ã€‚
         * æ‰€æœ‰å¯¹è±¡å°†ä»¥ä¸æŽ’åºçš„å½¢å¼å¤„ç†ã€‚
         * æŸ¥è¯¢å°†ä¸ä¼šæœ‰ä»»ä½•çš„æŽ’åºï¼ŒåŒæ—¶limit æˆ–skip å°†æ— æ•ˆã€‚
         * @param callback {Function} æ¯ä¸ªç»“æžœè°ƒç”¨çš„å›žè°ƒå‡½æ•°
         * @param options {Object} å¯é€‰çš„ Backbone-like å¸¦æˆåŠŸæˆ–å¤±è´¥çš„å›žè°ƒï¼Œå›žè°ƒå°†ä¼šæ‰§è¡Œå½“è¿­ä»£ç»“æŸçš„æ—¶å€™ã€‚
         * @return {Bmob.Promise} å½“è¿­ä»£ç»“æŸçš„æ—¶å€™A promise å°†ä¼šæ‰§è¡Œä¸€æ¬¡ã€‚
         */
        each: function(callback, options) {
            options = options || {};

            if (this._order || this._skip || (this._limit >= 0)) {
                var error =
                    "Cannot iterate on a query with sort, skip, or limit.";
                return Bmob.Promise.error(error)._thenRunCallbacks(options);
            }

            var promise = new Bmob.Promise();

            var query = new Bmob.Query(this.objectClass);
            // We can override the batch size from the options.
            // This is undocumented, but useful for testing.
            query._limit = options.batchSize || 100;
            query._where = _.clone(this._where);
            query._include = _.clone(this._include);

            query.ascending('objectId');

            var finished = false;
            return Bmob.Promise._continueWhile(function() {
                return !finished;

            }, function() {
                return query.find().then(function(results) {
                    var callbacksDone = Bmob.Promise.as();
                    Bmob._.each(results, function(result) {
                        callbacksDone = callbacksDone.then(function() {
                            return callback(result);
                        });
                    });

                    return callbacksDone.then(function() {
                        if (results.length >= query._limit) {
                            query.greaterThan("objectId", results[results.length - 1].id);
                        } else {
                            finished = true;
                        }
                    });
                });
            })._thenRunCallbacks(options);
        }
    };

    Bmob.FriendShipQuery = Bmob.Query._extend({
        _objectClass: Bmob.User,
        _newObject: function(){
            return new Bmob.User();
        },
        _processResult: function(json){
            var user = json[this._friendshipTag];
            if(user.__type === 'Pointer' && user.className === '_User'){
                delete user.__type;
                delete user.className;
            }
            return user;
        },
    });
}(this));


/*global _: false, document: false, window: false, navigator: false */
(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * History serves as a global router (per frame) to handle hashchange
     * events or pushState, match the appropriate route, and trigger
     * callbacks. You shouldn't ever have to create one of these yourself
     * â€” you should use the reference to <code>Bmob.history</code>
     * that will be created for you automatically if you make use of
     * Routers with routes.
     *
     * <p>A fork of Backbone.History, provided for your convenience.  If you
     * use this class, you must also include jQuery, or another library
     * that provides a jQuery-compatible $ function.  For more information,
     * see the <a href="http://documentcloud.github.com/backbone/#History">
     * Backbone documentation</a>.</p>
     * <p><strong><em>Available in the client SDK only.</em></strong></p>
     */
    Bmob.History = function() {
        this.handlers = [];
        _.bindAll(this, 'checkUrl');
    };

    // Cached regex for cleaning leading hashes and slashes .
    var routeStripper = /^[#\/]/;

    // Cached regex for detecting MSIE.
    var isExplorer = /msie [\w.]+/;

    // Has the history handling already been started?
    Bmob.History.started = false;

    // Set up all inheritable **Bmob.History** properties and methods.
    _.extend(Bmob.History.prototype, Bmob.Events,
        /** @lends Bmob.History.prototype */ {

            // The default interval to poll for hash changes, if necessary, is
            // twenty times a second.
            interval: 50,

            // Gets the true hash value. Cannot use location.hash directly due to bug
            // in Firefox where location.hash will always be decoded.
            getHash: function(windowOverride) {
                var loc = windowOverride ? windowOverride.location : window.location;
                var match = loc.href.match(/#(.*)$/);
                return match ? match[1] : '';
            },

            // Get the cross-browser normalized URL fragment, either from the URL,
            // the hash, or the override.
            getFragment: function(fragment, forcePushState) {
                if (Bmob._isNullOrUndefined(fragment)) {
                    if (this._hasPushState || forcePushState) {
                        fragment = window.location.pathname;
                        var search = window.location.search;
                        if (search) {
                            fragment += search;
                        }
                    } else {
                        fragment = this.getHash();
                    }
                }
                if (!fragment.indexOf(this.options.root)) {
                    fragment = fragment.substr(this.options.root.length);
                }
                return fragment.replace(routeStripper, '');
            },

            /**
             * Start the hash change handling, returning `true` if the current
             * URL matches an existing route, and `false` otherwise.
             */
            start: function(options) {
                if (Bmob.History.started) {
                    throw new Error("Bmob.history has already been started");
                }
                Bmob.History.started = true;

                // Figure out the initial configuration. Do we need an iframe?
                // Is pushState desired ... is it available?
                this.options = _.extend({}, {root: '/'}, this.options, options);
                this._wantsHashChange = this.options.hashChange !== false;
                this._wantsPushState = !!this.options.pushState;
                this._hasPushState = !!(this.options.pushState &&
                window.history &&
                window.history.pushState);
                var fragment = this.getFragment();
                var docMode = document.documentMode;
                var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) &&
                (!docMode || docMode <= 7));

                if (oldIE) {
                    this.iframe = Bmob.$('<iframe src="javascript:0" tabindex="-1" />')
                        .hide().appendTo('body')[0].contentWindow;
                    this.navigate(fragment);
                }

                // Depending on whether we're using pushState or hashes, and whether
                // 'onhashchange' is supported, determine how we check the URL state.
                if (this._hasPushState) {
                    Bmob.$(window).bind('popstate', this.checkUrl);
                } else if (this._wantsHashChange &&
                    ('onhashchange' in window) &&
                    !oldIE) {
                    Bmob.$(window).bind('hashchange', this.checkUrl);
                } else if (this._wantsHashChange) {
                    this._checkUrlInterval = window.setInterval(this.checkUrl,
                        this.interval);
                }

                // Determine if we need to change the base url, for a pushState link
                // opened by a non-pushState browser.
                this.fragment = fragment;
                var loc = window.location;
                var atRoot  = loc.pathname === this.options.root;

                // If we've started off with a route from a `pushState`-enabled browser,
                // but we're currently in a browser that doesn't support it...
                if (this._wantsHashChange &&
                    this._wantsPushState &&
                    !this._hasPushState &&
                    !atRoot) {
                    this.fragment = this.getFragment(null, true);
                    window.location.replace(this.options.root + '#' + this.fragment);
                    // Return immediately as browser will do redirect to new url
                    return true;

                    // Or if we've started out with a hash-based route, but we're currently
                    // in a browser where it could be `pushState`-based instead...
                } else if (this._wantsPushState &&
                    this._hasPushState &&
                    atRoot &&
                    loc.hash) {
                    this.fragment = this.getHash().replace(routeStripper, '');
                    window.history.replaceState({}, document.title,
                        loc.protocol + '//' + loc.host + this.options.root + this.fragment);
                }

                if (!this.options.silent) {
                    return this.loadUrl();
                }
            },

            // Disable Bmob.history, perhaps temporarily. Not useful in a real app,
            // but possibly useful for unit testing Routers.
            stop: function() {
                Bmob.$(window).unbind('popstate', this.checkUrl)
                    .unbind('hashchange', this.checkUrl);
                window.clearInterval(this._checkUrlInterval);
                Bmob.History.started = false;
            },

            // Add a route to be tested when the fragment changes. Routes added later
            // may override previous routes.
            route: function(route, callback) {
                this.handlers.unshift({route: route, callback: callback});
            },

            // Checks the current URL to see if it has changed, and if it has,
            // calls `loadUrl`, normalizing across the hidden iframe.
            checkUrl: function(e) {
                var current = this.getFragment();
                if (current === this.fragment && this.iframe) {
                    current = this.getFragment(this.getHash(this.iframe));
                }
                if (current === this.fragment) {
                    return false;
                }
                if (this.iframe) {
                    this.navigate(current);
                }
                if (!this.loadUrl()) {
                    this.loadUrl(this.getHash());
                }
            },

            // Attempt to load the current URL fragment. If a route succeeds with a
            // match, returns `true`. If no defined routes matches the fragment,
            // returns `false`.
            loadUrl: function(fragmentOverride) {
                var fragment = this.fragment = this.getFragment(fragmentOverride);
                var matched = _.any(this.handlers, function(handler) {
                    if (handler.route.test(fragment)) {
                        handler.callback(fragment);
                        return true;
                    }
                });
                return matched;
            },

            // Save a fragment into the hash history, or replace the URL state if the
            // 'replace' option is passed. You are responsible for properly URL-encoding
            // the fragment in advance.
            //
            // The options object can contain `trigger: true` if you wish to have the
            // route callback be fired (not usually desirable), or `replace: true`, if
            // you wish to modify the current URL without adding an entry to the
            // history.
            navigate: function(fragment, options) {
                if (!Bmob.History.started) {
                    return false;
                }
                if (!options || options === true) {
                    options = {trigger: options};
                }
                var frag = (fragment || '').replace(routeStripper, '');
                if (this.fragment === frag) {
                    return;
                }

                // If pushState is available, we use it to set the fragment as a real URL.
                if (this._hasPushState) {
                    if (frag.indexOf(this.options.root) !== 0) {
                        frag = this.options.root + frag;
                    }
                    this.fragment = frag;
                    var replaceOrPush = options.replace ? 'replaceState' : 'pushState';
                    window.history[replaceOrPush]({}, document.title, frag);

                    // If hash changes haven't been explicitly disabled, update the hash
                    // fragment to store history.
                } else if (this._wantsHashChange) {
                    this.fragment = frag;
                    this._updateHash(window.location, frag, options.replace);
                    if (this.iframe &&
                        (frag !== this.getFragment(this.getHash(this.iframe)))) {
                        // Opening and closing the iframe tricks IE7 and earlier
                        // to push a history entry on hash-tag change.
                        // When replace is true, we don't want this.
                        if (!options.replace) {
                            this.iframe.document.open().close();
                        }
                        this._updateHash(this.iframe.location, frag, options.replace);
                    }

                    // If you've told us that you explicitly don't want fallback hashchange-
                    // based history, then `navigate` becomes a page refresh.
                } else {
                    window.location.assign(this.options.root + fragment);
                }
                if (options.trigger) {
                    this.loadUrl(fragment);
                }
            },

            // Update the hash location, either replacing the current entry, or adding
            // a new one to the browser history.
            _updateHash: function(location, fragment, replace) {
                if (replace) {
                    var s = location.toString().replace(/(javascript:|#).*$/, '');
                    location.replace(s + '#' + fragment);
                } else {
                    location.hash = fragment;
                }
            }
        });
}(this));

/*global _: false*/
(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * Routers map faux-URLs to actions, and fire events when routes are
     * matched. Creating a new one sets its `routes` hash, if not set statically.
     *
     * <p>A fork of Backbone.Router, provided for your convenience.
     * For more information, see the
     * <a href="http://documentcloud.github.com/backbone/#Router">Backbone
     * documentation</a>.</p>
     * <p><strong><em>Available in the client SDK only.</em></strong></p>
     */
    Bmob.Router = function(options) {
        options = options || {};
        if (options.routes) {
            this.routes = options.routes;
        }
        this._bindRoutes();
        this.initialize.apply(this, arguments);
    };

    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var namedParam    = /:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[\-\[\]{}()+?.,\\\^\$\|#\s]/g;

    // Set up all inheritable **Bmob.Router** properties and methods.
    _.extend(Bmob.Router.prototype, Bmob.Events,
        /** @lends Bmob.Router.prototype */ {

            /**
             * Initialize is an empty function by default. Override it with your own
             * initialization logic.
             */
            initialize: function(){},

            /**
             * Manually bind a single named route to a callback. For example:
             *
             * <pre>this.route('search/:query/p:num', 'search', function(query, num) {
     *       ...
     *     });</pre>
             */
            route: function(route, name, callback) {
                Bmob.history = Bmob.history || new Bmob.History();
                if (!_.isRegExp(route)) {
                    route = this._routeToRegExp(route);
                }
                if (!callback) {
                    callback = this[name];
                }
                Bmob.history.route(route, _.bind(function(fragment) {
                    var args = this._extractParameters(route, fragment);
                    if (callback) {
                        callback.apply(this, args);
                    }
                    this.trigger.apply(this, ['route:' + name].concat(args));
                    Bmob.history.trigger('route', this, name, args);
                }, this));
                return this;
            },

            /**
             * Whenever you reach a point in your application that you'd
             * like to save as a URL, call navigate in order to update the
             * URL. If you wish to also call the route function, set the
             * trigger option to true. To update the URL without creating
             * an entry in the browser's history, set the replace option
             * to true.
             */
            navigate: function(fragment, options) {
                Bmob.history.navigate(fragment, options);
            },

            // Bind all defined routes to `Bmob.history`. We have to reverse the
            // order of the routes here to support behavior where the most general
            // routes can be defined at the bottom of the route map.
            _bindRoutes: function() {
                if (!this.routes) {
                    return;
                }
                var routes = [];
                for (var route in this.routes) {
                    if (this.routes.hasOwnProperty(route)) {
                        routes.unshift([route, this.routes[route]]);
                    }
                }
                for (var i = 0, l = routes.length; i < l; i++) {
                    this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
                }
            },

            // Convert a route string into a regular expression, suitable for matching
            // against the current location hash.
            _routeToRegExp: function(route) {
                route = route.replace(escapeRegExp, '\\$&')
                    .replace(namedParam, '([^\/]+)')
                    .replace(splatParam, '(.*?)');
                return new RegExp('^' + route + '$');
            },

            // Given a route, and a URL fragment that it matches, return the array of
            // extracted parameters.
            _extractParameters: function(route, fragment) {
                return route.exec(fragment).slice(1);
            }
        });


    /**
     * @function
     * @param {Object} instanceProps Instance properties for the router.
     * @param {Object} classProps Class properies for the router.
     * @return {Class} A new subclass of <code>Bmob.Router</code>.
     */
    Bmob.Router.extend = Bmob._extend;
}(this));


(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * @namespace å¤„ç†å›¾ç‰‡çš„å‡½æ•°
     */
    Bmob.Image = Bmob.Image || {};

    _.extend(Bmob.Image, /** @lends Bmob.Image */  {
        /**
         * è°ƒç”¨ç”Ÿæˆç¼©ç•¥å›¾çš„å‡½æ•°ã€‚
         * @param {Object} ç›¸åº”çš„å‚æ•°
         * @param {Object} Backbone-style options å¯¹è±¡ã€‚ options.success, å¦‚æžœè®¾ç½®äº†ï¼Œå°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨æˆåŠŸçš„æƒ…å†µã€‚ options.error å¦‚æžœè®¾ç½®äº†ï¼Œå°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨å¤±è´¥çš„æƒ…å†µã€‚ ä¸¤ä¸ªå‡½æ•°éƒ½æ˜¯å¯é€‰çš„ã€‚ä¸¤ä¸ªå‡½æ•°éƒ½åªæœ‰ä¸€ä¸ªå‚æ•°ã€‚
         * @return {Bmob.Promise} A promise å°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨çš„æƒ…å†µã€‚
         */
        thumbnail: function(data, options) {
            var request = Bmob._request("images/thumbnail", null, null, 'POST',
                Bmob._encode(data, null, true));

            return request.then(function(resp) {
                return resp;
            });

        },

        /**
         * è°ƒç”¨ç”Ÿæˆæ°´å°çš„å‡½æ•°ã€‚
         * @param {Object} ç›¸åº”çš„å‚æ•°
         * @param {Object} Backbone-style options å¯¹è±¡ã€‚ options.success, å¦‚æžœè®¾ç½®äº†ï¼Œå°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨æˆåŠŸçš„æƒ…å†µã€‚ options.error å¦‚æžœè®¾ç½®äº†ï¼Œå°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨å¤±è´¥çš„æƒ…å†µã€‚ ä¸¤ä¸ªå‡½æ•°éƒ½æ˜¯å¯é€‰çš„ã€‚ä¸¤ä¸ªå‡½æ•°éƒ½åªæœ‰ä¸€ä¸ªå‚æ•°ã€‚
         * @return {Bmob.Promise} A promise å°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨çš„æƒ…å†µã€‚
         */
        watermark: function(data, options) {
            var request = Bmob._request("images/watermark", null, null, 'POST',
                Bmob._encode(data, null, true));

            return request.then(function(resp) {
                return resp;
            });

        }
    });



}(this));



(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;
    var _ = Bmob._;

    /**
     * @namespace è¿è¡Œäº‘ç«¯ä»£ç 
     * <a href="cloudcode/developdoc/index.html?menukey=develop_doc&key=develop_cloudcode">cloud functions</a>.
     */
    Bmob.Cloud = Bmob.Cloud || {};

    _.extend(Bmob.Cloud, /** @lends Bmob.Cloud */ {
        /**
         * è¿è¡Œäº‘ç«¯ä»£ç 
         * @param {String} äº‘ç«¯ä»£ç çš„å‡½æ•°å
         * @param {Object} ä¼ äººäº‘ç«¯ä»£ç çš„å‚æ•°
         * @param {Object} options  Backbone-style options å¯¹è±¡ã€‚
         * options.success, å¦‚æžœè®¾ç½®äº†ï¼Œå°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨æˆåŠŸçš„æƒ…å†µã€‚  options.error å¦‚æžœè®¾ç½®äº†ï¼Œå°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨å¤±è´¥çš„æƒ…å†µã€‚  ä¸¤ä¸ªå‡½æ•°éƒ½æ˜¯å¯é€‰çš„ã€‚ä¸¤ä¸ªå‡½æ•°éƒ½åªæœ‰ä¸€ä¸ªå‚æ•°ã€‚
         * @return {Bmob.Promise} A promise å°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨çš„æƒ…å†µã€‚
         */
        run: function(name, data, options) {
            var request = Bmob._request("functions", name, null, 'POST',
                Bmob._encode(data, null, true));

            return request.then(function(resp) {
                return Bmob._decode(null, resp).result;
            })._thenRunCallbacks(options);
        }
    });
}(this));


(function(root) {
    root.Bmob = root.Bmob || {};
    var Bmob = root.Bmob;

    Bmob.Installation = Bmob.Object.extend("_Installation");

    /**
     * åŒ…å«pushçš„å‡½æ•°
     * @name Bmob.Push
     * @namespace æŽ¨é€æ¶ˆæ¯
     */
    Bmob.Push = Bmob.Push || {};

    /**
     * æŽ¨é€æ¶ˆæ¯
     * @param {Object} data -  å…·ä½“çš„å‚æ•°è¯·æŸ¥çœ‹<a href="http://docs.bmob.cn/restful/developdoc/index.html?menukey=develop_doc&key=develop_restful">æŽ¨é€æ–‡æ¡£</a>.
     * @param {Object} options options å¯¹è±¡ã€‚ options.success, å¦‚æžœè®¾ç½®äº†ï¼Œå°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨æˆåŠŸçš„æƒ…å†µã€‚ options.error å¦‚æžœè®¾ç½®äº†ï¼Œå°†ä¼šå¤„ç†äº‘ç«¯ä»£ç è°ƒç”¨å¤±è´¥çš„æƒ…å†µã€‚ ä¸¤ä¸ªå‡½æ•°éƒ½æ˜¯å¯é€‰çš„ã€‚ä¸¤ä¸ªå‡½æ•°éƒ½åªæœ‰ä¸€ä¸ªå‚æ•°ã€‚
     */
    Bmob.Push.send = function(data, options) {
        if (data.where) {
            data.where = data.where.toJSON().where;
        }

        if (data.push_time) {
            data.push_time = data.push_time.toJSON();
        }

        if (data.expiration_time) {
            data.expiration_time = data.expiration_time.toJSON();
        }

        if (data.expiration_time && data.expiration_time_interval) {
            throw "Both expiration_time and expiration_time_interval can't be set";
        }

        var request = Bmob._request('push', null, null, 'POST', data);
        return request._thenRunCallbacks(options);
    };
}(this));