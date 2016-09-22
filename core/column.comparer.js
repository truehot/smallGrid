(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Column": {
            "Comparer": {
                "Default": mixedComparer,
                "Date": dateComparer,
                "Number": numberComparer,
                "String": stringComparer
            }
        }
    });

    function mixedComparer(settings) {
        return function (a, b) {
            var x = (settings.field in a.item) ? a.item[settings.field] : null,
                y = (settings.field in b.item) ? b.item[settings.field] : null;

            if (x instanceof Date && y instanceof Date) {
                x = x.getTime();
                y = y.getTime();
            } else if (!isNaN(parseFloat(x)) && isFinite(x)) {
                x++; y++;
            } else if (x && typeof x.toString === 'function' && y && typeof y.toString === 'function') {
                x = x.toString().toLowerCase();
                y = y.toString().toLowerCase();
            }
            return (x == y ? 0 : (x > y ? settings.sortOrder : -settings.sortOrder));
        };
    }

    function numberComparer(settings) {
        var sortOrder = settings.sortOrder;
        return function (a, b) {
            var x = (settings.field in a.item) ? a.item[settings.field] : null,
                y = (settings.field in b.item) ? b.item[settings.field] : null;
            return (x - y) * sortOrder;
        };
    }

    function localeStringComparer(settings) {
        var sortOrder = settings.sortOrder;
        return function (a, b) {
            var x = (settings.field in a.item && typeof a.item[settings.field] === 'string') ? a.item[settings.field].toLowerCase() : null,
                y = (settings.field in b.item && typeof b.item[settings.field] === 'string') ? b.item[settings.field].toLowerCase() : null;
            return x.localeCompare(y) * sortOrder;
        };
    }

    function stringComparer(settings) {
        var sortOrder = settings.sortOrder;
        return function (a, b) {
            var x = (settings.field in a.item && typeof a.item[settings.field] === 'string') ? a.item[settings.field].toLowerCase() : null,
                y = (settings.field in b.item && typeof b.item[settings.field] === 'string') ? b.item[settings.field].toLowerCase() : null;

            return (x == y ? 0 : (x > y ? 1 * sortOrder : -1 * sortOrder));
        };
    }

    function dateComparer(settings) {
        var sortOrder = settings.sortOrder;
        return function (a, b) {
            var x = (settings.field in a.item) ? a.item[settings.field] : null,
                y = (settings.field in b.item) ? b.item[settings.field] : null;
            return (new Date(x) - new Date(y)) * sortOrder;
        };
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});