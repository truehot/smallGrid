"use strict";

(function ($) {
    $.extend(true, window, {
        "SmallGrid": {
            "Filter": {
                "FilterRequest": FilterRequest,
            }
        }
    });

    function FilterRequest(filters, dataModel) {

        function getRowsInRange(top, height, outerHeight) {
            return dataModel.filter(new rowsRangeByHeight(top, height, outerHeight, getRowFilter()));
        }

        function getColumnsInRange(left, width, outerWidth) {
            return dataModel.filter(new columnsRangeByWidth(left, width, outerWidth, getColumnFilter()));
        }

        function getColumnsWidth(width) {
            return dataModel.reduce(new columnsFullWidth(width, getColumnFilter()), 0);
        }

        function getRowsHeight(height) {
            return dataModel.reduce(new itemFullHeight(height, getRowFilter()), 0);
        }

        function getColumnFilter() {

        }

        function getRowFilter() {
            var resultQuery = "";

            for (var i = 0; i < filters.length; i++) {
                var queries = filters[i].get(),
                    field = filters[i].getField(),
                    convertedQuery = "";
                for (var ii = 0; ii < queries.length; ii++) {
                    var query = queries[ii];

                    switch (query.action) {
                        case 'and':
                            convertedQuery += " && ";
                            break;
                        case 'or':
                            convertedQuery += " || ";
                            break;

                        case 'eq':
                            convertedQuery += " isEqual(item.item['" + field + "'], '" + query.value + "') === true ";
                            break;

                        case 'neq':
                            convertedQuery += " isEqual(item.item['" + field + "'], '" + query.value + "') === false ";
                            break;

                        case 'startsWith':
                            convertedQuery += " startsWith(item.item['" + field + "'], '" + query.value + "') === true ";
                            break;

                        case 'endsWith':
                            convertedQuery += " endsWith(item.item['" + field + "'], '" + query.value + "') === true ";
                            break;

                        case 'contains':
                            convertedQuery += " contains(item.item['" + field + "'], '" + query.value + "') === true ";
                            break;

                        case 'doesNotContain':
                            convertedQuery += " contains(item.item['" + field + "'], '" + query.value + "') === false ";
                            break;
                    }
                };

                if (convertedQuery.length) {
                    if (i !== 0) {
                        resultQuery += " && ";
                    }
                    resultQuery += '(' + convertedQuery + ')';
                }
            }
            return resultQuery;
        }

        function isEqual(str1, str2) {
            return (str1 == str2);
        }

        function startsWith(str, suffix) {
            return ('' + str).indexOf(suffix) === 0;
        }

        function endsWith(str, suffix) {
            return ('' + str).indexOf(suffix, str.length - suffix.length) !== -1;
        }

        function contains(str, search) {
            return ('' + str).indexOf(search) !== -1;
        }

        function columnsFullWidth(outerWidth, filter) {
            if (filter) {
                var f = new Function('item', 'return ' + resultQuery);
                return function (prev, item) {
                    if (f(item) === false) return prev;
                    return prev + item.width + outerWidth;
                };
            } else {
                return function (prev, item) {
                    return prev + item.width + outerWidth;
                };
            }

        }

        function itemFullHeight(outerHeight, filter) {
            if (filter) {
                var f = new Function('item', 'return ' + resultQuery);
                return function (prev, item) {
                    if (f(item) === false) return prev;
                    return prev + item.height + outerHeight;
                };
            } else {
                return function (prev, item) {
                    return prev + item.height + outerHeight;
                };
            }
        }

        function columnsRangeByWidth(center, width, outerWidth, filter) {
            var calcWidth = 0, min = center - 2 * width - outerWidth, max = center + 2 * width + outerWidth;
            if (filter) {
                var f = new Function('item', 'return ' + resultQuery);
                return function (item, index, array) {
                    if (!(f(item) === false)) {
                        calcWidth += outerWidth + item.width;
                        if (min <= calcWidth && calcWidth <= max) {
                            item.calcWidth = calcWidth;
                            item.calcIndex = index;
                            return true;
                        }
                    }
                    return false;
                };
            } else {
                return function (item, index, array) {
                    calcWidth += outerWidth + item.width;
                    if (min <= calcWidth && calcWidth <= max) {
                        item.calcWidth = calcWidth;
                        item.calcIndex = index;
                        return true;
                    }
                    return false;
                };
            }
        }

        function rowsRangeByHeight(center, height, outerHeight, filter) {
            var calcHeight = 0, min = center - 2 * height - outerHeight, max = center + 2 * height + outerHeight;
            if (filter) {
                return function (item, index, array) {
                    if (!(f(item) === false)) {
                        calcHeight += outerHeight + item.height;
                        if (min <= calcHeight && calcHeight <= max) {
                            item.calcHeight = calcHeight;
                            item.calcIndex = index;
                            return true;
                        }
                    }
                    return false;
                };
            } else {
                return function (item, index, array) {
                    calcHeight += outerHeight + item.height;
                    if (min <= calcHeight && calcHeight <= max) {
                        item.calcHeight = calcHeight;
                        item.calcIndex = index;
                        return true;
                    }

                    return false;
                };
            }
        }

        $.extend(this, {
            "getColumnsInRange": getColumnsInRange,
            "getColumnsWidth": getColumnsWidth,
            "getRowsHeight": getRowsHeight,
            "getRowsInRange": getRowsInRange,
        });

    }
})(jQuery);