"use strict";

(function ($) {
    $.extend(true, window, {
        "SmallGrid": {
            "Filter": {
                "FilterQuery": FilterQuery,
            }
        }
    });

    //add or / and?
    function FilterQuery(field, settings) {
        var self = this;
        var query = [];
        var id = settings.Utils.getNewGuid();

        function getId() {
            return id;
        }

        function getField() {
            return field;
        }

        function clear() {
            query = [];
            return this;
        }

        function get() {
            return query;
        }

        function add(type, str) {
            if (type in this) {
                return this[type](str || "");
            }
            throw "Type " + type + " not found";
        }

        //where
        function and() {
            query.push({ action: "and" });
            return this;
        }

        function or() {
            query.push({ action: "or" });
            return this;
        }

        function eq(value) {
            query.push({ action: "eq", "value": value });
            return this;
        }

        function neq(value) {
            query.push({ action: "neq", "value": value });
            return this;
        }

        function startswith(value) {
            query.push({ action: "startsWith", "value": value });
            return this;
        }

        function endswith(value) {
            query.push({ action: "endsWith", "value": value });
            return this;
        }

        function contains(value) {
            query.push({ action: "contains", "value": value });
            return this;
        }

        function doesnotcontain(value) {
            query.push({ action: "doesNotContain", "value": value });
            return this;
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
})(jQuery);