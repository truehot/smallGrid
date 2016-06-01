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
                    "Select": selectFormatter,
                    "None": defaultFormatter,
                    "Radio": radioFormatter,
                    "Text": textFormatter,
                },
            }
        }
    });

    function defaultFormatter(value, column, row, settings) {
        return (value != null) ? value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;") : "";
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
            value = new Intl.NumberFormat(settings.formatter.moneyFormatter.locales, settings.formatter.moneyFormatter.options).format(value);
            return value + "<i class='fa fa fa-pencil grid-text-icon-formatter'></i>";
        }
        return defaultFormatter(value, column, row, settings);
    }

    function dateFormatter(value, column, row, settings) {
        if (!(value instanceof Date)) {
            value = Date.parse(value);
        }

        if (!isNaN(value)) {
            value = new Intl.DateTimeFormat(settings.formatter.dateFormatter.locales, settings.formatter.moneyFormatter.options).format(value);
            return value + "<i class='fa fa-calendar grid-date-icon-formatter'></i>";
        }

        return defaultFormatter(value, column, row, settings);
    }

    function selectFormatter(value, column, row, settings) {
        var html = defaultFormatter(value, column, row, settings);
        return value + "<i class='fa fa-caret-square-o-down grid-select-icon-formatter'></i>";
    }

    function textFormatter(value, column, row, settings) {
        var html = defaultFormatter(value, column, row, settings);
        return html + "<i class='fa fa fa-pencil grid-text-icon-formatter'></i>";
    }

})(jQuery);