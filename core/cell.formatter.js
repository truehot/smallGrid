"use strict";

(function ($) {
    $.extend(true, window, {
        "SmallGrid": {
            "Cell": {
                "Formatter": {
                    "Checkbox": CheckboxFormatter,
                    "Default": DefaultFormatter,
                    "Float": FloatFormatter,
                    "Integer": IntegerFormatter,
                    "None": NoneFormatter,
                    "Radio": RadioFormatter,
                    "Text": DefaultFormatter,
                },
            }
        }
    });

    function DefaultFormatter(value, column, row, settings) {
        return (value !== undefined) ? value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
    }

    function CheckboxFormatter(value, column, row, settings) {
        return value ? "<i class='fa fa-check-square-o'></i>" : "<i class='fa fa-square-o'></i>";
    }

    function RadioFormatter(value, column, row, settings) {
        return value ? "<i class='fa fa-dot-circle-o'></i>" : "<i class='fa fa-circle-o'></i>";
    }

    function FloatFormatter(value, column, row, settings) {
        return (parseFloat(value) || 0).toFixed(settings.formatter.floatFormatter.decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    function IntegerFormatter(value, column, row, settings) {
        return (parseInt(value, 10) || 0).toFixed(settings.formatter.integerFormatter.decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    function NoneFormatter(value, column, row, settings) {
        return value;
    }

})(jQuery);