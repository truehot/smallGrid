(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Query": {
            "Request": Request
        }
    });

    function Request(filters, sorters, dataModel) {

        function sortRows() {
            for (var i = 0; i < sorters.length; i++) {
                var sorter = sorters[i];
                dataModel.sort(
                    SmallGrid.Column.Comparer[sorter.getSortComparer()]({
                        "sortOrder": sorter.getSortOrder(),
                        "field": sorter.getField()
                    })
                );
            }
        }

        function sortColumns() {
            for (var i = 0; i < sorters.length; i++) {
                var sorter = sorters[i];
                dataModel.sort(
                    SmallGrid.Column.Comparer[sorter.getSortComparer()]({
                        "sortOrder": sorter.getSortOrder(),
                        "field": sorter.getField()
                    })
                );
            }
        }

        function getRowsInRange(top, height, outerHeight) {
            sortRows();
            return dataModel.filter(RowsRangeByHeight(top, height, outerHeight, getRowFilter()));
        }

        function getColumnsInRange(left, width, outerWidth) {
            return dataModel.filter(ColumnsRangeByWidth(left, width, outerWidth, getColumnFilter()));
        }

        function getColumnsTotal(width) {
            var total = {
                width: 0,
                count: 0
            };
            var columns = dataModel.getColumns();
            var filter = getColumnFilter();

            for (var i = 0; i < columns.length; i++) {
                if ((filter && (filter(columns[i]) === false)) || (columns[i].hidden === true)) continue;
                total.width += columns[i].width + width;
                total.count++;
            }

            return total;
        }

        function getRowsTotal(height) {
            var total = {
                height: 0,
                count: 0
            };
            var rows = dataModel.getRows();
            var filter = getRowFilter();

            for (var i = 0; i < rows.length; i++) {
                if ((filter && (filter(rows[i]) === false)) || (rows[i].hidden === true)) continue;
                total.height += rows[i].height + height;
                total.count++;
            }
            return total;
        }

        function getColumnFilter() {
            return "";
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
                            convertedQuery += " (item.item['" + field + "'] == '" + query.value + "') === true ";
                            break;

                        case 'neq':
                            convertedQuery += " (item.item['" + field + "'] == '" + query.value + "') === false ";
                            break;

                        case 'startsWith':
                            convertedQuery += " (('' + item.item['" + field + "']).indexOf('" + query.value + "') === 0) === true ";
                            break;

                        case 'endsWith':
                            convertedQuery += " (('' + item.item['" + field + "']).indexOf('" + query.value + "', item.item['" + field + "'].length - '" + query.value + "'.length) !== -1) === true ";
                            break;

                        case 'contains':
                            convertedQuery += " (('' + item.item['" + field + "']).indexOf('" + query.value + "') !== -1) === true ";
                            break;

                        case 'doesNotContain':
                            convertedQuery += " (('' + item.item['" + field + "']).indexOf('" + query.value + "') !== -1) === false ";
                            break;
                    }
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

        function ColumnsRangeByWidth(center, width, outerWidth, filter) {
            var calcWidth = 0, min = center - width - outerWidth, max = center + 2 * width + outerWidth, filterIndex = 0;
            return function (item, index, array) {
                if ((filter && (filter(item) === false)) || (item.hidden === true)) return false;
                filterIndex++;

                var inRange = min <= calcWidth && calcWidth <= max;

                calcWidth += outerWidth + item.width;

                if (inRange || (min <= calcWidth && calcWidth <= max)) {
                    item.calcWidth = calcWidth;
                    item.calcIndex = filterIndex;
                    return true;
                }

                return false;
            };
        }

        function RowsRangeByHeight(center, height, outerHeight, filter) {
            var calcHeight = 0, min = center - height - outerHeight, max = center + 2 * height + outerHeight, filterIndex = 0;
            return function (item, index, array) {
                if (filter && (filter(item) === false) || (item.hidden === true)) return false;
                filterIndex++;

                var inRange = min <= calcHeight && calcHeight <= max;

                calcHeight += outerHeight + item.height;

                if (inRange || (min <= calcHeight && calcHeight <= max)) {
                    item.calcHeight = calcHeight;
                    item.calcIndex = filterIndex;
                    return true;
                }

                return false;
            };
        }

        $.extend(this, {
            "getColumnsInRange": getColumnsInRange,
            "getColumnsTotal": getColumnsTotal,
            "getRowsTotal": getRowsTotal,
            "getRowsInRange": getRowsInRange
        });
    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});