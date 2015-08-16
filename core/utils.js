"use strict";

(function ($) {

    var guid = function () {
        var e = {};
        var t = [];
        for (var n = 0; n < 256; n++) {
            t[n] = (n < 16 ? "0" : "") + n.toString(16);
        }
        e.newGuid = function () {
            var e = Math.random() * 4294967295 | 0;
            var n = Math.random() * 4294967295 | 0;
            var r = Math.random() * 4294967295 | 0;
            var i = Math.random() * 4294967295 | 0;
            return t[e & 255] + t[e >> 8 & 255] + t[e >> 16 & 255] + t[e >> 24 & 255] + "-" + t[n & 255] + t[n >> 8 & 255] + "-" + t[n >> 16 & 15 | 64] + t[n >> 24 & 255] + "-" + t[r & 63 | 128] + t[r >> 8 & 255] + "-" + t[r >> 16 & 255] + t[r >> 24 & 255] + t[i & 255] + t[i >> 8 & 255] + t[i >> 16 & 255] + t[i >> 24 & 255];
        };
        return e;
    }();

    function isFunction(funcName, obj) {
        return (obj && funcName && funcName in obj && typeof (obj[funcName]) === "function");
    }

    function isProperty(property, obj) {
        return (property && property in obj);
    }

    function parseBool(str) {
        return (/^true$/i).test(str);
    }

    function measureMaxSupportedCssHeight() {
        var incHeight = 1000000, supportedHeight = 1000000, el = $('<div style="display:none; " />').appendTo(document.body);
        while (true) {
            el.css("height", supportedHeight);
            if (el.height() === supportedHeight) {
                supportedHeight += incHeight;
                if (supportedHeight < 16000000) {
                    continue;
                }
            }
            break;
        }
        el.remove();
        return supportedHeight - incHeight;
    }

    function measureScrollbar() {
        var $el = $('<div style="position:absolute; top:-100px; left:-100px; width:100px; height:100px; overflow:scroll;"></div>').appendTo('body');

        var dim = {
            width: $el.width() - $el[0].clientWidth,
            height: $el.height() - $el[0].clientHeight
        };

        $el.remove();
        return dim;
    }


    function measureCellDiff($element) {
        var $row = $("<tr />").appendTo($element),
            $cell = $("<td style='width:5px; height:5px;'>-</td>").appendTo($row);

        var cellDiff = {
            width: $cell.outerWidth() - $cell.width(),
            height: $cell.outerHeight() - $cell.height(),
        };

        $cell.remove();
        $row.remove();

        return cellDiff;
    }

    function changeSortOrder(sortOrder) {
        return -1 * (sortOrder < 0 ? -1 : 1);
    }

    $.extend(true, window, {
        "SmallGrid": {
            "Utils": {
                "changeSortOrder": changeSortOrder,
                "getNewGuid": guid.newGuid,
                "isFunction": isFunction,
                "isProperty": isProperty,
                "measureCellDiff": measureCellDiff,
                "measureMaxSupportedCssHeight": measureMaxSupportedCssHeight,
                "measureScrollbar": measureScrollbar,
                "parseBool": parseBool,
            }
        }
    });

})(jQuery);