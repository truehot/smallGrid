(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Query": {
            "Sorter": SorterQuery
        }
    });

    function SorterQuery(field, sortOrder, sortComparer) {
        var self = this,
            id = SmallGrid.Utils.createGuid();

        function getId() {
            return id;
        }

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
            "getId": getId,
            "getField": getField,
            "getSortOrder": getSortOrder,
            "getSortComparer": getSortComparer
        });
    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});