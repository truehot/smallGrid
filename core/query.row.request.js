(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Query": {
            "Row": {
                "Request": Request,
                "Create": CreateRequest
            }
        }
    });

    function Request(dataModel) {

        function getConvertedQuery(field, val, action) {
            var result = "";
            var value = val.replace(/'/g, "\\'");

            switch (action) {
                case 'and':
                    result += " && ";
                    break;
                case 'or':
                    result += " || ";
                    break;

                case 'eq':
                    result += " (item.item['" + field + "'] == '" + value + "') === true ";
                    break;

                case 'neq':
                    result += " (item.item['" + field + "'] == '" + value + "') === false ";
                    break;

                case 'startsWith':
                    result += " (('' + item.item['" + field + "']).indexOf('" + value + "') === 0) === true ";
                    break;

                case 'endsWith':
                    result += " (('' + item.item['" + field + "']).indexOf('" + value + "', item.item['" + field + "'].length - '" + value + "'.length) !== -1) === true ";
                    break;

                case 'contains':
                    result += " (('' + item.item['" + field + "']).indexOf('" + value + "') !== -1) === true ";
                    break;

                case 'doesNotContain':
                    result += " (('' + item.item['" + field + "']).indexOf('" + value + "') !== -1) === false ";
                    break;
            }

            return result;
        }

        function getFilterFunc(filters) {
            var resultQuery = "";

            for (var i = 0; i < filters.length; i++) {
                var queries = filters[i].get(),
                    field = filters[i].getField(),
                    convertedQuery = "";

                for (var ii = 0; ii < queries.length; ii++) {
                    convertedQuery += getConvertedQuery(field, queries[ii].value, queries[ii].action);
                }

                if (convertedQuery.length) {
                    if (i !== 0) {
                        resultQuery += ' && ';
                    }
                    resultQuery += '(' + convertedQuery + ')';
                }
            }

            if (resultQuery.length) {
                return new Function('item', "return " + resultQuery);
            }
        }

        function rowsRangeByHeight(center, height, outerHeight, filter) {
            var calcHeight = 0, inRange = false, min = center - height - outerHeight, max = center + 2 * height + outerHeight, filterIndex = 0;
            return function (item, index, array) {
                if (filter && (filter(item) === false) || (item.hidden === true)) return false;
                filterIndex++;

                inRange = min <= calcHeight && calcHeight <= max;
                calcHeight += outerHeight + item.height;

                if (inRange || (min <= calcHeight && calcHeight <= max)) {
                    item.calcHeight = calcHeight;
                    item.calcIndex = filterIndex;
                    return true;
                }

                return false;
            };
        }

        /* 
         * Public API
         */
        function getRowsInRange(top, height, outerHeight, sorters, filters) {
            for (var i = 0; i < sorters.length; i++) {
                dataModel.sort(
                    SmallGrid.Column.Comparer[sorters[i].getSortComparer()]({
                        "sortOrder": sorters[i].getSortOrder(),
                        "field": sorters[i].getField()
                    })
                );
            }

            return dataModel.filter(rowsRangeByHeight(top, height, outerHeight, getFilterFunc(filters)));
        }

        function getRowsTotal(height, filters) {
            var total = {
                height: 0,
                count: 0
            };
            var rows = dataModel.getRows();
            var filter = getFilterFunc(filters);

            for (var i = 0; i < rows.length; i++) {
                if ((filter && (filter(rows[i]) === false)) || (rows[i].hidden === true)) continue;
                total.height += rows[i].height + height;
                total.count++;
            }
            return total;
        }

        $.extend(this, {
            "getRowsInRange": getRowsInRange,
            "getRowsTotal": getRowsTotal
        });
    }

    function CreateRequest(dataModel) {
        if (dataModel instanceof SmallGrid.Row.Model === false) {
            throw new TypeError("Rows model is not defined.");
        }

        return new SmallGrid.Query.Row.Request(dataModel);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});