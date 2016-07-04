(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Query": {
            "FilterQuery": FilterQuery
        }
    });

    function FilterQuery(field) {
        var self = this;
        var query = [];
        var id = SmallGrid.Utils.createGuid();

        function getId() {
            return id;
        }

        function getField() {
            return field;
        }

        function clear() {
            query = [];
            return self;
        }

        function get() {
            return query;
        }

        function add(type, str) {
            if (type in self) {
                return self[type](str || "");
            }
            throw new TypeError("Type " + type + " not found.");
        }

        function and() {
            query.push({ action: "and" });
            return self;
        }

        function or() {
            query.push({ action: "or" });
            return self;
        }

        function eq(value) {
            query.push({ action: "eq", "value": value });
            return self;
        }

        function neq(value) {
            query.push({ action: "neq", "value": value });
            return self;
        }

        function startswith(value) {
            query.push({ action: "startsWith", "value": value });
            return self;
        }

        function endswith(value) {
            query.push({ action: "endsWith", "value": value });
            return self;
        }

        function contains(value) {
            query.push({ action: "contains", "value": value });
            return self;
        }

        function doesnotcontain(value) {
            query.push({ action: "doesNotContain", "value": value });
            return self;
        }

        $.extend(this, {
            "getId": getId,
            "getField": getField,

            "clear": clear,
            "get": get,
            "add": add,

            "and": and,
            "or": or,

            "contains": contains,
            "doesnotcontain": doesnotcontain,
            "endswith": endswith,
            "eq": eq,
            "neq": neq,
            "startswith": startswith,
        });
    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});