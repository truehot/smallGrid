"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Cell": {
                "Editor": {
                    "Create": CreateEditor,
                    "Checkbox": CheckboxEditor,
                    "Float": FloatEditor,
                    "Integer": IntegerEditor,
                    "None": NoneEditor,
                    "Text": TextEditor,
                },
            }
        }
    });

    function CheckboxEditor(options) {
        var self = this,
            value = options.value,
            $element = $('<input type="checkbox" class="grid-checkbox-editor" />').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return this;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return this;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return this;
        };

        this.getValue = function () {
            return convertValue($element.prop('checked'));
        };

        this.setValue = function (value) {
            $element.prop('checked', convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return this;
        };

        this.focus = function () {
            $element.val(self.getValue()).focus();
            return this;
        };

        function convertValue(value) {
            return (/^true$/i).test(value);
        };

        $.extend(this, {
            "onInitialize": new Small.Event.Handler(),
            "onChange": new Small.Event.Handler(),
            "onDestroy": new Small.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function FloatEditor(options) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-float-editor" />').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return this;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return this;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return this;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return this;
        };

        this.focus = function () {
            $element.val(self.getValue()).select();

            return this;
        };

        function convertValue(value) {
            return parseFloat(value, 10) || 0;
        };

        $.extend(this, {
            "onInitialize": new Small.Event.Handler(),
            "onChange": new Small.Event.Handler(),
            "onDestroy": new Small.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function IntegerEditor(options) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-integer-editor" />').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return this;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return this;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return this;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return this;
        };

        this.focus = function () {
            $element.val(self.getValue()).select();

            return this;
        };

        function convertValue(value) {
            return parseInt(value, 10) || 0;
        };

        $.extend(this, {
            "onInitialize": new Small.Event.Handler(),
            "onChange": new Small.Event.Handler(),
            "onDestroy": new Small.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function NoneEditor(options) {
        var self = this,
            value = options.value,
            $element = $("<span class='grid-none-editor' />").text(value);
        
        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return this;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return this;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return this;
        };

        this.getValue = function () {
            return convertValue($element.text());
        };

        this.setValue = function (value) {
            
            $element.text(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return this;
        };

        this.focus = function () {
            $element.select();
            return this;
        };

        function convertValue(value) {
            return value;
        };

        $.extend(this, {
            "onInitialize": new Small.Event.Handler(),
            "onChange": new Small.Event.Handler(),
            "onDestroy": new Small.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function TextEditor(options) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-text-editor"/>').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return this;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return this;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return this;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return this;
        };

        this.focus = function () {
            $element.val(self.getValue()).select();
            return this;
        };

        function convertValue(value) {
            return value;
        };

        $.extend(this, {
            "onInitialize": new Small.Event.Handler(),
            "onChange": new Small.Event.Handler(),
            "onDestroy": new Small.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function CreateEditor(name, options, settings) {
        if (settings.Utils.isFunction(name, settings.RowEditor) == true) {
            return new settings.RowEditor[name](options);
        }
    }

})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
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
        return (value != undefined) ? value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
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

})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Column": {
                "Create": CreateModel,
                "Model": ColumnModel,
                "ColumnData": ColumnData
            }
        }
    });


    function ColumnData(data) {
        if ("cellCssClass" in data) this.cellCssClass = data.cellCssClass;
        if ("editable" in data) this.editable = data.editable;
        if ("editor" in data) this.editor = data.editor;
        if ("editMode" in data) this.editMode = data.editMode;
        if ("field" in data) this.field = data.field;
        if ("filterable" in data) this.filterable = data.filterable;
        if ("formatter" in data) this.formatter = data.formatter;
        if ("headerCssClass" in data) this.headerCssClass = data.headerCssClass;
        if ("id" in data) this.id = data.id;
        if ("item" in data) this.item = data.item;
        if ("maxWidth" in data) this.maxWidth = data.maxWidth;
        if ("minWidth" in data) this.minWidth = data.minWidth;
        if ("name" in data) this.name = data.name;
        if ("resizeable" in data) this.resizeable = data.resizeable;
        if ("sortable" in data) this.sortable = data.sortable;
        if ("sortOrder" in data) this.sortOrder = data.sortOrder;
        if ("sortComparer" in data) this.sortComparer = data.sortComparer;
        if ("width" in data) this.width = data.width;
    }

    ColumnData.prototype.cellCssClass = "";//css class for column cells
    ColumnData.prototype.editable = true; // are column cells editable
    ColumnData.prototype.editor = undefined; // name of editor
    ColumnData.prototype.editMode = false; // are column cells in editMode
    ColumnData.prototype.field = ""; // cell content will be taken from value of this property in row
    ColumnData.prototype.filterable = false;//bool
    ColumnData.prototype.formatter = "Default";//default cell content formatter
    ColumnData.prototype.headerCssClass = "";//css class for column header cell  
    ColumnData.prototype.id = undefined;//unique indicator
    ColumnData.prototype.item = null;
    ColumnData.prototype.maxWidth = 9999;
    ColumnData.prototype.minWidth = 25;
    ColumnData.prototype.name = "";
    ColumnData.prototype.resizeable = true;//is column resizeable
    ColumnData.prototype.sortable = true;//is column sortable
    ColumnData.prototype.sortComparer = "Default";
    ColumnData.prototype.sortOrder = 0;//0, 1, -1
    ColumnData.prototype.width = 50;

    //todo: fix events
    function ColumnModel(items, settings) {
        var self = this;
        var data = [];

        function forEach(callback) {
            if (data.length) {
                data.forEach(callback);
            }
            return this;
        }

        function filter(callback) {
            if (data.length) {
                return data.filter(callback);
            }
            return [];
        }

        function reduce(callback, initialValue) {
            if (data.length) {
                return data.reduce(callback, initialValue);
            }
        }

        function sort(comparer) {
            if (data.length) {
                self.onChangeStart.notify();
                data.sort(comparer);
                self.onChangeStop.notify();
            }
            return this;
        }

        function isEmpty() {
            return data.length == 0;
        }

        function total() {
            return data.length;
        }


        function init() {
            addItems(items);
        }


        function addItem(item) {
            return addColumn(
                createColumn(item)
            );
        }

        function addItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < items.length; i++) {
                    addItem(items[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }

        function deleteItem(item) {
            var idProperty = settings.columns.idProperty;
            if (settings.Utils.isProperty(idProperty, item)) {
                deleteColumnById(item[idProperty]);
            }
            return this;
        }

        function getItems() {
            var result = []
            for (var i = 0; i < data.length; i++) {
                result.push(data[i].item);
            }
            return result;
        }

        function setItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                var ids = [];
                for (var i = 0; i < data.length; i++) {
                    ids.push(data[i].id);
                }
                data = [];
                for (var i = 0; i < items.length; i++) {
                    addItem(items[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }

        function updateItem(item) {
            var idProperty = settings.columns.idProperty;
            if (settings.Utils.isProperty(idProperty, item)) {
                updateItemById(item[idProperty], item);
            }
        }

        function updateItemById(id, item) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data[i].item = item;
                    self.onChange.notify({ "id": [id] });
                    break;
                }
            }
            return this;
        }

        function updateItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < items.length; i++) {
                    updateItem(items[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }


        function addColumn(column) {
            if (column instanceof ColumnData) {
                data.push(column);
                self.onChange.notify({ "id": [column.id] });
            }
            return this;
        }

        function addColumns(columns) {
            if (columns.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < columns.length; i++) {
                    addColumn(columns[i]);
                }

                self.onChangeStop.notify();
            }
            return this;
        }

        function deleteColumn(column) {
            if (column instanceof ColumnData) {
                deleteColumnById(column.id);
            }
            return this;
        }

        function deleteColumnById(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data.splice(i, 1);
                    self.onChange.notify({ "id": [id] });
                    break;
                }
            }
            return this;
        }

        function deleteColumnByIndex(idx) {
            var id = data[idx].id;
            data.splice(idx, 1);
            self.onChange.notify({ "id": [id] });
            return this;
        }

        function deleteColumns() {
            if (data.length) {
                self.onChangeStop.notify();
                var ids = [];
                for (var i = 0; i < data.length; i++) {
                    ids.push(data[i].id);
                }
                data = [];
                self.onChange.notify({ "id": ids });
                self.onChangeStop.notify();
            }
            return this;
        }

        function getColumnById(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    return data[i];
                }
            }
        }

        function getColumnByIndex(idx) {
            return data[idx];
        }

        function getColumnIdByIndex(idx) {
            return data[idx].id;
        }

        function getColumnIndexById(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    return i;
                }
            }
            return -1;
        }

        function getColumnPropertyById(id, propertyName) {
            var column = getColumnById(id);
            if (column && propertyName && propertyName in column) {
                return column[propertyName];
            }
        }

        function getColumnPropertyByIndex(idx, propertyName) {
            var column = getColumnByIndex(idx);
            if (column && propertyName && propertyName in column) {
                return column[propertyName];
            }
        }

        function getColumns() {
            return data;
        }

        function insertColumnAfterId(id, column) {
            insertColumnAfterIndex(
                getColumnIndexById(id),
                column
            );
            return this;
        }

        function insertColumnAfterIndex(idx, column) {
            if (column instanceof ColumnData) {
                data.splice(
                    idx + 1,
                    0,
                    column
                );
                self.onChange.notify({ "id": [column.id] });
            }
            return this;
        }

        function insertColumnBeforeId(id, column) {
            insertColumnBeforeIndex(
                getColumnIndexById(id),
                column
            );
            return this;
        }

        function insertColumnBeforeIndex(idx, column) {
            if (column instanceof ColumnData) {
                data.splice(
                    idx,
                    0,
                    column
                );
                self.onChange.notify({ "id": [column.id] });
            }
            return this;
        }

        function setColumnPropertyById(id, propertyName, propertyValue) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    if (propertyName && propertyName in data[i]) {
                        data[i][propertyName] = propertyValue;
                        self.onChange.notify({ "id": [id] });
                    }
                    break;
                }
            }
            return this;
        }

        function setColumnPropertyByIndex(idx, propertyName, propertyValue) {
            if (propertyName && propertyName in data[idx]) {
                data[idx][propertyName] = propertyValue;
                self.onChange.notify({ "id": [data[idx].id] });
            }
            return this;
        }

        function setColumns(columns) {
            if (columns.length) {
                self.onChangeStart.notify();
                var ids = [];
                for (var i = 0; i < data.length; i++) {
                    ids.push(data[i].id);
                }
                data = [];

                for (var i = 0; i < columns.length; i++) {
                    addColumn(columns[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }

        function setColumnsProperty(propertyName, propertyValue) {
            for (var i = 0; i < data.length; i++) {
                data[i][propertyName] = propertyValue;
            }
            return this;
        }

        function updateColumn(column) {
            if (column instanceof ColumnData) {
                data[idx] = column;
                self.onChange.notify({ "id": [column.id] });
            }
            return this;
        }

        function updateColumnById(id, column) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data[i] = column;
                    self.onChange.notify({ "id": [id] });
                    break;
                }
            }
            return this;
        }

        function updateColumnByIndex(idx, column) {
            if (data[idx]) {
                data[idx] = column;
                self.onChange.notify({ "id": [column.id] });
            }
            return this;
        }

        function updateColumns(columns) {
            if (columns.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < columns.length; i++) {
                    updateColumn(columns[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }

        function createItemData(item) {
            if (settings.columns.mapProperties == true) {
                var itemData = $.extend({ item: item }, item);
                //itemData.item = item;//TODO: extend?
                return itemData;
            }
            return itemData = {
                "name": item.name,
                "field": item.field,
                "item": item
            };
        }

        function createColumn(item) {
            var column = new ColumnData(createItemData(item));

            var idProperty = settings.columns.idProperty;
            if (settings.Utils.isProperty(idProperty, column)) {
                column.id = column[idProperty];
            } else {
                column.id = settings.Utils.getNewGuid();
            }

            column.width = Math.max(
                Math.min(
                    parseInt(column.width, 10),
                    column.maxWidth
                ),
                column.minWidth
            );


            if (column.sortComparer && settings.Utils.isFunction(column.sortComparer, settings.RowComparer) == false) {
                delete column.sortComparer;
            }

            if (column.formatter && settings.Utils.isFunction(column.formatter, settings.RowFormatter) == false) {
                delete column.formatter;
            }

            if (column.editor && settings.Utils.isFunction(column.editor, settings.RowEditor) == false) {
                delete column.editor;
            }

            return column;
        }


        $.extend(this, {
            "onChange": new Small.Event.Handler(),
            "onChangeStart": new Small.Event.Handler(),
            "onChangeStop": new Small.Event.Handler(),

            "filter": filter,
            "forEach": forEach,
            "reduce": reduce,
            "sort": sort,
            "total": total,

            "addItem": addItem,
            "addItems": addItems,
            "deleteItem": deleteItem,
            "deleteItems": deleteColumns,
            "deleteItemById": deleteColumnById,
            "getItems": getItems,
            "setItems": setItems,
            "updateItem": updateItem,
            "updateItemById": updateItemById,
            "updateItems": updateItems,

            "addColumn": addColumn,
            "addColumns": addColumns,
            "createColumn": createColumn,
            "deleteColumn": deleteColumn,
            "deleteColumnById": deleteColumnById,
            "deleteColumnByIndex": deleteColumnByIndex,
            "deleteColumns": deleteColumns,
            "getColumnById": getColumnById,
            "getColumnByIndex": getColumnByIndex,
            "getColumnIdByIndex": getColumnIdByIndex,
            "getColumnIndexById": getColumnIndexById,
            "getColumnPropertyById": getColumnPropertyById,
            "getColumnPropertyByIndex": getColumnPropertyByIndex,
            "getColumns": getColumns,
            "insertColumnAfterId": insertColumnAfterId,
            "insertColumnAfterIndex": insertColumnAfterIndex,
            "insertColumnBeforeId": insertColumnBeforeId,
            "insertColumnBeforeIndex": insertColumnBeforeIndex,
            "isEmpty": isEmpty,
            "setColumnPropertyById": setColumnPropertyById,
            "setColumnPropertyByIndex": setColumnPropertyByIndex,
            "setColumns": setColumns,
            "setColumnsProperty": setColumnsProperty,
            "updateColumn": updateColumn,
            "updateColumnById": updateColumnById,
            "updateColumnByIndex": updateColumnByIndex,
            "updateColumns": updateColumns,
        });

        init();
    }



    function CreateModel(data, settings) {
        return new ColumnModel(
            data,
            settings
        );
    }





})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Event": {
                "Args": EventArgs,
                "Handler": EventHandler
            }
        }
    });

    function EventArgs(args) {
        for (var key in args) {
            if (args.hasOwnProperty(key)) {
                this[key] = args[key];
            }
        }

        var isPropagationStopped = false;
        var isImmediatePropagationStopped = false;

        //Prevents any related handlers from being notified of the event.
        this.stopPropagation = function () {
            isPropagationStopped = true;
        };

        this.isPropagationStopped = function () {
            return isPropagationStopped;
        };
        //Keeps the rest of the handlers from being executed
        this.stopImmediatePropagation = function () {
            isImmediatePropagationStopped = true;
        };

        this.isImmediatePropagationStopped = function () {
            return isImmediatePropagationStopped;
        }
    }

    function EventHandler() {
        var handlers = [];

        this.subscribe = function (fn) {
            handlers.push(fn);
            return this;
        };

        this.unsubscribe = function (fn) {
            for (var i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i] === fn) {
                    handlers.splice(i, 1);
                }
            }
            return this;
        };

        this.unsubscribeLast = function () {
            if (handlers.length) {
                handlers.pop();
            }
            return this;
        };

        this.unsubscribeAll = function () {
            handlers = [];
            return this;
        };

        this.notify = function (e) {
            if (typeof (e) != EventArgs) {
                e = new EventArgs(e);
            }

            for (var i = 0; i < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()) ; i++) {
                if (handlers[i].call(this, e) === false) {
                    e.stopImmediatePropagation();
                    break;
                }
            }
        }
    }

})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
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
                if (str) {
                    this[type](str);
                } else {
                    this[type]();
                }
            } else {
                throw "Type " + type + " not found";
            }

            return this;
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
})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Filter": {
                "FilterRequest": FilterRequest,
            }
        }
    });

    function FilterRequest(filters, dataModel) {

        function getRowsInRange(top, height, outerHeight) {
            return dataModel.filter(new rowsRangeByHeight(top, height, outerHeight, getRowFilter()));
        }

        function getColumnsInRange(left, width, outerWidth) {
            return dataModel.filter(new columnsRangeByWidth(left, width, outerWidth, getColumnFilter()));
        }

        function getColumnsWidth(width) {
            return dataModel.reduce(new columnsFullWidth(width, getColumnFilter()), 0);
        }

        function getRowsHeight(height) {
            return dataModel.reduce(new itemFullHeight(height, getRowFilter()), 0);
        }

        function getColumnFilter() {

        }

        function getRowFilter() {
            var resultQuery = "";

            for (var i = 0; i < filters.length; i++) {
                var queries = filters[i].get();
                var field = filters[i].getField();
                var convertedQuery = "";
                for (var ii = 0; ii < queries.length; ii++) {
                    var query = queries[ii];

                    switch (query.action) {
                        case 'and':
                            convertedQuery += " && ";
                            break;
                        case 'or':
                            convertedQuery += " || ";
                            break;

                        case 'eq':
                            convertedQuery += " isEqual(item.item['" + field + "'], '" + query.value + "') == true ";
                            break;

                        case 'neq':
                            convertedQuery += " isEqual(item.item['" + field + "'], '" + query.value + "') == false ";
                            break;

                        case 'startsWith':
                            convertedQuery += " startsWith(item.item['" + field + "'], '" + query.value + "') == true ";
                            break;

                        case 'endsWith':
                            convertedQuery += " endsWith(item.item['" + field + "'], '" + query.value + "') == true ";
                            break;

                        case 'contains':
                            convertedQuery += " contains(item.item['" + field + "'], '" + query.value + "') == true ";
                            break;

                        case 'doesNotContain':
                            convertedQuery += " contains(item.item['" + field + "'], '" + query.value + "') == false ";
                            break;
                    }
                };

                if (convertedQuery.length) {
                    if (i != 0) {
                        resultQuery += " && ";
                    }
                    resultQuery += '(' + convertedQuery + ')';
                }
            }

            return resultQuery;
        }

        function isEqual(str1, str2) {
            return (str1 == str2);
        }

        function startsWith(str, suffix) {
            return ('' + str).indexOf(suffix) == 0;
        }

        function endsWith(str, suffix) {
            return ('' + str).indexOf(suffix, str.length - suffix.length) !== -1;
        }

        function contains(str, search) {
            return ('' + str).indexOf(search) !== -1;
        }

        function columnsFullWidth(outerWidth, filter) {
            return function (prev, item) {
                if (filter && eval(filter) == false) return prev;
                return prev + item.width + outerWidth;
            };
        }

        function itemFullHeight(outerHeight, filter) {
            return function (prev, item) {
                if (filter && eval(filter) == false) return prev;
                return prev + item.height + outerHeight;
            };
        }

        function columnsRangeByWidth(center, width, outerWidth, filter) {
            var calcWidth = 0, min = center - 2 * width - outerWidth, max = center + 2 * width + outerWidth;
            return function (item, index, array) {
                if (!(filter && eval(filter) == false)) {
                    calcWidth += outerWidth + item.width;
                    if (min <= calcWidth && calcWidth <= max) {
                        item.calcWidth = calcWidth;
                        return true;
                    }
                }
                return false;
            };
        }

        function rowsRangeByHeight(center, height, outerHeight, filter) {
            var calcHeight = 0, min = center - 2 * height - outerHeight, max = center + 2 * height + outerHeight;
            return function (item, index, array) {
                if (!(filter && eval(filter) == false)) {
                    calcHeight += outerHeight + item.height;
                    if (min <= calcHeight && calcHeight <= max) {
                        item.calcHeight = calcHeight;
                        return true;
                    }
                }

                return false;
            };
        }

        $.extend(this, {
            "getColumnsInRange": getColumnsInRange,
            "getColumnsWidth": getColumnsWidth,
            "getRowsHeight": getRowsHeight,
            "getRowsInRange": getRowsInRange,
        });

    }
})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Grid": {
                "Create": CreateModel,
                "Model": GridModel,
            }
        }
    });

    function GridModel($container, viewModel, settings) {
        var self = this;
        var view = {};
        var plugins = {};

        /*
        Init & Destroy
        */
        function init() {
            view = new settings.View.Create($container, settings);
            view.setModel(viewModel);
            registerPlugins(settings.plugins);
            view.render();
        }

        function destroy() {
            for (var i = 0; i < plugins.length; i++) {
                unregisterPlugin(plugins[i]);
            }
        }

        /*
        View
        */
        function getView() {
            return view;
        }

        /*View model*/
        function getViewModel() {
            return viewModel;
        }

        /*
        Settings
        */
        function getSettings() {
            return settings;
        }

        /*
        Plugins
        */
        function isRegisteredPlugin(name) {
            return plugins[name] != undefined;
        }

        function registerPlugin(name) {
            if (isRegisteredPlugin(name)) {
                unregisterPlugin(name);
            }
            plugins[name] = new settings.Plugins[name](viewModel, view, settings);
        }

        function registerPlugins(array) {
            for (var i = 0; i < array.length; i++) {
                registerPlugin(array[i]);
            }
        }

        function unregisterPlugin(name) {
            if (plugins[name]) {
                plugins[name].destroy();
                delete plugins[name];
            }
        }

        function unregisterPlugins() {
            var keys = Object.keys(plugins);
            for (var i = 0; i < keys.length; i++) {
                unregisterPlugin(keys[i]);
            }
        }

        $.extend(this, {
            "destroy": destroy,
            "getSettings": getSettings,
            "getView": getView,
            "getViewModel": getViewModel,
            "init": init,
            "isRegisteredPlugin": isRegisteredPlugin,
            "registerPlugins": registerPlugins,
            "registerPlugin": registerPlugin,
            "unregisterPlugin": unregisterPlugin,
            "unregisterPlugins": unregisterPlugins,
        });
    }

    function CreateModel($container, rows, columns, settings) {
        var settings = new Small.Settings.Create(settings);
        var viewModel = new Small.View.Model(
            new Small.Row.Create(rows, settings),
            new Small.Column.Create(columns, settings),
            settings
        );

        var grid = new GridModel(
            $container,
            viewModel,
            settings
        );

        if (settings.explicitInitialization == false) {
            grid.init();
        }

        return grid;

    }

})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Handler": {
                "Click": ClickHandler
            }
        }
    });

    var defaultSettings = {
        "rowIdentifier": "TR",
        "cellIdentifier": "TD",
        "handleClick": undefined,
        "handleDblClick": undefined,
        "handleContextMenu": undefined,
        "handleKeyDown": undefined,
    }

    function ClickHandler($container, settings) {
        var settings = jQuery.extend({}, defaultSettings, settings);

        $container
            .on("click", handleClick)
            .on("contextmenu", handleContextMenu)
            .on("dblclick", handleDblClick)
            .on("keydown", handleKeyDown);

        function getCellEvent(e) {
            if (e && e.target) {
                var $cellElement = $(e.target).closest(settings.cellIdentifier);
                if ($cellElement.length) {
                    var $rowElement = $cellElement.closest(settings.rowIdentifier);
                    if ($rowElement.length) {
                        return {
                            cellIndex: $cellElement.index(),
                            rowIndex: $rowElement.index(),
                            event: e,
                        }
                    }
                }
            }
        }

        function handleClick(e) {
            var event = getCellEvent(e);
            if (event && settings.handleClick) {
                settings.handleClick(event);
            }
        }

        function handleContextMenu(e) {
            var event = getCellEvent(e);
            if (event && settings.handleContextMenu) {
                settings.handleContextMenu(event);
            }
        }

        function handleDblClick(e) {
            var event = getCellEvent(e);
            if (event && settings.handleDblClick) {
                settings.handleDblClick(event);
            }
        }

        function handleKeyDown(e) {
            var event = getCellEvent(e);
            if (event && settings.handleKeyDown) {
                settings.handleKeyDown(event);
            }
        }

        function destroy() {
            $container
                .off("click", handleClick)
                .off("contextmenu", handleContextMenu)
                .off("dblclick", handleDblClick)
                .off("keydown", handleKeyDown);
        }

        $.extend(this, {
            "destroy": destroy
        });

    };

})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Handler": {
                "Resize": ResizeHandler
            }
        }
    });

    var defaultSettings = {
        "cellIdentifier": "TD",
        "handleResize": undefined,
        "handleResizeStart": undefined,
        "handleResizeStop": undefined,
        "handlerIdentifier": undefined,
    }

    function ResizeHandler($container, settings) {
        var settings = jQuery.extend({}, defaultSettings, settings);

        $container.on("mousedown", settings.handlerIdentifier, handleMouseDown);

        function handleMouseDown(e) {

            var $cellElement = $(this).closest(settings.cellIdentifier);

            if ($cellElement.length) {
                var cellIndex = $cellElement.index();

                settings.handleResizeStart({
                    cellElement: $cellElement,
                    cellIndex: cellIndex,
                    event: e
                });

                $("body")
                    .bind("mousemove", function (event) {
                        var newWidth = event.pageX - $cellElement.offset().left;
                        //TODO: remove condition?
                        if (newWidth > 0) {

                            settings.handleResize({
                                cellElement: $cellElement,
                                cellIndex: cellIndex,
                                width: newWidth,
                                event: e
                            });
                        }
                    })
                    .bind("mouseup", function (event) {
                        $(this).unbind("mousemove mouseup");

                        settings.handleResizeStop({
                            cellElement: $cellElement,
                            cellIndex: cellIndex,
                            event: e
                        });
                    });
            }
        }

        function destroy() {
            $container.off('mousedown', handleMouseDown);
        }

        $.extend(this, {
            "destroy": destroy
        });

    };

})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Handler": {
                "Scroll": ScrollHandler
            }
        }
    });

    var defaultSettings = {
        "handleMouseWheel": undefined,
        "handleMouseWheelStart": undefined,
        "handleMouseWheelStop": undefined,
        "handlescroll": undefined,
        "handlescrollStart": undefined,
        "handlescrollStop": undefined,
        latency: 300,
        resetLeft: true,
        resetTop: true,
    }


    /*
    TODO: direction change
    https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
    */
    function ScrollHandler($element, settings) {
        var settings = jQuery.extend({}, defaultSettings, settings);

        if (settings.resetTop) {
            $element[0].scrollTop = 0;
        }
        if (settings.resetLeft) {
            $element[0].scrollLeft = 0;
        }

        var scrollTimer,
            wheelTimer,
            last = {
                scrollTop: $element[0].scrollTop,
                scrollLeft: $element[0].scrollLeft,
            };

        $element.on('scroll', handleScroll);
        $element.on('wheel', handleMouseWheel);

        function handleMouseWheel(e) {
            if (wheelTimer) {
                clearTimeout(wheelTimer);
            } else {
                settings.handleMouseWheelStart({ event: e });
            }

            settings.handleMouseWheel({ event: e });

            wheelTimer = setTimeout(function () {
                wheelTimer = null;
                settings.handleMouseWheelStop({ event: e });
            }, settings.latency);
        }

        function handleScroll(e) {

            var dim = {
                scrollTop: $element[0].scrollTop,
                scrollLeft: $element[0].scrollLeft,
            }

            if (scrollTimer) {
                clearTimeout(scrollTimer);
            } else {
                settings.handleScrollStart({
                    scrollTop: dim.scrollTop,
                    scrollLeft: dim.scrollLeft,
                    topDelta: dim.scrollTop - last.scrollTop,
                    leftDelta: dim.scrollLeft - last.scrollLeft,
                    event: e,
                });
            }

            settings.handleScroll({
                scrollTop: dim.scrollTop,
                scrollLeft: dim.scrollLeft,
                topDelta: dim.scrollTop - last.scrollTop,
                leftDelta: dim.scrollLeft - last.scrollLeft,
                event: e,
            });

            scrollTimer = setTimeout(function () {
                scrollTimer = null;
                settings.handleScrollStop({
                    scrollTop: dim.scrollTop,
                    scrollLeft: dim.scrollLeft,
                    topDelta: dim.scrollTop - last.scrollTop,
                    leftDelta: dim.scrollLeft - last.scrollLeft,
                    event: e,
                });

            }, settings.latency);

            last = {
                scrollTop: dim.scrollTop,
                scrollLeft: dim.scrollLeft,
            }
        }

        function destroy() {
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            if (wheelTimer) {
                clearTimeout(wheelTimer);
            }

            $element.off('scroll', handleScroll);
            $element.off('wheel', handleMouseWheel);
        }

        $.extend(this, {
            "destroy": destroy
        });

    };

})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Row": {
                "Comparer": {
                    "Default": mixedComparer,
                    "Date": dateComparer,
                    "Number": numberComparer,
                    "String": stringComparer,
                }
            }
        }
    });

    function mixedComparer(settings) {
        var sortOrder = settings.sortOrder;
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
        }
    }

    function numberComparer(settings) {
        var sortOrder = settings.sortOrder;
        return function (a, b) {
            var x = (settings.field in a.item) ? a.item[settings.field] : null,
                y = (settings.field in b.item) ? b.item[settings.field] : null;
            return (x - y) * sortOrder;
        }
    }

    function localeStringComparer(settings) {
        var sortOrder = settings.sortOrder;
        return function (a, b) {
            var x = (settings.field in a.item) ? a.item[settings.field].toLowerCase() : null,
                y = (settings.field in b.item) ? b.item[settings.field].toLowerCase() : null;
            return x.localeCompare(y) * sortOrder;
        }
    }

    function stringComparer(settings) {
        var sortOrder = settings.sortOrder;
        return function (a, b) {
            var x = (settings.field in a.item) ? a.item[settings.field].toLowerCase() : null,
                y = (settings.field in b.item) ? b.item[settings.field].toLowerCase() : null;

            return (x == y ? 0 : (x > y ? 1 * sortOrder : -1 * sortOrder));
        }
    }

    function dateComparer(settings) {
        var sortOrder = settings.sortOrder;
        return function (a, b) {
            var x = (settings.field in a.item) ? a.item[settings.field] : null,
                y = (settings.field in b.item) ? b.item[settings.field] : null;
            return (new Date(x) - new Date(y)) * sortOrder;
        }
    }

})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Row": {
                "Create": CreateModel,
                "Model": RowModel,
                "RowData": RowData,
            }
        }
    });

    function RowData(data) {
        if ("cellCssClass" in data) this.cellCssClass = data.cellCssClass;
        if ("disabled" in data) this.disabled = data.disabled;//todo: wtf is that? row css class?
        if ("editable" in data) this.editable = data.editable;
        if ("editMode" in data) this.editMode = data.editMode;
        if ("height" in data) this.height = data.height;
        if ("id" in data) this.id = data.id;
        if ("item" in data) this.item = data.item;
        if ("maxHeight" in data) this.maxHeight = data.maxHeight;
        if ("minHeight" in data) this.minHeight = data.minHeight;
        if ("rowCssClass" in data) this.rowCssClass = data.rowCssClass;
    }


    RowData.prototype.cellCssClass = "";// row based cell class
    RowData.prototype.disabled = false; // is row disabled for ????????????
    RowData.prototype.editable = true; // are row cells editable?
    RowData.prototype.editMode = false; // are row cells in edit mode
    RowData.prototype.height = 25;// row height
    RowData.prototype.id = undefined;// unique indicator
    RowData.prototype.item = null;//
    RowData.prototype.maxHeight = 200;// max row height
    RowData.prototype.minHeight = 20; // min row height
    RowData.prototype.rowCssClass = ""; // whole row css class

    function RowModel(items, settings) {
        var self = this;
        var data = [];

        function forEach(callback) {
            if (data.length) {
                data.forEach(callback);
            }
            return this;
        }

        function filter(callback) {
            if (data.length) {
                return data.filter(callback);
            }
            return [];
        }

        function reduce(callback, initialValue) {
            if (data.length) {
                return data.reduce(callback, initialValue);
            }
        }

        function sort(comparer) {
            if (data.length) {
                self.onChangeStart.notify();
                data.sort(comparer);
                self.onChangeStop.notify();
            }
            return this;
        }

        function isEmpty() {
            return data.length == 0;
        }

        function total() {
            return data.length;
        }

        function init() {
            addItems(items);
        }

        function addItem(item) {
            return addRow(
                createRow(item)
            );
        }

        function addItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < items.length; i++) {
                    addItem(items[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }

        function deleteItem(item) {
            var idProperty = settings.rows.idProperty;
            if (settings.Utils.isProperty(idProperty, item)) {
                deleteRowById(item[idProperty]);
            }
            return this;
        }

        function getItems() {
            var result = []
            for (var i = 0; i < data.length; i++) {
                result.push(data[i].item);
            }
            return result;
        }

        function setItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                var ids = [];
                for (var i = 0; i < data.length; i++) {
                    ids.push(data[i].id);
                }
                data = [];
                for (var i = 0; i < items.length; i++) {
                    addItem(items[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }

        function updateItem(item) {
            var idProperty = settings.rows.idProperty;
            if (settings.Utils.isProperty(idProperty, item)) {
                updateItemById(item[idProperty], item);
            }
        }

        function updateItemById(id, item) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data[i].item = item;
                    self.onChange.notify({ "id": [id] });
                    break;
                }
            }
            return this;
        }

        function updateItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < items.length; i++) {
                    updateItem(items[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }


        function addRow(row) {
            if (row instanceof RowData) {
                data.push(row);
                self.onChange.notify({ "id": [row.id] });
            }
            return this;
        }

        function addRows(rows) {
            if (rows.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < rows.length; i++) {
                    addRow(rows[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }

        function deleteRow(row) {
            if (row instanceof RowData) {
                deleteRowById(row.id);
            }
            return this;
        }

        function deleteRowById(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data.splice(i, 1);
                    self.onChange.notify({ "id": [id] });
                    break;
                }
            }
            return this;
        }

        function deleteRowByIndex(idx) {
            var id = data[idx].id;
            data.splice(idx, 1);
            self.onChange.notify({ "id": [id] });
            return this;
        }

        function deleteRows() {
            if (data.length) {
                self.onChangeStop.notify();
                var ids = [];
                for (var i = 0; i < data.length; i++) {
                    ids.push(data[i].id);
                }
                data = [];
                self.onChange.notify({ "id": ids });
                self.onChangeStop.notify();
            }
            return this;
        }

        function getRowById(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    return data[i];
                }
            }
        }

        function getRowByIndex(idx) {
            return data[idx];
        }

        function getRowIdByIndex(idx) {
            return data[idx].id;
        }

        function getRowIndexById(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    return i;
                }
            }
            return -1;
        }

        function getRowPropertyById(id, propertyName) {
            var row = getRowById(id);
            if (row && propertyName && propertyName in row) {
                return row[propertyName];
            }
        }

        function getRowPropertyByIndex(idx, propertyName) {
            var row = getRowByIndex(idx);
            if (row && propertyName && propertyName in row) {
                return row[propertyName];
            }
        }

        function getRows() {
            return data;
        }

        function insertRowAfterId(id, row) {
            insertRowAfterIndex(
                getRowIndexById(id),
                row
            );
            return this;
        }

        function insertRowAfterIndex(idx, row) {
            if (row instanceof RowData) {
                data.splice(
                    idx + 1,
                    0,
                    row
                );
                self.onChange.notify({ "id": [row.id] });
            }
            return this;
        }

        function insertRowBeforeId(id, row) {
            insertRowBeforeIndex(
                getRowIndexById(id),
                row
            );
            return this;
        }

        function insertRowBeforeIndex(idx, row) {
            if (row instanceof RowData) {
                data.splice(
                    idx,
                    0,
                    row
                );
                self.onChange.notify({ "id": [row.id] });
            }
            return this;
        }

        function setRowPropertyById(id, propertyName, propertyValue) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    if (propertyName && propertyName in data[i]) {
                        data[i][propertyName] = propertyValue;
                        self.onChange.notify({ "id": [id] });
                    }
                    break;
                }
            }
            return this;
        }

        function setRowPropertyByIndex(idx, propertyName, propertyValue) {
            if (propertyName && propertyName in data[idx]) {
                data[idx][propertyName] = propertyValue;
                self.onChange.notify({ "id": [data[idx].id] });
            }
            return this;
        }

        function setRows(rows) {
            if (rows.length) {
                self.onChangeStart.notify();
                var ids = [];
                for (var i = 0; i < data.length; i++) {
                    ids.push(data[i].id);
                }
                data = [];

                for (var i = 0; i < rows.length; i++) {
                    addRow(rows[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }

        function setRowsProperty(propertyName, propertyValue) {
            for (var i = 0; i < data.length; i++) {
                data[i][propertyName] = propertyValue;
            }
            return this;
        }

        function updateRow(row) {
            if (row instanceof RowData) {
                data[idx] = row;
                self.onChange.notify({ "id": [row.id] });
            }
            return this;
        }

        function updateRowById(id, row) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data[i] = row;
                    self.onChange.notify({ "id": [id] });
                    break;
                }
            }
            return this;
        }

        function updateRowByIndex(idx, row) {
            if (data[idx]) {
                data[idx] = row;
                self.onChange.notify({ "id": [row.id] });
            }
            return this;
        }

        function updateRows(rows) {
            if (rows.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < rows.length; i++) {
                    updateRow(rows[i]);
                }
                self.onChangeStop.notify();
            }
            return this;
        }

        function createItemData(item) {
            if (settings.rows.mapProperties == true) {
                var itemData = $.extend({}, item);
                itemData.item = item;//TODO: extend?
                return itemData;
            }
            return { item: item };
        }

        function createRow(item) {
            var data = new RowData(createItemData(item));

            var idProperty = settings.rows.idProperty;
            if (settings.Utils.isProperty(idProperty, item)) {
                data.id = item[idProperty];
            } else {
                data.id = settings.Utils.getNewGuid();
            }

            data.height = Math.max(
                Math.min(
                    parseInt(data.height, 10),
                    data.maxHeight
                ),
                data.minHeight
            );

            return data;
        }

        $.extend(this, {
            "onChange": new Small.Event.Handler(),
            "onChangeStart": new Small.Event.Handler(),
            "onChangeStop": new Small.Event.Handler(),

            "filter": filter,
            "forEach": forEach,
            "reduce": reduce,
            "sort": sort,
            "total": total,

            "addItem": addItem,
            "addItems": addItems,
            "deleteItem": deleteItem,
            "deleteItems": deleteRows,
            "deleteItemById": deleteRowById,
            "getItems": getItems,
            "setItems": setItems,
            "updateItem": updateItem,
            "updateItemById": updateItemById,
            "updateItems": updateItems,

            "addRow": addRow,
            "addRows": addRows,
            "createRow": createRow,
            "deleteRow": deleteRow,
            "deleteRowById": deleteRowById,
            "deleteRowByIndex": deleteRowByIndex,
            "deleteRows": deleteRows,
            "getRowById": getRowById,
            "getRowByIndex": getRowByIndex,
            "getRowIdByIndex": getRowIdByIndex,
            "getRowIndexById": getRowIndexById,
            "getRowPropertyById": getRowPropertyById,
            "getRowPropertyByIndex": getRowPropertyByIndex,
            "getRows": getRows,
            "insertRowAfterId": insertRowAfterId,
            "insertRowAfterIndex": insertRowAfterIndex,
            "insertRowBeforeId": insertRowBeforeId,
            "insertRowBeforeIndex": insertRowBeforeIndex,
            "isEmpty": isEmpty,
            "setRowPropertyById": setRowPropertyById,
            "setRowPropertyByIndex": setRowPropertyByIndex,
            "setRows": setRows,
            "setRowsProperty": setRowsProperty,
            "updateRow": updateRow,
            "updateRowById": updateRowById,
            "updateRowByIndex": updateRowByIndex,
            "updateRows": updateRows,
        });
        init();
    }


    function CreateModel(data, settings) {
        return new RowModel(
            data,
            settings
        );
    }

})(jQuery);"use strict";

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
    }()

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
        var supportedHeight = 1000000,
            testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? 6000000 : 1000000000,
            div = $('<div style="display:none" />').appendTo(document.body);

        while (true) {
            var test = supportedHeight * 2;
            div.css("height", test);
            if (test > testUpTo || div.height() !== test) {
                break;
            } else {
                supportedHeight = test;
            }
        }

        div.remove();
        return supportedHeight;
    }

    function measureScrollbar() {
        var $c = $('<div style="position:absolute; top:-100px; left:-100px; width:100px; height:100px; overflow:scroll;"></div>').appendTo('body');

        var dim = {
            width: $c.width() - $c[0].clientWidth,
            height: $c.height() - $c[0].clientHeight
        };

        $c.remove();
        return dim;
    }


    function measureCellDiff($element) {
        var $row = $("<tr />").appendTo($element);
        var $cell = $("<td style='width:5px; height:5px;'>-</td>").appendTo($row);

        var cellDiff = {
            width: $cell.outerWidth() - $cell.width(),
            height: $cell.outerHeight() - $cell.height(),
        }

        $cell.remove();
        $row.remove();

        return cellDiff;
    }

    function changeSortOrder(sortOrder) {
        return -1 * (sortOrder < 0 ? -1 : 1);
    }

    $.extend(true, window, {
        "Small": {
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

})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "View": {
                "Create": CreateView,
            }
        }
    });



    function ViewData($container, settings) {
        var self = this;
        var viewModel;

        var suspend = true;
        var suspendRenderRequests = 0;

        var canvasSize = {
            width: 0,
            height: 0,
        }

        var cellOuterSize = {
            width: 0,
            height: 0,
        }

        //handlers
        var handlers = [];


        //elements
        var $viewport,
            $header,
            $canvas,
            $footer,
            $tableWrap,
            $table,
            $tableCol,
            $tableTbody,
            $headerWrap,
            $headerTable,
            $headerTbody;

        function init() {
            $container.empty().addClass(settings.uid);

            $viewport = $('<div class="small-grid grid-viewport"/>');
            $header = $('<div class="grid-header disable-text-selection"/>');
            $canvas = $('<div class="grid-canvas"/>');
            $footer = $('<div class="grid-footer"/>');

            $headerWrap = $('<div class="grid-header-wrap"/>');
            $headerTable = $('<table class="grid-header-table" border=1></table>');
            $headerTbody = $('<tbody></tbody>');

            $tableWrap = $('<div class="grid-table-wrap"/>');
            $table = $('<table class="grid-table" border=1></table>');
            $tableCol = $('<colgroup></colgroup>');
            $tableTbody = $('<tbody></tbody>');

            //main structure
            $header.appendTo($viewport);
            $canvas.appendTo($viewport);
            $footer.appendTo($viewport);

            //header part
            $headerTbody.appendTo($headerTable);
            $headerTable.appendTo($headerWrap);
            $headerWrap.appendTo($header);

            //table part
            $tableCol.appendTo($table);
            $tableTbody.appendTo($table);
            $table.appendTo($tableWrap);
            $tableWrap.appendTo($canvas);

            //bind scroll events
            if (settings.HandlerScroll) {
                handlers['scroll'] = new settings.HandlerScroll($canvas, {
                    "handleScrollStart": handleScrollStart,
                    "handleScrollStop": handleScrollStop,
                    "handleScroll": handleScroll,
                    "handleMouseWheelStart": handleMouseWheelStart,
                    "handleMouseWheelStop": handleMouseWheelStop,
                    "handleMouseWheel": handleMouseWheel,
                });
            }
            //bind resize events
            if (settings.HandlerResize) {
                handlers['resize'] = new settings.HandlerResize($header, {
                    "handleResize": handleHeaderResize,
                    "handleResizeStart": handleHeaderResizeStart,
                    "handleResizeStop": handleHeaderResizeStop,
                    "handlerIdentifier": "." + settings.cssClass.headerResizeHandle,
                });
            }
            //bind header click events
            if (settings.HandlerClick) {
                handlers['header'] = new settings.HandlerClick($header, {
                    "handleClick": handleHeaderClick,
                    "handleDblClick": handleHeaderDblClick,
                    "handleContextMenu": handleHeaderContextMenu,
                });
            }
            //bind cell click events
            if (settings.HandlerClick) {
                handlers['canvas'] = new settings.HandlerClick($canvas, {
                    "handleClick": handleCellClick,
                    "handleDblClick": handleCellDblClick,
                    "handleContextMenu": handleCellContextMenu,
                    "handleKeyDown": handleCellKeyDown,
                });
            }

            $(document.body).on("click", handleBodyClick);


            $viewport.appendTo($container);

            //calculate sizes
            cellOuterSize = settings.Utils.measureCellDiff($tableTbody);

            canvasSize = {
                width: $container.width(),
                height: $container.height(),
            };

            //setup sizes
            $canvas.width(canvasSize.width);
            $canvas.height(canvasSize.height);

            //block invisible part in header
            $header.width(canvasSize.width - settings.scrollbarDimensions.width);

            self.onInitialize.notify({});
        }

        /*
        Nodes
        */
        function getContainerNode() {
            return $container;
        }

        function getViewPortNode() {
            return $viewport;
        }

        /*
        Visiblity func
        */
        function isCellVisible(columnId, rowId) {
            return isColumnVisible(columnId) && isRowVisible(rowId);
        }

        function isColumnVisible(columnId) {
            var column = viewModel.getColumnById(columnId);
            if (column) {
                if (column.calcWidth - column.width - cellOuterSize.width >= $canvas[0].scrollLeft && column.calcWidth < canvasSize.width + $canvas[0].scrollLeft) {
                    return true;
                }
            }
            return false;
        }

        function isRowVisible(rowId) {
            var row = viewModel.getRowById(rowId);
            if (row) {
                if (row.calcHeight - row.height - cellOuterSize.height >= $canvas[0].scrollTop && row.calcHeight + row.height + cellOuterSize.height < canvasSize.height + $canvas[0].scrollTop) {
                    return true;
                }
            }
            return false;
        }

        /*
        Row func
        */
        function getRowNodeByIndex(rowIndex) {
            return $tableTbody[0].rows[rowIndex];
        }

        function getCellNodeByIndex(cellIndex, rowIndex) {
            return $tableTbody[0].rows[rowIndex].cells[cellIndex];
        }

        function getRowNodeById(rowId) {
            if (viewModel) {
                var rowIndex = viewModel.getRowIndexById(rowId);
                if (rowIndex != -1) {
                    return getRowNodeByIndex(rowIndex);
                }
            }
        }

        function getCellNodeById(columnId, rowId) {
            var rowIndex = viewModel.getRowIndexById(rowId);
            var columnIndex = viewModel.getColumnIndexById(columnId);
            if (rowIndex != -1 && columnIndex != -1) {
                return getCellNodeByIndex(columnIndex, rowIndex);
            }
        }

        function setColumnWidthByIndex(columnIndex, width) {
            var $headerCell = $headerTable.find("tr > td:nth-child(" + (columnIndex) + ")");
            if ($headerCell) {
                $headerCell.css("width", width);
            }

            var $col = $table.find("colgroup > col:nth-child(" + (columnIndex) + ")");
            if ($col) {
                $col.css("width", width + cellOuterSize.width);
            }
        }

        function enableHeaderClass(cssClass) {
            $headerTbody.find("." + cssClass + '_disabled').toggleClass(cssClass + '_disabled ' + cssClass);
        }

        function disableHeaderClass(cssClass) {
            $headerTbody.find("." + cssClass).toggleClass(cssClass + ' ' + cssClass + '_disabled');
        }

        function addViewPortClass(cssClass) {
            $viewport.addClass(cssClass);
        }

        function removeViewPortClass(cssClass) {
            $viewport.removeClass(cssClass);
        }

        function removeAllTextSelections() {
            var selection = ('getSelection' in window)
                ? window.getSelection()
                : ('selection' in document)
                    ? document.selection
                    : null;
            try {
                if ('removeAllRanges' in selection) {
                    selection.removeAllRanges();
                } else if ('empty' in selection) {
                    selection.empty();
                }
            } catch (e) { }
        }


        /*
        Public api
        */
        function setModel(model) {
            suspendRender(true);

            viewModel = model;
            viewModel.onRowsChange.subscribe(handleRowsChange);
            viewModel.onColumnsChange.subscribe(handleColumnsChange);

            viewModel.onDataChange.subscribe(handleDataChange);
            viewModel.onDataChangeStart.subscribe(handleDataChangeStart);
            viewModel.onDataChangeStop.subscribe(handleDataChangeStop);

            suspendRender(false);
        }

        function render() {
            suspendRenderRequests++;

            if (suspend == false) {
                renderRequests();
            }

            return this;
        }

        function renderRequests() {
            if (suspend == false && suspendRenderRequests > 0) {
                suspendRenderRequests = 0;
                viewModel.requestDataFromRange(
                    {
                        top: $canvas[0].scrollTop,
                        left: $canvas[0].scrollLeft
                    },
                    canvasSize,
                    cellOuterSize
                );
            }
            return this;
        }

        function isRenderSuspended() {
            return suspend;
        }

        function suspendRender(value) {
            suspend = value;
            return this;
        }

        function destroy() {
            suspendRender(true);

            if (viewModel) {
                viewModel.onRowsChange.unsubscribe(handleRowsChange);
                viewModel.onColumnsChange.unsubscribe(handleColumnsChange);
                viewModel.onDataChange.unsubscribe(handleDataChange);
                viewModel.onDataChangeStart.unsubscribe(handleDataChangeStart);
                viewModel.onDataChangeStop.unsubscribe(handleDataChangeStop);
            }

            if ($container.length) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].destroy();
                }
                $container.empty().removeClass(uid);
            }
            $(document.body).off("click", handleBodyClick);
            self.onDestroy.notify({});
        }

        /*
        Render part
        */
        function renderView(columnsHtml, colsHtml, rowsHtml) {
            self.onBeforeRowsRendered.notify({});

            $headerTbody[0].innerHTML = columnsHtml;
            $tableCol[0].innerHTML = colsHtml;
            $tableTbody[0].innerHTML = rowsHtml;

            self.onAfterRowsRendered.notify({});
        }

        /*
        Build part
        */
        function buldHeaderColumnsHtml(columns) {
            var html = '<tr class="' + settings.cssClass.headerRow + '">';
            for (var i = 0; i < columns.length; i++) {
                html += buildHeaderColumnHtml(columns[i]);
            }
            return html + buildLastHeaderColumn() + '</tr>';
        }

        function buildLastHeaderColumn() {
            return "<td class='" + settings.cssClass.headerCell + "' style='height:" + settings.columns.header.height + "px'></td>";
        }

        function buildHeaderColumnHtml(column) {
            var value = "",
                html,
                cellCssClass = settings.cssClass.headerCell;

            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            if (column.name) {
                value += column.name;
            }

            if (column.sortable || column.filterable) {
                cellCssClass += " " + settings.cssClass.cursorPointer;
            }

            var html = "<td style='width:" + (column.width) + "px;height:" + settings.columns.header.height + "px' class='" + cellCssClass + "'><div class='" + settings.cssClass.headerRowDiv + "'><span class='" + settings.cssClass.headerColumnName + "'>" + value + "</span>";


            if (column.sortable && column.sortOrder != 0) {
                html += "<span class='" + ((column.sortOrder == 1) ? settings.cssClass.headerSortUp : settings.cssClass.headerSortDown) + "'></span>";
            }

            if (column.filterable) {
                html += "<span class='" + settings.cssClass.headerFilter + "'></span>";
            }

            if (column.resizeable) {
                html += "<span class='" + settings.cssClass.headerResizeHandle + "'></span>";
            }

            return html + "</div></td>";
        }

        function buildColsHtml(columns) {
            var html = '';
            for (var i = 0; i < columns.length; i++) {
                html += buildColHtml(columns[i]);
            }
            return html + buildLastColHtml();
        }

        function buildLastColHtml() {
            return "<col class='" + settings.cssClass.col + "' style='width:0px;' />";
        }

        function buildColHtml(column) {
            var cellCssClass = settings.cssClass.col;
            if (column.headerCssClass) {
                cellCssClass += " " + columns.headerCssClass;
            }

            return "<col style='width:" + (column.width + cellOuterSize.width) + "px;' class='" + cellCssClass + "'/>";
        }

        function buildRowsHtml(columns, rows) {
            var html = '';
            for (var i = 0; i < rows.length; i++) {
                html += buildRowHtml(columns, rows[i], i);
            }
            return html;
        }

        function buildRowHtml(columns, row, index) {
            var rowCssClass = settings.cssClass.row + ((index & 1 == 1) ? " " + settings.cssClass.rowEven : " " + settings.cssClass.rowOdd);
            if (row.rowCssClass) {
                rowCssClass += " " + row.rowCssClass;
            }
            //todo: remove
            if (settings.rows.formatter) {
                row = settings.rows.formatter(row, columns);
            }

            var html = "<tr class='" + rowCssClass + "'>";
            for (var i = 0; i < columns.length; i++) {
                html += buildCellHtml(columns[i], row);
            }
            return html + buildLastCellHtml() + '</tr>';
        }

        function buildLastCellHtml() {
            return "<td class='" + settings.cssClass.cell + "'></td>";
        }

        function buildCellHtml(column, row) {
            var cellCssClass = settings.cssClass.cell;
            if (column.cellCssClass) {
                cellCssClass += " " + column.cellCssClass;
            }

            if (row.cellCssClass && column.field in row.cellCssClass) {
                cellCssClass += " " + row.cellCssClass[column.field];
            }

            return "<td height='" + row.height + "' class='" + cellCssClass + "'>" + buildCellContentHtml(column, row) + "</td>";
        }

        function buildCellContentHtml(column, row) {
            var value = "";

            if (column.field in row.item && (row.editMode === false || column.editMode === false)) {
                value = (column.formatter) ? settings.RowFormatter[column.formatter](row.item[column.field], column, row, settings) : row.item[column.field];
            }
            return value;
        }

        /*
        Calc private funcs
        */
        function getColumnEventType(targetClass, column) {
            var type = "";
            if (column.resizeable && targetClass.indexOf(settings.cssClass.headerResizeHandle) != -1) {
                type = "resize";
            } else if (column.filterable && targetClass.indexOf(settings.cssClass.headerFilter) != -1) {
                type = "filter";
            } else if (column.sortable) {
                type = "sort";
            }
            return type;
        }

        //todo: fix multiple types, edit && select, remove, add type registration
        function getCellEventType(targetClass, column, row) {
            var type = "";
            if (row.editable == true && column.editable == true) {
                type = "edit";
            } else if (row.disabled == true) {
                type = "disabled";
            }
            return type;
        }

        function getColumnEvent(e) {
            var column = viewModel.getColumnByIndex(e.cellIndex);
            if (column) {
                e.type = getColumnEventType($(e.event.target).attr("class"), column);
                e.targetClass = $(e.event.target).attr("class"),
                e.column = column;
                return e;
            }
        }

        function getCellEvent(e) {
            var column = viewModel.getColumnByIndex(e.cellIndex);
            var row = viewModel.getRowByIndex(e.rowIndex);

            if (column && column.field.length > 0 && row && column.field in row.item) {
                //replace with extend
                e.type = getCellEventType($(e.event.target).attr("class"), column, row);
                e.row = row;
                e.column = column;

                return e;
            }
        }

        /*
        Data handlers
        */
        function handleRowsChange(e) {
            if (viewModel) {
                var itemsHeight = viewModel.getRowsHeight(cellOuterSize);

                $tableWrap.css({
                    'height': itemsHeight,
                });
            }
        }

        function handleColumnsChange(e) {
            if (viewModel) {
                var columnsWidth = viewModel.getColumnsWidth(cellOuterSize);

                $headerWrap.css({
                    'width': columnsWidth
                });

                $tableWrap.css({
                    'width': columnsWidth,
                });
            }
        }

        function handleDataChange(e) {
            render();
        }

        function handleDataChangeStart(e) {
            suspendRender(true);
        }

        function handleDataChangeStop(e) {
            if (e.rows.length > 0 && e.columns.length > 0) {
                $headerTable.css({
                    'left': e.columns[0].calcWidth - e.columns[0].width - cellOuterSize.width
                });

                $table.css({
                    'top': e.rows[0].calcHeight - e.rows[0].height - cellOuterSize.height,
                    'left': e.columns[0].calcWidth - e.columns[0].width - cellOuterSize.width
                });

                renderView(
                    buldHeaderColumnsHtml(e.columns),
                    buildColsHtml(e.columns),
                    buildRowsHtml(e.columns, e.rows)
                );
            }

            suspendRender(false);
        }

        /*
        Handle cell events
        */
        function handleCellClick(e) {
            var cellEvent = getCellEvent(e);
            if (cellEvent) {
                suspendRender(true);
                self.onCellClick.notify(cellEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        function handleCellDblClick(e) {
            var cellEvent = getCellEvent(e);
            if (cellEvent) {
                suspendRender(true);
                self.onCellDblClick.notify(cellEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        function handleCellContextMenu(e) {
            var cellEvent = getCellEvent(e);
            if (cellEvent) {
                suspendRender(true);
                self.onCellContextMenu.notify(cellEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        function handleCellKeyDown(e) {
            var cellEvent = getCellEvent(e);
            if (cellEvent) {
                suspendRender(true);
                self.onCellKeyDown.notify(cellEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        /*
        Handle resize events
        */
        function handleHeaderResize(e) {
            suspendRender(true);
            self.onColumnResize.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleHeaderResizeStart(e) {
            suspendRender(true);
            self.onColumnResizeStart.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleHeaderResizeStop(e) {
            suspendRender(true);
            self.onColumnResizeStop.notify(e);
            suspendRender(false);
            renderRequests();
        }

        /*
        Handle mouse wheel
        */
        function handleMouseWheelStart(e) {
            suspendRender(true);
            self.onMouseWheelStart.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleMouseWheelStop(e) {
            suspendRender(true);
            self.onMouseWheelStop.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleMouseWheel(e) {
            suspendRender(true);
            self.onMouseWheel.notify(e);
            suspendRender(false);
            renderRequests();
        }

        /*
        Handle scroll
        */
        function handleScrollStart(e) {
            suspendRender(true);
            self.onScrollStart.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleScrollStop(e) {
            suspendRender(true);
            self.onScrollStop.notify(e);
            suspendRender(false);
            renderRequests();
        }

        function handleScroll(e) {
            self.suspendRender(true);
            $header[0].scrollLeft = $canvas[0].scrollLeft;
            self.onScroll.notify(e);
            self.suspendRender(false);
            render();
        }

        /*
        Handle body events
        */
        function handleBodyClick(e) {
            suspendRender(true);
            self.onBodyClick.notify({
                event: e,
            });
            suspendRender(false);
            renderRequests();
        }

        /*
        Handle header events
        */
        function handleHeaderClick(e) {
            var columnEvent = getColumnEvent(e);
            if (columnEvent) {
                suspendRender(true);
                self.onHeaderClick.notify(columnEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        function handleHeaderContextMenu(e) {
            var columnEvent = getColumnEvent(e);
            if (columnEvent) {
                suspendRender(true);
                self.onHeaderContextMenu.notify(columnEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        function handleHeaderDblClick(e) {
            var columnEvent = getColumnEvent(e);
            if (columnEvent) {
                suspendRender(true);
                self.onHeaderDblClick.notify(columnEvent);
                suspendRender(false);
                renderRequests();
            }
        }

        $.extend(this, {
            //Events
            "onScroll": new Small.Event.Handler(),
            "onScrollStart": new Small.Event.Handler(),
            "onScrollStop": new Small.Event.Handler(),

            "onMouseWheel": new Small.Event.Handler(),
            "onMouseWheelStart": new Small.Event.Handler(),
            "onMouseWheelStop": new Small.Event.Handler(),

            "onBodyClick": new Small.Event.Handler(),

            "onHeaderClick": new Small.Event.Handler(),
            "onHeaderContextMenu": new Small.Event.Handler(),
            "onHeaderDblClick": new Small.Event.Handler(),

            "onHeaderFilter": new Small.Event.Handler(),
            "onHeaderResize": new Small.Event.Handler(),
            "onHeaderSort": new Small.Event.Handler(),

            "onCellClick": new Small.Event.Handler(),
            "onCellContextMenu": new Small.Event.Handler(),
            "onCellDblClick": new Small.Event.Handler(),
            "onCellKeyDown": new Small.Event.Handler(),

            "onColumnResize": new Small.Event.Handler(),
            "onColumnResizeStart": new Small.Event.Handler(),
            "onColumnResizeStop": new Small.Event.Handler(),

            "onAfterRowsRendered": new Small.Event.Handler(),
            "onBeforeRowsRendered": new Small.Event.Handler(),

            "onInitialize": new Small.Event.Handler(),
            "onDestroy": new Small.Event.Handler(),

            "getContainerNode": getContainerNode,
            "getViewPortNode": getViewPortNode,

            "getRowNodeById": getRowNodeById,
            "getRowNodeByIndex": getRowNodeByIndex,
            "getCellNodeByIndex": getCellNodeByIndex,
            "getCellNodeById": getCellNodeById,
            "isCellVisible": isCellVisible,

            "addViewPortClass": addViewPortClass,
            "disableHeaderClass": disableHeaderClass,
            "enableHeaderClass": enableHeaderClass,
            "removeViewPortClass": removeViewPortClass,
            "setColumnWidthByIndex": setColumnWidthByIndex,
            "removeAllTextSelections": removeAllTextSelections,

            "destroy": destroy,
            "isRenderSuspended": isRenderSuspended,
            "render": render,
            "setModel": setModel,
            "suspendRender": suspendRender,
        });

        init();
    }


    function CreateView($container, data, columns, settings) {
        $container = $($container);
        if ($container.length < 1) {
            throw new Error("Small grid requires a valid container, " + container + " does not exist in the DOM.");
        }

        return new ViewData($container, data, columns, settings);
    }

})(jQuery);"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "View": {
                "Model": ViewModel
            }
        }
    });


    function ViewModel(rowsModel, columnsModel, settings) {
        var self = this;
        var columns = columnsModel;
        var rows = rowsModel;

        var rowsCache = [];
        var columnsCache = [];

        var rowsFilters = [];
        var columnsFilters = [];

        var sorters = [];

        var cachedRange = {
            minTop: -1,
            maxTop: -1,
            minLeft: -1,
            maxLeft: -1,
        }

        /*
        Init && destroy
        */
        function init() {
            rowsModel.onChange.subscribe(handleRowsChange);
            columnsModel.onChange.subscribe(handleColumnsChange);
            return this;
        }

        function destroy() {
            rowsModel.onChange.unsubscribe(handleRowsChange);
            columnsModel.onChange.unsubscribe(handleColumnsChange);
        }

        /*
        Handlers
        */
        function handleColumnsChange() {
            //self.onColumnsChange.notify();
            resetCacheRangeWidth();
            self.onDataChange.notify();
        }

        function handleRowsChange() {
            //self.onRowsChange.notify();
            resetCacheRangeHeight();
            self.onDataChange.notify();
        }

        /*
        Row and column helpers
        */
        function getRowByIndex(idx) {
            return rowsCache[idx];
        }

        function getColumnByIndex(idx) {
            return columnsCache[idx];
        }

        function getRowIndexById(id) {
            for (var i = 0; i < rowsCache.length; i++) {
                if (rowsCache[i].id == id) {
                    return i;
                }
            }
            return -1;
        }

        function getColumnIndexById(id) {
            for (var i = 0; i < columnsCache.length; i++) {
                if (columnsCache[i].id == id) {
                    return i;
                }
            }
            return -1;
        }

        function getRowById(id) {
            for (var i = 0; i < rowsCache.length; i++) {
                if (rowsCache[i].id == id) {
                    return rowsCache[i];
                }
            }
        }

        function getColumnById(id) {
            for (var i = 0; i < columnsCache.length; i++) {
                if (columnsCache[i].id == id) {
                    return columnsCache[i];
                }
            }
        }

        /*
        Filter part
        */
        function getFilters() {
            return rowsFilters;
        }

        function setFilter(filterObj) {
            if (filterObj instanceof settings.Filter.FilterQuery) {
                clearFilter(filterObj);
                rowsFilters.push(filterObj);

                resetCacheRangeHeight();
                self.onDataChange.notify();
            }
        }

        function setFilters(filters) {
            rowsFilters = [];
            for (var i = 0; i < filters.length; i++) {
                rowsFilters.push(filters[i]);
            }
            resetCacheRangeHeight();
            self.onDataChange.notify();
        }

        function clearFilter(filterObj) {
            if (filterObj instanceof settings.Filter.FilterQuery) {
                for (var i = 0; i < rowsFilters.length; i++) {
                    if (rowsFilters[i].getId() == filterObj.getId()) {
                        rowsFilters.splice(i, 1);

                        resetCacheRangeHeight();
                        self.onDataChange.notify();
                        break;
                    }
                }
            }
        }

        function clearFilters() {
            rowsFilters = [];

            resetCacheRangeHeight();
            self.onDataChange.notify();
        }

        /*
        Data calculations
        */
        function getRowsHeight(cellOuterSize) {
            return new settings.Filter.FilterRequest(rowsFilters, rowsModel).getRowsHeight(cellOuterSize.height);
        }

        function getColumnsWidth(cellOuterSize) {
            return new settings.Filter.FilterRequest(columnsFilters, columnsModel).getColumnsWidth(cellOuterSize.width);
        }

        function requestDataFromRange(point, size, outerSize) {
            var rowsCached = (cachedRange.minTop <= point.top && point.top <= cachedRange.maxTop) && settings.rows.virtualization;
            var columnsCached = (cachedRange.minLeft <= point.left && point.left <= cachedRange.maxLeft) && settings.columns.virtualization;

            if (rowsCached == false || columnsCached == false) {
                self.onDataChangeStart.notify();
            }

            if (rowsCached == false) {
                rowsCache = new settings.Filter.FilterRequest(rowsFilters, rowsModel).getRowsInRange(point.top, size.height, outerSize.height);

                self.onRowsChange.notify();
            }

            if (columnsCached == false) {
                columnsCache = new settings.Filter.FilterRequest(columnsFilters, columnsModel).getColumnsInRange(point.left, size.width, outerSize.width);

                self.onColumnsChange.notify();
            }

            updateCacheRange(point, size, outerSize);

            if (rowsCached == false || columnsCached == false) {
                self.onDataChangeStop.notify({
                    rows: rowsCache,
                    columns: columnsCache,
                });
            }
        }

        /*
        Cache range
        */
        function updateCacheRange(point, size, outerSize) {
            if (columnsCache.length && rowsCache.length) {
                cachedRange = {
                    minTop: rowsCache[0].calcHeight < size.height
                        ? rowsCache[0].calcHeight - rowsCache[0].height - outerSize.height
                        : rowsCache[0].calcHeight + size.height,
                    maxTop: rowsCache[(rowsCache.length - 1)].calcHeight - size.height + settings.scrollbarDimensions.height,
                    minLeft: columnsCache[0].calcWidth < size.width
                        ? columnsCache[0].calcWidth - columnsCache[0].width - outerSize.width
                        : columnsCache[0].calcWidth + size.width,
                    maxLeft: columnsCache[(columnsCache.length - 1)].calcWidth - size.width + settings.scrollbarDimensions.width,
                }
            } else {
                resetCacheRange();
            }
        }

        function resetCacheRangeHeight() {
            cachedRange.minTop = -1;
            cachedRange.maxTop = -1;
        }

        function resetCacheRangeWidth() {
            cachedRange.minLeft = -1;
            cachedRange.maxLeft = -1;
        }

        function resetCacheRange() {
            resetCacheRangeHeight();
            resetCacheRangeWidth();
        }

        init();

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "resetCacheRange": resetCacheRange,
            "requestDataFromRange": requestDataFromRange,

            "rows": rows,
            "columns": columns,

            "getRowsHeight": getRowsHeight,
            "getColumnsWidth": getColumnsWidth,

            "getRowByIndex": getRowByIndex,
            "getColumnByIndex": getColumnByIndex,
            "getRowById": getRowById,
            "getColumnById": getColumnById,

            "getRowIndexById": getRowIndexById,
            "getColumnIndexById": getColumnIndexById,

            "setFilter": setFilter,
            "clearFilter": clearFilter,
            "clearFilters": clearFilters,

            "onRowsChange": new Small.Event.Handler(),//rename to onRowCountChange
            "onColumnsChange": new Small.Event.Handler(),//rename to onColumnCountChange
            "onDataChange": new Small.Event.Handler(),
            "onDataChangeStart": new Small.Event.Handler(),
            "onDataChangeStop": new Small.Event.Handler(),
        });
    }
})(jQuery);"use strict";
/*
Required
email

*/
(function ($) {

    $.extend(true, window, {
        "Small": {
            "Plugins": {
                "CellEdit": CellEditPlugin,
            }
        }
    });



    function CellEditPlugin(viewModel, view, settings) {
        var self = this;

        var history = [];//todo: history

        var editOptions = {
            enabled: false
        };

        function init() {
            view.onAfterRowsRendered.subscribe(handelAfterRowsRendered);
            view.onBeforeRowsRendered.subscribe(handelBeforeRowsRendered);
            view.onCellClick.subscribe(handleCellClick);
            view.onCellDblClick.subscribe(handleCellDblClick);
            view.onCellKeyDown.subscribe(handeCellKeyDown);
            view.onScrollStop.subscribe(handleScrollStop);
        }

        function destroy() {
            view.onAfterRowsRendered.unsubscribe(handelAfterRowsRendered);
            view.onBeforeRowsRendered.unsubscribe(handelBeforeRowsRendered);
            view.onCellClick.unsubscribe(handleCellClick);
            view.onCellDblClick.unsubscribe(handleCellDblClick);
            view.onCellKeyDown.unsubscribe(handeCellKeyDown);
            view.onScrollStop.unsubscribe(handleScrollStop);
        }

        function handleScrollStop(e) {
            if (isEditMode() == true && settings.edit.autoFocus == true) {
                if (view.isCellVisible(editOptions.column.id, editOptions.row.id)) {
                    editOptions.editor.focus();
                }
            }
        }

        function handelBeforeRowsRendered(e) {
            if (isEditMode() == true) {
                editOptions.editor.remove();
            }
        }

        function handelAfterRowsRendered(e) {
            if (isEditMode() == true) {
                var cellNode = view.getCellNodeById(editOptions.column.id, editOptions.row.id);
                if (cellNode) {
                    editOptions.editor.append(cellNode);
                    if (editOptions.addFocus == true) {
                        editOptions.addFocus = false;
                        editOptions.editor.focus();
                    }
                }
            }
        }

        function handleCellDblClick(e) {
            if (settings.edit.editOnClick == false) {
                editCellById(e.column.id, e.row.id);
            }
        }

        function handleCellClick(e) {
            if (settings.edit.editOnClick == true) {
                editCellById(e.column.id, e.row.id);
            }
        }

        function handeCellKeyDown(e) {
            //enter pressed
            if (e && e.event) {
                switch (e.event.keyCode) {
                    case 13:
                        applyEdit();
                        break;
                    case 27:
                        cancelEdit();
                        break;
                }
            }
        }

        /*
        Public api
        */
        function editCellById(columnId, rowId) {
            if (isEditMode() == true) {
                if (editOptions.column.id != columnId || editOptions.row.id != rowId) {
                    applyEdit();
                }
            }

            if (isEditMode() == false) {

                var column = viewModel.getColumnById(columnId);
                var row = viewModel.getRowById(rowId);

                if (row && column && row.editable && column.editable && column.editor) {
                    editOptions = {
                        enabled: true,
                        addFocus: true,
                        row: row,
                        column: column,
                        editor: new settings.RowEditor.Create(
                            column.editor,
                            {
                                "value": row.item[column.field],
                            },
                            settings
                        ),
                    }

                    viewModel.columns.setColumnPropertyById(
                        column.id,
                        'editMode',
                        true
                    );

                    viewModel.rows.setRowPropertyById(
                        row.id,
                        'editMode',
                        true
                    );
                }
            }
        }


        function getEditor() {
            if (editOptions.enabled == true) {
                return editOptions.editor;
            }
        }

        function isEditMode() {
            return (editOptions.enabled == true);
        }

        function applyEdit() {
            if (editOptions.enabled == true) {

                viewModel.columns.setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = viewModel.rows.getRowById(editOptions.row.id);
                if (row) {
                    row.item[editOptions.column.field] = editOptions.editor.getValue();
                    row.editMode = false;
                    viewModel.rows.updateItem(row);
                }

                //apply
                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
            }
            return this;
        }

        function cancelEdit() {
            if (editOptions.enabled == true) {

                viewModel.columns.setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = viewModel.rows.getRowById(editOptions.row.id);
                if (row) {
                    row.editMode = false;
                    viewModel.rows.updateItem(row);
                }

                //undo
                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
            }
            return this;
        }


        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "applyEdit": applyEdit,
            "cancelEdit": cancelEdit,
            "editCellById": editCellById,
            "getEditor": getEditor,
            "isEditMode": isEditMode,
        });

        init();
    }

})(jQuery);"use strict";

(function ($) {

    $.extend(true, window, {
        "Small": {
            "Plugins": {
                "Filter": FilterMenuPlugin,
                "FilterMenu": FilterMenu,
            }
        }
    });

    function FilterMenu(column, $container, settings) {
        var self = this;
        var $element = $("<div class='grid-header-menu'></div>").hide();
        var filter = new settings.Filter.FilterQuery(column.field, settings);

        /*
        Init && destroy
        */
        function init() {
            var $form = $('<form>').appendTo($element);
            var $content = $('<div class="grid-header-menucontent"></div>')
                .append('<select name="type1"><option value="contains">Contains</option><option value="doesnotcontain">Does not contains</option><option value="eq">Is equal to</option><option value="neq">Is not equal to</option><option value="startswith">Starts with</option><option value="endswith">Ends with</option></select>')
                .append('<input type="text" name="value1" value=""/>')
                .append('<select name="operator"><option value="and">And</option><option value="or">Or</option></select>')
                .append('<select name="type2"><option value="contains">Contains</option><option value="doesnotcontain">Does not contains</option><option value="eq">Is equal to</option><option value="neq">Is not equal to</option><option value="startswith">Starts with</option><option value="endswith">Ends with</option></select>')
                .append('<input type="text" name="value2" value=""/>')
                .append('<input type="submit" name="Filter" value="Filter" class="btn btn-primary"/>')
                .append('<input type="reset" name="Clear" value="Clear" class="btn"/>')
                .appendTo($form);

            $element.on("click", handleMenuClick);
            $form.on("submit", handleMenuSubmit);
            $form.on("reset", handleMenuClear);


            $element.appendTo($container);

            return this;
        }

        function destroy() {
            $element.remove();
        }

        /*
        Menu functions
        */
        function setupMenu($target) {
            var containerSizes = {
                width: $container.width(),
                left: $container.offset().left
            }

            var elementSizes = {
                width: $element.width(),
                height: $element.height()
            }

            var targetSizes = {
                left: $target.offset().left,
                top: $target.offset().top,
                width: $target.width(),
                height: $target.height(),
            }

            var left = (elementSizes.width + targetSizes.left > containerSizes.width && elementSizes.width < targetSizes.left - containerSizes.left)
                            ? targetSizes.left + targetSizes.width - elementSizes.width
                            : targetSizes.left;

            $element.offset({
                top: targetSizes.top + targetSizes.height,
                left: left
            });

            return this;
        }

        function show() {
            $element.show();
            return this;
        }

        function hide() {
            $element.hide();
            return this;
        }

        function getFormValues() {
            return {
                "value": [$element.find("input[name='value1']").val(), $element.find("input[name='value2']").val()],
                "type": [$element.find("select[name='type1']").val(), $element.find("select[name='type2']").val()],
                "operator": $element.find("select[name='operator']").val()
            }
        }

        function getId() {
            return column.id;
        }

        function getFilter() {
            return filter;
        }

        /*
        Menu handlers
        */
        function handleMenuSubmit(e) {
            e.preventDefault();
            var formValues = getFormValues();

            filter.clear();
            filter.add(formValues.type[0], formValues.value[0]);
            if (formValues.value[1]) {
                filter.add(formValues.operator);
                filter.add(formValues.type[1], formValues.value[1]);
            }

            self.onSubmit.notify();

            hide();
        }

        function handleMenuClear(e) {
            e.preventDefault();
            self.onClear.notify({});
            hide();
        }

        function handleMenuClick(e) {
            e.stopPropagation();
        }


        $.extend(this, {
            "onSubmit": new Small.Event.Handler(),
            "onClear": new Small.Event.Handler(),

            "init": init,
            "destroy": destroy,

            "getFilter": getFilter,

            "getId": getId,
            "hide": hide,
            "setupMenu": setupMenu,
            "show": show,
        });
    }

    function FilterMenuPlugin(viewModel, view, settings) {
        var self = this;
        var cache = [];
        var activeId = 0;

        function init() {
            view.onBeforeRowsRendered.subscribe(handleHideMenu);
            view.onBodyClick.subscribe(handleHideMenu);
            view.onColumnResizeStart.subscribe(handleHideMenu);
            view.onHeaderClick.subscribe(handleHeaderClick);
            view.onScrollStart.subscribe(handleHideMenu);
        }

        function destroy() {
            view.onBeforeRowsRendered.unsubscribe(handleHideMenu);
            view.onBodyClick.unsubscribe(handleHideMenu);
            view.onColumnResizeStart.unsubscribe(handleHideMenu);
            view.onHeaderClick.unsubscribe(handleHeaderClick);
            view.onScrollStart.unsubscribe(handleHideMenu);

            for (var i = 0; i < cache.length; i++) {
                var menu = cache[i];
                menu.onSubmit.unsubscribe(handleMenuSubmit);
                menu.onClear.unsubscribe(handleMenuClear);
                menu.destroy();
            }
            cache = [];
        }

        /*
        Grid handlers
        */
        function handleHeaderClick(e) {
            if (e && e.type && e.type == "filter") {
                e.event.stopPropagation();

                if (!isMenu(e.column.id)) {
                    var menu = new FilterMenu(e.column, view.getContainerNode(), settings)
                        .init()
                        .show()
                        .setupMenu($(e.event.target));
                    menu.onSubmit.subscribe(handleMenuSubmit);
                    menu.onClear.subscribe(handleMenuClear);

                    cache.push(menu);
                }

                if (activeId !== e.column.id) {
                    hideActiveMenu();
                    showMenuById(e.column.id);
                } else {
                    if (activeId) {
                        hideActiveMenu();
                    } else {
                        showMenuById(e.column.id);
                    }
                }
            }
        }

        function handleHideMenu(e) {
            if (activeId) {
                hideActiveMenu();
            }
        }

        /*
        Menu handlers
        */
        function handleMenuSubmit(e) {
            if (activeId) {
                for (var i = 0; i < cache.length; i++) {
                    if (cache[i].getId() == activeId) {
                        viewModel.setFilter(cache[i].getFilter());
                        break;
                    }
                }
                hideActiveMenu();
            }
        }

        function handleMenuClear(e) {
            if (activeId) {
                for (var i = 0; i < cache.length; i++) {
                    if (cache[i].getId() == activeId) {
                        viewModel.clearFilter(cache[i].getFilter());
                        break;
                    }
                }
                hideActiveMenu();
            }
        }

        /*
        Menu functions
        */
        function isMenu(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].getId() == id) {
                    return true;
                }
            }
            return false;
        }

        function getMenu(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].getId() == id) {
                    return cache[i];
                }
            }
        }

        function showMenuById(id) {
            var menu = getMenu(id);
            if (menu) {
                menu.show();
                activeId = id;
            }
        }

        function hideActiveMenu() {
            var menu = getMenu(activeId);
            if (menu) {
                menu.hide();
                activeId = 0;
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

        init();
    }

})(jQuery);"use strict";

(function ($) {

    $.extend(true, window, {
        "Small": {
            "Plugins": {
                "ColumnResize": ColumnResizePlugin,
            }
        }
    });

    function ColumnResizePlugin(viewModel, view, settings) {
        var self = this;
        var column;
        var width;

        function init() {
            view.onColumnResize.subscribe(handleColumnResize);
            view.onColumnResizeStart.subscribe(handleColumnResizeStart);
            view.onColumnResizeStop.subscribe(handleColumnResizeStop);
        }

        function destroy() {
            view.onColumnResize.unsubscribe(handleColumnResize);
            view.onColumnResizeStart.subscribe(handleColumnResizeStart);
            view.onColumnResizeStop.subscribe(handleColumnResizeStop);
        }

        function handleColumnResize(e) {
            if (column) {
                width = Math.max(
                    Math.min(
                        parseInt(e.width, 10),
                        column.maxWidth
                    ),
                    column.minWidth
                );
                //change visual width
                view.setColumnWidthByIndex(e.cellIndex + 1, width);
            }
        }

        function handleColumnResizeStart(e) {
            column = viewModel.getColumnByIndex(e.cellIndex);

            if (column) {
                view.disableHeaderClass(settings.cssClass.cursorPointer);
                view.addViewPortClass(settings.cssClass.cursorResize);
            }
        }

        function handleColumnResizeStop(e) {
            
            if (column) {
                if (width) {
                    viewModel.columns.setColumnPropertyById(
                        column.id,
                        'width',
                        width
                    );
                }
                view.enableHeaderClass(settings.cssClass.cursorPointer);
                view.removeViewPortClass(settings.cssClass.cursorResize);
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

        init();
    }

})(jQuery);"use strict";

(function ($) {

    $.extend(true, window, {
        "Small": {
            "Plugins": {
                "ColumnSort": ColumnSortPlugin,
            }
        }
    });

    function ColumnSortPlugin(viewModel, view, settings) {
        var self = this;
        function init() {
            view.onHeaderClick.subscribe(handleHeaderClick);
        }

        function destroy() {
            view.onHeaderClick.unsubscribe(handleHeaderClick);
        }

        function handleHeaderClick(e) {
            if (e && e.type && e.type == "sort") {
                viewModel.resetCacheRange();

                var column = e.column;
                var sortOrder = settings.Utils.changeSortOrder(column.sortOrder);//todo: remade
                viewModel.columns.setColumnsProperty("sortOrder", 0);//reset sorting
                viewModel.columns.setColumnPropertyById(column.id, "sortOrder", sortOrder);
                viewModel.rows.sort(
                    settings.RowComparer[column.sortComparer]({
                        "sortOrder": sortOrder,
                        "field": column.field
                    })
                );
            }
        }

        //todo
        function sortColumnByIndex(idx, sortOrder) {

        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

        init();
    }

})(jQuery);"use strict";

(function ($) {

    $.extend(true, window, {
        "Small": {
            "Plugins": {
                "RowSelection": RowSelectionPlugin,
            }
        }
    });
    //todo: add shift and ctrl support
    //todo: update css classes
    //todo: keyboard navigation up and down

    function RowSelectionPlugin(viewModel, view, settings) {
        var self = this;
        var selectedRowIds = [];

        function init() {
            view.onCellClick.subscribe(handleCellClick);
            view.onCellKeyDown.subscribe(handeCellKeyDown);
        }

        function destroy() {
            view.onCellClick.unsubscribe(handleCellClick);
            view.onCellKeyDown.unsubscribe(handeCellKeyDown);
        }

        function handleCellClick(e) {
            setSelectedRow(e.row.id);
        }


        function handeCellKeyDown(e) {
            //console.log(e);//todo
        }

        function selectRowById(id) {

            if (isRowSelected(id) === false) {
                var row = viewModel.rows.getRowById(id);
                if (row) {
                    viewModel.rows.setRowPropertyById(
                        id,
                        'rowCssClass',
                        row.rowCssClass + ' ' + settings.cssClass.rowSelected
                    );
                    selectedRowIds.push(id);
                }
            }
        }

        /*
        Public api
        */
        function setSelectedRows(ids) {
            if (settings.allowMultiRowSelection == true) {
                for (var i = 0; i < ids.length; i++) {
                    var row = viewModel.rows.getRowById(ids);
                    if (row) {
                        selectRowById(row.id);
                    }
                }
            }
            return this;
        }

        function clearSelectedRows(skipId) {
            if (selectedRowIds.length) {
                for (var i = 0; i < selectedRowIds.length; i++) {
                    if (selectedRowIds[i] == skipId) {
                        continue;
                    }

                    var row = viewModel.rows.getRowById(selectedRowIds[i]);
                    if (row) {
                        viewModel.rows.setRowPropertyById(
                            row.id,
                            'rowCssClass',
                            row.rowCssClass.replace(' ' + settings.cssClass.rowSelected, '')
                        );
                    }
                    selectedRowIds.splice(i, 1);
                }
            }
            return this;
        }

        function isRowSelected(id) {
            return (selectedRowIds.indexOf(id) !== -1);
        }

        function setSelectedRow(id) {
            if (settings.allowMultiRowSelection == false) {
                clearSelectedRows(id);
            }
            selectRowById(id);
        }

        function getSelectedRows() {
            return selectedRowIds;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "clearSelectedRows": clearSelectedRows,
            "getSelectedRows": getSelectedRows,
            "isRowSelected": isRowSelected,
            "setSelectedRow": setSelectedRow,
            "setSelectedRows": setSelectedRows,
        });

        init();
    }

})(jQuery);"use strict";
if (typeof jQuery === "undefined") {
    throw "Small grid requires jquery module to be loaded";
}

(function ($) {


    function getNamespaceFromString(namespace) {
        var ref = window;
        var namespaceParts = namespace.split(".");
        for (var i = 0; i < namespaceParts.length; ++i) {
            ref = ref[namespaceParts[i]];
        }
        return ref;
    }

    function loadShortcuts(settings) {
        for (var shortcut in shortcuts) {
            var namespace = getNamespaceFromString(shortcuts[shortcut])
            if (namespace) {
                settings[shortcut] = namespace;
            }
        }
    }

    var shortcuts = {
        Event: "Small.Event",
        HandlerClick: "Small.Handler.Click",
        HandlerResize: "Small.Handler.Resize",
        HandlerScroll: "Small.Handler.Scroll",
        Plugins: "Small.Plugins",
        RowComparer: "Small.Row.Comparer",
        Filter: "Small.Filter",
        RowEditor: "Small.Cell.Editor",
        RowFormatter: "Small.Cell.Formatter",
        Utils: "Small.Utils",
        View: "Small.View",
    }

    var defaultSettings = {
        maxSupportedCssHeight: undefined,//internal
        scrollbarDimensions: undefined,//internal
        explicitInitialization: false,
        uid: undefined,
        uidPrefix: "smallgrid_",
        allowMultiRowSelection: false,//allow multirow selection
        edit: {
            editOnClick: false,//when true, editor loaded after click
            autoFocus: true,//autofocus editor when scrolling
        },

        cssClass: {
            cell: "grid-td grid-td-div",
            col: "grid-col",
            cursorPointer: "grid-cursor-pointer",
            cursorResize: "grid-cursor-resize",
            headerCell: "grid-header-cell",
            headerColumnName: "grid-column-name",
            headerFilter: "grid-header-filter",
            headerResizeHandle: "grid-resizable-handle",
            headerRow: "grid-header-row",
            headerRowDiv: "grid-header-td-div",
            headerSortable: "grid-sortable",
            headerSortDown: "grid-sort-icon grid-sort-icon-desc",
            headerSortUp: "grid-sort-icon grid-sort-icon-asc",
            row: "grid-tr",
            rowEven: "grid-tr-even",
            rowOdd: "grid-tr-odd",
            rowSelected: "grid-row-selected"
        },

        columns: {
            idProperty: undefined,
            mapProperties: true,
            virtualization: true,
            header: {
                height: 20,
            },
        },

        rows: {
            idProperty: undefined,//TODO: other fields mapping
            mapProperties: true,
            virtualization: true,
            formatter: undefined,//todo: remove?
            editable: true,
            selectable: true,
        },

        formatter: {
            floatFormatter: {
                decimals: 2,
            },
            integerFormatter: {
                decimals: 2,
            },
        },

        plugins: [
            "ColumnSort",
            "ColumnResize",
            "RowSelection",
            "CellEdit",
            "Filter",
        ]
    }



    function CreateObj(settings) {

        var settings = jQuery.extend(true, defaultSettings, settings);

        if (settings['maxSupportedCssHeight'] == undefined) {
            defaultSettings['maxSupportedCssHeight'] = settings['maxSupportedCssHeight'] = settings.Utils.measureMaxSupportedCssHeight()
        }
        if (settings['scrollbarDimensions'] == undefined) {
            defaultSettings['scrollbarDimensions'] = settings['scrollbarDimensions'] = settings.Utils.measureScrollbar()
        }

        settings.uid = settings.uid || settings.Utils.getNewGuid();
        return settings;
    }

    loadShortcuts(defaultSettings);

    $.extend(true, window, {
        "Small": {
            "Settings": {
                "Create": CreateObj,
                "Default": defaultSettings,
            }
        }
    });
})(jQuery);