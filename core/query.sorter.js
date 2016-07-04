(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Query": {
            "SorterQuery": SorterQuery
        }
    });

    function SorterQuery(field, sortOrder, sortComparer) {
        var self = this;

        function getField() {
            return field;
        }

        function getSortOrder() {
            return sortOrder;
        }

        function getSortComparer() {
            return sortComparer;
        }

        $.extend(this, {
            "getField": getField,
            "getSortOrder": getSortOrder,
            "getSortComparer": getSortComparer
        });
    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});