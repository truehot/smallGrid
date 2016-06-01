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
                    "Text": TextEditor,
                    "Select": SelectEditor,
                },
            }
        }
    });

    function CheckboxEditor(options, settings) {
        var self = this,
            value = !options.value;

        this.destroy = function () {
            return self;
        };

        this.getValue = function () {
            self.onChange.notify({
                "value": value
            });
            return value;
        };

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": options.value
        });
    }

    function FloatEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-float-editor" />').val(value).width(options.column.width);

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
            if ($element.is(':focus') === false) {
                $element.val(self.getValue()).select();
            }
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
            $element = $('<input type="text" class="grid-integer-editor" />').val(value).width(options.column.width);

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
            if ($element.is(':focus') === false) {
                $element.val(self.getValue()).select();
            }
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

    function TextEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-text-editor"/>').val(value).width(options.column.width);

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
            return $element.val();
        };

        this.setValue = function (value) {
            $element.val(value);
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            if ($element.is(':focus') === false) {
                $element.val(self.getValue()).select();
            }
            return self;
        };


        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }


    function SelectEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<select class="grid-select-editor"/>').val(value);

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
            return $element.val();
        };

        this.setValue = function (value) {
            $element.val(value);
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            $element.focus();
            return self;
        };

        self.setSource = function (values) {
            if (values.constructor === Array) {
                $.each(values, function (index, item) {
                    $element.append(new Option(item.text, item.value));
                });
            }
            $element.val(value);
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
        if (!name.length) {
            throw new TypeError("Editor name is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        if (SmallGrid.Utils.isFunction(name, SmallGrid.Cell.Editor) === false) {
            throw new TypeError("name is not defined");
        }

        return new SmallGrid.Cell.Editor[name](options, settings);
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
    ColumnData.prototype.editable = true; //true when column cells editable
    ColumnData.prototype.editor = undefined; // name of editor
    ColumnData.prototype.editMode = false; //true when column cell in editMode
    ColumnData.prototype.field = ""; //cell content will be taken from value of this property in row
    ColumnData.prototype.filterable = false;//true when column is filterable
    ColumnData.prototype.formatter = "Default";//default cell content formatter
    ColumnData.prototype.headerCssClass = "";//css class for column header cell
    ColumnData.prototype.hidden = false;//true when column is visible
    ColumnData.prototype.id = undefined;//column unique indicator
    ColumnData.prototype.item = null;
    ColumnData.prototype.maxWidth = 9999;
    ColumnData.prototype.minWidth = 25;
    ColumnData.prototype.name = "";//column title in grid header
    ColumnData.prototype.resizeable = true;//true when column resizeable
    ColumnData.prototype.sortable = true;//true when column sortable
    ColumnData.prototype.sortComparer = "Default";
    ColumnData.prototype.sortOrder = 0;//0, 1, -1
    ColumnData.prototype.width = 50;

    function ColumnModel(settings) {
        var self = this;
        var data = [];
        var items = {
            addItem: function (item) {
                var column = createColumn(item);
                addColumn(column);
                self.onChange.notify({ "id": column.id });
                return column;
            },

            addItems: function (items) {
                if (items.length) {
                    self.onChange.blockEvents();
                    for (var i = 0; i < items.length; i++) {
                        self.items.addItem(items[i]);
                    }
                    self.onChange.notifyBlocked();
                }
                return self;
            },


            deleteItem: function (item) {
                if (SmallGrid.Utils.isProperty(settings.columns.idProperty, item)) {
                    deleteColumnById(item[settings.columns.idProperty]);
                }
                return self;
            },

            deleteItems: function () {
                return deleteColumns();
            },

            deleteItemById: function (id) {
                return deleteColumnById(id);
            },

            getItems: function () {
                var result = [];
                for (var i = 0; i < data.length; i++) {
                    result.push(data[i].item);
                }
                return result;
            },

            setItems: function (items) {
                if (items.length) {
                    self.onChange.blockEvents();
                    data = [];
                    for (var i = 0; i < items.length; i++) {
                        self.items.addItem(items[i]);
                    }
                    self.onChange.notifyBlocked();
                }
                return self;
            },

            updateItem: function (item) {
                if (SmallGrid.Utils.isProperty(settings.columns.idProperty, item)) {
                    self.items.updateItemById(item[settings.columns.idProperty], item);
                }
            },

            updateItemById: function (id, item) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == id) {
                        data[i].item = item;
                        self.onChange.notify({ "id": id });
                        break;
                    }
                }
                return self;
            },

            updateItemByIndex: function (idx, item) {
                if (data[idx]) {
                    data[idx].item = item;
                    self.onChange.notify({ "id": data[idx].id });
                }
                return self;
            },


            updateItems: function (items) {
                if (items.length) {
                    self.onChange.blockEvents();
                    for (var i = 0; i < items.length; i++) {
                        self.items.updateItem(items[i]);
                    }
                    self.onChange.notifyBlocked();
                }
                return self;
            }
        };

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
                self.onChange.blockEvents();
                data.sort(comparer);
                self.onChange.notifyBlocked();
            }
            return self;
        }

        function isEmpty() {
            return data.length === 0;
        }

        function total() {
            return data.length;
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
                self.onChange.blockEvents();
                for (var i = 0; i < columns.length; i++) {
                    addColumn(columns[i]);
                }

                self.onChange.notifyBlocked();
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
                self.onChange.blockEvents();
                data = [];
                self.onChange.notifyBlocked();
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
                self.onChange.blockEvents();
                data = [];
                for (var i = 0; i < columns.length; i++) {
                    addColumn(columns[i]);
                }

                self.onChange.notifyBlocked();
            }
            return self;
        }

        function setColumnsProperty(propertyName, propertyValue) {
            self.onChange.blockEvents();
            for (var i = 0; i < data.length; i++) {
                data[i][propertyName] = propertyValue;
                self.onChange.notify({ "id": data[i].id });
            }
            self.onChange.notifyBlocked();
            return self;
        }

        function updateColumn(column) {
            if (column instanceof ColumnData) {
                updateColumnById(column.id, column);
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
                self.onChange.blockEvents();
                for (var i = 0; i < columns.length; i++) {
                    updateColumn(columns[i]);
                }
                self.onChange.notifyBlocked();
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
            "items": items,

            "onChange": new SmallGrid.Event.Handler(),

            "filter": filter,
            "reduce": reduce,
            "sort": sort,
            "total": total,

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
    }

    function CreateModel(data, settings) {
        if (Array.isArray(data) == false) {
            throw new TypeError("Data is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        return new ColumnModel(
            settings
        ).items.addItems(data);
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
        var isDefaultPrevented = false;

        this.preventDefault = function () {
            if (data && "event" in data && typeof (data.event.preventDefault) === "function") {
                data.event.preventDefault();
            }
            isDefaultPrevented = true;
        };

        this.isDefaultPrevented = function () {
            return isDefaultPrevented;
        };

        this.stopPropagation = function () {
            if (data && "event" in data && typeof (data.event.stopPropagation) === "function") {
                data.event.stopPropagation();
            }
            isPropagationStopped = true;
        };

        this.isPropagationStopped = function () {
            return isPropagationStopped;
        };

        //Keeps the rest of the handlers from being executed
        this.stopImmediatePropagation = function () {
            if (data && "event" in data && typeof (data.event.stopImmediatePropagation) === "function") {
                data.event.stopImmediatePropagation();
            }
            isImmediatePropagationStopped = true;
        };

        this.isImmediatePropagationStopped = function () {
            return isImmediatePropagationStopped;
        };
    }

    function EventHandler() {
        var self = this,
            handlers = [],
            blockEvents = false,
            blockedEventData = [];


        self.subscribe = function (func) {
            if ($.isFunction(func)) {
                handlers.push(func);
            }
            return self;
        };

        self.unsubscribe = function (func) {
            for (var i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i] === func) {
                    handlers.splice(i, 1);
                }
            }
            return self;
        };

        self.unsubscribeLast = function () {
            if (handlers.length) {
                handlers.pop();
            }
            return self;
        };

        self.unsubscribeAll = function () {
            handlers = [];
            return self;
        };

        self.blockEvents = function () {
            blockEvents = true;
        };

        self.notifyBlocked = function (opts) {
            blockEvents = false;

            self.notify(new EventData({
                opts: opts || {},
                data: blockedEventData
            }));

            blockedEventData = [];
        };

        self.notify = function (eventData) {
            if (blockEvents == true) {
                return blockedEventData.push(eventData);
            }

            if (typeof (eventData) != EventData) {
                eventData = new EventData(eventData);
            }

            for (var i = 0; i < handlers.length && !eventData.isImmediatePropagationStopped() ; i++) {
                if (handlers[i].call(self, eventData) === false) {
                    self.stopImmediatePropagation();
                    break;
                }
            }
        };
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

    function GridModel($container, view, viewModel, windowManager, settings) {
        var self = this,
            plugins = {},
            version = "0.4",
            id = SmallGrid.Utils.createGuid();

        /*
        Init & Destroy
        */
        function init() {
            registerPlugins(settings.plugins);
            return self;
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

        function getRowsModel() {
            return viewModel.getRowsModel();
        }

        function getColumnsModel() {
            return viewModel.getColumnsModel();
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

            var plugin = SmallGrid.Plugins.Create(name, { view: view, viewModel: viewModel, windowManager: windowManager }, settings, pluginSettings);
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
            "getRowsModel": getRowsModel,
            "getColumnsModel": getColumnsModel,
            "getWindowManager": getWindowManager,
            "isRegisteredPlugin": isRegisteredPlugin,
            "registerPlugin": registerPlugin,
            "registerPlugins": registerPlugins,
            "unregisterPlugin": unregisterPlugin,
            "unregisterPlugins": unregisterPlugins,
        });
    }

    function CreateModel($container, rows, columns, options) {
        var settings = SmallGrid.Settings.Create(options || {});

        var viewModel = SmallGrid.View.Model.Create(
            new SmallGrid.Row.Create(rows || [], settings),
            new SmallGrid.Column.Create(columns || [], settings),
            settings
        );

        var view = SmallGrid.View.Create($container, viewModel, settings);
        var windowManager = SmallGrid.View.Window.Create(view, settings);

        var grid = new GridModel(
            $container,
            view,
            viewModel,
            windowManager,
            settings
        );

        return grid.init();
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

        function getCellEvent(evt) {
            if (evt && evt.target) {
                var $cellElement = $(evt.target).closest(settings.cellIdentifier);
                if ($cellElement.length) {
                    var $rowElement = $cellElement.closest(settings.rowIdentifier);
                    if ($rowElement.length) {
                        return {
                            cellIndex: $cellElement.index(),
                            rowIndex: $rowElement.index(),
                            event: evt,
                        };
                    }
                }
            }
        }

        function handleMouseDown(evt) {
            if (evt.ctrlKey || evt.shiftKey) {
                document.getSelection().removeAllRanges();
                evt.preventDefault();
            }
        }

        function handleClick(evt) {
            evt = getCellEvent(evt);
            if (evt && settings.handleClick) {
                settings.handleClick(evt);
            }
        }

        function handleContextMenu(evt) {
            evt = getCellEvent(evt);
            if (evt && settings.handleContextMenu) {
                settings.handleContextMenu(evt);
            }
        }

        function handleDblClick(evt) {
            evt = getCellEvent(evt);
            if (evt && settings.handleDblClick) {
                settings.handleDblClick(evt);
            }
        }

        function handleKeyDown(evt) {
            evt = getCellEvent(evt);
            if (evt && settings.handleKeyDown) {
                settings.handleKeyDown(evt);
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

        function handleMouseDown(evt) {
            var $cellElement = $(this).closest(settings.cellIdentifier);

            if ($cellElement.length) {
                var cellIndex = $cellElement.index();

                settings.handleResizeStart({
                    cellElement: $cellElement,
                    cellIndex: cellIndex,
                    event: evt
                });

                $(document)
                    .bind("mousemove", function (evt) {
                        var newWidth = evt.pageX - $cellElement.offset().left;
                        if (newWidth > 0) {
                            settings.handleResize({
                                cellElement: $cellElement,
                                cellIndex: cellIndex,
                                width: newWidth,
                                event: evt
                            });
                        }
                    })
                    .bind("mouseup", function (evt) {
                        $(this).unbind("mousemove mouseup");

                        settings.handleResizeStop({
                            cellElement: $cellElement,
                            cellIndex: cellIndex,
                            event: evt
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

        function handleMouseWheel(evt) {
            clearTimeout(wheelStopTimer);

            if (isWheelMoved === false) {
                isWheelMoved = true;
                settings.handleMouseWheelStart({ event: evt });
            }

            settings.handleMouseWheel({ event: evt });

            wheelStopTimer = setTimeout(function () {
                settings.handleMouseWheelStop({ event: evt });
                isWheelMoved = false;
            }, settings.latency);

        }

        function handleScroll(evt) {
            var scroll = {
                scrollTop: $element[0].scrollTop,
                scrollLeft: $element[0].scrollLeft,
                topDelta: $element[0].scrollTop - lastScroll.scrollTop,
                leftDelta: $element[0].scrollLeft - lastScroll.scrollLeft,
                event: evt,
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
            "latency": 300,
            "resetLeft": true,
            "resetTop": true,
        };

        settings = $.extend({}, defaultSettings, settings);

        return new ScrollHandler($container, settings);
    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Handler": {
                "Shared": {
                    "GetInstance": GetInstance,
                    "Handler": SharedHandler,
                }
            }
        }
    });

    function SharedHandler() {
        var self = this,
            resizeTimer;

        $(window)
            .on("click", handleClick)
            .on("contextmenu", handleContextMenu)
            .on("resize", handleResize);

        function handleClick(evt) {
            self.onClick.notify({
                event: evt
            });
        }

        function handleContextMenu(evt) {
            self.onContextMenu.notify({
                event: evt
            });
        }

        function handleResize(evt) {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

            resizeTimer = setTimeout(function () {
                self.onResize.notify({
                    event: evt
                });
            }, 400);
        }

        function destroy() {
            $(window)
                .off("click", handleClick)
                .off("contextmenu", handleContextMenu)
                .off("resize", handleResize)
        }

        $.extend(this, {
            "onClick": new SmallGrid.Event.Handler(),
            "onContextMenu": new SmallGrid.Event.Handler(),
            "onResize": new SmallGrid.Event.Handler(),

            "destroy": destroy
        });
    }

    var handler;

    function GetInstance() {
        if (!handler) {
            handler = new SharedHandler();
        }

        return handler;
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

    function Create(name, context, settings, pluginSettings) {
        if (!name.length) {
            throw new Error("Plugin name is not defined.");
        }

        if (context.view instanceof SmallGrid.View.View === false) {
            throw new TypeError("View is not defined");
        }

        if (context.windowManager instanceof SmallGrid.View.Window.Manager === false) {
            throw new TypeError("WindowManager is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        if (SmallGrid.Utils.isFunction(name, SmallGrid.Plugins) !== true) {
            throw new TypeError("name is not defined");
        }

        settings.plugins[name] = jQuery.extend(true, settings.plugins[name] || {}, pluginSettings || {});
        var plugin = new SmallGrid.Plugins[name](context, settings);
        return plugin.init();

    }

})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Query": {
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
})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Query": {
                "Request": Request,
            }
        }
    });

    function Request(filters, sorters, dataModel) {

        function sortRows() {
            for (var i = 0; i < sorters.length; i++) {
                var sorter = sorters[i];
                dataModel.sort(
                    SmallGrid.Column.Comparer[sorter.getSortComparer()]({
                        "sortOrder": sorter.getSortOrder(),
                        "field": sorter.getField()
                    })
                );
            }
        }

        function sortColumns() {
            for (var i = 0; i < sorters.length; i++) {
                var sorter = sorters[i];
                dataModel.sort(
                    SmallGrid.Column.Comparer[sorter.getSortComparer()]({
                        "sortOrder": sorter.getSortOrder(),
                        "field": sorter.getField()
                    })
                );
            }
        }

        function getRowsInRange(top, height, outerHeight) {
            sortRows();
            return dataModel.filter(new RowsRangeByHeight(top, height, outerHeight, getRowFilter()));
        }

        function getColumnsInRange(left, width, outerWidth) {
            return dataModel.filter(new ColumnsRangeByWidth(left, width, outerWidth, getColumnFilter()));
        }

        function getColumnsTotal(width) {
            var total = {
                width: 0,
                count: 0,
            };
            var columns = dataModel.getColumns();
            var filter = getColumnFilter();

            for (var i = 0; i < columns.length; i++) {
                if ((filter && (filter(columns[i]) === false)) || (columns[i].hidden === true)) continue;
                total.width += columns[i].width + width;
                total.count++;
            }

            return total;
        }

        function getRowsTotal(height) {
            var total = {
                height: 0,
                count: 0,
            };
            var rows = dataModel.getRows();
            var filter = getRowFilter();

            for (var i = 0; i < rows.length; i++) {
                if ((filter && (filter(rows[i]) === false)) || (rows[i].hidden === true)) continue;
                total.height += rows[i].height + height;
                total.count++;
            }
            return total;
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
                        resultQuery += ' && ';
                    }
                    resultQuery += '(' + convertedQuery + ')';
                }
            }

            if (resultQuery.length) {
                return new Function('item', "return " + resultQuery);
            }
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
                if (filter && (filter(item) === false) || (item.hidden === true)) return false;
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
            "getColumnsTotal": getColumnsTotal,
            "getRowsTotal": getRowsTotal,
            "getRowsInRange": getRowsInRange
        });
    }
})(jQuery);(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Query": {
                "SorterQuery": SorterQuery,
            }
        }
    });

    function SorterQuery(field, sortOrder, sortComparer, settings) {
        var self = this;

        function getField() {
            return field;
        }

        function getSortOrder() {
            return sortOrder;
        }

        function getSortComparer() {
            return sortComparer;
        }

        $.extend(this, {
            "getField": getField,
            "getSortOrder": getSortOrder,
            "getSortComparer": getSortComparer,
        });
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
        if ("disabled" in data) this.disabled = data.disabled;
        if ("editable" in data) this.editable = data.editable;
        if ("editMode" in data) this.editMode = data.editMode;
        if ("height" in data) this.height = data.height;
        if ("hidden" in data) this.hidden = data.hidden;
        if ("id" in data) this.id = data.id;
        if ("item" in data) this.item = data.item;
        if ("maxHeight" in data) this.maxHeight = data.maxHeight;
        if ("minHeight" in data) this.minHeight = data.minHeight;
        if ("rowCssClass" in data) this.rowCssClass = data.rowCssClass;
    }

    RowData.prototype.cellCssClass = "";// row based cell class
    RowData.prototype.disabled = false; // is row disabled
    RowData.prototype.editable = true; // true when row cells are editable
    RowData.prototype.editMode = false; // true when row cell in edit mode
    RowData.prototype.height = 20;// row height
    RowData.prototype.hidden = false;//row visibility
    RowData.prototype.id = undefined;// unique indicator
    RowData.prototype.item = null;//item data
    RowData.prototype.maxHeight = 200;// max row height
    RowData.prototype.minHeight = 20; // min row height
    RowData.prototype.rowCssClass = "";// whole row css class

    function RowModel(settings) {
        var self = this;
        var data = [];

        var items = {

            addItem: function (item) {
                var row = createRow(item);
                addRow(row);
                self.onChange.notify({ "id": row.id });
                return row;
            },

            addItems: function (items) {
                if (items.length) {
                    self.onChange.blockEvents();
                    for (var i = 0; i < items.length; i++) {
                        self.items.addItem(items[i]);
                    }
                    self.onChange.notifyBlocked();
                }
                return self;
            },

            deleteItems: function () {
                return deleteRows();
            },

            deleteItemById: function (id) {
                return deleteRowById(id);
            },

            deleteItem: function (item) {
                if (SmallGrid.Utils.isProperty(settings.rows.idProperty, item)) {
                    deleteRowById(item[settings.rows.idProperty]);
                }
                return self;
            },

            getItems: function () {
                var result = [];
                for (var i = 0; i < data.length; i++) {
                    result.push(data[i].item);
                }
                return result;
            },

            setItems: function (items) {
                if (items.length) {
                    self.onChange.blockEvents();
                    data = [];
                    for (var i = 0; i < items.length; i++) {
                        self.items.addItem(items[i]);
                    }
                    self.onChange.notifyBlocked();
                }
                return self;
            },

            updateItems: function (items) {
                if (items.length) {
                    self.onChange.blockEvents();
                    for (var i = 0; i < items.length; i++) {
                        self.items.updateItem(items[i]);
                    }
                    self.onChange.notifyBlocked();
                }
                return self;
            },

            updateItem: function (item) {
                if (SmallGrid.Utils.isProperty(settings.rows.idProperty, item)) {
                    self.items.updateItemById(item[settings.rows.idProperty], item);
                }
            },

            updateItemById: function (id, item) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == id) {
                        data[i].item = item;
                        self.onChange.notify({ "id": id });
                        break;
                    }
                }
                return self;
            },

            updateItemByIndex: function (idx, item) {
                if (data[idx]) {
                    data[idx].item = item;
                    self.onChange.notify({ "id": data[idx].id });
                }
                return self;
            }
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
                self.onChange.blockEvents();
                data.sort(comparer);
                self.onChange.notifyBlocked();
            }
            return self;
        }

        function isEmpty() {
            return data.length === 0;
        }

        function total() {
            return data.length;
        }


        /*
        Batch updates
        */
        function addRows(rows) {
            if (rows.length) {
                self.onChange.blockEvents();
                for (var i = 0; i < rows.length; i++) {
                    addRow(rows[i]);
                }
                self.onChange.notifyBlocked();
            }
            return self;
        }


        function updateRows(rows) {
            if (rows.length) {
                self.onChange.blockEvents();
                for (var i = 0; i < rows.length; i++) {
                    updateRow(rows[i]);
                }
                self.onChange.notifyBlocked();
            }
            return self;
        }

        function setRows(rows) {
            if (rows.length) {
                self.onChange.blockEvents();
                data = [];
                for (var i = 0; i < rows.length; i++) {
                    addRow(rows[i]);
                }
                self.onChange.notifyBlocked();
            }
            return self;
        }

        function setRowsProperty(propertyName, propertyValue) {
            self.onChange.blockEvents();
            for (var i = 0; i < data.length; i++) {
                data[i][propertyName] = propertyValue;
                self.onChange.notify({ "id": data[i].id });
            }
            self.onChange.notifyBlocked();
            return self;
        }


        function deleteRows() {
            if (data.length) {
                self.onChange.blockEvents();
                data = [];
                self.onChange.notifyBlocked();
            }
            return self;
        }

        /*
        Single updates
        */
        function addRow(row) {
            if (row instanceof RowData) {
                data.push(row);
                self.onChange.notify({ "id": row.id });
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



        function updateRow(row) {
            if (row instanceof RowData) {
                updateRowById(row.id, row);
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
            "items": items,
            "onChange": new SmallGrid.Event.Handler(),

            "filter": filter,

            "reduce": reduce,
            "sort": sort,
            "total": total,

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
    }

    function CreateModel(data, settings) {
        if (Array.isArray(data) == false) {
            throw new TypeError("Data is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        return new RowModel(
            settings
        ).items.addItems(data);
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

    function measureViewport() {
        var $el = $('<div style="display:none;width:1vw;height:1vh;" />').appendTo(document.body);
        var dim = {
            width: $el.width() - $el[0].clientWidth,
            height: $el.height() - $el[0].clientHeight,
        };
        $el.remove();

        return dim;
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
        } while (supportedHeight < 16000000)

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
        var $table = $("<table class='grid-content-table' style='position:absolute; top:-100px; left:-100px;'></table>").appendTo(document.body),
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
                "measureViewport": measureViewport,
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
            el.container.empty().addClass(settings.uid);

            el.viewport.appendTo(el.container);

            //bind events
            handlers.push(
                SmallGrid.Handler.Resize.Create(el.header, {
                    "handleResize": handleHeaderResize,
                    "handleResizeStart": handleHeaderResizeStart,
                    "handleResizeStop": handleHeaderResizeStop,
                    "handlerIdentifier": "." + settings.cssClass.headerResizeHandle,
                }),
                SmallGrid.Handler.Click.Create(el.header, {
                    "handleClick": handleHeaderClick,
                    "handleDblClick": handleHeaderDblClick,
                    "handleContextMenu": handleHeaderContextMenu,
                }),
                SmallGrid.Handler.Click.Create(el.content, {
                    "handleClick": handleCellClick,
                    "handleDblClick": handleCellDblClick,
                    "handleContextMenu": handleCellContextMenu,
                    "handleKeyDown": handleCellKeyDown,
                }),
                SmallGrid.Handler.Scroll.Create(el.content, {
                    "handleScrollStart": handleScrollStart,
                    "handleScrollStop": handleScrollStop,
                    "handleScroll": handleScroll,
                    "handleMouseWheelStart": handleMouseWheelStart,
                    "handleMouseWheelStop": handleMouseWheelStop,
                    "handleMouseWheel": handleMouseWheel,
                })
            );

            var sharedHandler = SmallGrid.Handler.Shared.GetInstance();
            sharedHandler.onClick.subscribe(handleDocumentClick);
            sharedHandler.onResize.subscribe(handleDocumentResize);
            sharedHandler.onContextMenu.subscribe(handleDocumentContextMenu);

            viewModel.onRowsChange.subscribe(handleRowsChange);
            viewModel.onColumnsChange.subscribe(handleColumnsChange);

            resize();
            if (settings.resizeColumnsOnLoad === true) resizeColumns();
            renderView();

            resumeRender(request);

            self.onInitialize.notify({});

            return self;
        }

        function destroy() {
            suspendRender();

            renderer = null;

            viewModel.onRowsChange.unsubscribe(handleRowsChange);
            viewModel.onColumnsChange.unsubscribe(handleColumnsChange);

            var sharedHandler = SmallGrid.Handler.Shared.GetInstance();
            sharedHandler.onClick.unsubscribe(handleDocumentClick);
            sharedHandler.onResize.unsubscribe(handleDocumentResize);
            sharedHandler.onContextMenu.unsubscribe(handleDocumentContextMenu);

            if (el.container.length) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].destroy();
                }
                el.container.empty().removeClass(settings.uid);
            }

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
                return (row.calcHeight - row.height - settings.cellOuterSize.height >= el.content[0].scrollTop && row.calcHeight + row.height + settings.cellOuterSize.height < contentSize.height + el.content[0].scrollTop);

            }
            return false;
        }

        function getRowNodeByIndex(rowIndex) {
            return el.contentTbody[0].rows[rowIndex];
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
            if (el.contentTbody[0].rows[rowIndex] && el.contentTbody[0].rows[rowIndex].cells[columnIndex]) {
                return el.contentTbody[0].rows[rowIndex].cells[columnIndex];
            }
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
                return (column.calcWidth - column.width - settings.cellOuterSize.width >= el.content[0].scrollLeft && column.calcWidth < contentSize.width + el.content[0].scrollLeft);
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
            if (suspendRenderRequests > 0) {
                if (requestDataTimer != null || isSuspended() === true) {
                    clearTimeout(requestRenderTimer);
                    requestRenderTimer = setTimeout(render, 187);
                } else {
                    requestDataTimer++;
                    clearTimeout(requestRenderTimer);
                    renderView();
                    if (settings.renderDelay) {
                        setTimeout(function () {
                            requestDataTimer = null;
                        }, settings.renderDelay)
                    } else {
                        requestDataTimer = null;
                    }
                }
            }
            return self;
        }

        function renderView() {

            var request = suspendRender();
            suspendRenderRequests = 0;

            var result = viewModel.requestDataFromRange(
                {
                    top: el.content[0].scrollTop * heightRatio,
                    left: el.content[0].scrollLeft
                },
                contentSize,
                settings.cellOuterSize,
                {
                    width: scrollVisibility.vertical ? settings.scrollbarDimensions.width : 0,
                    height: scrollVisibility.horisontal ? settings.scrollbarDimensions.height : 0,
                },
                heightRatio == 1
            );

            if (result.isCached === 0) {
                if (result.columns.length > 0) {
                    el.headerTable.css({
                        'left': result.columns[0].calcWidth - result.columns[0].width - settings.cellOuterSize.width
                    });

                    if (result.rows.length > 0) {
                        el.contentTable.css({
                            'top': result.rows[0].calcHeight - result.rows[0].height - settings.cellOuterSize.height - (el.content[0].scrollTop * heightRatio) + el.content[0].scrollTop,
                            'left': result.columns[0].calcWidth - result.columns[0].width - settings.cellOuterSize.width
                        });
                    }

                    var lastColumn = result.columns[result.columns.length - 1];

                    var opts = {
                        hideRowBorder: (scrollVisibility.horisontal === false && scrollVisibility.vertical == true),
                        hideColumnBorder: (scrollVisibility.vertical === false && contentSize.width <= lastColumn.calcWidth),
                        virtualColumnWidth: (settings.showLastColumn === true && contentSize.width >= lastColumn.calcWidth) ? contentSize.width - lastColumn.calcWidth : 0,
                    };

                    renderViewHtml(
                        renderer.buildHeaderColumnsHtml(result.columns, opts),
                        renderer.buildColsHtml(result.columns, opts),
                        renderer.buildRowsHtml(result.columns, result.rows, opts)
                    );

                } else {
                    renderViewHtml("", "", "");
                }
            }

            resumeRender(request);
        }

        function renderViewHtml(columnsHtml, colsHtml, rowsHtml) {
            self.onBeforeRowsRendered.notify({});

            el.headerCol[0].innerHTML = el.contentCol[0].innerHTML = colsHtml;
            el.headerTbody[0].innerHTML = columnsHtml;
            el.contentTbody[0].innerHTML = rowsHtml;

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
                    return true;
                }
            }
            return false;
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

        function getColumnEvent(evt) {
            var column = viewModel.getColumnByIndex(evt.cellIndex);
            if (column) {
                evt.type = getColumnEventType($(evt.event.target).attr("class"), column);
                evt.targetClass = $(evt.event.target).attr("class");
                evt.column = column;
                return evt;
            }
        }

        function getCellEvent(evt) {
            var column = viewModel.getColumnByIndex(evt.cellIndex);
            var row = viewModel.getRowByIndex(evt.rowIndex);

            if (column && column.field.length > 0 && row && column.field in row.item) {

                evt.type = getCellEventType($(evt.event.target).attr("class"), column, row);
                evt.row = row;
                evt.column = column;

                return evt;
            }
        }

        /*
        Resize 
        */
        function resizeColumnsWidth(allColumns, scrollBarWidth, cellOuterWidth) {
            var updateColumns = allColumns.slice();
            var total =
                {
                    minWidth: 0,
                    maxWidth: 0,
                    width: 0
                },
                contentWidth = contentSize.width - updateColumns.length * cellOuterWidth - scrollBarWidth;

            for (var i = updateColumns.length - 1; i >= 0; i--) {
                var updateColumn = updateColumns[i];
                if (updateColumn.resizeable === false) {
                    contentWidth -= updateColumn.width;
                    updateColumns.splice(i, 1);
                    continue;
                }
                total.minWidth += updateColumn.minWidth;
                total.maxWidth += updateColumn.maxWidth;
                total.width += updateColumn.width;
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
                viewModel.getColumnsModel().getColumns(),
                (scrollVisibility.vertical === true) ? settings.scrollbarDimensions.width : 0,
                settings.cellOuterSize.width
            );

            var request = suspendRender();

            viewModel.getColumnsModel().updateColumns(updateColumns);

            resumeRender(request);

            return self;
        }

        function resize() {
            contentSize.width = el.container.width();
            contentSize.height = Math.max(el.container.height() - settings.header.height - settings.cellOuterSize.height, 0);

            if (contentSize.height) el.content.height(contentSize.height);

            applyRowsChange();
            applyColumnsChange();

            return self;
        }

        /*
        Data handlers
        */
        function applyRowsChange() {
            var rowsHeight = viewModel.getRowsHeight(settings.cellOuterSize);

            scrollVisibility.vertical = scrollVisibility.horisontal ? (rowsHeight > (contentSize.height - settings.scrollbarDimensions.height)) : (rowsHeight > contentSize.height);

            if (settings.showLastColumn == true) {
                el.headerWrap.css({
                    'width': Math.max(el.headerWrap.width(), contentSize.width)
                });

                el.contentWrap.css({
                    'width': Math.max(el.contentWrap.width(), contentSize.width),
                });
            }

            if (rowsHeight > settings.maxSupportedCssHeight) {
                heightRatio = (rowsHeight - contentSize.height + settings.scrollbarDimensions.height) / (settings.maxSupportedCssHeight - contentSize.height + settings.scrollbarDimensions.height);
                rowsHeight = settings.maxSupportedCssHeight;
            }

            el.header.css({
                'width': scrollVisibility.vertical ? contentSize.width - settings.scrollbarDimensions.width : contentSize.width
            });

            el.contentWrap.css({
                'height': rowsHeight,
            });

        }

        function handleRowsChange() {
            applyRowsChange();
            render();
        }

        function applyColumnsChange() {
            var columnsWidth = viewModel.getColumnsWidth(settings.cellOuterSize);

            scrollVisibility.horisontal = scrollVisibility.vertical ? (columnsWidth > (contentSize.width - settings.scrollbarDimensions.width)) : (columnsWidth > contentSize.width);

            var width = Math.max(
                columnsWidth,
                scrollVisibility.vertical ? contentSize.width - settings.scrollbarDimensions.width : contentSize.width
            );

            el.headerWrap.css({
                'width': width
            });

            el.contentWrap.css({
                'width': width,
            });
        }

        function handleColumnsChange() {
            applyColumnsChange();
            render();
        }

        /*
        Handle cell events
        */
        function handleCellClick(evt) {
            var cellEvent = getCellEvent(evt);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellClick");
            }
        }

        function handleCellDblClick(evt) {
            var cellEvent = getCellEvent(evt);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellDblClick");
            }
        }

        function handleCellContextMenu(evt) {
            var cellEvent = getCellEvent(evt);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellContextMenu");
            }
        }

        function handleCellKeyDown(evt) {
            var cellEvent = getCellEvent(evt);
            if (cellEvent) {
                notifyEvent(cellEvent, "onCellKeyDown");
            }
        }

        /*
        Handle resize events
        */
        function handleHeaderResize(evt) {
            notifyEvent(evt, "onColumnResize");
        }

        function handleHeaderResizeStart(evt) {
            suspendScrollEvent = true;
            notifyEvent(evt, "onColumnResizeStart");
        }

        function handleHeaderResizeStop(evt) {
            suspendScrollEvent = false;
            notifyEvent(evt, "onColumnResizeStop");
        }

        /*
        Handle mouse wheel
        */
        function handleMouseWheelStart(evt) {
            notifyEvent(evt, "onMouseWheelStart");
        }

        function handleMouseWheelStop(evt) {
            notifyEvent(evt, "onMouseWheelStop");
        }

        function handleMouseWheel(evt) {
            notifyEvent(evt, "onMouseWheel");
        }

        /*
        Handle scroll
        */
        function handleScrollStart(evt) {
            if (suspendScrollEvent === false) {
                notifyEvent(evt, "onScrollStart");
            }
        }

        function handleScrollStop(evt) {
            if (suspendScrollEvent === false) {
                notifyEvent(evt, "onScrollStop");
            }
        }

        function handleScroll(evt) {
            if (suspendScrollEvent === false) {
                el.header[0].scrollLeft = el.content[0].scrollLeft;
                render();
                notifyEvent(evt, "onScroll");
            }
        }

        /*
        Handle document events
        */
        function handleDocumentResize(evt) {
            var request = suspendRender();
            resize();

            notifyEvent(evt, "onDocumentResize");

            renderView();
            resumeRender(request);

        }
        function handleDocumentContextMenu(evt) {
            notifyEvent(evt, "onDocumentContextMenu");
        }

        function handleDocumentClick(evt) {
            notifyEvent(evt, "onDocumentClick");
        }

        /*
        Handle header events
        */
        function handleHeaderClick(evt) {
            var columnEvent = getColumnEvent(evt);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderClick");
            }
        }

        function handleHeaderContextMenu(evt) {
            var columnEvent = getColumnEvent(evt);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderContextMenu");
            }
        }

        function handleHeaderDblClick(evt) {
            var columnEvent = getColumnEvent(evt);
            if (columnEvent) {
                notifyEvent(columnEvent, "onHeaderDblClick");
            }
        }

        function notifyEvent(evt, handlerName) {
            self[handlerName].notify(evt);
        }

        $.extend(this, {
            "init": init,
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

            "onScroll": new SmallGrid.Event.Handler(),
            "onScrollStart": new SmallGrid.Event.Handler(),
            "onScrollStop": new SmallGrid.Event.Handler(),

            "onMouseWheel": new SmallGrid.Event.Handler(),
            "onMouseWheelStart": new SmallGrid.Event.Handler(),
            "onMouseWheelStop": new SmallGrid.Event.Handler(),

            "onDocumentClick": new SmallGrid.Event.Handler(),
            "onDocumentResize": new SmallGrid.Event.Handler(),
            "onDocumentContextMenu": new SmallGrid.Event.Handler(),

            "onHeaderClick": new SmallGrid.Event.Handler(),
            "onHeaderContextMenu": new SmallGrid.Event.Handler(),
            "onHeaderDblClick": new SmallGrid.Event.Handler(),

            "onCellClick": new SmallGrid.Event.Handler(),
            "onCellContextMenu": new SmallGrid.Event.Handler(),
            "onCellDblClick": new SmallGrid.Event.Handler(),
            "onCellKeyDown": new SmallGrid.Event.Handler(),

            "onColumnResize": new SmallGrid.Event.Handler(),
            "onColumnResizeStart": new SmallGrid.Event.Handler(),
            "onColumnResizeStop": new SmallGrid.Event.Handler(),

            "onAfterRowsRendered": new SmallGrid.Event.Handler(),
            "onBeforeRowsRendered": new SmallGrid.Event.Handler(),

            "onInitialize": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });
    }


    function CreateView(container, viewModel, settings) {
        var $container = $(container);
        if (!$container.length) {
            throw new TypeError("Container is not defined or does not exist in the DOM.");
        }

        if (viewModel instanceof SmallGrid.View.Model.Model === false) {
            throw new TypeError("View model is not defined.");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        var renderer = SmallGrid.View.Renderer.Create(settings);

        return new ViewData($container, viewModel, renderer, settings).init();
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
        var rowsTotal = { count: 0, height: 0 };
        var columnsTotal = { count: 0, width: 0 };

        var rowsCache = [];
        var columnsCache = [];

        var rowsFilters = [];
        var columnsFilters = [];
        var rowsSorters = [];
        var columnsSorters = [];

        var cachedRange = {
            minTop: undefined,
            maxTop: undefined,
            minLeft: undefined,
            maxLeft: undefined,
        };

        /*
        Init && destroy
        */
        function init() {
            rowsModel.onChange.subscribe(handleRowsChange);
            columnsModel.onChange.subscribe(handleColumnsChange);
            return self;
        }

        function destroy() {
            rowsModel.onChange.unsubscribe(handleRowsChange);
            columnsModel.onChange.unsubscribe(handleColumnsChange);

        }
        /* Rows and Columns*/
        function getRowsModel() {
            return rowsModel;
        }

        function getColumnsModel() {
            return columnsModel;
        }

        /*
        Handlers
        */
        function handleColumnsChange(evt) {
            updateCacheWidth();

            if (evt.data) {
                var stackedIds = [];
                for (var i = 0; i < evt.data.length; i++) {
                    if (evt.data[i].id) {
                        stackedIds.push(evt.data[i].id);
                    }
                }
                self.onColumnsChange.notify({ "ids": stackedIds });

            } else if (evt.id) {
                self.onColumnsChange.notify({ "ids": [evt.id] });
            }
        }

        function handleRowsChange(evt) {
            updateCacheHeight();

            if (evt.data) {
                var stackedIds = [];
                for (var i = 0; i < evt.data.length; i++) {
                    if (evt.data[i].id) {
                        stackedIds.push(evt.data[i].id);
                    }
                }
                self.onRowsChange.notify({ "ids": stackedIds });

            } else if (evt.id) {
                self.onRowsChange.notify({ "ids": [evt.id] });
            }
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

        function getRowsTotal() {
            return rowsTotal;
        }

        function getColumnsTotal() {
            return columnsTotal;
        }

        /*
        Filter part
        */
        function getFilters() {
            return rowsFilters;
        }

        function setFilter(filterObj) {
            if (filterObj instanceof SmallGrid.Query.FilterQuery) {
                for (var i = 0; i < rowsFilters.length; i++) {
                    if (rowsFilters[i].getId() == filterObj.getId()) {
                        break;
                    }
                }

                rowsFilters[i] = filterObj;
                updateCacheHeight();
                self.onRowsChange.notify();
            }
        }

        function clearFilter(filterObj) {
            if (filterObj instanceof SmallGrid.Query.FilterQuery) {
                for (var i = 0; i < rowsFilters.length; i++) {
                    if (rowsFilters[i].getId() == filterObj.getId()) {
                        rowsFilters.splice(i, 1);
                        updateCacheHeight();
                        self.onRowsChange.notify();
                        break;
                    }
                }
            }
        }

        function clearFilters() {
            rowsFilters = [];
            updateCacheHeight();
            self.onRowsChange.notify();
        }

        /* 
        Sorter part
        */
        function getSorters() {
            return rowsSorters;
        }

        function setSorter(sorterObj) {
            if (sorterObj instanceof SmallGrid.Query.SorterQuery) {
                rowsSorters = [];
                updateCacheHeight();
                rowsSorters.push(sorterObj);
                self.onRowsChange.notify();
            }
        }

        function clearSorter(sorterObj) {
            if (sorterObj instanceof SmallGrid.Query.SorterQuery) {
                for (var i = 0; i < rowsSorters.length; i++) {
                    if (rowsSorters[i].getField() == sorterObj.getField()) {
                        rowsSorters.splice(i, 1);
                        updateCacheHeight();
                        self.onRowsChange.notify();
                        break;
                    }
                }
            }
        }

        function clearSorters() {
            rowsSorters = [];
            updateCacheHeight();
            self.onRowsChange.notify();
        }

        /*
        Data calculations
        */
        function getRowsHeight(cellOuterSize) {
            rowsTotal = new SmallGrid.Query.Request(rowsFilters, rowsSorters, rowsModel).getRowsTotal(cellOuterSize.height);
            return rowsTotal.height;
        }

        function getColumnsWidth(cellOuterSize) {
            columnsTotal = new SmallGrid.Query.Request(columnsFilters, columnsSorters, columnsModel).getColumnsTotal(cellOuterSize.width);
            return columnsTotal.width;
        }

        function requestDataFromRange(point, size, outerSize, scrollSize, allowCache) {
            var rowsCached = (cachedRange.minTop <= point.top && point.top <= cachedRange.maxTop + scrollSize.height) & allowCache;
            var columnsCached = (cachedRange.minLeft <= point.left && point.left <= cachedRange.maxLeft + scrollSize.width) & allowCache;

            if (rowsCached === 0) {
                rowsCache = new SmallGrid.Query.Request(rowsFilters, rowsSorters, rowsModel).getRowsInRange(point.top, size.height, outerSize.height);
                updateCacheHeight(rowsCache, size, outerSize);
            }

            if (columnsCached === 0) {
                columnsCache = new SmallGrid.Query.Request(columnsFilters, columnsSorters, columnsModel).getColumnsInRange(point.left, size.width, outerSize.width);
                updateCacheWidth(columnsCache, size, outerSize);
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
        function updateCacheWidth(columns, size, outerSize) {
            if (columns && columns.length) {
                cachedRange.minLeft = columns[0].calcWidth - columns[0].width - outerSize.width;
                cachedRange.maxLeft = columns[(columns.length - 1)].calcWidth > size.width ? columns[(columns.length - 1)].calcWidth - size.width : size.width;

            } else {
                cachedRange.minLeft = undefined;
                cachedRange.maxLeft = undefined;
            }
        }

        function updateCacheHeight(rows, size, outerSize) {
            if (rows && rows.length) {
                cachedRange.minTop = rows[0].calcHeight - rows[0].height - outerSize.height;
                cachedRange.maxTop = rows[(rows.length - 1)].calcHeight > size.height ? rows[(rows.length - 1)].calcHeight - size.height : size.height;
            } else {
                cachedRange.minTop = undefined;
                cachedRange.maxTop = undefined;
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "getRowsTotal": getRowsTotal,
            "getColumnsTotal": getColumnsTotal,

            "getColumnsModel": getColumnsModel,
            "getRowsModel": getRowsModel,

            "requestDataFromRange": requestDataFromRange,

            "clearSorter": clearSorter,
            "clearSorters": clearSorters,
            "clearFilter": clearFilter,
            "clearFilters": clearFilters,
            "getColumnById": getColumnById,
            "getColumnByIndex": getColumnByIndex,
            "getColumnIndexById": getColumnIndexById,
            "getColumns": getColumns,
            "getColumnsWidth": getColumnsWidth,
            "getFilters": getFilters,
            "getSorters": getSorters,
            "getRowById": getRowById,
            "getRowByIndex": getRowByIndex,
            "getRowIndexById": getRowIndexById,
            "getRows": getRows,
            "getRowsHeight": getRowsHeight,
            "setFilter": setFilter,
            "setSorter": setSorter,


            "onColumnsChange": new SmallGrid.Event.Handler(),
            "onRowsChange": new SmallGrid.Event.Handler(),
        });
    }

    function CreateModel(rowsModel, columnsModel, settings) {
        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        if (rowsModel instanceof SmallGrid.Row.Model === false) {
            throw new TypeError("Rows model is not defined.");
        }

        if (columnsModel instanceof SmallGrid.Column.Model === false) {
            throw new TypeError("Column model is not defined.");
        }

        return new ViewModel(rowsModel, columnsModel, settings).init();
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
            el['preload'] = $("<div class='grid-preload-font'/>");

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
            el['preload'].appendTo(el['viewport']);

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

        function buildHeaderColumnHtml(column, opts, isLastColumn) {
            var value = "",
                html,
                cellCssClass = settings.cssClass.headerCell;

            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            if (isLastColumn && opts.hideColumnBorder) {
                cellCssClass += " " + settings.cssClass.cellColumnLast;
            }

            switch (column.align) {
                case "center":
                    cellCssClass += " " + settings.cssClass.cellAlignCenter;
                    break;
                case "right":
                    cellCssClass += " " + settings.cssClass.cellAlignRight;
                    break;
            }

            if (column.name) {
                value += column.name;
            }

            if (column.sortable || column.filterable) {
                cellCssClass += " " + settings.cssClass.cursorPointer;
            }

            html = "<td style='height:" + settings.header.height + "px' class='" + cellCssClass + "'><div class='" + settings.cssClass.headerCellDiv + "'><span class='" + settings.cssClass.headerColumnName + "'>" + value + "</span>";


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
            return "<td class='" + settings.cssClass.headerCell + ' ' + settings.cssClass.cellColumnLast + "' style='height:" + settings.header.height + "px'></td>";
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
            for (var i = 0, length = rows.length - 1; i <= length; i++) {
                html += buildRowHtml(columns, rows[i], opts, length == i);
            }
            return html;
        }

        function buildRowHtml(columns, row, opts, isLastRow) {
            var rowCssClass = settings.cssClass.row + ((row.calcIndex & 1 == 1) ? " " + settings.cssClass.rowEven : " " + settings.cssClass.rowOdd);

            if (row.rowCssClass) rowCssClass += " " + row.rowCssClass;

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
                html += buildCellHtml(columns[i], row, opts, length == i, isLastRow);
            }

            if (opts.virtualColumnWidth > 0) {
                html += buildLastCellHtml(columns[i - 1], opts, isLastRow);
            }


            return html + '</tr>';
        }

        function buildCellHtml(column, row, opts, isLastColumn, isLastRow) {
            var cellCssClass = settings.cssClass.cell;
            if (column.cellCssClass) {
                cellCssClass += " " + column.cellCssClass;
            }

            if (isLastColumn && opts.hideColumnBorder) {
                cellCssClass += " " + settings.cssClass.cellColumnLast;
            }

            if (isLastRow && opts.hideRowBorder) {
                cellCssClass += " " + settings.cssClass.cellRowLast;
            }

            if (column.align == "center") {
                cellCssClass += " " + settings.cssClass.cellAlignCenter;
            }
            if (column.align == "right") {
                cellCssClass += " " + settings.cssClass.cellAlignRight;
            }

            if (row.cellCssClass && (column.field in row.cellCssClass)) {
                cellCssClass += " " + row.cellCssClass[column.field];
            }

            return "<td height='" + row.height + "' class='" + cellCssClass + "'>" + getCellContentHtml(column, row) + "</td>";
        }

        function buildLastCellHtml(column, opts, isLastRow) {
            var cssClass = settings.cssClass.cell + ' ' + settings.cssClass.cellColumnLast;
            if (isLastRow) cssClass += ' ' + settings.cssClass.cellRowLast;
            return "<td class='" + cssClass + "'></td>";
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
        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

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

        function createWindow(id, $contentElement, opts) {
            if (isWindow(id) === false) {
                cache.push({ id: id, opts: opts || {} });

                var $container = $('<div class="grid-window grid-window-' + id + '"/>');
                if ($contentElement && $contentElement.length) $contentElement.appendTo($container);
                $container.appendTo(view.getNode('container')).hide();
            }
            return self;
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
            return self;
        }

        function removeWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id == id) {
                    cache.splice(i, 1);
                    var window = view.getNode('container').children('.grid-window-' + id);
                    if (window.length) {
                        window.remove();
                    }
                    break;
                }
            }
            return self;
        }

        function showWindowNearPosition(id, position, margin) {
            var containerMargin = margin || 0;
            var data = getWindow(id);
            if (data != null) {
                data.container.show();

                var $container = view.getNode('container');

                var elementSize = {
                    width: data.container.width(),
                    height: data.container.height()
                };

                var left = (elementSize.width + position.x > $container.width() && elementSize.width < position.x - $container.offset().left) ? position.x - elementSize.width + containerMargin : position.x - containerMargin;

                data.container.offset({
                    top: position.y - containerMargin,
                    left: left
                });
            }
            return self;
        }

        function showWindowNearTarget(id, $target) {
            var data = getWindow(id);
            if (data != null) {
                data.container.show();

                var $container = view.getNode('container');

                var elementSize = {
                    width: data.container.width(),
                    height: data.container.height()
                };

                var targetSizes = {
                    left: $target.offset().left,
                    top: $target.offset().top,
                    width: $target.width(),
                    height: $target.height(),
                };

                var left = (elementSize.width + targetSizes.left > $container.width() && elementSize.width < targetSizes.left - $container.offset().left) ? targetSizes.left + targetSizes.width - elementSize.width : targetSizes.left;

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
            return self;
        }

        function hideWindow(id) {
            view.getNode('container').children('.grid-window-' + id).hide();
            return self;
        }

        function hideWindows() {
            view.getNode('container').children('.grid-window').hide();
            return self;
        }

        function init() {
            view.onDocumentClick.subscribe(hideWindows);
            view.onColumnResizeStart.subscribe(hideWindows);
            return self;
        }

        function destroy() {
            view.onDocumentClick.unsubscribe(hideWindows);
            view.onColumnResizeStart.unsubscribe(hideWindows);

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
        if (view instanceof SmallGrid.View.View === false) {
            throw new TypeError("View is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

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

    function CellEditPlugin(context, settings) {
        var self = this;
        var view = context.view;
        var windowManager = context.windowManager;
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
            return self;
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
        function handleScrollStop(evt) {
            if (isEditMode() === true && settings.plugins.CellEdit.autoFocus === true) {
                if (view.isCellVisible(editOptions.column.id, editOptions.row.id)) {
                    editOptions.editor.focus();
                }
            }
        }

        function handleBeforeRowsRendered(evt) {
            if (isEditMode() === true) {
                editOptions.editor.remove();
            }
        }

        function handleAfterRowsRendered(evt) {
            if (isEditMode() === true) {
                var cellNode = view.getCellNodeById(editOptions.column.id, editOptions.row.id);
                if (cellNode) {
                    cellNode.className += " " + settings.cssClass.cellEdit;
                    editOptions.editor.append(cellNode);
                    if (editOptions.addFocusOnce === true) {
                        editOptions.addFocusOnce = false;
                        editOptions.editor.focus();
                    }
                }
            }
        }

        function handleCellDblClick(evt) {
            if (isEditMode() === true && evt.column.id == editOptions.column.id && evt.row.id == editOptions.row.id) {
                editOptions.editor.focus();
            }

            if (settings.plugins.CellEdit.editOnClick === false) {
                editCellById(evt.column.id, evt.row.id);
            }
        }

        function handleCellClick(evt) {
            if (isEditMode() === true && evt.column.id == editOptions.column.id && evt.row.id == editOptions.row.id) {
                editOptions.editor.focus();
            }

            if (settings.plugins.CellEdit.editOnClick === true) {
                editCellById(evt.column.id, evt.row.id);
            }
        }

        function handleCellKeyDown(evt) {
            if (evt && evt.event) {
                switch (evt.event.keyCode) {
                    case 13:
                        if (evt.event.target && evt.event.target.tagName != "TEXTAREA") {
                            applyEdit();
                        }
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
                    var request = view.suspendRender();

                    editOptions = {
                        enabled: true,
                        addFocusOnce: true,
                        row: row,
                        column: column,
                        editor: new SmallGrid.Cell.Editor.Create(
                            column.editor,
                            {
                                "row": row,
                                "column": column,
                                "value": row.item[column.field],
                                "windowManager": windowManager,
                                "settings": settings
                            },
                            settings
                        ),
                    }

                    self.onCellEdited.notify({
                        row: editOptions.row,
                        column: editOptions.column,
                        editor: editOptions.editor,
                    });

                    view.getModel().getColumnsModel().setColumnPropertyById(
                        column.id,
                        'editMode',
                        true
                    );

                    view.getModel().getRowsModel().setRowPropertyById(
                        row.id,
                        'editMode',
                        true
                    );

                    view.resumeRender(request);

                    if (SmallGrid.Utils.isFunction("append", editOptions.editor)) {
                        //view.render();
                    } else {
                        applyEdit();
                    }
                }
            }
        }

        function getEditor() {
            if (isEditMode() === true) {
                return editOptions.editor;
            }
        }

        function isEditMode() {
            return (editOptions.enabled === true);
        }

        function applyEdit() {
            if (isEditMode() === true) {
                var request = view.suspendRender();

                view.getModel().getColumnsModel().setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = view.getModel().getRowsModel().getRowById(editOptions.row.id);
                if (row) {
                    row.item[editOptions.column.field] = editOptions.editor.getValue();
                    row.editMode = false;
                    view.getModel().getRowsModel().updateRow(row);
                }

                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
                view.resumeRender(request);
                //view.render();
            }
            return self;
        }

        function cancelEdit() {
            if (isEditMode() === true) {
                var request = view.suspendRender();

                view.getModel().getColumnsModel().setColumnPropertyById(
                    editOptions.column.id,
                    'editMode',
                    false
                );

                var row = view.getModel().getRowsModel().getRowById(editOptions.row.id);
                if (row) {
                    row.editMode = false;
                    view.getModel().getRowsModel().updateRow(row);
                }

                editOptions.editor.destroy();
                editOptions = {
                    enabled: false
                }
                view.resumeRender(request);
                //view.render();
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


            "onCellEdited": new SmallGrid.Event.Handler(),

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

    function ColumnFilterMenu(context, settings) {
        var self = this;
        var lastActiveColumnId = null;
        var view = context.view;
        var windowManager = context.windowManager;

        function handleHeaderClick(evt) {
            if (evt && evt.type && evt.type == "filter") {
                evt.stopPropagation();
                lastActiveColumnId = evt.column.id;

                var isVisible = windowManager.isVisible(evt.column.id);
                windowManager.hideWindows();

                if (windowManager.isWindow(evt.column.id) === false) {

                    windowManager.createWindow(
                        evt.column.id,
                        buildElements(evt.column.id),
                        {
                            filter: new SmallGrid.Query.FilterQuery(evt.column.field, settings)
                        }
                    );

                    windowManager.showWindowNearTarget(evt.column.id, $(evt.event.target));
                } else if (isVisible === false) {
                    windowManager.showWindow(evt.column.id);
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
        function handleMenuSubmit(evt) {
            evt.preventDefault();

            var data = windowManager.getWindow(evt.data.id);
            if (data && data.opts) {
                var column = view.getModel().getColumnsModel().getColumnById(evt.data.id);
                if (column) {
                    var filter = data.opts.filter;
                    var formValues = getFormValues(data.container);

                    data.opts.filter.clear();
                    data.opts.filter.add(formValues.type[0], formValues.value[0]);
                    if (formValues.value[1]) {
                        data.opts.filter.add(formValues.operator);
                        data.opts.filter.add(formValues.type[1], formValues.value[1]);
                    }

                    column.headerCssClass += ' ' + settings.cssClass.headerFilterActive;
                    view.getModel().getColumnsModel().updateColumn(column);
                    view.getModel().setFilter(filter);
                    windowManager.hideWindow(evt.data.id);
                }
            }
        }

        function handleMenuClear(evt) {
            var data = windowManager.getWindow(evt.data.id);
            if (data) {
                var column = view.getModel().getColumnsModel().getColumnById(evt.data.id);
                if (column) {
                    column.headerCssClass = column.headerCssClass.replace(' ' + settings.cssClass.headerFilterActive, '');
                    view.getModel().getColumnsModel().updateColumn(column);

                    view.getModel().clearFilter(data.opts.filter);
                    windowManager.hideWindow(evt.data.id);
                }

            }
        }

        function handleMenuClick(evt) {
            evt.stopPropagation();
        }

        function hideWindow() {
            if (lastActiveColumnId != null) {
                windowManager.hideWindow(lastActiveColumnId);
                lastActiveColumnId = null;
            }
        }

        /*
        Init && destroy
        */
        function init() {
            view.onHeaderClick.subscribe(handleHeaderClick);
            view.onScrollStart.subscribe(hideWindow);
            return self;
        }

        function destroy() {
            view.onHeaderClick.unsubscribe(handleHeaderClick);
            view.onScrollStart.unsubscribe(hideWindow);
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

    function ColumnPickerMenu(context, settings) {
        var self = this;
        var currentId = "column-picker";
        var view = context.view;
        var windowManager = context.windowManager;

        function handleHeaderContextMenu(evt) {

            if (evt) {
                evt.preventDefault();

                windowManager.hideWindows();
                if (windowManager.isWindow(currentId) === false) {
                    windowManager.createWindow(currentId, buildElements(currentId));
                } else {
                    var data = windowManager.getWindow(currentId);
                    if (data) {
                        data.container.empty().append(buildElements(currentId));
                    }
                }

                windowManager.showWindowNearPosition(
                    currentId,
                    {
                        x: evt.event.pageX,
                        y: evt.event.pageY
                    },
                    5
                );
            }
        }

        function buildElements(id) {
            var $element = $("<div class='grid-columnpicker-menu'></div>");
            var $content = $('<div class="grid-columnpicker-menucontent"></div>').appendTo($element);

            $element.on("click", { id: id }, handleMenuClick);
            $element.on("mouseenter", { id: id }, handleMenuMouseEnter);

            $(buildContent()).appendTo($content);
            return $element;
        }

        function buildContent() {
            var html = '';
            var columns = view.getModel().getColumnsModel().getColumns();
            for (var i = 0; i < columns.length; i++) {
                html += '<div><label><input type="checkbox" name="" ' + ((columns[i].hidden) ? '' : ' checked ') + ' value="' + columns[i].id + '"/> ' + columns[i].name + '</label></div>';
            }
            return html;
        }

        function checkHiddenColumns(columns) {
            var counter = 0;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].hidden === false) counter++;
                if (counter > 1) return true;
            }
            return false;
        }

        /*
        Handlers
        */
        function handleMenuMouseEnter(evt) {
            $(this).off("mouseleave").on("mouseleave", function () {
                windowManager.hideWindow(evt.data.id);
            });

        }

        function handleMenuClick(evt) {
            evt.stopPropagation();
            if (evt.target) {
                var $checkbox = $(evt.target).closest('input');
                if ($checkbox.length) {
                    if (checkHiddenColumns(view.getModel().getColumns()) === false && $checkbox[0].checked == false) {
                        return false;
                    }
                    view.getModel().getColumnsModel().setColumnPropertyById($checkbox.val(), "hidden", !$checkbox[0].checked);
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

    function ColumnResizePlugin(context, settings) {
        var self = this;
        var view = context.view;
        var windowManager = context.windowManager;

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
            return self;
        }

        function destroy() {
            view.onColumnResize.unsubscribe(handleColumnResize);
            view.onColumnResizeStart.subscribe(handleColumnResizeStart);
            view.onColumnResizeStop.subscribe(handleColumnResizeStop);
        }

        function handleColumnResize(evt) {
            if (column && $lastHeaderCol.length) {
                width = Math.max(
                    Math.min(
                        parseInt(evt.width, 10),
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

        function handleColumnResizeStart(evt) {
            headerWidth = view.getNode('header').width();
            column = view.getModel().getColumnByIndex(evt.cellIndex);
            $headerCursorCells = view.getNode('headerTbody').find("." + settings.cssClass.cursorPointer);
            $headerCol = view.getNode('headerTable').find("colgroup > col:nth-child(" + (evt.cellIndex + 1) + ")");
            $contentCol = view.getNode('contentTable').find("colgroup > col:nth-child(" + (evt.cellIndex + 1) + ")");
            $lastHeaderCol = view.getNode('headerTable').find("colgroup > col:last");
            $lastContentCol = view.getNode('contentTable').find("colgroup > col:last");

            if (column && $lastHeaderCol.length) {

                if (settings.showLastColumn == true && $lastHeaderCol.hasClass(settings.cssClass.collLast)) {
                    $lastHeaderCol.width(0);
                    if ($lastContentCol.length) $lastContentCol.width(0);
                }

                $headerCell = view.getNode('headerTable').find('td.' + settings.cssClass.cellColumnLast);
                if ($headerCell.length) toggleDisabled($headerCell, settings.cssClass.cellColumnLast);

                $contentCell = view.getNode('contentTable').find('td.' + settings.cssClass.cellColumnLast);
                if ($contentCell.length) toggleDisabled($contentCell, settings.cssClass.cellColumnLast);

                toggleDisabled($headerCursorCells, settings.cssClass.cursorPointer);
                view.getNode('viewport').addClass(settings.cssClass.cursorResize);
            }
        }

        function handleColumnResizeStop() {
            if (column) {

                if ($headerCell.length) toggleEnabled($headerCell, settings.cssClass.cellColumnLast);
                if ($contentCell.length) toggleEnabled($contentCell, settings.cssClass.cellColumnLast);


                toggleEnabled($headerCursorCells, settings.cssClass.cursorPointer);
                view.getNode('viewport').removeClass(settings.cssClass.cursorResize);

                if (width) {
                    view.getModel().getColumnsModel().setColumnPropertyById(
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

    function ColumnSortPlugin(context, settings) {
        var self = this;
        var view = context.view;
        var windowManager = context.windowManager;

        function init() {
            view.onHeaderClick.subscribe(handleHeaderClick);
            return self;
        }

        function destroy() {
            view.onHeaderClick.unsubscribe(handleHeaderClick);
        }

        function handleHeaderClick(evt) {
            if (evt && evt.type && evt.type == "sort") {
                var request = view.suspendRender();
                var column = evt.column;
                var sortOrder = SmallGrid.Utils.changeSortOrder(column.sortOrder);
                view.getModel().getColumnsModel().setColumnsProperty("sortOrder", 0);//reset sorting
                view.getModel().getColumnsModel().setColumnPropertyById(column.id, "sortOrder", sortOrder);
                view.getModel().setSorter(new SmallGrid.Query.SorterQuery(column.field, sortOrder, column.sortComparer));
                view.resumeRender(request);
                //view.render();
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

    function RowSelectionPlugin(context, settings) {
        var self = this;
        var view = context.view;
        var rowsModel = context.viewModel.getRowsModel();
        var windowManager = context.windowManager;
        var selectedRowIds = [];
        var lastFocusedRowId = null;

        function init() {
            view.onCellClick.subscribe(handleCellClick);
            return self;
        }

        function destroy() {
            view.onCellClick.unsubscribe(handleCellClick);
        }

        function handleCellClick(evt) {
            var request = view.suspendRender();
            if (evt.event.shiftKey === true && settings.plugins.RowSelection.multipleRowSelection === true && lastFocusedRowId && lastFocusedRowId != evt.row.id) {
                clearSelectedRows(selectedRowIds);

                var lastFocusedRow = rowsModel.getRowById(lastFocusedRowId);
                var currentRow = rowsModel.getRowById(evt.row.id);

                if (lastFocusedRow && currentRow) {
                    selectRowsRange(lastFocusedRowId, evt.row.id);
                }

            } else if (evt.event.ctrlKey === true && settings.plugins.RowSelection.multipleRowSelection) {
                if (isRowSelected(evt.row.id) === false) {
                    selectRowById(evt.row.id);
                } else {
                    clearSelectedRow(evt.row.id);
                }
            } else {
                var clearRowsIds = selectedRowIds.slice();
                var selectedIndex = clearRowsIds.indexOf(evt.row.id);

                if (selectedIndex === -1) {
                    selectRowById(evt.row.id);
                } else {
                    clearRowsIds.splice(selectedIndex, 1);
                }

                clearSelectedRows(clearRowsIds);
            }
            view.resumeRender(request);

            if (evt.event.shiftKey === false) lastFocusedRowId = evt.row.id;
        }

        function selectRowsRange(id1, id2) {
            var lastFocusedIndex = rowsModel.getRowIndexById(id1);
            var currentRowIndex = rowsModel.getRowIndexById(id2);
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
                selectedRowIds.push(row.id);
                rowsModel.setRowPropertyById(
                    row.id,
                    'rowCssClass',
                    row.rowCssClass + ' ' + settings.cssClass.rowSelected
                );
            }
        }

        function selectRowByIndex(idx) {
            selectRow(
                rowsModel.getRowByIndex(idx)
            );
            return self;
        }

        function selectRowById(id) {
            selectRow(
                rowsModel.getRowById(id)
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
            var row = rowsModel.getRowById(id);
            if (row) {
                rowsModel.setRowPropertyById(
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
    throw new Error("Small grid requires jquery module to be loaded.");
}
if (typeof SmallGrid === "undefined") {
    throw new Error("Small grid required to be loaded.");
}

(function ($) {
    "use strict";
    var defaultSettings = {
        renderDelay: 0,
        showLastColumn: false,//show last column
        uidPrefix: "smallgrid_",
        resizeColumnsOnLoad: false,//resize columns when view loaded to fit canvas
        maxSupportedCssHeight: undefined,//internal
        scrollbarDimensions: undefined,//internal
        cellOuterSize: undefined,//internal
        viewportDimensions:undefined,//internal
        uid: undefined,//internal
        cssClass: {
            disableTextSelection: "disable-text-selection",
            cell: "grid-cell",
            cellEdit: "grid-cell-edit",
            cellColumnLast: "grid-cell-column-last",
            cellRowLast: "grid-cell-row-last",
            col: "grid-col",
            collLast: "grid-coll-last",
            cursorPointer: "grid-cursor-pointer",
            cursorResize: "grid-cursor-resize disable-text-selection",
            headerCell: "grid-header-cell",
            headerCellDiv: "grid-header-cell-div",
            headerColumnName: "grid-column-name",
            headerFilter: "grid-header-filter",
            headerFilterActive: "grid-header-filter-active",
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
                    currency: 'EUR',
                    style: 'currency'
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
                multipleRowSelection: false//allow multiplerow selection
            },
            CellEdit: {
                editOnClick: false,//when true, editor loaded after click
                autoFocus: true//autofocus edited cell when scrolling
            },
            ColumnFilterMenu: {},
            ColumnPickerMenu: {},
        }
    };

    function CreateSettings(settings) {

        var settings = $.extend(true, {}, defaultSettings, settings || {});

        if (settings.viewportDimensions == undefined) {
            defaultSettings.viewportDimensions = settings.viewportDimensions = SmallGrid.Utils.measureViewport();
        }

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