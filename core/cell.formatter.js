(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Cell": {
                "Formatter": {
                    "Checkbox": checkboxFormatter,
                    "Date": dateFormatter,
                    "Default": defaultFormatter,
                    "Float": floatFormatter,
                    "Integer": integerFormatter,
                    "Money": moneyFormatter,
                    "None": defaultFormatter,
                    "Radio": radioFormatter,
                    "Text": defaultFormatter,
                },
            }
        }
    });

    function defaultFormatter(value, column, row, settings) {
        return (value != undefined) ? value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
    }

    function checkboxFormatter(value, column, row, settings) {
        return value ? "<i class='fa fa-check-square-o'></i>" : "<i class='fa fa-square-o'></i>";
    }

    function radioFormatter(value, column, row, settings) {
        return value ? "<i class='fa fa-dot-circle-o'></i>" : "<i class='fa fa-circle-o'></i>";
    }

    function floatFormatter(value, column, row, settings) {
        return (parseFloat(value) || 0).toFixed(settings.formatter.floatFormatter.decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    function integerFormatter(value, column, row, settings) {
        return (parseInt(value, 10) || 0).toFixed(settings.formatter.integerFormatter.decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    function moneyFormatter(value, column, row, settings) {
        value = +value;
        if (!isNaN(value)) {
            return new Intl.NumberFormat(settings.formatter.moneyFormatter.locales, settings.formatter.moneyFormatter.options).format(value);
        }
        return defaultFormatter(value, column, row, settings);
    }

    function dateFormatter(value, column, row, settings) {
        if (!(value instanceof Date)) {
            value = Date.parse(value);
        }

        if (!isNaN(value)) {
            return new Intl.DateTimeFormat(settings.formatter.dateFormatter.locales, settings.formatter.moneyFormatter.options).format(value);
        }

        return defaultFormatter(value, column, row, settings);
    }

})(jQuery);