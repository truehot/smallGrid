(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Query": {
            "Column": {
                "Request": Request,
                "Create": Create
            }
        }
    });

    function Request(dataModel) {

        function columnsRangeByWidth(center, width, outerWidth) {
            var calcWidth = 0, inRange = false, min = center - width - outerWidth, max = center + 2 * width + outerWidth, filterIndex = 0;
            return function (item, index, array) {
                if (item.hidden === true) return false;
                filterIndex++;

                inRange = min <= calcWidth && calcWidth <= max;
                calcWidth += outerWidth + item.width;

                if (inRange || (min <= calcWidth && calcWidth <= max)) {
                    item.calcWidth = calcWidth;
                    item.calcIndex = filterIndex;
                    return true;
                }

                return false;
            };
        }

        function getColumnsInRange(left, width, outerWidth) {
            return dataModel.filter(columnsRangeByWidth(left, width, outerWidth));
        }

        function getColumnsTotal(width) {
            var total = {
                width: 0,
                count: 0
            };
            var columns = dataModel.getColumns();

            for (var i = 0; i < columns.length; i++) {
                if (columns[i].hidden === true) continue;
                total.width += columns[i].width + width;
                total.count++;
            }

            return total;
        }

        $.extend(this, {
            "getColumnsInRange": getColumnsInRange,
            "getColumnsTotal": getColumnsTotal
        });
    }

    function Create(dataModel) {
        if (dataModel instanceof SmallGrid.Column.Model === false) {
            throw new TypeError("Column model is not defined.");
        }

        return new SmallGrid.Query.Column.Request(dataModel);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});