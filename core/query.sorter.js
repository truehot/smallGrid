(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Query": {
                "SorterQuery": SorterQuery,
            }
        }
    });

    function SorterQuery(field, sortOrder, sortComparer, settings) {
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
            "getSortComparer": getSortComparer,
        });
    }
})(jQuery);