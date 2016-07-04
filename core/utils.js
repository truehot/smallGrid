(function ($, SmallGrid) {
    "use strict";

    var createGuid = function () {
        var t = [];
        for (var i = 0; i < 256; i++) {
            t[i] = i < 16 ? "0" + i.toString(16) : i.toString(16);
        }
        return function () {
            var e = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0, r = Math.random() * 4294967295 | 0, i = Math.random() * 4294967295 | 0;
            return (t[e & 255] + t[e >> 8 & 255] + t[e >> 16 & 255] + t[e >> 24 & 255] + "-" + t[n & 255] + t[n >> 8 & 255] + "-" + t[n >> 16 & 15 | 64] + t[n >> 24 & 255] + "-" + t[r & 63 | 128] + t[r >> 8 & 255] + "-" + t[r >> 16 & 255] + t[r >> 24 & 255] + t[i & 255] + t[i >> 8 & 255] + t[i >> 16 & 255] + t[i >> 24 & 255]).toLowerCase();
        };
    }();

    var createId = function () {
        var lastId = 0;
        return function () {
            return "" + lastId++;
        };
    }();


    function isFunction(funcName, obj) {
        return obj && funcName && funcName in obj && typeof obj[funcName] === "function";
    }

    function isProperty(property, obj) {
        return property && property in obj;
    }

    function parseBool(str) {
        return (/^true$/i).test(str);
    }

    function measureMaxSupportedCssHeight() {
        var incHeight = 1000000, supportedHeight = 1000000, el = $('<div style="display:none; " />').appendTo(document.body);

        do {
            el.css("height", supportedHeight);
            if (el.height() === supportedHeight) {
                supportedHeight += incHeight;
            } else {
                break;
            }
        } while (supportedHeight < 16000000);

        el.remove();
        return supportedHeight - incHeight;
    }

    function measureScrollbar() {
        var $el = $('<div style="position:absolute; top:-100px; left:-100px; width:100px; height:100px; overflow:scroll;"></div>').appendTo(document.body);

        var dim = {
            width: $el.width() - $el[0].clientWidth,
            height: $el.height() - $el[0].clientHeight
        };

        $el.remove();
        return dim;
    }


    function measureTableCellDiff(cssClass) {
        var $table = $("<table class='grid-content-table' style='position:absolute; top:-100px; left:-100px;'><tbody><tr><td class='" + cssClass + "' style='width:5px; height:5px;'>-</td></tr></tbody></table>").appendTo(document.body)
        var $cell = $table.find('TD');

        var cellDiff = {
            width: $cell.outerWidth() - $cell.width(),
            height: $cell.outerHeight() - $cell.height()
        };

        $table.remove();
        $table = $cell = undefined;

        return cellDiff;
    }

    function changeSortOrder(sortOrder) {
        return sortOrder < 0 ? 1 : -1;
    }

    $.extend(true, SmallGrid, {
        "Utils": {
            "changeSortOrder": changeSortOrder,
            "createGuid": createGuid,
            "createId": createId,
            "isFunction": isFunction,
            "isProperty": isProperty,
            "measureCellDiff": measureTableCellDiff,
            "measureMaxSupportedCssHeight": measureMaxSupportedCssHeight,
            "measureScrollbar": measureScrollbar,
            "parseBool": parseBool
        }
    });

})(jQuery, window.SmallGrid = window.SmallGrid || {});