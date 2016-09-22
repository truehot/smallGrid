(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Cell": {
            "HeaderFormatter": {
                "Default": defaultFormatter,
                "Checkbox": checkboxFormatter,
                "SelectionCheckbox": selectionCheckboxFormatter,
                "Star": starFormatter
            }
        }
    });

    function defaultFormatter(column, settings) {
        return column.name !== null && column.name !== undefined ? column.name.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;") : "";
    }

    function checkboxFormatter(column, settings) {
        return column[column.field] ? "<i class='fa fa-check-square-o' data-click-type='checkbox'></i>" : "<i class='fa fa-square-o' data-click-type='checkbox'></i>";
    }

    function selectionCheckboxFormatter(column, settings) {
        return column[column.field] ? "<i class='fa fa-check-square-o' data-click-type='selection-checkbox'></i>" : "<i class='fa fa-square-o' data-click-type='selection-checkbox'></i>";
    }

    function starFormatter(column, settings) {
        return column[column.field] ? "<i class='fa fa-star' data-click-type='star'></i>" : "<i class='fa fa-star-o' data-click-type='star'></i>";
    }


})(jQuery, window.SmallGrid = window.SmallGrid || {});