(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.output = factory());
}(this, (function () { 'use strict';

    function isPromise(value) {
        return value &&
            value.then && typeof value.then == "function" &&
            value.catch && typeof value.catch == "function";
    }

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var serializeArray_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function serializeArray(jsonObject, keys, path) {
        if (jsonObject.length) {
            for (var keyName in jsonObject) {
                if (keyName) {
                    var keyValue = jsonObject[keyName];
                    var elementName = path + "[" + keyName + "]";
                    serializeToArray_1.serializeToArray(keyValue, keys, elementName);
                }
            }
        }
        else {
            keys[path] = jsonObject;
        }
    }
    exports.serializeArray = serializeArray;
    });

    unwrapExports(serializeArray_1);
    var serializeArray_2 = serializeArray_1.serializeArray;

    var serializeObject_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function serializeObject(jsonObject, keys, path) {
        for (var keyName in jsonObject) {
            if (keyName) {
                var keyValue = jsonObject[keyName];
                var elementName = "" + keyName;
                if (path && typeof path === "string") {
                    elementName = path + "." + keyName;
                }
                serializeToArray_1.serializeToArray(keyValue, keys, elementName);
            }
        }
    }
    exports.serializeObject = serializeObject;
    });

    unwrapExports(serializeObject_1);
    var serializeObject_2 = serializeObject_1.serializeObject;

    var serializeToArray_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    function serializeToArray(jsonObject, keys, path) {
        keys = keys || [];
        path = path || "";
        if (jsonObject instanceof Array) {
            serializeArray_1.serializeArray(jsonObject, keys, path);
        }
        else if (jsonObject instanceof Object && !(jsonObject instanceof Date) && !(jsonObject instanceof Function)) {
            serializeObject_1.serializeObject(jsonObject, keys, path);
        }
        else {
            keys[path] = jsonObject;
        }
        return keys;
    }
    exports.serializeToArray = serializeToArray;
    });

    unwrapExports(serializeToArray_1);
    var serializeToArray_2 = serializeToArray_1.serializeToArray;

    var extractFilters_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function _extractFilterBySymbol(filter, symbol) {
        if (symbol.length) {
            return filter.substring(symbol.length);
        }
        else {
            return filter;
        }
    }
    function _extractFilterBySymbols(filter, symbolPatterns) {
        for (var _i = 0, symbolPatterns_1 = symbolPatterns; _i < symbolPatterns_1.length; _i++) {
            var symbolPattern = symbolPatterns_1[_i];
            var symbol = _getSymbol(filter, symbolPattern);
            if (symbol !== null) {
                return _extractFilterBySymbol(filter, symbol);
            }
        }
        return null;
    }
    function _getSymbol(filter, symbol) {
        var matches = symbol.exec(filter);
        symbol.lastIndex = 0;
        if (matches && matches.length > 1) {
            return matches[1];
        }
        return null;
    }
    function extractFilters(filters, symbolPatterns) {
        var extract = [];
        for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
            var filter = filters_1[_i];
            var formattedFilter = _extractFilterBySymbols(filter, symbolPatterns);
            if (formattedFilter) {
                extract.push(formattedFilter);
            }
        }
        return extract;
    }
    exports.extractFilters = extractFilters;
    });

    unwrapExports(extractFilters_1);
    var extractFilters_2 = extractFilters_1.extractFilters;

    var jsonExcludePropertyFilter = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var JsonExcludePropertyFilter = (function () {
        function JsonExcludePropertyFilter(_properties) {
            this._properties = _properties;
        }
        JsonExcludePropertyFilter.prototype.apply = function (source) {
            if (this._properties.length) {
                for (var _i = 0, _a = this._properties; _i < _a.length; _i++) {
                    var rule = _a[_i];
                    this._exclude(rule, source);
                }
                return source;
            }
            return source;
        };
        JsonExcludePropertyFilter.prototype._exclude = function (rule, source) {
            if (rule.match(JsonExcludePropertyFilter.ALL_PROPERTIES_REGEX)) {
                this._excludeProperties(rule, source);
            }
            else if (rule.match(JsonExcludePropertyFilter.ALL_ELEMENT_PROPERTIES_REGEX)) {
                this._excludeRootProperties(rule, source);
            }
            else {
                this._excludeSpecificPath(rule, source);
            }
        };
        JsonExcludePropertyFilter.prototype._excludeProperty = function (rule, source, path) {
            var pathWithoutArrayIndexStart = this._removeArrayIndexStart(path);
            var regexp = "^" + rule.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
            if (pathWithoutArrayIndexStart.match(regexp)) {
                delete source[path];
            }
        };
        JsonExcludePropertyFilter.prototype._excludeProperties = function (rule, source) {
            var formattedRule = rule.substr(0, rule.length - 2);
            for (var path in source) {
                if (path) {
                    this._excludeProperty(formattedRule, source, path);
                }
            }
        };
        JsonExcludePropertyFilter.prototype._excludeRootProperty = function (rule, path, source) {
            var pathWithoutIndex = this._removeArrayIndex(path);
            if (rule === JsonExcludePropertyFilter.STRING_EMPTY) {
                var pathWithoutArrayIndexStart = this._removeArrayIndexStart(path);
                var splittedPath = pathWithoutArrayIndexStart.split(JsonExcludePropertyFilter.PATH_SEPARATOR);
                if (splittedPath.length === 1) {
                    delete source[path];
                }
            }
            else {
                var regexp = "^" + rule.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
                if (pathWithoutIndex.match(regexp)) {
                    var pathItems = pathWithoutIndex.split(JsonExcludePropertyFilter.PATH_SEPARATOR);
                    var ruleItems = rule.split(JsonExcludePropertyFilter.PATH_SEPARATOR);
                    if (pathItems.length === ruleItems.length) {
                        delete source[path];
                    }
                }
            }
        };
        JsonExcludePropertyFilter.prototype._excludeRootProperties = function (rule, source) {
            var ruleWithoutRootSymbol = rule.substr(0, rule.length - 1);
            for (var path in source) {
                if (path) {
                    this._excludeRootProperty(ruleWithoutRootSymbol, path, source);
                }
            }
        };
        JsonExcludePropertyFilter.prototype._excludeSpecificPath = function (rule, source) {
            var regexp = "^" + rule.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
            for (var path in source) {
                if (path) {
                    var pathWithoutArrayIndexStart = this._removeArrayIndexStart(path);
                    var pathWithoutIndex = this._removeArrayIndex(pathWithoutArrayIndexStart);
                    if (pathWithoutIndex.match(regexp)) {
                        var pathWithoutIndexItems = pathWithoutIndex.split(JsonExcludePropertyFilter.PATH_SEPARATOR);
                        var ruleItems = rule.split(".");
                        var pathWithoutIndexItem = pathWithoutIndexItems[ruleItems.length - 1];
                        var ruleItem = ruleItems[ruleItems.length - 1];
                        if (pathWithoutIndexItem === ruleItem) {
                            delete source[path];
                        }
                    }
                }
            }
        };
        JsonExcludePropertyFilter.prototype._removeArrayIndex = function (path) {
            return path.replace(JsonExcludePropertyFilter.ARRAY_INDEX, JsonExcludePropertyFilter.STRING_EMPTY);
        };
        JsonExcludePropertyFilter.prototype._removeArrayIndexStart = function (path) {
            return path.replace(JsonExcludePropertyFilter.ARRAY_INDEX_START, JsonExcludePropertyFilter.STRING_EMPTY);
        };
        JsonExcludePropertyFilter.ALL_PROPERTIES_REGEX = /\*\*$/g;
        JsonExcludePropertyFilter.ALL_ELEMENT_PROPERTIES_REGEX = /\*$/g;
        JsonExcludePropertyFilter.ARRAY_INDEX = /\[[0-9]+\]/g;
        JsonExcludePropertyFilter.ARRAY_INDEX_START = /^\[([0-9]+)\]\./;
        JsonExcludePropertyFilter.PATH_SEPARATOR = ".";
        JsonExcludePropertyFilter.STRING_EMPTY = "";
        return JsonExcludePropertyFilter;
    }());
    exports.JsonExcludePropertyFilter = JsonExcludePropertyFilter;
    });

    unwrapExports(jsonExcludePropertyFilter);
    var jsonExcludePropertyFilter_1 = jsonExcludePropertyFilter.JsonExcludePropertyFilter;

    var jsonIncludePropertyFilter = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var JsonIncludePropertyFilter = (function () {
        function JsonIncludePropertyFilter(_properties) {
            this._properties = _properties;
        }
        JsonIncludePropertyFilter.prototype.apply = function (source) {
            if (this._properties.length) {
                var destination = [];
                for (var _i = 0, _a = this._properties; _i < _a.length; _i++) {
                    var rule = _a[_i];
                    this._include(rule, source, destination);
                }
                return destination;
            }
            else {
                return source;
            }
        };
        JsonIncludePropertyFilter.prototype._include = function (rule, source, destination) {
            if (rule.match(JsonIncludePropertyFilter.ALL_PROPERTIES_REGEX)) {
                this._includeProperties(rule, source, destination);
            }
            else if (rule.match(JsonIncludePropertyFilter.ALL_ELEMENT_PROPERTIES_REGEX)) {
                this._includeRootProperties(rule, source, destination);
            }
            else {
                this._includeSpecificPath(rule, source, destination);
            }
        };
        JsonIncludePropertyFilter.prototype._includeProperty = function (rule, path, value, destination) {
            var cleanPath = this._removeArrayIndexStart(path);
            var regexp = "^" + rule.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
            if (cleanPath.match(regexp)) {
                destination[path] = value;
            }
        };
        JsonIncludePropertyFilter.prototype._includeProperties = function (rule, source, destination) {
            var formattedRule = rule.substr(0, rule.length - 2);
            for (var path in source) {
                if (path) {
                    var value = source[path];
                    this._includeProperty(formattedRule, path, value, destination);
                }
            }
        };
        JsonIncludePropertyFilter.prototype._includeRootProperty = function (rule, path, value, source, destination) {
            var pathWithoutArrayIndexStart = this._removeArrayIndexStart(path);
            if (rule === JsonIncludePropertyFilter.STRING_EMPTY) {
                var splittedPath = pathWithoutArrayIndexStart.split(JsonIncludePropertyFilter.PATH_SEPARATOR);
                if (splittedPath.length === 1) {
                    destination[path] = value;
                }
            }
            else {
                var regexp = "^" + rule.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
                if (pathWithoutArrayIndexStart.match(regexp)) {
                    var pathItems = pathWithoutArrayIndexStart.split(JsonIncludePropertyFilter.PATH_SEPARATOR);
                    var ruleItems = rule.split(JsonIncludePropertyFilter.PATH_SEPARATOR);
                    if (pathItems.length === ruleItems.length) {
                        destination[path] = value;
                    }
                }
            }
        };
        JsonIncludePropertyFilter.prototype._includeRootProperties = function (rule, source, destination) {
            var ruleWithoutRootSymbol = rule.substr(0, rule.length - 1);
            for (var path in source) {
                if (path) {
                    var value = source[path];
                    this._includeRootProperty(ruleWithoutRootSymbol, path, value, source, destination);
                }
            }
        };
        JsonIncludePropertyFilter.prototype._includeSpecificPath = function (rule, source, destination) {
            for (var path in source) {
                if (path) {
                    var pathWithoutArrayIndexStart = this._removeArrayIndexStart(path);
                    var pathWithoutIndex = this._removeArrayIndex(pathWithoutArrayIndexStart);
                    var regexp = "^" + rule;
                    if (pathWithoutIndex.match(regexp)) {
                        destination[path] = source[path];
                    }
                }
            }
        };
        JsonIncludePropertyFilter.prototype._removeArrayIndex = function (path) {
            return path.replace(JsonIncludePropertyFilter.ARRAY_INDEX, JsonIncludePropertyFilter.STRING_EMPTY);
        };
        JsonIncludePropertyFilter.prototype._removeArrayIndexStart = function (path) {
            return path.replace(JsonIncludePropertyFilter.ARRAY_INDEX_START, JsonIncludePropertyFilter.STRING_EMPTY);
        };
        JsonIncludePropertyFilter.ALL_PROPERTIES_REGEX = /\*\*$/g;
        JsonIncludePropertyFilter.ALL_ELEMENT_PROPERTIES_REGEX = /\*$/g;
        JsonIncludePropertyFilter.ARRAY_INDEX = /\[[0-9]+\]/g;
        JsonIncludePropertyFilter.ARRAY_INDEX_START = /^\[([0-9]+)\]\./;
        JsonIncludePropertyFilter.PATH_SEPARATOR = ".";
        JsonIncludePropertyFilter.STRING_EMPTY = "";
        return JsonIncludePropertyFilter;
    }());
    exports.JsonIncludePropertyFilter = JsonIncludePropertyFilter;
    });

    unwrapExports(jsonIncludePropertyFilter);
    var jsonIncludePropertyFilter_1 = jsonIncludePropertyFilter.JsonIncludePropertyFilter;

    var isArray_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function isArray(arr) {
        var keys = Object.keys(arr);
        var firstKey = keys[0];
        if (firstKey) {
            var isArrayRegexp = /^\[([0-9]+)\]/;
            return isArrayRegexp.test(firstKey);
        }
        return false;
    }
    exports.isArray = isArray;
    });

    unwrapExports(isArray_1);
    var isArray_2 = isArray_1.isArray;

    var serializeToObject_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    function _serialize(jsonObject, index, key, value, path) {
        var currentKey = path[index];
        var arrayFormat = /\[([0-9]+)\]$/;
        if (arrayFormat.test(currentKey)) {
            return _serializeArray(jsonObject, index, currentKey, value, path, arrayFormat);
        }
        else {
            return _serializeObject(jsonObject, index, currentKey, value, path);
        }
    }
    function _serializeObject(jsonObject, index, key, value, path) {
        if (typeof jsonObject === "object") {
            if (!(key in jsonObject)) {
                jsonObject[key] = jsonObject[key] || {};
            }
            var pathLength = path.length - 1;
            if (index === pathLength) {
                jsonObject[key] = value;
            }
            else {
                jsonObject[key] = jsonObject[key] || {};
                jsonObject = jsonObject[key];
            }
        }
        return jsonObject;
    }
    function _serializeArray(jsonObject, index, key, value, path, arrayFormat) {
        var arrayIndex = key.match(arrayFormat)[1];
        var formattedCurrentKey = key.replace(arrayFormat, "");
        var indexNextItem = index + 1;
        if (formattedCurrentKey) {
            jsonObject[formattedCurrentKey] = jsonObject[formattedCurrentKey] || [];
            if (indexNextItem < path.length) {
                jsonObject[formattedCurrentKey][arrayIndex] = jsonObject[formattedCurrentKey][arrayIndex] || {};
                jsonObject = jsonObject[formattedCurrentKey][arrayIndex];
            }
            else {
                jsonObject[formattedCurrentKey][arrayIndex] = value;
            }
        }
        else {
            if (indexNextItem < path.length) {
                jsonObject[arrayIndex] = jsonObject[arrayIndex] || {};
                jsonObject = jsonObject[arrayIndex];
            }
            else {
                jsonObject[arrayIndex] = value;
            }
        }
        return jsonObject;
    }
    function serializeToObject(arr) {
        var jsonObject = {};
        if (isArray_1.isArray(arr)) {
            jsonObject = [];
        }
        for (var key in arr) {
            if (key) {
                var value = arr[key];
                var path = key.split(".");
                var currentJsonObject = jsonObject;
                for (var index = 0; index < path.length; index++) {
                    currentJsonObject = _serialize(currentJsonObject, index, key, value, path);
                }
            }
        }
        return jsonObject;
    }
    exports.serializeToObject = serializeToObject;
    });

    unwrapExports(serializeToObject_1);
    var serializeToObject_2 = serializeToObject_1.serializeToObject;

    var jsonPropertyFilter = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });





    var JsonPropertyFilter = (function () {
        function JsonPropertyFilter(filters, separator, excludeSymbols, includeSymbols) {
            this._excludeFilters = [];
            this._includeFilters = [];
            if (filters) {
                this.setExcludeFilters(filters, separator, excludeSymbols);
                this.setIncludeFilters(filters, separator, includeSymbols);
            }
        }
        Object.defineProperty(JsonPropertyFilter.prototype, "excludeFilters", {
            get: function () {
                return this._excludeFilters;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonPropertyFilter.prototype, "includeFilters", {
            get: function () {
                return this._includeFilters;
            },
            enumerable: true,
            configurable: true
        });
        JsonPropertyFilter.prototype.apply = function (source) {
            var keys = serializeToArray_1.serializeToArray(source);
            var filtered = [];
            filtered = this._applyInclude(keys);
            filtered = this._applyExcludeFilters(filtered);
            return serializeToObject_1.serializeToObject(filtered);
        };
        JsonPropertyFilter.prototype.setExcludeFilters = function (filters, separator, symbols) {
            this._assertFilters(filters);
            this._assertSeparator(separator);
            var formattedProperties = this._formatProperties(filters, separator);
            var excludeSymbols = symbols || [JsonPropertyFilter.EXCLUDE_SYMBOL];
            this._excludeFilters = extractFilters_1.extractFilters(formattedProperties, excludeSymbols);
        };
        JsonPropertyFilter.prototype.setIncludeFilters = function (filters, separator, symbols) {
            this._assertFilters(filters);
            this._assertSeparator(separator);
            var formattedProperties = this._formatProperties(filters, separator);
            var includeSymbols = symbols || [
                JsonPropertyFilter.INCLUDE_SYMBOL,
                JsonPropertyFilter.DEFAULT_INCLUDE_SYMBOL,
            ];
            this._includeFilters = extractFilters_1.extractFilters(formattedProperties, includeSymbols);
        };
        JsonPropertyFilter.prototype._applyInclude = function (source) {
            var include = new jsonIncludePropertyFilter.JsonIncludePropertyFilter(this._includeFilters);
            return include.apply(source);
        };
        JsonPropertyFilter.prototype._applyExcludeFilters = function (source) {
            var exclude = new jsonExcludePropertyFilter.JsonExcludePropertyFilter(this._excludeFilters);
            return exclude.apply(source);
        };
        JsonPropertyFilter.prototype._assertFilters = function (filters) {
            if (!Array.isArray(filters) && typeof filters !== "string") {
                throw new TypeError("Parameter 'filters' is not a string or array type.");
            }
        };
        JsonPropertyFilter.prototype._assertSeparator = function (separator) {
            if (separator && typeof separator !== "string") {
                throw new TypeError("Parameter 'separator' is not a string type.");
            }
        };
        JsonPropertyFilter.prototype._formatProperties = function (properties, separator) {
            if (typeof properties === "string") {
                var separatorFilters = separator || JsonPropertyFilter.FILTER_SEPARATOR;
                return properties.split(separatorFilters);
            }
            else {
                return properties;
            }
        };
        JsonPropertyFilter.DEFAULT_INCLUDE_SYMBOL = /^()[^+-]/g;
        JsonPropertyFilter.EXCLUDE_SYMBOL = /^(\-)/g;
        JsonPropertyFilter.FILTER_SEPARATOR = ",";
        JsonPropertyFilter.INCLUDE_SYMBOL = /^(\+)/g;
        return JsonPropertyFilter;
    }());
    exports.JsonPropertyFilter = JsonPropertyFilter;
    });

    unwrapExports(jsonPropertyFilter);
    var jsonPropertyFilter_1 = jsonPropertyFilter.JsonPropertyFilter;

    function Filter(source, filterExpression) {
        let filter = new jsonPropertyFilter_1(filterExpression);
        return filter.apply(source);
    }

    function resolvePromise(next,action)
    {
        action.payload.then((result) => {
                let propName = result.jsonProperty;

                let jsonData = propName ? result[propName] : result;

                action.data = jsonData;

                if (action.filter) {
                    action.data = Filter(jsonData,action.filter);
                }
                
                action.type += "_Resolved";

                next(action);

            }).catch(ex => {
                action.errorMessage = ex.errorMessage;

                action.type += "_Error";

                next(action);
            });
    }

    function resolveJsonObject(next, action) {

        let jsonData = action.payload;
        action.data = jsonData;
        if (action.filter) {
            action.data = Filter(jsonData, action.filter);
        }
        action.type += "_Resolved";
        next(action);
    }

    var index = (store) => (next) => (action) => {

        if (action.payload && isPromise(action.payload)) {
            resolvePromise(next, action);
        }
        else if (action.payload) {
            resolveJsonObject(next, action);
        }
        else {
            next(action);
        }
    };

    return index;

})));
