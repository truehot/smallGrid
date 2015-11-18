(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
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

    function CheckboxEditor(options, settings) {
        var self = this,
            value = options.value,
            $label = $('<label/>'),
            $element = $('<input type="checkbox" class="grid-checkbox-editor" ' + (convertValue(value)?'checked':'') + '/>').val(value);

        this.append = function (cellNode) {
            $element.appendTo($label);
            $label.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $label.remove();
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return convertValue($element.prop('checked'));
        };

        this.setValue = function (value) {
            $element.prop('checked', convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            $element.val(self.getValue()).focus();
            return self;
        };

        function convertValue(value) {
            return (/^true$/i).test(value);
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function FloatEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-float-editor" />').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            $element.val(self.getValue()).select();

            return self;
        };

        function convertValue(value) {
            return parseFloat(value, 10) || 0;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function IntegerEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-integer-editor" />').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            $element.val(self.getValue()).select();

            return self;
        };

        function convertValue(value) {
            return parseInt(value, 10) || 0;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function NoneEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $("<span class='grid-none-editor' />").text(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return convertValue($element.text());
        };

        this.setValue = function (value) {

            $element.text(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            $element.select();
            return self;
        };

        function convertValue(value) {
            return value;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function TextEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-text-editor"/>').val(value);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            $element.val(self.getValue()).select();
            return self;
        };

        function convertValue(value) {
            return value;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function CreateEditor(name, options, settings) {
        if (SmallGrid.Utils.isFunction(name, SmallGrid.Cell.Editor) === true) {
            return new SmallGrid.Cell.Editor[name](options, settings);
        }
    }

})(jQuery);(function ($) {
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

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Column": {
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
            var x = (settings.field in a.item) ? a.item[settings.field].toLowerCase() : null,
                y = (settings.field in b.item) ? b.item[settings.field].toLowerCase() : null;
            return x.localeCompare(y) * sortOrder;
        };
    }

    function stringComparer(settings) {
        var sortOrder = settings.sortOrder;
        return function (a, b) {
            var x = (settings.field in a.item) ? a.item[settings.field].toLowerCase() : null,
                y = (settings.field in b.item) ? b.item[settings.field].toLowerCase() : null;

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

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Column": {
                "Create": CreateModel,
                "Model": ColumnModel,
                "ColumnData": ColumnData
            }
        }
    });

    function ColumnData(data) {
        if ("align" in data) this.align = data.align;
        if ("cellCssClass" in data) this.cellCssClass = data.cellCssClass;
        if ("editable" in data) this.editable = data.editable;
        if ("editor" in data) this.editor = data.editor;
        if ("editMode" in data) this.editMode = data.editMode;
        if ("field" in data) this.field = data.field;
        if ("filterable" in data) this.filterable = data.filterable;
        if ("formatter" in data) this.formatter = data.formatter;
        if ("headerCssClass" in data) this.headerCssClass = data.headerCssClass;
        if ("hidden" in data) this.hidden = data.hidden;
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

    ColumnData.prototype.align = "";//column cells align - "" / center / right
    ColumnData.prototype.cellCssClass = "";//css class for column cells
    ColumnData.prototype.editable = true; // are column cells editable
    ColumnData.prototype.editor = undefined; // name of editor
    ColumnData.prototype.editMode = false; // are column cells in editMode
    ColumnData.prototype.field = ""; // cell content will be taken from value of this property in row
    ColumnData.prototype.filterable = false;//bool
    ColumnData.prototype.formatter = "Default";//default cell content formatter
    ColumnData.prototype.headerCssClass = "";//css class for column header cell  
    ColumnData.prototype.hidden = false;//is column hidden?
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
            return self;
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
                self.onChangeStop.notify({ "mode": "all" });
            }
            return self;
        }

        function isEmpty() {
            return data.length === 0;
        }

        function total() {
            return data.length;
        }


        function init() {
            addItems(items);
        }


        function addItem(item) {
            var column = addColumn(
                createColumn(item)
            );
            self.onChange.notify({ "id": column.id });
            return column;
        }

        function addItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < items.length; i++) {
                    addItem(items[i]);
                }
                self.onChangeStop.notify();
            }
            return self;
        }

        function deleteItem(item) {
            if (SmallGrid.Utils.isProperty(settings.columns.idProperty, item)) {
                deleteColumnById(item[settings.columns.idProperty]);
            }
            return self;
        }

        function getItems() {
            var result = [];
            for (var i = 0; i < data.length; i++) {
                result.push(data[i].item);
            }
            return result;
        }

        function setItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                data = [];
                for (var i = 0; i < items.length; i++) {
                    addItem(items[i]);
                }
                self.onChangeStop.notify({ "mode": "all" });
            }
            return self;
        }

        function updateItem(item) {
            if (SmallGrid.Utils.isProperty(settings.columns.idProperty, item)) {
                updateItemById(item[settings.columns.idProperty], item);
            }
        }

        function updateItemById(id, item) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data[i].item = item;
                    self.onChange.notify({ "id": id });
                    break;
                }
            }
            return self;
        }

        function updateItemByIndex(idx, item) {
            if (data[idx]) {
                data[idx].item = item;
                self.onChange.notify({ "id": data[idx].id });
            }
            return self;
        }


        function updateItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < items.length; i++) {
                    updateItem(items[i]);
                }
                self.onChangeStop.notify();
            }
            return self;
        }


        function addColumn(column) {
            if (column instanceof ColumnData) {
                data.push(column);
                self.onChange.notify({ "id": column.id });
            }
            return self;
        }

        function addColumns(columns) {
            if (columns.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < columns.length; i++) {
                    addColumn(columns[i]);
                }

                self.onChangeStop.notify();
            }
            return self;
        }

        function deleteColumn(column) {
            if (column instanceof ColumnData) {
                deleteColumnById(column.id);
            }
            return self;
        }

        function deleteColumnById(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data.splice(i, 1);
                    self.onChange.notify({ "id": id });
                    break;
                }
            }
            return self;
        }

        function deleteColumnByIndex(idx) {
            if (data[idx]) {
                var id = data[idx].id;
                data.splice(idx, 1);
                self.onChange.notify({ "id": id });
            }
            return self;
        }

        function deleteColumns() {
            if (data.length) {
                self.onChangeStart.notify();
                data = [];
                self.onChange.notify({ "mode": "all" });
                self.onChangeStop.notify();
            }
            return self;
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
            return self;
        }

        function insertColumnAfterIndex(idx, column) {
            if (column instanceof ColumnData) {
                data.splice(
                    idx + 1,
                    0,
                    column
                );
                self.onChange.notify({ "id": column.id });
            }
            return self;
        }

        function insertColumnBeforeId(id, column) {
            insertColumnBeforeIndex(
                getColumnIndexById(id),
                column
            );
            return self;
        }

        function insertColumnBeforeIndex(idx, column) {
            if (column instanceof ColumnData) {
                data.splice(
                    idx,
                    0,
                    column
                );
                self.onChange.notify({ "id": column.id });
            }
            return self;
        }

        function setColumnPropertyById(id, propertyName, propertyValue) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    if (propertyName && propertyName in data[i]) {
                        data[i][propertyName] = propertyValue;
                        self.onChange.notify({ "id": id });
                    }
                    break;
                }
            }
            return self;
        }

        function setColumnPropertyByIndex(idx, propertyName, propertyValue) {
            if (propertyName && propertyName in data[idx]) {
                data[idx][propertyName] = propertyValue;
                self.onChange.notify({ "id": data[idx].id });
            }
            return self;
        }

        function setColumns(columns) {
            if (columns.length) {
                self.onChangeStart.notify();
                data = [];
                for (i = 0; i < columns.length; i++) {
                    addColumn(columns[i]);
                }
                self.onChangeStop.notify({ "mode": "all" });
            }
            return self;
        }

        function setColumnsProperty(propertyName, propertyValue) {
            self.onChangeStart.notify();
            for (var i = 0; i < data.length; i++) {
                data[i][propertyName] = propertyValue;
                self.onChange.notify({ "id": data[i].id });
            }
            self.onChangeStop.notify();
            return self;
        }

        function updateColumn(column) {
            if (column instanceof ColumnData && SmallGrid.Utils.isProperty(settings.columns.idProperty, column)) {
                updateColumnById(column[settings.columns.idProperty], column);
            }
            return self;
        }

        function updateColumnById(id, column) {
            if (column instanceof ColumnData) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == id) {
                        data[i] = column;
                        self.onChange.notify({ "id": id });
                        break;
                    }
                }
            }
            return self;
        }

        function updateColumnByIndex(idx, column) {
            if (column instanceof ColumnData) {
                if (data[idx]) {
                    data[idx] = column;
                    self.onChange.notify({ "id": column.id });
                }
            }
            return self;
        }

        function updateColumns(columns) {
            if (columns.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < columns.length; i++) {
                    updateColumn(columns[i]);
                }
                self.onChangeStop.notify();
            }
            return self;
        }

        function createItemData(item) {
            if (item instanceof Object) {
                if (settings.columns.mapProperties === true) {
                    return $.extend({ item: item }, item);
                }
                return {
                    "name": item.name,
                    "field": item.field,
                    "item": item
                };
            }
        }

        function createColumn(item) {
            var itemData = createItemData(item);
            if (itemData != undefined) {
                var column = new ColumnData(itemData);
                column.id = (SmallGrid.Utils.isProperty(settings.columns.idProperty, column)) ? column[settings.columns.idProperty] : SmallGrid.Utils.createGuid();
                column.width = Math.max(
                    Math.min(
                        parseInt(column.width, 10),
                        column.maxWidth
                    ),
                    column.minWidth
                );

                if (column.sortComparer && SmallGrid.Utils.isFunction(column.sortComparer, SmallGrid.Column.Comparer) === false) {
                    delete column.sortComparer;
                }

                if (column.formatter && SmallGrid.Utils.isFunction(column.formatter, SmallGrid.Cell.Formatter) === false) {
                    delete column.formatter;
                }

                if (column.editor && SmallGrid.Utils.isFunction(column.editor, SmallGrid.Cell.Editor) === false) {
                    delete column.editor;
                }

                return column;
            }
        }

        $.extend(this, {
            "onChange": new SmallGrid.Event.Handler(),
            "onChangeStart": new SmallGrid.Event.Handler(),
            "onChangeStop": new SmallGrid.Event.Handler(),

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
            "updateItemByIndex": updateItemByIndex,
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
        if (!Array.isArray(data)) {
            throw "Array expected";
        }
        return new ColumnModel(
            data,
            settings
        );
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Event": {
                "Data": EventData,
                "Handler": EventHandler
            }
        }
    });

    function EventData(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
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
        };
    }

    function EventHandler() {
        var handlers = [];
        var self = this;

        this.subscribe = function (func) {
            handlers.push(func);
            return self;
        };

        this.unsubscribe = function (func) {
            for (var i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i] === func) {
                    handlers.splice(i, 1);
                }
            }
            return self;
        };

        this.unsubscribeLast = function () {
            if (handlers.length) {
                handlers.pop();
            }
            return self;
        };

        this.unsubscribeAll = function () {
            handlers = [];
            return self;
        };

        this.notify = function (eventData) {
            if (typeof (eventData) != EventData) {
                eventData = new EventData(eventData);
            }

            for (var i = 0; i < handlers.length && !(eventData.isPropagationStopped() || eventData.isImmediatePropagationStopped()) ; i++) {
                if (handlers[i].call(this, eventData) === false) {
                    eventData.stopImmediatePropagation();
                    break;
                }
            }
        };
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Filter": {
                "FilterQuery": FilterQuery,
            }
        }
    });


    function FilterQuery(field, settings) {
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
            throw "Type " + type + " not found";
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
})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Filter": {
                "FilterRequest": FilterRequest,
            }
        }
    });

    function FilterRequest(filters, dataModel) {

        function getRowsInRange(top, height, outerHeight) {
            return dataModel.filter(new RowsRangeByHeight(top, height, outerHeight, getRowFilter()));
        }

        function getColumnsInRange(left, width, outerWidth) {
            return dataModel.filter(new ColumnsRangeByWidth(left, width, outerWidth, getColumnFilter()));
        }

        function getColumnsWidth(width) {
            return dataModel.reduce(new ColumnsFullWidth(width, getColumnFilter()), 0);
        }

        function getRowsHeight(height) {
            return dataModel.reduce(new RowsFullHeight(height, getRowFilter()), 0);
        }

        function getColumnFilter() {
            return "";
        }

        function getRowFilter() {
            var resultQuery = "";

            for (var i = 0; i < filters.length; i++) {
                var queries = filters[i].get(),
                    field = filters[i].getField(),
                    convertedQuery = "";
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
                            convertedQuery += " (item.item['" + field + "'] == '" + query.value + "') === true ";
                            break;

                        case 'neq':
                            convertedQuery += " (item.item['" + field + "'] == '" + query.value + "') === false ";
                            break;

                        case 'startsWith':
                            convertedQuery += " (('' + item.item['" + field + "']).indexOf('" + query.value + "') === 0) === true ";
                            break;

                        case 'endsWith':
                            convertedQuery += " (('' + item.item['" + field + "']).indexOf('" + query.value + "', item.item['" + field + "'].length - '" + query.value + "'.length) !== -1) === true ";
                            break;

                        case 'contains':
                            convertedQuery += " (('' + item.item['" + field + "']).indexOf('" + query.value + "') !== -1) === true ";
                            break;

                        case 'doesNotContain':
                            convertedQuery += " (('' + item.item['" + field + "']).indexOf('" + query.value + "') !== -1) === false ";
                            break;
                    }
                }

                if (convertedQuery.length) {
                    if (i !== 0) {
                        resultQuery += " && ";
                    }
                    resultQuery += '(' + convertedQuery + ')';
                    resultQuery = new Function('item', 'return ' + resultQuery);
                }
            }
            return resultQuery;
        }

        function ColumnsFullWidth(outerWidth, filter) {
            return function (prev, item) {
                if ((filter && (filter(item) === false)) || (item.hidden === true)) return prev;
                return prev + item.width + outerWidth;
            };
        }

        function RowsFullHeight(outerHeight, filter) {
            return function (prev, item) {
                if (filter && (filter(item) === false)) return prev;
                return prev + item.height + outerHeight;
            };
        }

        function ColumnsRangeByWidth(center, width, outerWidth, filter) {
            var calcWidth = 0, min = center - width - outerWidth, max = center + 2 * width + outerWidth, filterIndex = 0;
            return function (item, index, array) {
                if ((filter && (filter(item) === false)) || (item.hidden === true)) return false;
                filterIndex++;

                var inRange = min <= calcWidth && calcWidth <= max;

                calcWidth += outerWidth + item.width;

                if (inRange || (min <= calcWidth && calcWidth <= max)) {
                    item.calcWidth = calcWidth;
                    item.calcIndex = filterIndex;
                    return true;
                }

                return false;
            };
        }

        function RowsRangeByHeight(center, height, outerHeight, filter) {
            var calcHeight = 0, min = center - height - outerHeight, max = center + 2 * height + outerHeight, filterIndex = 0;
            return function (item, index, array) {
                if (filter && (filter(item) === false)) return false;
                filterIndex++;

                var inRange = min <= calcHeight && calcHeight <= max;

                calcHeight += outerHeight + item.height;

                if (inRange || (min <= calcHeight && calcHeight <= max)) {
                    item.calcHeight = calcHeight;
                    item.calcIndex = filterIndex;
                    return true;
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
})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Grid": {
                "Create": CreateModel,
                "Model": GridModel,
            }
        }
    });

    function GridModel($container, viewModel, settings) {
        var self = this;
        var view = {};
        var windowManager = {};
        var plugins = {};
        var version = "0.4";
        var id = SmallGrid.Utils.createGuid();

        /*
        Init & Destroy
        */
        function init() {
            view = SmallGrid.View.Create($container, viewModel, settings);
            windowManager = SmallGrid.View.Window.Create(view, settings);
            registerPlugins(settings.plugins);
        }

        function destroy() {
            for (var i = 0; i < plugins.length; i++) {
                unregisterPlugin(plugins[i]);
            }
            windowManager.destroy();
            view.destroy();
        }
        /*
         WindowManager
         */
        function getWindowManager() {
            return windowManager;
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
        function getPlugin(name) {
            if (plugins[name]) {
                return plugins[name];
            }
        }

        function getPlugins() {
            return plugins;
        }

        function isRegisteredPlugin(name) {
            return plugins[name] !== undefined;
        }

        function registerPlugin(name, pluginSettings) {
            if (isRegisteredPlugin(name)) {
                unregisterPlugin(name);
            }
            
            var plugin = SmallGrid.Plugins.Create(name, view, windowManager, settings, pluginSettings);
            if (plugin) {
                plugins[name] = plugin;
            }
        }

        function registerPlugins(plugins) {
            var keys = Object.keys(plugins);
            for (var i = 0; i < keys.length; i++) {
                registerPlugin(keys[i], plugins[keys[i]]);
            }
        }

        function unregisterPlugin(name) {
            if (plugins[name]) {
                plugins[name].destroy();
            }
            if (name in plugins) {
                delete plugins[name];
            }
        }

        function unregisterPlugins() {
            var keys = Object.keys(plugins);
            for (var i = 0; i < keys.length; i++) {
                unregisterPlugin(keys[i]);
            }
        }

        /*
        Other
        */
        function getVersion() {
            return version;
        }

        function getId() {
            return id;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "getId": getId,
            "getPlugin": getPlugin,
            "getPlugins": getPlugins,
            "getSettings": getSettings,
            "getVersion": getVersion,
            "getView": getView,
            "getViewModel": getViewModel,
            "getWindowManager": getWindowManager,
            "isRegisteredPlugin": isRegisteredPlugin,
            "registerPlugin": registerPlugin,
            "registerPlugins": registerPlugins,
            "unregisterPlugin": unregisterPlugin,
            "unregisterPlugins": unregisterPlugins,
        });
    }

    function CreateModel($container, rows, columns, settings) {
        settings = SmallGrid.Settings.Create(settings);

        var viewModel = SmallGrid.View.Model.Create(
            new SmallGrid.Row.Create(rows, settings),
            new SmallGrid.Column.Create(columns, settings),
            settings
        );

        var grid = new GridModel(
            $container,
            viewModel,
            settings
        );

        if (settings.explicitInitialization === false) {
            grid.init();
        }

        return grid;
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Handler": {
                "Click": {
                    "Create": Create,
                    "Handler": ClickHandler,
                }
            }
        }
    });

    function ClickHandler($container, settings) {
        $container
            .on("click", handleClick)
            .on("mousedown", handleMouseDown)
            .on("contextmenu", handleContextMenu)
            .on("dblclick", handleDblClick)
            .on("keydown", handleKeyDown);

        function getCellEvent(event) {
            if (event && event.target) {
                var $cellElement = $(event.target).closest(settings.cellIdentifier);
                if ($cellElement.length) {
                    var $rowElement = $cellElement.closest(settings.rowIdentifier);
                    if ($rowElement.length) {
                        return {
                            cellIndex: $cellElement.index(),
                            rowIndex: $rowElement.index(),
                            event: event,
                        };
                    }
                }
            }
        }

        function handleMouseDown(event) {
            if (event.ctrlKey || event.shiftKey) {
                document.getSelection().removeAllRanges();
                event.preventDefault();
            }
        }

        function handleClick(event) {
            event = getCellEvent(event);
            if (event && settings.handleClick) {
                settings.handleClick(event);
            }
        }

        function handleContextMenu(event) {
            event = getCellEvent(event);
            if (event && settings.handleContextMenu) {
                settings.handleContextMenu(event);
            }
            return false;
        }

        function handleDblClick(event) {
            event = getCellEvent(event);
            if (event && settings.handleDblClick) {
                settings.handleDblClick(event);
            }
        }

        function handleKeyDown(event) {
            event = getCellEvent(event);
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
    }

    function Create($container, settings) {
        var defaultSettings = {
            "rowIdentifier": "TR",
            "cellIdentifier": "TD",
            "handleClick": undefined,
            "handleDblClick": undefined,
            "handleContextMenu": undefined,
            "handleKeyDown": undefined,
        };

        settings = $.extend({}, defaultSettings, settings);

        return new ClickHandler($container, settings);
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Handler": {
                "Resize": {
                    "Create": Create,
                    "Handler": ResizeHandler,
                }
            }
        }
    });

    function ResizeHandler($container, settings) {
        $container.on("mousedown", settings.handlerIdentifier, handleMouseDown);

        function handleMouseDown(event) {
            var $cellElement = $(this).closest(settings.cellIdentifier);

            if ($cellElement.length) {
                var cellIndex = $cellElement.index();

                settings.handleResizeStart({
                    cellElement: $cellElement,
                    cellIndex: cellIndex,
                    event: event
                });

                $(document)
                    .bind("mousemove", function (event) {
                        var newWidth = event.pageX - $cellElement.offset().left;
                        if (newWidth > 0) {
                            settings.handleResize({
                                cellElement: $cellElement,
                                cellIndex: cellIndex,
                                width: newWidth,
                                event: event
                            });
                        }
                    })
                    .bind("mouseup", function (event) {
                        $(this).unbind("mousemove mouseup");

                        settings.handleResizeStop({
                            cellElement: $cellElement,
                            cellIndex: cellIndex,
                            event: event
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
    }

    function Create($container, settings) {
        var defaultSettings = {
            "cellIdentifier": "TD",
            "handleResize": undefined,
            "handleResizeStart": undefined,
            "handleResizeStop": undefined,
            "handlerIdentifier": undefined,
        };

        settings = $.extend({}, defaultSettings, settings);

        return new ResizeHandler($container, settings);
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Handler": {
                "Scroll": {
                    "Create": Create,
                    "Handler": ScrollHandler,
                }
            }
        }
    });

    /*
    TODO: direction change
    https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
    */
    function ScrollHandler($element, settings) {

        if (settings.resetTop) {
            $element[0].scrollTop = 0;
        }
        if (settings.resetLeft) {
            $element[0].scrollLeft = 0;
        }

        var scrollStopTimer, wheelStopTimer,
            isScrollMoved = false, isWheelMoved = false,
            lastScroll = {
                scrollTop: $element[0].scrollTop,
                scrollLeft: $element[0].scrollLeft,
            };

        $element.on('scroll', handleScroll);
        $element.on('wheel', handleMouseWheel);

        function handleMouseWheel(event) {
            clearTimeout(wheelStopTimer);

            if (isWheelMoved === false) {
                isWheelMoved = true;
                settings.handleMouseWheelStart({ event: event });
            }

            settings.handleMouseWheel({ event: event });

            wheelStopTimer = setTimeout(function () {
                settings.handleMouseWheelStop({ event: event });
                isWheelMoved = false;
            }, settings.latency);

        }

        function handleScroll(event) {

            var scroll = {
                scrollTop: $element[0].scrollTop,
                scrollLeft: $element[0].scrollLeft,
                topDelta: $element[0].scrollTop - lastScroll.scrollTop,
                leftDelta: $element[0].scrollLeft - lastScroll.scrollLeft,
                event: event,
            };

            clearTimeout(scrollStopTimer);

            if (isScrollMoved === false) {
                isScrollMoved = true;
                settings.handleScrollStart(scroll);
            }

            settings.handleScroll(scroll);

            scrollStopTimer = setTimeout(function () {
                settings.handleScrollStop(scroll);
                isScrollMoved = false;
            }, settings.latency);

            lastScroll = {
                scrollTop: scroll.scrollTop,
                scrollLeft: scroll.scrollLeft,
            };
        }

        function destroy() {
            clearTimeout(scrollStopTimer);
            clearTimeout(wheelStopTimer);

            $element.off('scroll', handleScroll);
            $element.off('wheel', handleMouseWheel);
        }

        $.extend(this, {
            "destroy": destroy
        });
    }

    function Create($container, settings) {

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
        };

        settings = $.extend({}, defaultSettings, settings);

        return new ScrollHandler($container, settings);
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "Create": Create,
            }
        }
    });

    function Create(name, view, windowManager, settings, pluginSettings) {
        if (SmallGrid.Utils.isFunction(name, SmallGrid.Plugins) === true) {
            settings.plugins[name] = jQuery.extend(true, settings.plugins[name] || {}, pluginSettings || {});
            var plugin = new SmallGrid.Plugins[name](view, windowManager, settings);
            plugin.init();
            return plugin;
        }
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
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
    RowData.prototype.height = 20;// row height
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
            return self;
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
                self.onChangeStop.notify({ "mode": "all" });
            }
            return self;
        }

        function isEmpty() {
            return data.length === 0;
        }

        function total() {
            return data.length;
        }

        function init() {
            addItems(items);
        }

        //function add(data) {
        //    if (data instanceof RowData) {
        //        addRow(data);
        //    } else if (data instanceof Object) {
        //        addItem(data);
        //    } else if (data instanceof Array && data.length > 0) {
        //        if (data[0] instanceof RowData) {
        //            addRows(data);
        //        } else if (data[0] instanceof Object) {
        //            addItems(data);
        //        }
        //    }
        //}

        //function set(data) {
        //    if (data instanceof RowData) {
        //        setRows([data]);
        //    } else if (data instanceof Object) {
        //        setItems([data]);
        //    } else if (data instanceof Array && data.length > 0) {
        //        if (data[0] instanceof RowData) {
        //            setRows(data);
        //        } else if (data[0] instanceof Object) {
        //            setItems(data);
        //        }
        //    }
        //}

        //function update(data) {
        //    if (data instanceof RowData) {
        //        updateRow(data);
        //    } else if (data instanceof Object) {
        //        updateItem(data);
        //    } else if (data instanceof Array && data.length > 0) {
        //        if (data[0] instanceof RowData) {
        //            updateRows(data);
        //        } else if (data[0] instanceof Object) {
        //            updateItems(data);
        //        }
        //    }
        //}

        //function remove(data) {
        //    if (data instanceof RowData) {
        //        deleteRow(data);
        //    } else if (data instanceof Object) {
        //        deleteItem(data);
        //    } else if (data instanceof Array && data.length > 0) {
        //        if (data[0] instanceof RowData) {
        //            deleteRows(data);
        //        } else if (data[0] instanceof Object) {
        //            deleteItems(data);
        //        }
        //    }
        //}


        function addRow(row) {
            if (row instanceof RowData) {
                data.push(row);
                self.onChange.notify({ "id": row.id });
            }
            return self;
        }

        function addRows(rows) {
            if (rows.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < rows.length; i++) {
                    addRow(rows[i]);
                }
                self.onChangeStop.notify();
            }
            return self;
        }


        function addItem(item) {
            var row = addRow(
                createRow(item)
            );
            self.onChange.notify({ "id": row.id });
            return row;
        }


        function addItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < items.length; i++) {
                    addItem(items[i]);
                }
                self.onChangeStop.notify();
            }
            return self;
        }

        function deleteItem(item) {
            if (SmallGrid.Utils.isProperty(settings.rows.idProperty, item)) {
                deleteRowById(item[settings.rows.idProperty]);
            }
            return self;
        }

        function deleteItems(items) {
            if (data.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < items.length; i++) {
                    deleteItem(items[i]);
                }
                self.onChangeStop.notify({ "mode": "all" });
            }
            return self;
        }


        function getItems() {
            var result = [];
            for (var i = 0; i < data.length; i++) {
                result.push(data[i].item);
            }
            return result;
        }

        function setItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                data = [];
                for (var i = 0; i < items.length; i++) {
                    addItem(items[i]);
                }
                self.onChangeStop.notify({ "mode": "all" });
            }
            return self;
        }

        function updateItem(item) {
            if (SmallGrid.Utils.isProperty(settings.rows.idProperty, item)) {
                updateItemById(item[settings.rows.idProperty], item);
            }
        }

        function updateItemById(id, item) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data[i].item = item;
                    self.onChange.notify({ "id": id });
                    break;
                }
            }
            return self;
        }

        function updateItemByIndex(idx, item) {
            if (data[idx]) {
                data[idx].item = item;
                self.onChange.notify({ "id": data[idx].id });
            }
            return self;
        }


        function updateItems(items) {
            if (items.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < items.length; i++) {
                    updateItem(items[i]);
                }
                self.onChangeStop.notify();
            }
            return self;
        }



        function deleteRow(row) {
            if (row instanceof RowData) {
                deleteRowById(row.id);
            }
            return self;
        }

        function deleteRowById(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data.splice(i, 1);
                    self.onChange.notify({ "id": id });
                    break;
                }
            }
            return self;
        }

        function deleteRowByIndex(idx) {
            if (data[idx]) {
                var id = data[idx].id;
                data.splice(idx, 1);
                self.onChange.notify({ "id": id });
            }
            return self;
        }

        function deleteRows() {
            if (data.length) {
                self.onChangeStart.notify();
                data = [];
                self.onChangeStop.notify({ "mode": "all" });
            }
            return self;
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
            return self;
        }

        function insertRowAfterIndex(idx, row) {
            if (row instanceof RowData) {
                data.splice(
                    idx + 1,
                    0,
                    row
                );
                self.onChange.notify({ "id": row.id });
            }
            return self;
        }

        function insertRowBeforeId(id, row) {
            insertRowBeforeIndex(
                getRowIndexById(id),
                row
            );
            return self;
        }

        function insertRowBeforeIndex(idx, row) {
            if (row instanceof RowData) {
                data.splice(
                    idx,
                    0,
                    row
                );
                self.onChange.notify({ "id": row.id });
            }
            return self;
        }

        function setRowPropertyById(id, propertyName, propertyValue) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    if (propertyName && propertyName in data[i]) {
                        data[i][propertyName] = propertyValue;
                        self.onChange.notify({ "id": id });
                    }
                    break;
                }
            }
            return self;
        }

        function setRowPropertyByIndex(idx, propertyName, propertyValue) {
            if (propertyName && propertyName in data[idx]) {
                data[idx][propertyName] = propertyValue;
                self.onChange.notify({ "id": data[idx].id });
            }
            return self;
        }

        function setRows(rows) {
            if (rows.length) {
                self.onChangeStart.notify();
                data = [];
                for (i = 0; i < rows.length; i++) {
                    addRow(rows[i]);
                }
                self.onChangeStop.notify({ "mode": "all" });
            }
            return self;
        }

        function setRowsProperty(propertyName, propertyValue) {
            self.onChangeStart.notify();
            for (var i = 0; i < data.length; i++) {
                data[i][propertyName] = propertyValue;
                self.onChange.notify({ "id": data[i].id });
            }
            self.onChangeStop.notify();
            return self;
        }

        function updateRow(row) {
            if (row instanceof RowData && SmallGrid.Utils.isProperty(settings.rows.idProperty, row)) {
                updateRowById(row[settings.rows.idProperty], row);
            }
            return self;
        }

        function updateRowById(id, row) {
            if (row instanceof RowData) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == id) {
                        data[i] = row;
                        self.onChange.notify({ "id": id });
                        break;
                    }
                }
            }
            return self;
        }

        function updateRowByIndex(idx, row) {
            if (row instanceof RowData) {
                if (data[idx]) {
                    data[idx] = row;
                    self.onChange.notify({ "id": row.id });
                }
            }
            return self;
        }

        function updateRows(rows) {
            if (rows.length) {
                self.onChangeStart.notify();
                for (var i = 0; i < rows.length; i++) {
                    updateRow(rows[i]);
                }
                self.onChangeStop.notify();
            }
            return self;
        }

        function createItemData(item) {
            if (item instanceof Object) {
                if (settings.rows.mapProperties === true) {
                    return $.extend({ item: item }, item);
                }
                return { item: item };
            }
        }

        function createRow(item) {
            var itemData = createItemData(item);
            if (itemData != undefined) {
                var row = new RowData(itemData);
                row.id = (SmallGrid.Utils.isProperty(settings.rows.idProperty, item)) ? item[settings.rows.idProperty] : SmallGrid.Utils.createGuid();
                row.height = Math.max(
                    Math.min(
                        parseInt(row.height, 10),
                        row.maxHeight
                    ),
                    row.minHeight
                );

                return row;
            }
        }

        $.extend(this, {
            "onChange": new SmallGrid.Event.Handler(),
            "onChangeStart": new SmallGrid.Event.Handler(),
            "onChangeStop": new SmallGrid.Event.Handler(),

            //"add": add,
            //"update": update,
            //"set": set,
            //"remove": remove,

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
            "updateItemByIndex": updateItemByIndex,

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
        if (!Array.isArray(data)) {
            throw "Array expected";
        }
        return new RowModel(
            data,
            settings
        );
    }
})(jQuery);(function ($) {
    "use strict";

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


    function measureTableCellDiff(cssClass) {
        var $table = $("<table class='grid-content-table' style='position:absolute; top:-100px; left:-100px;'></table>").appendTo('body'),
            $tbody = $("<tbody></tbody>").appendTo($table),
            $row = $("<tr/>").appendTo($tbody),
            $cell = $("<td class='" + cssClass + "' style='width:5px; height:5px;'>-</td>").appendTo($row);

        var cellDiff = {
            width: $cell.outerWidth() - $cell.width(),
            height: $cell.outerHeight() - $cell.height(),
        };

        $cell.remove();
        $row.remove();
        $tbody.remove();
        $table.remove();
        return cellDiff;
    }

    function changeSortOrder(sortOrder) {
        return -1 * (sortOrder < 0 ? -1 : 1);
    }

    $.extend(true, window, {
        "SmallGrid": {
            "Utils": {
                "changeSortOrder": changeSortOrder,
                "createGuid": guid.newGuid,
                "isFunction": isFunction,
                "isProperty": isProperty,
                "measureCellDiff": measureTableCellDiff,
                "measureMaxSupportedCssHeight": measureMaxSupportedCssHeight,
                "measureScrollbar": measureScrollbar,
                "parseBool": parseBool,
            }
        }
    });

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "View": {
                "Create": CreateView,
                "View": ViewData,
            }
        }
    });


    function ViewData($container, viewModel, renderer, settings) {
        var self = this,
            contentSize =
            {
                width: 0,
                height: 0,
            },
            el = {},
            handlers = [],
            heightRatio = 1,
            requestDataTimer = null,
            requestRenderTimer = null,
            scrollVisibility =
            {
                horisontal: false,
                vertical: false,
            },
            suspendRequests = [],
            suspendScrollEvent = false,
            suspendRenderRequests = 0;

        /*Init and destroy*/
        function init() {
            var request = suspendRender();

            el = renderer.buildViewPortElements($container);
            el['container'].empty().addClass(settings.uid);

            //viewport
            el['viewport'].appendTo(el['container']);


            //bind events           
            handlers.push(
                SmallGrid.Handler.Resize.Create(el['header'], {
                    "handleResize": handleHeaderResize,
                    "handleResizeStart": handleHeaderResizeStart,
                    "handleResizeStop": handleHeaderResizeStop,
                    "handlerIdentifier": "." + settings.cssClass.headerResizeHandle,
                }),
                SmallGrid.Handler.Click.Create(el['header'], {
                    "handleClick": handleHeaderClick,
                    "handleDblClick": handleHeaderDblClick,
                    "handleContextMenu": handleHeaderContextMenu,
                }),
                SmallGrid.Handler.Click.Create(el['content'], {
                    "handleClick": handleCellClick,
                    "handleDblClick": handleCellDblClick,
                    "handleContextMenu": handleCellContextMenu,
                    "handleKeyDown": handleCellKeyDown,
                }),
                SmallGrid.Handler.Scroll.Create(el['content'], {
                    "handleScrollStart": handleScrollStart,
                    "handleScrollStop": handleScrollStop,
                    "handleScroll": handleScroll,
                    "handleMouseWheelStart": handleMouseWheelStart,
                    "handleMouseWheelStop": handleMouseWheelStop,
                    "handleMouseWheel": handleMouseWheel,
                })
            );

            $(document).on("click", handleBodyClick);

            viewModel.onRowsChange.subscribe(handleRowsChange);
            viewModel.onColumnsChange.subscribe(handleColumnsChange);


            //block invisible part in header ????
            //el['header'].width(contentSize.width - settings.scrollbarDimensions.width);

            resize();

            handleRowsChange();
            if (settings.resizeColumnsOnLoad === true) resizeColumns();
            handleColumnsChange();

            renderView();

            resumeRender(request);



            self.onInitialize.notify({});
        }

        function destroy() {
            suspendRender();

            renderer = null;

            viewModel.onRowsChange.unsubscribe(handleRowsChange);
            viewModel.onColumnsChange.unsubscribe(handleColumnsChange);

            if (el['container'].length) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].destroy();
                }
                el['container'].empty().removeClass(settings.uid);
            }
            $(document.body).off("click", handleBodyClick);
            self.onDestroy.notify({});
        }

        /* 
        Scroll
        */
        function isHorisontalScrollVisible() {
            return scrollVisibility.horisontal;
        }

        function isVerticalScrollVisible() {
            return scrollVisibility.vertical;
        }

        /*
        Nodes
        */
        function getNode(name) {
            if (el[name]) return el[name];
        }

        /*
        Row func
        */
        function isRowVisible(rowId) {
            var row = viewModel.getRowById(rowId);
            if (row) {
                return (row.calcHeight - row.height - settings.cellOuterSize.height >= el['content'][0].scrollTop && row.calcHeight + row.height + settings.cellOuterSize.height < contentSize.height + el['content'][0].scrollTop);

            }
            return false;
        }

        function getRowNodeByIndex(rowIndex) {
            return el['contentTbody'][0].rows[rowIndex];
        }

        function getRowNodeById(rowId) {
            var rowIndex = viewModel.getRowIndexById(rowId);
            if (rowIndex != -1) {
                return getRowNodeByIndex(rowIndex);
            }
        }

        /*
        Cell func
        */
        function isCellVisible(columnId, rowId) {
            return isColumnVisible(columnId) && isRowVisible(rowId);
        }

        function getCellNodeByIndex(columnIndex, rowIndex) {
            return el['contentTbody'][0].rows[rowIndex].cells[columnIndex];
        }

        function getCellNodeById(columnId, rowId) {
            var rowIndex = viewModel.getRowIndexById(rowId);
            var columnIndex = viewModel.getColumnIndexById(columnId);
            if (rowIndex != -1 && columnIndex != -1) {
                return getCellNodeByIndex(columnIndex, rowIndex);
            }
        }

        /*
        Column func
        */
        function isColumnVisible(columnId) {
            var column = viewModel.getColumnById(columnId);
            if (column) {
                return (column.calcWidth - column.width - settings.cellOuterSize.width >= el['content'][0].scrollLeft && column.calcWidth < contentSize.width + el['content'][0].scrollLeft);
            }
            return false;
        }

        /*
        Model
        */
        function getModel() {
            return viewModel;
        }

        /*
        Render
        */

        function render() {
            suspendRenderRequests++;
            renderRequests();
            return self;
        }

        function renderRequests() {
            if (isSuspended() === false && suspendRenderRequests > 0) {

                if (requestDataTimer == null) {
                    requestDataTimer = setTimeout(function () {
                        renderView();
                        requestDataTimer = requestRenderTimer = null;
                    }, 30);

                } else if (requestRenderTimer == null) {
                    requestRenderTimer = setTimeout(render, 200);
                }
            }
            return self;
        }

        function renderView() {
            
            var request = suspendRender();
            suspendRenderRequests = 0;
            var result = viewModel.requestDataFromRange(
                {
                    top: el['content'][0].scrollTop * heightRatio,
                    left: el['content'][0].scrollLeft
                },
                contentSize,
                settings.cellOuterSize,
                heightRatio == 1
            );

            if (result.columns.length > 0 && result.isCached == 0) {

                el['headerTable'].css({
                    'left': result.columns[0].calcWidth - result.columns[0].width - settings.cellOuterSize.width
                });

                if (result.rows.length > 0) {
                    el['contentTable'].css({
                        'top': result.rows[0].calcHeight - result.rows[0].height - settings.cellOuterSize.height - (el['content'][0].scrollTop * heightRatio) + el['content'][0].scrollTop,
                        'left': result.columns[0].calcWidth - result.columns[0].width - settings.cellOuterSize.width
                    });
                }

                var opts =
                    {
                        hideColumnBorder: false,
                        virtualColumnWidth: 0,
                    },
                    lastColumn = result.columns[result.columns.length - 1];

                if (scrollVisibility.vertical === false && contentSize.width <= lastColumn.calcWidth) {
                    opts.hideColumnBorder = true;
                }
                if (settings.showLastColumn === true && contentSize.width >= lastColumn.calcWidth) {
                    opts.virtualColumnWidth = contentSize.width - lastColumn.calcWidth;
                }

                renderViewHtml(
                    renderer.buildHeaderColumnsHtml(result.columns, opts),
                    renderer.buildColsHtml(result.columns, opts),
                    renderer.buildRowsHtml(result.columns, result.rows, opts)
                );
            }

            resumeRender(request);
        }

        function renderViewHtml(columnsHtml, colsHtml, rowsHtml) {
            self.onBeforeRowsRendered.notify({});

            el['headerCol'][0].innerHTML = el['contentCol'][0].innerHTML = colsHtml;
            el['headerTbody'][0].innerHTML = columnsHtml;
            el['contentTbody'][0].innerHTML = rowsHtml;

            self.onAfterRowsRendered.notify({});
        }

        function isSuspended() {
            return suspendRequests.length > 0;
        }

        function suspendRender() {
            var id = SmallGrid.Utils.createGuid();
            suspendRequests.push(id);
            return id;
        }

        function resumeRender(value) {
            for (var i = 0; i < suspendRequests.length; i++) {
                if (suspendRequests[i] == value) {
                    suspendRequests.splice(i, 1);
                    break;
                }
            }
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
            if (row.editable === true && column.editable === true) {
                type = "edit";
            } else if (row.disabled === true) {
                type = "disabled";
            }
            return type;
        }

        function getColumnEvent(event) {
            var column = viewModel.getColumnByIndex(event.cellIndex);
            if (column) {
                event.type = getColumnEventType($(event.event.target).attr("class"), column);
                event.targetClass = $(event.event.target).attr("class");
                event.column = column;
                return event;
            }
        }

        function getCellEvent(event) {
            var column = viewModel.getColumnByIndex(event.cellIndex);
            var row = viewModel.getRowByIndex(event.rowIndex);

            if (column && column.field.length > 0 && row && column.field in row.item) {
                //replace with extend
                event.type = getCellEventType($(event.event.target).attr("class"), column, row);
                event.row = row;
                event.column = column;

                return event;
            }
        }

        /*
        Resize 
        */
        function resizeColumnsWidth(updateColumns, scrollBarWidth, cellOuterWidth) {
            var updateColumns = updateColumns.slice();
            var total =
                {
                    minWidth: 0,
                    maxWidth: 0,
                    width: 0
                },
                contentWidth = contentSize.width - updateColumns.length * cellOuterWidth - scrollBarWidth;

            for (var i = updateColumns.length - 1; i >= 0; i--) {
                var column = updateColumns[i];
                if (column.resizeable === false) {
                    contentWidth -= column.width;
                    updateColumns.splice(i, 1);
                    continue;
                }
                total.minWidth += column.minWidth;
                total.maxWidth += column.maxWidth;
                total.width += column.width;
            }

            if (total.minWidth <= contentWidth && contentWidth <= total.maxWidth) {
                var columns = updateColumns.slice();
                while (columns.length > 0) {
                    var ratio = contentWidth / total.width;
                    total.width = 0;

                    for (i = columns.length - 1; i >= 0; i--) {
                        var column = columns[i];
                        var newColumnWidth = Math.max(
                            Math.min(
                                Math.floor(column.width * ratio),
                                column.maxWidth
                            ),
                            column.minWidth
                        );

                        total.width += newColumnWidth;

                        if (column.width == newColumnWidth) {
                            if (columns.length == 1 && contentWidth != column.width) {
                                column.width += contentWidth - column.width;
                            }
                            contentWidth -= column.width;
                            columns.splice(i, 1);
                            continue;
                        }

                        column.width = newColumnWidth;
                    }
                }
            }
            return updateColumns;
        }

        function resizeColumns() {

            var updateColumns = resizeColumnsWidth(
                viewModel.columns.getColumns(),
                (scrollVisibility.vertical === true) ? settings.scrollbarDimensions.width : 0,
                settings.cellOuterSize.width
            );

            var request = suspendRender();

            for (var i = 0; i < updateColumns.length; i++) {
                viewModel.columns.setColumnPropertyById(
                    updateColumns[i].id,
                    'width',
                    updateColumns[i].width
                );
            }

            resumeRender(request);

            return self;
        }

        function resize() {
            contentSize.width = el['container'].width();
            contentSize.height = el['container'].height() - settings.header.height - settings.cellOuterSize.height;
            el['content'].width(contentSize.width);
            el['content'].height(contentSize.height);
            return self;
        }

        /*
        Data handlers
        */
        function handleRowsChange() {
            var rowsHeight = viewModel.getRowsHeight(settings.cellOuterSize);

            scrollVisibility.vertical = (rowsHeight > contentSize.height);

            if (rowsHeight > settings.maxSupportedCssHeight) {
                heightRatio = (rowsHeight - contentSize.height + settings.scrollbarDimensions.height) / (settings.maxSupportedCssHeight - contentSize.height + settings.scrollbarDimensions.height);
                rowsHeight = settings.maxSupportedCssHeight;
            }

            //fix?
            el['header'].css({
                'width': scrollVisibility.vertical ? contentSize.width - settings.scrollbarDimensions.width : contentSize.width
            });

            el['contentWrap'].css({
                'height': rowsHeight,
            });

            render();
        }

        function handleColumnsChange() {
            var columnsWidth = viewModel.getColumnsWidth(settings.cellOuterSize);

            scrollVisibility.horisontal = (columnsWidth > contentSize.width);

            var width = Math.max(
                columnsWidth,
                scrollVisibility.vertical ? contentSize.width - settings.scrollbarDimensions.width : contentSize.width
            );

            el['headerWrap'].css({
                'width': width
            });

            el['contentWrap'].css({
                'width': width,
            });

            render();
        }

        /*
        Handle cell events
        */
        function handleCellClick(event) {
            var cellEvent = getCellEvent(event);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellClick");
            }
        }

        function handleCellDblClick(event) {
            var cellEvent = getCellEvent(event);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellDblClick");
            }
        }

        function handleCellContextMenu(event) {
            var cellEvent = getCellEvent(event);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellContextMenu");
            }
        }

        function handleCellKeyDown(event) {
            var cellEvent = getCellEvent(event);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellKeyDown");
            }
        }

        /*
        Handle resize events
        */
        function handleHeaderResize(event) {
            notifyEvent(event, "onColumnResize");
        }

        function handleHeaderResizeStart(event) {
            suspendScrollEvent = true;
            notifyEvent(event, "onColumnResizeStart");
        }

        function handleHeaderResizeStop(event) {
            suspendScrollEvent = false;
            notifyEvent(event, "onColumnResizeStop");
        }

        /*
        Handle mouse wheel
        */
        function handleMouseWheelStart(event) {
            notifyEvent(event, "onMouseWheelStart");
        }

        function handleMouseWheelStop(event) {
            notifyEvent(event, "onMouseWheelStop");
        }

        function handleMouseWheel(event) {
            notifyEvent(event, "onMouseWheel");
        }

        /*
        Handle scroll
        */
        function handleScrollStart(event) {
            if (suspendScrollEvent == false) {
                notifyEvent(event, "onScrollStart");
            }
        }

        function handleScrollStop(event) {
            if (suspendScrollEvent == false) {
                notifyEvent(event, "onScrollStop");
            }
        }

        function handleScroll(event) {
            if (suspendScrollEvent == false) {
                notifyEvent(event, "onScroll", function () {
                    el['header'][0].scrollLeft = el['content'][0].scrollLeft;
                    render();
                });
            }
        }

        /*
        Handle body events
        */
        function handleBodyClick(event) {
            notifyEvent(event, "onBodyClick");
        }

        /*
        Handle header events
        */
        function handleHeaderClick(event) {
            var columnEvent = getColumnEvent(event);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderClick");
            }
        }

        function handleHeaderContextMenu(event) {
            var columnEvent = getColumnEvent(event);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderContextMenu");
            }
        }

        function handleHeaderDblClick(event) {
            var columnEvent = getColumnEvent(event);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderDblClick");
            }
        }

        function notifyEvent(event, handlerName, callback) {
            if (callback != undefined) callback();
            self[handlerName].notify(event);
        }

        $.extend(this, {
            "destroy": destroy,

            "getCellNodeById": getCellNodeById,
            "getCellNodeByIndex": getCellNodeByIndex,
            "getModel": getModel,
            "getNode": getNode,
            "getRowNodeById": getRowNodeById,
            "getRowNodeByIndex": getRowNodeByIndex,
            "isCellVisible": isCellVisible,
            "isColumnVisible": isColumnVisible,
            "isHorisontalScrollVisible": isHorisontalScrollVisible,
            "isRowVisible": isRowVisible,
            "isSuspended": isSuspended,
            "isVerticalScrollVisible": isVerticalScrollVisible,
            "render": render,
            "resize": resize,
            "resizeColumns": resizeColumns,
            "resumeRender": resumeRender,
            "suspendRender": suspendRender,

            //Events
            "onScroll": new SmallGrid.Event.Handler(),
            "onScrollStart": new SmallGrid.Event.Handler(),
            "onScrollStop": new SmallGrid.Event.Handler(),

            "onMouseWheel": new SmallGrid.Event.Handler(),
            "onMouseWheelStart": new SmallGrid.Event.Handler(),
            "onMouseWheelStop": new SmallGrid.Event.Handler(),

            "onBodyClick": new SmallGrid.Event.Handler(),

            "onHeaderClick": new SmallGrid.Event.Handler(),
            "onHeaderContextMenu": new SmallGrid.Event.Handler(),
            "onHeaderDblClick": new SmallGrid.Event.Handler(),

            "onCellClick": new SmallGrid.Event.Handler(),
            "onCellContextMenu": new SmallGrid.Event.Handler(),
            "onCellDblClick": new SmallGrid.Event.Handler(),
            "onCellKeyDown": new SmallGrid.Event.Handler(), // not working?

            "onColumnResize": new SmallGrid.Event.Handler(),
            "onColumnResizeStart": new SmallGrid.Event.Handler(),
            "onColumnResizeStop": new SmallGrid.Event.Handler(),

            "onAfterRowsRendered": new SmallGrid.Event.Handler(),
            "onBeforeRowsRendered": new SmallGrid.Event.Handler(),

            "onInitialize": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        init();
    }


    function CreateView(container, viewModel, settings) {
        var $container = $(container);
        if (!$container.length) {
            throw new Error("Small grid requires a valid container, " + container + " does not exist in the DOM.");
        }
        var renderer = SmallGrid.View.Renderer.Create(settings);
        return new ViewData($container, viewModel, renderer, settings);
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "View": {
                "Model": {
                    "Model": ViewModel,
                    "Create": CreateModel,
                }
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

        var bulkColumns = [];
        var bulkRows = [];

        var cachedRange = {
            minTop: -1,
            maxTop: -1,
            minLeft: -1,
            maxLeft: -1,
        };

        /*
        Init && destroy
        */
        function init() {
            rowsModel.onChange.subscribe(handleRowsChange);
            rowsModel.onChangeStart.subscribe(handleRowsChangeStart);
            rowsModel.onChangeStop.subscribe(handleRowsChangeStop);

            columnsModel.onChange.subscribe(handleColumnsChange);
            columnsModel.onChangeStart.subscribe(handleColumnsChangeStart);
            columnsModel.onChangeStop.subscribe(handleColumnsChangeStop);
            return self;
        }

        function destroy() {
            rowsModel.onChange.unsubscribe(handleRowsChange);
            rowsModel.onChangeStart.unsubscribe(handleRowsChangeStart);
            rowsModel.onChangeStop.unsubscribe(handleRowsChangeStop);

            columnsModel.onChange.unsubscribe(handleColumnsChange);
            columnsModel.onChangeStart.unsubscribe(handleColumnsChangeStart);
            columnsModel.onChangeStop.unsubscribe(handleColumnsChangeStop);
        }

        /*
        Handlers
        */
        function handleColumnsChange(event) {

            if (bulkColumns.length == 0 && event.id) {
                if (isInColumnsCache([event.id]) === true) {
                    resetCacheRangeWidth();
                    self.onColumnsChange.notify();
                }
            } else if (event.id) {
                bulkColumns.push(event.id);
            }
        }

        function handleRowsChange(event) {
            if (bulkRows.length == 0 && event.id) {
                if (isInRowsCache([event.id]) === true) {
                    resetCacheRangeHeight();
                    self.onRowsChange.notify();
                }
            } else if (event.id) {
                bulkRows.push(event.id);
            }
        }

        function handleColumnsChangeStart() {
            bulkColumns = [];
        }

        function handleRowsChangeStart() {
            bulkRows = [];
        }

        function handleColumnsChangeStop(event) {
            if ((event.mode && event.mode == "all") || (bulkColumns.length && isInColumnsCache(bulkRows))) {
                bulkColumns = [];
                resetCacheRangeWidth();
                self.onColumnsChange.notify();
            }
        }

        function handleRowsChangeStop(event) {
            if ((event.mode && event.mode == "all") || (bulkRows.length && isInRowsCache(bulkRows))) {
                bulkRows = [];
                resetCacheRangeHeight();
                self.onRowsChange.notify();
            }
        }

        function isInRowsCache(ids) {
            for (var i = 0; i < ids.length; i++) {
                if (getRowIndexById(ids[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }

        function isInColumnsCache(ids) {
            for (var i = 0; i < ids.length; i++) {
                if (getColumnByIndex(ids[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }


        /*
        Row and column helpers
        */
        function getRows() {
            return rowsCache;
        }
        function getColumns() {
            return columnsCache;
        }

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
        function getFilterById(id) {
            for (var i = 0; i < rowsFilters.length; i++) {
                if (rowsFilters[i].getId() == id) {
                    return rowsFilters[i];
                }
            }
        }

        function getFilters() {
            return rowsFilters;
        }

        function setFilter(filterObj) {
            if (filterObj instanceof SmallGrid.Filter.FilterQuery) {
                clearFilter(filterObj);
                rowsFilters.push(filterObj);

                resetCacheRangeHeight();
                self.onRowsChange.notify();
            }
        }

        function setFilters(filters) {
            rowsFilters = [];
            for (var i = 0; i < filters.length; i++) {
                rowsFilters.push(filters[i]);
            }
            resetCacheRangeHeight();
            self.onRowsChange.notify();
        }

        function clearFilter(filterObj) {
            if (filterObj instanceof SmallGrid.Filter.FilterQuery) {
                for (var i = 0; i < rowsFilters.length; i++) {
                    if (rowsFilters[i].getId() == filterObj.getId()) {
                        rowsFilters.splice(i, 1);
                        resetCacheRangeHeight();
                        self.onRowsChange.notify();
                        break;
                    }
                }
            }
        }

        function clearFilters() {
            rowsFilters = [];
            resetCacheRangeHeight();
            self.onRowsChange.notify();
        }

        /*
        Data calculations
        */
        function getRowsHeight(cellOuterSize) {
            return new SmallGrid.Filter.FilterRequest(rowsFilters, rowsModel).getRowsHeight(cellOuterSize.height);
        }

        function getColumnsWidth(cellOuterSize) {
            return new SmallGrid.Filter.FilterRequest(columnsFilters, columnsModel).getColumnsWidth(cellOuterSize.width);
        }

        function requestDataFromRange(point, size, outerSize, allowCache) {

            var rowsCached = (cachedRange.minTop <= point.top && point.top <= cachedRange.maxTop) & allowCache;
            var columnsCached = (cachedRange.minLeft <= point.left && point.left <= cachedRange.maxLeft) & allowCache;

            if (rowsCached === 0 || columnsCached === 0) {
                if (rowsCached === 0) {
                    rowsCache = new SmallGrid.Filter.FilterRequest(rowsFilters, rowsModel).getRowsInRange(point.top, size.height, outerSize.height);
                }

                if (columnsCached === 0) {
                    columnsCache = new SmallGrid.Filter.FilterRequest(columnsFilters, columnsModel).getColumnsInRange(point.left, size.width, outerSize.width);
                }

                updateCacheRange(size, outerSize);
            }

            return {
                isCached: (rowsCached && columnsCached),
                rows: rowsCache,
                columns: columnsCache,
            };
        }

        /*
        Cache range
        */
        function updateCacheRange(size, outerSize) {
            if (columnsCache.length && rowsCache.length) {
                cachedRange = {
                    minTop: rowsCache[0].calcHeight < size.height ? rowsCache[0].calcHeight - rowsCache[0].height - outerSize.height : rowsCache[0].calcHeight + size.height,
                    maxTop: rowsCache[(rowsCache.length - 1)].calcHeight < size.height ? size.height : rowsCache[(rowsCache.length - 1)].calcHeight - size.height,
                    minLeft: columnsCache[0].calcWidth < size.width ? columnsCache[0].calcWidth - columnsCache[0].width - outerSize.width : columnsCache[0].calcWidth + size.width,
                    maxLeft: columnsCache[(columnsCache.length - 1)].calcWidth < size.width ? size.width : columnsCache[(columnsCache.length - 1)].calcWidth - size.width,
                };
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

        init();//move to factory

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "columns": columns,
            "rows": rows,

            "resetCacheRange": resetCacheRange,
            "requestDataFromRange": requestDataFromRange,

            "clearFilter": clearFilter,
            "clearFilters": clearFilters,
            "getColumnById": getColumnById,
            "getColumnByIndex": getColumnByIndex,
            "getColumnIndexById": getColumnIndexById,
            "getColumns": getColumns,
            "getColumnsWidth": getColumnsWidth,
            "getFilterById": getFilterById,
            "getFilters": getFilters,
            "getRowById": getRowById,
            "getRowByIndex": getRowByIndex,
            "getRowIndexById": getRowIndexById,
            "getRows": getRows,
            "getRowsHeight": getRowsHeight,
            "setFilter": setFilter,
            "setFilters": setFilters,

            "onColumnsChange": new SmallGrid.Event.Handler(),
            "onRowsChange": new SmallGrid.Event.Handler(),
        });
    }

    function CreateModel(rowsModel, columnsModel, settings) {
        return new ViewModel(rowsModel, columnsModel, settings);
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "View": {
                "Renderer": {
                    "Create": Create,
                    "Renderer": Renderer,
                }
            }
        }
    });

    function Renderer(settings) {
        var self = this;

        /*
        Structure
        */
        function buildViewPortElements($container) {
            var el = {
                'container': $container,
                'content': null,
                'contentCol': null,
                'contentTable': null,
                'contentTbody': null,
                'contentWrap': null,
                'footer': null,
                'header': null,
                'headerCol': null,
                'headerTable': null,
                'headerTbody': null,
                'headerWrap': null,
                'viewport': null,
            };

            //create
            el['viewport'] = $("<div class='small-grid grid-viewport'/>");
            el['header'] = $("<div class='grid-header'/>");
            el['content'] = $("<div class='grid-content'/>");
            el['footer'] = $("<div class='grid-footer'/>");

            el['headerCol'] = $("<colgroup></colgroup>");
            el['headerTable'] = $("<table class='grid-header-table'></table>");
            el['headerTbody'] = $("<tbody></tbody>");
            el['headerWrap'] = $("<div class='grid-header-wrap'/>");

            el['contentCol'] = $("<colgroup></colgroup>");
            el['contentTable'] = $("<table class='grid-content-table'></table>");
            el['contentTbody'] = $("<tbody></tbody>");
            el['contentWrap'] = $("<div class='grid-content-wrap'/>");

            //header part
            el['headerCol'].appendTo(el['headerTable']);
            el['headerTbody'].appendTo(el['headerTable']);
            el['headerTable'].appendTo(el['headerWrap']);
            el['headerWrap'].appendTo(el['header']);

            //content part
            el['contentCol'].appendTo(el['contentTable']);
            el['contentTbody'].appendTo(el['contentTable']);
            el['contentTable'].appendTo(el['contentWrap']);
            el['contentWrap'].appendTo(el['content']);

            //main structure
            el['header'].appendTo(el['viewport']);
            el['content'].appendTo(el['viewport']);
            el['footer'].appendTo(el['viewport']);

            if (settings.header.disableTextSelection) {
                el['header'].addClass(settings.cssClass.disableTextSelection);
            }

            if (settings.rows.disableTextSelection) {
                el['content'].addClass(settings.cssClass.disableTextSelection);
            }

            return el;
        }

        /*
        Header columns
        */
        function buildHeaderColumnsHtml(columns, opts) {
            var html = "<tr class='" + settings.cssClass.headerRow + "'>";
            for (var i = 0, length = columns.length - 1; i <= length; i++) {
                html += buildHeaderColumnHtml(columns[i], opts, length == i);
            }

            if (opts.virtualColumnWidth > 0) {
                html += buildLastHeaderColumn(columns[i - 1], opts);
            }

            return html + "</tr>";
        }

        function buildHeaderColumnHtml(column, opts, isLast) {
            var value = "",
                html,
                cellCssClass = settings.cssClass.headerCell;

            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            if (isLast && opts.hideColumnBorder) {
                cellCssClass += " " + settings.cssClass.cellLast;
            }
            //TODO: replace
            switch (column.align) {
                case "center":
                    cellCssClass += " " + settings.cssClass.cellAlignCenter;
                    break;
                case "right":
                    cellCssClass += " " + settings.cssClass.cellAlignRight;
                    break;
            }

            //TODO: add formatter
            if (column.name) {
                value += column.name;
            }

            if (column.sortable || column.filterable) {
                cellCssClass += " " + settings.cssClass.cursorPointer;
            }

            html = "<td style='width:" + (column.width + settings.cellOuterSize.width) + "px;height:" + settings.header.height + "px' class='" + cellCssClass + "'><div class='" + settings.cssClass.headerCellDiv + "'><span class='" + settings.cssClass.headerColumnName + "'>" + value + "</span>";


            if (column.sortable && column.sortOrder !== 0) {
                html += "<span class='" + ((column.sortOrder == 1) ? settings.cssClass.headerSortUp : settings.cssClass.headerSortDown) + "'></span>";
            }

            if (column.filterable) {
                html += "<span class='" + settings.cssClass.headerFilter + "'></span>";
            }

            html += "</div>";

            if (column.resizeable) {
                html += "<span class='" + settings.cssClass.headerResizeHandle + "'></span>";
            }

            return html + "</td>";
        }

        function buildLastHeaderColumn(column, opts) {
            return "<td class='" + settings.cssClass.headerCell + ' ' + settings.cssClass.cellLast + "' style='height:" + settings.header.height + "px'></td>";
        }

        /*
        Cols
        */
        function buildColsHtml(columns, opts) {
            var html = '';
            for (var i = 0, length = columns.length; i < length; i++) {
                html += buildColHtml(columns[i]);
            }

            if (opts.virtualColumnWidth > 0) {
                html += buildLastColHtml(columns[i - 1], opts);
            }

            return html;
        }

        function buildColHtml(column) {
            var cellCssClass = settings.cssClass.col;
            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            return "<col style='width:" + (column.width + settings.cellOuterSize.width) + "px;' class='" + cellCssClass + "'/>";
        }

        function buildLastColHtml(column, opts) {
            return "<col style='width:" + opts.virtualColumnWidth + "px;' class='" + settings.cssClass.col + " " + settings.cssClass.collLast + "'/>";
        }

        /*
        Rows
        */
        function buildRowsHtml(columns, rows, opts) {
            var html = '';
            for (var i = 0, length = rows.length; i < length; i++) {
                html += buildRowHtml(columns, rows[i], opts);
            }
            return html;
        }

        function buildRowHtml(columns, row, opts) {
            var rowCssClass = settings.cssClass.row + ((row.calcIndex & 1 == 1) ? " " + settings.cssClass.rowEven : " " + settings.cssClass.rowOdd);

            if (row.rowCssClass) rowCssClass += " " + row.rowCssClass;

            //TODO: remove / replace
            switch (settings.rows.valign) {
                case "middle":
                    rowCssClass += " " + settings.cssClass.rowValignMiddle;
                    break;
                case "top":
                    rowCssClass += " " + settings.cssClass.rowValignTop;
                    break;
                case "bottom":
                    rowCssClass += " " + settings.cssClass.rowValignBottom;
                    break;
                case "baseline":
                    rowCssClass += " " + settings.cssClass.rowValignBaseline;
                    break;
            }

            var html = "<tr class='" + rowCssClass + "'>";
            for (var i = 0, length = columns.length - 1; i <= length; i++) {
                html += buildCellHtml(columns[i], row, opts, length == i);
            }

            if (opts.virtualColumnWidth > 0) {
                html += buildLastCellHtml(columns[i - 1], opts);
            }


            return html + '</tr>';
        }

        function buildCellHtml(column, row, opts, isLast) {
            var cellCssClass = settings.cssClass.cell;
            if (column.cellCssClass) {
                cellCssClass += " " + column.cellCssClass;
            }

            if (isLast && opts.hideColumnBorder) {
                cellCssClass += " " + settings.cssClass.cellLast;
            }

            //TODO: remove/replace
            if (column.align == "center") {
                cellCssClass += " " + settings.cssClass.cellAlignCenter;
            }
            //TODO: remove/replace
            if (column.align == "right") {
                cellCssClass += " " + settings.cssClass.cellAlignRight;
            }

            if (row.cellCssClass && column.field in row.cellCssClass) {
                cellCssClass += " " + row.cellCssClass[column.field];
            }

            return "<td height='" + row.height + "' class='" + cellCssClass + "'>" + getCellContentHtml(column, row) + "</td>";
        }

        function buildLastCellHtml(column, opts) {
            return "<td class='" + settings.cssClass.cell + ' ' + settings.cssClass.cellLast + "'></td>";
        }

        /*
        Cell content
        */
        function getCellContentHtml(column, row) {
            var value = "";

            if (column.field in row.item && (row.editMode === false || column.editMode === false)) {
                value = getCellFormatter(column, row);
            }
            return value;
        }

        function getCellFormatter(column, row) {
            return (column.formatter) ? SmallGrid.Cell.Formatter[column.formatter](getCellValue(column, row), column, row, settings) : getCellValue(column, row);
        }

        function getCellValue(column, row) {
            return row.item[column.field];
        }


        $.extend(this, {
            "buildViewPortElements": buildViewPortElements,
            "buildHeaderColumnsHtml": buildHeaderColumnsHtml,
            "buildColsHtml": buildColsHtml,
            "buildRowsHtml": buildRowsHtml,
        });
    }

    function Create(settings) {
        return new Renderer(settings);
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "View": {
                "Window": {
                    "Create": Create,
                    "Manager": Manager,
                },
            }
        }
    });

    function Manager(view, settings) {
        var self = this;
        var cache = [];

        function createWindow(id, opts, $contentElement) {
            if (isWindow(id) === false) {
                cache.push({ id: id, opts: opts });

                var $container = $('<div class="grid-window grid-window-' + id + '"/>');
                if ($contentElement && $contentElement.length) $contentElement.appendTo($container);
                $container.appendTo(view.getNode('container')).hide();
            }
        }

        function isWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id == id) {
                    return true;
                }
            }
            return false;
        }

        function getWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id == id) {
                    return {
                        id: cache[i].id,
                        opts: cache[i].opts,
                        container: view.getNode('container').children('.grid-window-' + id),
                    };
                }
            }
        }

        function removeWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id == id) {
                    return cache[i];
                }
            }
        }

        function showWindowNearPosition(id, position) {
            var data = getWindow(id);
            if (data != null) {
                data.container.show();
                var $container = view.getNode('container')
                var elementSizes = {
                    width: data.container.width(),
                    height: data.container.height()
                };

                var left = (elementSizes.width + position.x > $container.width() && elementSizes.width < x - $container.offset().left) ? x - elementSizes.width : position.x;

                data.container.offset({
                    top: position.y,
                    left: left
                });
            }
        }

        function showWindowNearTarget(id, $target) {
            var data = getWindow(id);
            if (data != null) {
                data.container.show();

                var $container = view.getNode('container');

                var elementSizes = {
                    width: data.container.width(),
                    height: data.container.height()
                };

                var targetSizes = {
                    left: $target.offset().left,
                    top: $target.offset().top,
                    width: $target.width(),
                    height: $target.height(),
                };

                var left = (elementSizes.width + targetSizes.left > $container.width() && elementSizes.width < targetSizes.left - $container.offset().left) ? targetSizes.left + targetSizes.width - elementSizes.width : targetSizes.left;

                data.container.offset({
                    top: targetSizes.top + targetSizes.height,
                    left: left
                });
            }
            return self;
        }

        function isVisible(id) {
            return (view.getNode('container').children('.grid-window-' + id + ':visible').length > 0);
        }

        function showWindow(id) {
            view.getNode('container').children('.grid-window-' + id).show();
        }

        function hideWindow(id) {
            view.getNode('container').children('.grid-window-' + id).hide();
        }

        function hideWindows(event) {
            view.getNode('container').children('.grid-window').hide();
        }

        function init() {
            view.onBodyClick.subscribe(hideWindows);
            view.onColumnResizeStart.subscribe(hideWindows);
            view.onScrollStart.subscribe(hideWindows);
            return self;
        }

        function destroy() {
            view.onBodyClick.unsubscribe(hideWindows);
            view.onColumnResizeStart.unsubscribe(hideWindows);
            view.onScrollStart.unsubscribe(hideWindows);

            cache = [];
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "createWindow": createWindow,
            "showWindowNearPosition": showWindowNearPosition,
            "showWindowNearTarget": showWindowNearTarget,
            "getWindow": getWindow,
            "hideWindow": hideWindow,
            "hideWindows": hideWindows,
            "isWindow": isWindow,
            "isVisible": isVisible,
            "removeWindow": removeWindow,
            "showWindow": showWindow,
        });
    }


    function Create(view, settings) {
        return new SmallGrid.View.Window.Manager(view, settings).init();
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "CellEdit": CellEditPlugin,
            }
        }
    });


    function CellEditPlugin(view, windowManager, settings) {
        var self = this;
        var editOptions = {
            enabled: false
        };

        function init() {
            view.onAfterRowsRendered.subscribe(handleAfterRowsRendered);
            view.onBeforeRowsRendered.subscribe(handleBeforeRowsRendered);
            view.onCellClick.subscribe(handleCellClick);
            view.onCellDblClick.subscribe(handleCellDblClick);
            view.onCellKeyDown.subscribe(handleCellKeyDown);
            view.onScrollStop.subscribe(handleScrollStop);
        }

        function destroy() {
            view.onAfterRowsRendered.unsubscribe(handleAfterRowsRendered);
            view.onBeforeRowsRendered.unsubscribe(handleBeforeRowsRendered);
            view.onCellClick.unsubscribe(handleCellClick);
            view.onCellDblClick.unsubscribe(handleCellDblClick);
            view.onCellKeyDown.unsubscribe(handleCellKeyDown);
            view.onScrollStop.unsubscribe(handleScrollStop);
        }

        /*
         Handlers
         */
        function handleScrollStop(event) {
            if (isEditMode() === true && settings.plugins.CellEdit.autoFocus === true) {
                if (view.isCellVisible(editOptions.column.id, editOptions.row.id)) {
                    editOptions.editor.focus();
                }
            }
        }

        function handleBeforeRowsRendered(event) {
            if (isEditMode() === true) {
                editOptions.editor.remove();
            }
        }

        function handleAfterRowsRendered(event) {
            if (isEditMode() === true) {
                var cellNode = view.getCellNodeById(editOptions.column.id, editOptions.row.id);
                if (cellNode) {
                    cellNode.className += " " + settings.cssClass.cellEdit;
                    editOptions.editor.append(cellNode);
                    if (editOptions.addFocus === true) {
                        editOptions.addFocus = false;
                        editOptions.editor.focus();
                    }
                }
            }
        }

        function handleCellDblClick(event) {
            if (settings.plugins.CellEdit.editOnClick === false) {
                editCellById(event.column.id, event.row.id);
            }
        }

        function handleCellClick(event) {
            if (settings.plugins.CellEdit.editOnClick === true) {
                editCellById(event.column.id, event.row.id);
            }
        }

        function handleCellKeyDown(event) {
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
            if (isEditMode() === true) {
                if (editOptions.column.id != columnId || editOptions.row.id != rowId) {
                    applyEdit();
                }
            }

            if (isEditMode() === false) {
                var column = view.getModel().getColumnById(columnId);
                var row = view.getModel().getRowById(rowId);
                if (row && column && row.editable && column.editable && column.editor) {
                    editOptions = {
                        enabled: true,
                        addFocus: true,
                        row: row,
                        column: column,
                        editor: new SmallGrid.Cell.Editor.Create(
                            column.editor,
                            {
                                "value": row.item[column.field],
                            },
                            settings
                        ),
                    }

                    view.getModel().columns.setColumnPropertyById(
                        column.id,
                        'editMode',
                        true
                    );

                    view.getModel().rows.setRowPropertyById(
                        row.id,
                        'editMode',
                        true
                    );

                }
            }
        }


        function getEditor() {
            if (editOptions.enabled === true) {
                return editOptions.editor;
            }
        }

        function isEditMode() {
            return (editOptions.enabled === true);
        }

        function applyEdit() {
            if (editOptions.enabled === true) {

                view.getModel().columns.setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = view.getModel().rows.getRowById(editOptions.row.id);
                if (row) {
                    row.item[editOptions.column.field] = editOptions.editor.getValue();
                    row.editMode = false;
                    view.getModel().rows.updateItem(row);
                }

                //apply
                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
            }
            return self;
        }

        function cancelEdit() {
            if (editOptions.enabled === true) {

                view.getModel().columns.setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = view.getModel().rows.getRowById(editOptions.row.id);
                if (row) {
                    row.editMode = false;
                    view.getModel().rows.updateItem(row);
                }

                //undo
                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
            }
            return self;
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
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnFilterMenu": ColumnFilterMenu,
            }
        }
    });

    function ColumnFilterMenu(view, windowManager, settings) {
        var self = this;

        function handleHeaderClick(event) {
            if (event && event.type && event.type == "filter") {
                event.event.stopPropagation();
                var isVisible = windowManager.isVisible(event.column.id);
                windowManager.hideWindows();

                if (windowManager.isWindow(event.column.id) === false) {

                    windowManager.createWindow(
                        event.column.id,
                        { filter: new SmallGrid.Filter.FilterQuery(event.column.field, settings) },
                        buildElements(event.column.id)
                    );

                    windowManager.showWindowNearTarget(event.column.id, $(event.event.target));
                } else if (isVisible === false) {
                    windowManager.showWindow(event.column.id);
                }
            }
        }

        function buildElements(id) {
            var $element = $("<div class='grid-header-menu'></div>");
            var $form = $('<form>');
            var $content = $('<div class="grid-header-menucontent"></div>')
                .append('<select name="type1"><option value="contains">Contains</option><option value="doesnotcontain">Does not contains</option><option value="eq">Is equal to</option><option value="neq">Is not equal to</option><option value="startswith">Starts with</option><option value="endswith">Ends with</option></select>')
                .append('<input type="text" name="value1" value=""/>')
                .append('<select name="operator"><option value="and">And</option><option value="or">Or</option></select>')
                .append('<select name="type2"><option value="contains">Contains</option><option value="doesnotcontain">Does not contains</option><option value="eq">Is equal to</option><option value="neq">Is not equal to</option><option value="startswith">Starts with</option><option value="endswith">Ends with</option></select>')
                .append('<input type="text" name="value2" value=""/>')
                .append('<input type="submit" name="Filter" value="Filter" class="btn-submit"/>')
                .append('<input type="reset" name="Clear" value="Clear" class="btn-clear"/>')
                .appendTo($form);

            $form.on("submit", { id: id }, handleMenuSubmit);
            $form.on("reset", { id: id }, handleMenuClear);
            $form.on("click", { id: id }, handleMenuClick);
            $form.appendTo($element);

            return $element;
        }

        function getFormValues($element) {
            return {
                "value": [$element.find("input[name='value1']").val(), $element.find("input[name='value2']").val()],
                "type": [$element.find("select[name='type1']").val(), $element.find("select[name='type2']").val()],
                "operator": $element.find("select[name='operator']").val()
            };
        }

        /*
        Handlers
        */
        function handleMenuSubmit(event) {
            event.preventDefault();

            var data = windowManager.getWindow(event.data.id);
            if (data) {
                var filter = data.opts.filter;
                var formValues = getFormValues(data.container);

                data.opts.filter.clear();
                data.opts.filter.add(formValues.type[0], formValues.value[0]);
                if (formValues.value[1]) {
                    data.opts.filter.add(formValues.operator);
                    data.opts.filter.add(formValues.type[1], formValues.value[1]);
                }
                view.getModel().setFilter(filter);

                windowManager.hideWindow(event.data.id);
            }
        }

        function handleMenuClear(event) {
            var data = windowManager.getWindow(event.data.id);
            if (data) {
                view.getModel().clearFilter(data.opts.filter);
                windowManager.hideWindow(event.data.id);
            }
        }

        function handleMenuClick(event) {
            event.stopPropagation();
        }

        /*
        Init && destroy
        */
        function init() {
            view.onHeaderClick.subscribe(handleHeaderClick);
            return self;
        }

        function destroy() {
            view.onHeaderClick.unsubscribe(handleHeaderClick);
        }


        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });
    }



})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnPickerMenu": ColumnPickerMenu,
            }
        }
    });

    function ColumnPickerMenu(view, windowManager, settings) {
        var self = this;
        var currentId = "column-picker";
        function handleHeaderContextMenu(event) {

            if (event) {
                windowManager.hideWindows();
                if (windowManager.isWindow(currentId) === false) {
                    windowManager.createWindow(currentId, {}, buildElements(currentId));
                }
                windowManager.showWindowNearPosition(
                    currentId,
                    { x: event.event.pageX, y: event.event.pageY }
                );
            }
        }

        function buildElements(id) {
            var $element = $("<div class='grid-columnpicker-menu'></div>");
            var $form = $('<form>');
            var $content = $('<div class="grid-columnpicker-menucontent"></div>')
                .appendTo($form);

            $form.on("click", { id: id }, handleMenuClick);
            $form.appendTo($element);

            $(buildContent()).appendTo($content);

            return $element;
        }

        function buildContent() {
            var html = '';
            var columns = view.getModel().columns.getColumns();
            for (var i = 0; i < columns.length; i++) {
                html += '<div><label><input type="checkbox" name="" ' + ((columns[i].hidden) ? '' : ' checked ') + ' value="' + columns[i].id + '"/> ' + columns[i].name + '</label></div>';
            }
            return html;
        }

        /*
        Handlers
        */
        function handleMenuClick(event) {
            event.stopPropagation();
            if (event.target) {
                var $checkbox = $(event.target).closest('input');
                if ($checkbox.length) {
                    if (view.getModel().getColumns().length == 1 && $checkbox[0].checked == false) {
                        return false;
                    }

                    view.getModel().columns.setColumnPropertyById($checkbox.val(), "hidden", !$checkbox[0].checked);
                }
            }
        }

        /*
        Init && destroy
        */
        function init() {
            view.onHeaderContextMenu.subscribe(handleHeaderContextMenu);
            return self;
        }

        function destroy() {
            view.onHeaderContextMenu.unsubscribe(handleHeaderContextMenu);
        }


        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnResize": ColumnResizePlugin,
            }
        }
    });

    function ColumnResizePlugin(view, windowManager, settings) {
        var self = this;

        var column,
            $headerTable,
            $contentCell,
            $contentCol,
            $headerCell,
            $headerCursorCells,
            $headerCol,
            $lastContentCol,
            $lastHeaderCol,
            headerWidth,
            width;

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

        function handleColumnResize(event) {
            if (column && $lastHeaderCol.length) {
                width = Math.max(
                    Math.min(
                        parseInt(event.width, 10),
                        column.maxWidth
                    ),
                    column.minWidth
                );

                if ($headerCol.length) $headerCol.css("width", width + settings.cellOuterSize.width);
                if ($contentCol.length) $contentCol.css("width", width + settings.cellOuterSize.width);

                var wrapWidth = Math.max(view.getNode('headerTable').width(), headerWidth);
                view.getNode('headerWrap').width(wrapWidth);
                view.getNode('contentWrap').width(wrapWidth);
            }
        }

        function handleColumnResizeStart(event) {
            headerWidth = view.getNode('header').width();
            column = view.getModel().getColumnByIndex(event.cellIndex);
            $headerCursorCells = view.getNode('headerTbody').find("." + settings.cssClass.cursorPointer);
            $headerCol = view.getNode('headerTable').find("colgroup > col:nth-child(" + (event.cellIndex + 1) + ")");
            $contentCol = view.getNode('contentTable').find("colgroup > col:nth-child(" + (event.cellIndex + 1) + ")");
            $lastHeaderCol = view.getNode('headerTable').find("colgroup > col:last");
            $lastContentCol = view.getNode('contentTable').find("colgroup > col:last");

            if (column && $lastHeaderCol.length) {

                if (settings.showLastColumn == true && $lastHeaderCol.hasClass(settings.cssClass.collLast)) {
                    $lastHeaderCol.width(0);
                    if ($lastContentCol.length) $lastContentCol.width(0);
                }

                $headerCell = view.getNode('headerTable').find('td.' + settings.cssClass.cellLast);
                if ($headerCell.length) toggleDisabled($headerCell, settings.cssClass.cellLast);

                $contentCell = view.getNode('contentTable').find('td.' + settings.cssClass.cellLast);
                if ($contentCell.length) toggleDisabled($contentCell, settings.cssClass.cellLast);

                toggleDisabled($headerCursorCells, settings.cssClass.cursorPointer);
                view.getNode('viewport').addClass(settings.cssClass.cursorResize);
            }
        }

        function handleColumnResizeStop() {
            if (column) {

                if ($headerCell.length) toggleEnabled($headerCell, settings.cssClass.cellLast);
                if ($contentCell.length) toggleEnabled($contentCell, settings.cssClass.cellLast);


                toggleEnabled($headerCursorCells, settings.cssClass.cursorPointer);
                view.getNode('viewport').removeClass(settings.cssClass.cursorResize);

                if (width) {
                    view.getModel().columns.setColumnPropertyById(
                        column.id,
                        'width',
                        width
                    );
                }
            }
        }

        function toggleEnabled($elements, cssClass) {
            $elements.toggleClass(cssClass + ' ' + cssClass + '-disabled');
        }

        function toggleDisabled($elements, cssClass) {
            $elements.toggleClass(cssClass + '-disabled' + ' ' + cssClass);
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnSort": ColumnSortPlugin,
            }
        }
    });

    function ColumnSortPlugin(view, windowManager, settings) {
        var self = this;
        function init() {
            view.onHeaderClick.subscribe(handleHeaderClick);
        }

        function destroy() {
            view.onHeaderClick.unsubscribe(handleHeaderClick);
        }

        function handleHeaderClick(event) {
            if (event && event.type && event.type == "sort") {
                var request = view.suspendRender();
                var column = event.column;
                var sortOrder = SmallGrid.Utils.changeSortOrder(column.sortOrder);
                view.getModel().columns.setColumnsProperty("sortOrder", 0);//reset sorting
                view.getModel().columns.setColumnPropertyById(column.id, "sortOrder", sortOrder);
                view.getModel().rows.sort(
                    SmallGrid.Column.Comparer[column.sortComparer]({
                        "sortOrder": sortOrder,
                        "field": column.field
                    })
                );

                view.resumeRender(request);
                view.render();
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });

    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "RowSelection": RowSelectionPlugin,
            }
        }
    });

    function RowSelectionPlugin(view, windowManager, settings) {
        var self = this;
        var selectedRowIds = [];
        var lastFocusedRowId = null;

        function init() {
            view.onCellClick.subscribe(handleCellClick);
        }

        function destroy() {
            view.onCellClick.unsubscribe(handleCellClick);
        }

        function handleCellClick(event) {

            if (event.event.shiftKey === true && settings.plugins.RowSelection.multipleRowSelection === true && lastFocusedRowId && lastFocusedRowId != event.row.id) {
                clearSelectedRows(selectedRowIds);

                var lastFocusedRow = view.getModel().rows.getRowById(lastFocusedRowId);
                var currentRow = view.getModel().rows.getRowById(event.row.id);

                if (lastFocusedRow && currentRow) {
                    selectRowsRange(lastFocusedRowId, event.row.id);
                }

            } else if (event.event.ctrlKey === true && settings.plugins.RowSelection.multipleRowSelection) {
                if (isRowSelected(event.row.id) === false) {
                    selectRowById(event.row.id);
                } else {
                    clearSelectedRow(event.row.id);
                }
            } else {
                var clearRowsIds = selectedRowIds.slice();
                var selectedIndex = clearRowsIds.indexOf(event.row.id);

                if (selectedIndex === -1) {
                    selectRowById(event.row.id);
                } else {
                    clearRowsIds.splice(selectedIndex, 1);
                }

                clearSelectedRows(clearRowsIds);
            }

            if (event.event.shiftKey === false) lastFocusedRowId = event.row.id;
        }

        function selectRowsRange(id1, id2) {
            var lastFocusedIndex = view.getModel().rows.getRowIndexById(id1);
            var currentRowIndex = view.getModel().rows.getRowIndexById(id2);
            if (lastFocusedIndex !== -1 && currentRowIndex !== -1) {
                var startIndex = Math.min(currentRowIndex, lastFocusedIndex);
                var endIndex = Math.max(currentRowIndex, lastFocusedIndex);

                for (var i = startIndex ; i <= endIndex; i++) {
                    selectRowByIndex(i);
                }
            }
            return self;
        }

        function selectRow(row) {
            if (row) {
                view.getModel().rows.setRowPropertyById(
                    row.id,
                    'rowCssClass',
                    row.rowCssClass + ' ' + settings.cssClass.rowSelected
                );
                selectedRowIds.push(row.id);
            }
        }

        function selectRowByIndex(idx) {
            selectRow(
                view.getModel().rows.getRowByIndex(idx)
            );
            return self;
        }

        function selectRowById(id) {
            selectRow(
                view.getModel().rows.getRowById(id)
            );
            return self;
        }

        function clearSelectedRows(ids) {
            for (var i = ids.length - 1; i >= 0; i--) {
                clearSelectedRow(ids[i]);
            }
            return self;
        }

        function clearSelectedRow(id) {
            var row = view.getModel().rows.getRowById(id);
            if (row) {
                view.getModel().rows.setRowPropertyById(
                    row.id,
                    'rowCssClass',
                    row.rowCssClass.replace(' ' + settings.cssClass.rowSelected, '')
                );
            }
            var selectedIndex = selectedRowIds.indexOf(id);
            if (selectedIndex !== -1) {
                selectedRowIds.splice(selectedIndex, 1);
            }

            return self;
        }

        function isRowSelected(id) {
            return (selectedRowIds.indexOf(id) !== -1);
        }

        function getSelectedRowsIds() {
            return selectedRowIds;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "clearSelectedRow": clearSelectedRow,
            "clearSelectedRows": clearSelectedRows,
            "getSelectedRowsIds": getSelectedRowsIds,
            "isRowSelected": isRowSelected,
            "selectRowByIndex": selectRowByIndex,
            "selectRowById": selectRowById,
            "selectRowsRange": selectRowsRange,

        });

    }

})(jQuery);if (typeof jQuery === "undefined") {
    throw "Small grid requires jquery module to be loaded";
}
if (typeof SmallGrid === "undefined") {
    throw "Small grid required to be loaded";
}

(function ($) {
    "use strict";
    var defaultSettings = {
        showLastColumn: true,//show last column
        explicitInitialization: false,
        uidPrefix: "smallgrid_",
        resizeColumnsOnLoad: false,//resize columns when view loaded to fit canvas
        maxSupportedCssHeight: undefined,//internal
        scrollbarDimensions: undefined,//internal
        cellOuterSize: undefined,//internal
        uid: undefined,//internal
        cssClass: {
            disableTextSelection: "disable-text-selection",
            cell: "grid-cell",
            cellEdit: "grid-cell-edit",
            cellLast: "grid-cell-last",
            col: "grid-col",
            collLast: "grid-coll-last",
            cursorPointer: "grid-cursor-pointer",
            cursorResize: "grid-cursor-resize disable-text-selection",
            headerCell: "grid-header-cell",
            headerCellDiv: "grid-header-cell-div",
            headerColumnName: "grid-column-name",
            headerFilter: "grid-header-filter",
            headerResizeHandle: "grid-resizable-handle",
            headerRow: "grid-header-row",
            headerSortable: "grid-sortable",
            headerSortDown: "grid-sort-icon grid-sort-icon-desc",
            headerSortUp: "grid-sort-icon grid-sort-icon-asc",
            row: "grid-row",
            rowEven: "grid-row-even",
            rowOdd: "grid-row-odd",
            rowSelected: "grid-row-selected",
            rowValignMiddle: "grid-row-valign-middle",
            rowValignTop: "grid-row-valign-top",
            rowValignBottom: "grid-row-valign-bottom",
            rowValignBaseline: "grid-row-valign-baseline",
            cellAlignCenter: "grid-cell-align-center",
            cellAlignRight: "grid-cell-align-right",
        },
        header: {
            height: 20,
            disableTextSelection: true,
        },

        columns: {
            idProperty: undefined,
            mapProperties: true,
        },
        rows: {
            disableTextSelection: false,
            idProperty: undefined,//TODO: other fields mapping
            mapProperties: true,
            valign: "", //middle, top, bottom, baseline
        },
        formatter: {
            floatFormatter: {
                decimals: 2,
            },
            integerFormatter: {
                decimals: 0,
            },
            moneyFormatter: {
                locales: 'en-US',
                options: {
                    currency: 'USD'
                },
            },
            dateFormatter: {
                locales: 'en-US',
                options: {},
            }
        },

        plugins: {
            ColumnSort: {},
            ColumnResize: {},
            RowSelection: {
                multipleRowSelection: false//allow multirow selection
            },
            CellEdit: {
                editOnClick: false,//when true, editor loaded after click
                autoFocus: true//autofocus editor when scrolling
            },
            ColumnFilterMenu: {},
            ColumnPickerMenu: {},
        }
    };

    function CreateSettings(settings) {

        var settings = $.extend(true, {}, defaultSettings, settings || {});

        if (settings.maxSupportedCssHeight == undefined) {
            defaultSettings.maxSupportedCssHeight = settings.maxSupportedCssHeight = SmallGrid.Utils.measureMaxSupportedCssHeight();
        }

        if (settings.scrollbarDimensions == undefined) {
            defaultSettings.scrollbarDimensions = settings.scrollbarDimensions = SmallGrid.Utils.measureScrollbar();
        }

        if (settings.cellOuterSize == undefined) {
            settings.cellOuterSize = SmallGrid.Utils.measureCellDiff(settings.cssClass.cell);
        }

        if (settings.uid == undefined) {
            settings.uid = SmallGrid.Utils.createGuid();
        }

        return settings;
    }

    $.extend(true, window, {
        "SmallGrid": {
            "Settings": {
                "Create": CreateSettings,
                "Default": defaultSettings,
            }
        }
    });
})(jQuery);