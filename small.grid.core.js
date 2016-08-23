(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Callback": {
            "Handler": CallbackHandler,
            "Create": Create,
        }
    });

    function CallbackHandler() {
        this.handlers = [];
        this.isLocked = false;
        this.lockedData = [];
    }

    CallbackHandler.prototype.subscribe = function (func) {
        if ($.isFunction(func)) {
            this.handlers.push(func);
        }
        return this;
    };

    CallbackHandler.prototype.unsubscribe = function (func) {
        for (var i = this.handlers.length - 1; i >= 0; i--) {
            if (this.handlers[i] === func) {
                this.handlers.splice(i, 1);
            }
        }
        return this;
    };

    CallbackHandler.prototype.unsubscribeAll = function () {
        this.handlers = [];
        return this;
    };

    CallbackHandler.prototype.notify = function () {
        var result = arguments[0];

        if (this.isLocked === true) {
            this.lockedData.push(result);
            return result;
        }

        for (var i = 0; i < this.handlers.length; i++) {
            result = this.handlers[i].apply(null, arguments);
        }
        return result;
    };

    CallbackHandler.prototype.lock = function () {
        this.isLocked = true;
        this.lockedData = [];
    };

    CallbackHandler.prototype.notifyLocked = function () {
        this.isLocked = false;
        return this.notify({ data: this.lockedData });
    };


    function Create() {
        return new CallbackHandler();
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Cell": {
            "Editor": {
                "Create": CreateEditor,
                "Checkbox": CheckboxEditor,
                "Float": FloatEditor,
                "Integer": IntegerEditor,
                "Text": TextEditor,
                "Select": SelectEditor
            }
        }
    });

    function CheckboxEditor(context, settings) {
        var self = this,
            value = !context.value;

        this.destroy = function () { };

        this.getValue = function () {
            self.onChange.notify({
                "value": value
            });
            return value;
        };

        $.extend(this, {
            "onInitialize": SmallGrid.Callback.Create(),
            "onChange": SmallGrid.Callback.Create(),
            "onDestroy": SmallGrid.Callback.Create()
        });

        self.onInitialize.notify({
            "value": context.value
        });
    }

    function FloatEditor(context, settings) {
        var self = this,
            value = context.value,
            $element = $('<input type="text" class="grid-float-editor" />').val(value).width(context.column.width);

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
            $element = undefined;
            self.onDestroy.notify({});
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
            "onInitialize": SmallGrid.Callback.Create(),
            "onChange": SmallGrid.Callback.Create(),
            "onDestroy": SmallGrid.Callback.Create()
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function IntegerEditor(context, settings) {
        var self = this,
            value = context.value,
            $element = $('<input type="text" class="grid-integer-editor" />').val(value).width(context.column.width);

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
            $element = undefined;
            self.onDestroy.notify({});
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
            "onInitialize": SmallGrid.Callback.Create(),
            "onChange": SmallGrid.Callback.Create(),
            "onDestroy": SmallGrid.Callback.Create()
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function TextEditor(context, settings) {
        var self = this,
            value = context.value,
            $element = $('<input type="text" class="grid-text-editor"/>').val(value).width(context.column.width);

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
            $element = undefined;
            self.onDestroy.notify({});
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
            "onInitialize": SmallGrid.Callback.Create(),
            "onChange": SmallGrid.Callback.Create(),
            "onDestroy": SmallGrid.Callback.Create()
        });

        self.onInitialize.notify({
            "value": value
        });
    }


    function SelectEditor(context, settings) {
        var self = this,
            option = context.value || { text: "", value: "" },
            $element = $('<select class="grid-select-editor"/>');

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
            $element = undefined;
            self.onDestroy.notify({});
        };

        this.getValue = function () {
            return { text: $element.find('option:selected').text(), value: $element.val() };
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

        this.setSource = function (values) {
            if (values.constructor === Array) {
                var options = '';
                var selected = false;
                for (var i = 0; i < values.length; i++) {
                    selected = option.value === values[i].value;
                    options += '<option value="' + values[i].value + '"' + (selected ? " selected" : "") + '>' + values[i].text + '</option>';
                }
                $element.append(options);
            }
        };

        $.extend(this, {
            "onInitialize": SmallGrid.Callback.Create(),
            "onChange": SmallGrid.Callback.Create(),
            "onDestroy": SmallGrid.Callback.Create()
        });

        self.onInitialize.notify({
            "value": option
        });
    }

    function CreateEditor(name, context, settings) {
        if (!name.length) {
            throw new TypeError("Editor name is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        if (SmallGrid.Utils.isFunction(name, SmallGrid.Cell.Editor) === false) {
            throw new TypeError("name is not defined");
        }

        return new SmallGrid.Cell.Editor[name](context, settings);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
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
                "Text": defaultFormatter
            }
        }
    });

    function defaultFormatter(value, column, row, settings) {
        return value != null ? value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;") : "";
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

    function selectFormatter(value, column, row, settings) {
        if (value instanceof Object) {
            return value.text;
        } 
        return value;
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Column": {
            "Comparer": {
                "Default": mixedComparer,
                "Date": dateComparer,
                "Number": numberComparer,
                "String": stringComparer,
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
            var x = (settings.field in a.item && typeof a.item[settings.field] === 'string') ? a.item[settings.field].toLowerCase() : null,
                y = (settings.field in b.item && typeof b.item[settings.field] === 'string') ? b.item[settings.field].toLowerCase() : null;
            return x.localeCompare(y) * sortOrder;
        };
    }

    function stringComparer(settings) {
        var sortOrder = settings.sortOrder;
        return function (a, b) {
            var x = (settings.field in a.item && typeof a.item[settings.field] === 'string') ? a.item[settings.field].toLowerCase() : null,
                y = (settings.field in b.item && typeof b.item[settings.field] === 'string') ? b.item[settings.field].toLowerCase() : null;

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

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Column": {
            "Create": CreateModel,
            "Model": ColumnModel,
            "ColumnData": ColumnData
        }
    });

    function ColumnData() { }
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

        this.items = {

            addItem: function (item) {
                addColumn(createColumn(item));
                return self;
            },

            addItems: function (items) {
                if (items.length) {
                    self.onChange.lock();
                    for (var i = 0; i < items.length; i++) {
                        self.items.addItem(items[i]);
                    }
                    self.onChange.notifyLocked();
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
                    self.onChange.lock();
                    data = [];
                    for (var i = 0; i < items.length; i++) {
                        self.items.addItem(items[i]);
                    }
                    self.onChange.notifyLocked();
                }
                return self;
            },

            updateItemById: function (id, item) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id === id) {
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
        };

        function destroy() {
            data = [];
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
                data.sort(comparer);
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
                self.onChange.lock();
                for (var i = 0; i < columns.length; i++) {
                    addColumn(columns[i]);
                }

                self.onChange.notifyLocked();
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
                if (data[i].id === id) {
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
                self.onChange.lock();
                data = [];
                self.onChange.notifyLocked();
            }
            return self;
        }

        function getColumnById(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id === id) {
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
                if (data[i].id === id) {
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
                if (data[i].id === id) {
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
                self.onChange.lock();
                data = [];
                for (var i = 0; i < columns.length; i++) {
                    addColumn(columns[i]);
                }

                self.onChange.notifyLocked();
            }
            return self;
        }

        function setColumnsProperty(propertyName, propertyValue) {
            self.onChange.lock();
            for (var i = 0; i < data.length; i++) {
                data[i][propertyName] = propertyValue;
                self.onChange.notify({ "id": data[i].id });
            }
            self.onChange.notifyLocked();
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
                    if (data[i].id === id) {
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
                self.onChange.lock();
                for (var i = 0; i < columns.length; i++) {
                    updateColumn(columns[i]);
                }
                self.onChange.notifyLocked();
            }
            return self;
        }

        function createColumn(item) {
            if (item instanceof Object) {
                var column = new ColumnData();

                if (SmallGrid.Utils.isProperty(settings.columns.idProperty, column)) {
                    column.id = column[settings.columns.idProperty];
                } else if (settings.columns.newIdType === "number") {
                    column.id = SmallGrid.Utils.createId();
                } else {
                    column.id = SmallGrid.Utils.createGuid();
                }

                column.name = item.name;
                column.field = item.field;
                column.item = item;

                if ("align" in item) column.align = item.align;
                if ("cellCssClass" in item) column.cellCssClass = item.cellCssClass;
                if ("editable" in item) column.editable = item.editable;
                if ("editor" in item) column.editor = item.editor;
                if ("editMode" in item) column.editMode = item.editMode;
                if ("filterable" in item) column.filterable = item.filterable;
                if ("formatter" in item) column.formatter = item.formatter;
                if ("headerCssClass" in item) column.headerCssClass = item.headerCssClass;
                if ("hidden" in item) column.hidden = item.hidden;
                if ("maxWidth" in item) column.maxWidth = item.maxWidth;
                if ("minWidth" in item) column.minWidth = item.minWidth;
                if ("resizeable" in item) column.resizeable = item.resizeable;
                if ("sortable" in item) column.sortable = item.sortable;
                if ("sortOrder" in item) column.sortOrder = item.sortOrder;
                if ("sortComparer" in item) column.sortComparer = item.sortComparer;
                if ("width" in item) column.width = item.width;

                return column;
            }
        }

        $.extend(this, {
            "destroy": destroy,

            "onChange": SmallGrid.Callback.Create(),

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
            "updateColumns": updateColumns
        });
    }

    function CreateModel(data, settings) {
        if (Array.isArray(data) === false) {
            throw new TypeError("Data is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        return new ColumnModel(settings).items.addItems(data);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Event": {
            "Data": EventData,
            "Handler": EventHandler,
            "Create": Create
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
            if (data && "event" in data && typeof data.event.preventDefault === "function") {
                data.event.preventDefault();
            }
            isDefaultPrevented = true;
        };

        this.isDefaultPrevented = function () {
            return isDefaultPrevented;
        };

        this.stopPropagation = function () {
            if (data && "event" in data && typeof data.event.stopPropagation === "function") {
                data.event.stopPropagation();
            }
            isPropagationStopped = true;
        };

        this.isPropagationStopped = function () {
            return isPropagationStopped;
        };

        this.stopImmediatePropagation = function () {
            if (data && "event" in data && typeof data.event.stopImmediatePropagation === "function") {
                data.event.stopImmediatePropagation();
            }
            isImmediatePropagationStopped = true;
        };

        this.isImmediatePropagationStopped = function () {
            return isImmediatePropagationStopped;
        };
    }

    function EventHandler() {
        this.handlers = [];
    }

    EventHandler.prototype.subscribe = function (func) {
        if ($.isFunction(func)) {
            this.handlers.push(func);
        }
        return this;
    };

    EventHandler.prototype.unsubscribe = function (func) {
        for (var i = this.handlers.length - 1; i >= 0; i--) {
            if (this.handlers[i] === func) {
                this.handlers.splice(i, 1);
            }
        }
        return this;
    };

    EventHandler.prototype.unsubscribeAll = function () {
        this.handlers = [];
        return this;
    };

    EventHandler.prototype.notify = function (eventData) {
        if (typeof eventData !== EventData) {
            eventData = new EventData(eventData);
        }

        for (var i = 0; i < this.handlers.length && eventData.isImmediatePropagationStopped() === false; i++) {
            if (this.handlers[i].call(null, eventData) === false) {
                this.stopImmediatePropagation();
                break;
            }
        }
    };


    function Create() {
        return new EventHandler();
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Grid": {
            "Create": CreateModel,
            "Model": GridModel
        }
    });

    function GridModel($container, context, settings) {
        var self = this,
            plugins = {},
            version = "0.6.2 beta",
            id = SmallGrid.Utils.createGuid();

        /*
         * Init & Destroy
         */
        function init() {
            registerPlugins(settings.plugins);

            var contextKeys = ["windowManager", "view", "viewModel"];
            for (var i = 0; i < contextKeys.length; i++) {
                context[contextKeys[i]].init();
            }

            self.onInitialize.notify({});
            return self;
        }

        function destroy() {
            unregisterPlugins();

            var contextKeys = ["windowManager", "view", "viewModel", "rowsModel", "columnsModel"];
            for (var i = 0; i < contextKeys.length; i++) {
                context[contextKeys[i]].destroy();
                delete context[contextKeys[i]];
            }

            self.onDestroy.notify({});
        }
        /*
         * WindowManager
         */
        function getWindowManager() {
            return context.windowManager;
        }

        /*
         * View
         */
        function getView() {
            return context.view;
        }

        /*
         * View model
         */
        function getViewModel() {
            return context.viewModel;
        }

        function getRowsModel() {
            return context.rowsModel;
        }

        function getColumnsModel() {
            return context.columnsModel;
        }

        /*
         * Settings
         */
        function getSettings() {
            return settings;
        }

        /*
         * Plugins
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

            var plugin = SmallGrid.Plugins.Create(
                name,
                context,
                settings,
                pluginSettings
            );

            if (!plugin) {
                throw new Error("Plugin is not defined.");
            }

            plugins[name] = plugin;
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
         * Other
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

            "onInitialize": SmallGrid.Callback.Create(),
            "onDestroy": SmallGrid.Callback.Create()
        });
    }

    function CreateModel($container, rows, columns, options, autoInit) {
        var settings = SmallGrid.Settings.Create(options || {});
        var rowsModel = SmallGrid.Row.Create(rows || [], settings);
        var columnsModel = SmallGrid.Column.Create(columns || [], settings);
        var viewModel = SmallGrid.View.Model.Create(rowsModel, columnsModel, settings, false);
        var view = SmallGrid.View.Create($container, viewModel, settings, false);
        var windowManager = SmallGrid.View.Window.Create(view, settings, false);

        var grid = new GridModel(
            $container,
            {
                "columnsModel": columnsModel,
                "rowsModel": rowsModel,
                "view": view,
                "viewModel": viewModel,
                "windowManager": windowManager
            },
            settings
        );

        if (autoInit !== false) grid.init();

        return grid;

    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Handler": {
            "Click": {
                "Create": Create,
                "Handler": ClickHandler
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
                            event: evt
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
            var cellEvt = getCellEvent(evt);
            if (cellEvt && settings.handleClick) {
                settings.handleClick(cellEvt);
            }
        }

        function handleContextMenu(evt) {
            var cellEvt = getCellEvent(evt);
            if (cellEvt && settings.handleContextMenu) {
                settings.handleContextMenu(cellEvt);
            }
        }

        function handleDblClick(evt) {
            var cellEvt = getCellEvent(evt);
            if (cellEvt && settings.handleDblClick) {
                settings.handleDblClick(cellEvt);
            }
        }

        function handleKeyDown(evt) {
            var cellEvt = getCellEvent(evt);
            if (cellEvt && settings.handleKeyDown) {
                settings.handleKeyDown(cellEvt);
            }
        }

        function destroy() {
            $container
                .off("click", handleClick)
                .off("mousedown", handleMouseDown)
                .off("contextmenu", handleContextMenu)
                .off("dblclick", handleDblClick)
                .off("keydown", handleKeyDown);

            var settingsKeys = Object.keys(settings);
            for (var i = 0; i < settingsKeys.length; i++) {
                delete settings[settingsKeys[i]];
            }
        }

        $.extend(this, {
            "destroy": destroy
        });
    }

    function Create($container, options) {
        if (!$container.length) {
            throw new TypeError("Container is not defined or does not exist in the DOM.");
        }

        if ($container.length !== 1) {
            throw new TypeError("There should be only 1 container.");
        }

        var defaultSettings = {
            "rowIdentifier": "TR",
            "cellIdentifier": "TD",
            "handleClick": undefined,
            "handleDblClick": undefined,
            "handleContextMenu": undefined,
            "handleKeyDown": undefined
        };

        var settings = $.extend({}, defaultSettings, options);

        return new ClickHandler($container, settings);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Handler": {
            "Resize": {
                "Create": Create,
                "Handler": ResizeHandler
            }
        }
    });

    function ResizeHandler($container, settings) {
        var $cellElement, cellIndex, pageX, canBeMoved = false;

        $container.on("mousedown", settings.handlerIdentifier, handleMouseDown);
        $(document).on("mousemove", handleMouseMove).on("mouseup", handleMouseUp);

        function handleMouseDown(evt) {
            $cellElement = $(this).closest(settings.cellIdentifier);
            if ($cellElement.length) {
                cellIndex = $cellElement.index();
                pageX = evt.pageX;
                settings.handleResizeStart({
                    cellElement: $cellElement,
                    cellIndex: cellIndex,
                    event: evt
                });

                canBeMoved = true;
            }
        }

        function handleMouseMove(evt) {
            if (canBeMoved) {
                var newWidth = evt.pageX - $cellElement.offset().left;
                if (newWidth > 0) {
                    settings.handleResize({
                        cellElement: $cellElement,
                        cellIndex: cellIndex,
                        xDelta: evt.pageX - pageX,
                        width: newWidth,
                        event: evt
                    });
                }
            }
        }

        function handleMouseUp(evt) {
            if (canBeMoved) {
                canBeMoved = false;

                settings.handleResizeStop({
                    cellElement: $cellElement,
                    cellIndex: cellIndex,
                    event: evt
                });
            }
        }

        function destroy() {
            $container.off('mousedown', handleMouseDown);
            $(document).off("mousemove", handleMouseMove).off("mouseup", handleMouseUp);
            $cellElement = undefined;

            var settingsKeys = Object.keys(settings);
            for (var i = 0; i < settingsKeys.length; i++) {
                delete settings[settingsKeys[i]];
            }
        }

        $.extend(this, {
            "destroy": destroy
        });
    }

    function Create($container, options) {
        if (!$container.length) {
            throw new TypeError("Container is not defined or does not exist in the DOM.");
        }

        if ($container.length !== 1) {
            throw new TypeError("There should be only 1 container.");
        }

        var defaultSettings = {
            "cellIdentifier": "TD",
            "handleResize": undefined,
            "handleResizeStart": undefined,
            "handleResizeStop": undefined,
            "handlerIdentifier": undefined
        };

        var settings = $.extend({}, defaultSettings, options);

        return new ResizeHandler($container, settings);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Handler": {
            "Scroll": {
                "Create": Create,
                "Handler": ScrollHandler
            }
        }
    });

    function ScrollHandler($container, settings) {

        if (settings.resetTop) {
            $container[0].scrollTop = 0;
        }
        if (settings.resetLeft) {
            $container[0].scrollLeft = 0;
        }

        var scrollStopTimer, wheelStopTimer,
            isScrollMoved = false, isWheelMoved = false,
            lastScroll = {
                scrollTop: $container[0].scrollTop,
                scrollLeft: $container[0].scrollLeft
            };

        $container.on('scroll', handleScroll);
        $container.on('wheel', handleMouseWheel);

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
                scrollTop: $container[0].scrollTop,
                scrollLeft: $container[0].scrollLeft,
                topDelta: $container[0].scrollTop - lastScroll.scrollTop,
                leftDelta: $container[0].scrollLeft - lastScroll.scrollLeft,
                event: evt
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
                scrollLeft: scroll.scrollLeft
            };
        }

        function destroy() {
            clearTimeout(scrollStopTimer);
            clearTimeout(wheelStopTimer);

            $container.off('scroll', handleScroll);
            $container.off('wheel', handleMouseWheel);

            var settingsKeys = Object.keys(settings);
            for (var i = 0; i < settingsKeys.length; i++) {
                delete settings[settingsKeys[i]];
            }
        }

        $.extend(this, {
            "destroy": destroy
        });
    }

    function Create($container, options) {
        if (!$container.length) {
            throw new TypeError("Container is not defined or does not exist in the DOM.");
        }

        if ($container.length !== 1) {
            throw new TypeError("There should be only 1 container.");
        }

        var defaultSettings = {
            "handleMouseWheel": undefined,
            "handleMouseWheelStart": undefined,
            "handleMouseWheelStop": undefined,
            "handlescroll": undefined,
            "handlescrollStart": undefined,
            "handlescrollStop": undefined,
            "latency": 300,
            "resetLeft": true,
            "resetTop": true
        };

        var settings = $.extend({}, defaultSettings, options);

        return new ScrollHandler($container, settings);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Handler": {
            "Shared": {
                "GetInstance": GetInstance,
                "Handler": SharedHandler
            }
        }
    });

    function SharedHandler(settings) {
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
            }, settings.latency);
        }

        function getSettings() {
            return settings;
        }

        function destroy() {
            clearTimeout(resizeTimer);
            $(window)
                .off("click", handleClick)
                .off("contextmenu", handleContextMenu)
                .off("resize", handleResize);
        }

        $.extend(this, {
            "onClick": SmallGrid.Event.Create(),
            "onContextMenu": SmallGrid.Event.Create(),
            "onResize": SmallGrid.Event.Create(),
            "getSettings": getSettings,
            "destroy": destroy
        });
    }

    var handler;

    function GetInstance(options) {
        if (!handler) {
            var defaultSettings = {
                "latency": 400
            };

            var settings = $.extend({}, defaultSettings, options);

            handler = new SharedHandler(settings);
        }

        return handler;
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "Create": Create
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

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Query": {
            "Column": {
                "Request": Request,
                "Create": Create
            }
        }
    });

    function Request(dataModel) {

        function columnsRangeByWidth(center, width, outerWidth) {
            var calcWidth = 0, inRange = false, min = center - width - outerWidth, max = center + 2 * width + outerWidth, filterIndex = 0;
            return function (item, index, array) {
                if (item.hidden === true) return false;
                filterIndex++;

                inRange = min <= calcWidth && calcWidth <= max;
                calcWidth += outerWidth + item.width;

                if (inRange || (min <= calcWidth && calcWidth <= max)) {
                    item.calcWidth = calcWidth;
                    item.calcIndex = filterIndex;
                    return true;
                }

                return false;
            };
        }

        function getColumnsInRange(left, width, outerWidth) {
            return dataModel.filter(columnsRangeByWidth(left, width, outerWidth));
        }

        function getColumnsTotal(width) {
            var total = {
                width: 0,
                count: 0
            };
            var columns = dataModel.getColumns();

            for (var i = 0; i < columns.length; i++) {
                if (columns[i].hidden === true) continue;
                total.width += columns[i].width + width;
                total.count++;
            }

            return total;
        }

        $.extend(this, {
            "getColumnsInRange": getColumnsInRange,
            "getColumnsTotal": getColumnsTotal
        });
    }

    function Create(dataModel) {
        if (dataModel instanceof SmallGrid.Column.Model === false) {
            throw new TypeError("Column model is not defined.");
        }

        return new SmallGrid.Query.Column.Request(dataModel);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Query": {
            "Filter": FilterQuery
        }
    });

    function FilterQuery(field) {
        var self = this,
            query = [],
            id = SmallGrid.Utils.createGuid();

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
            "startswith": startswith
        });
    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Query": {
            "Row": {
                "Request": Request,
                "Create": CreateRequest
            }
        }
    });

    function Request(dataModel) {

        function getConvertedQuery(field, val, action) {
            var result = "";
            var value = val.replace(/'/g, "\\'");

            switch (action) {
                case 'and':
                    result += " && ";
                    break;
                case 'or':
                    result += " || ";
                    break;

                case 'eq':
                    result += " (item.item['" + field + "'] == '" + value + "') === true ";
                    break;

                case 'neq':
                    result += " (item.item['" + field + "'] == '" + value + "') === false ";
                    break;

                case 'startsWith':
                    result += " (('' + item.item['" + field + "']).indexOf('" + value + "') === 0) === true ";
                    break;

                case 'endsWith':
                    result += " (('' + item.item['" + field + "']).indexOf('" + value + "', item.item['" + field + "'].length - '" + value + "'.length) !== -1) === true ";
                    break;

                case 'contains':
                    result += " (('' + item.item['" + field + "']).indexOf('" + value + "') !== -1) === true ";
                    break;

                case 'doesNotContain':
                    result += " (('' + item.item['" + field + "']).indexOf('" + value + "') !== -1) === false ";
                    break;
            }

            return result;
        }

        function getFilterFunc(filters) {
            var resultQuery = "";

            for (var i = 0; i < filters.length; i++) {
                var queries = filters[i].get(),
                    field = filters[i].getField(),
                    convertedQuery = "";

                for (var ii = 0; ii < queries.length; ii++) {
                    convertedQuery += getConvertedQuery(field, queries[ii].value, queries[ii].action);
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

        function rowsRangeByHeight(center, height, outerHeight, filter) {
            var calcHeight = 0, inRange = false, min = center - height - outerHeight, max = center + 2 * height + outerHeight, filterIndex = 0;
            return function (item, index, array) {
                if (filter && (filter(item) === false) || (item.hidden === true)) return false;
                filterIndex++;

                inRange = min <= calcHeight && calcHeight <= max;
                calcHeight += outerHeight + item.height;

                if (inRange || (min <= calcHeight && calcHeight <= max)) {
                    item.calcHeight = calcHeight;
                    item.calcIndex = filterIndex;
                    return true;
                }

                return false;
            };
        }

        /* 
         * Public API
         */
        function getRowsInRange(top, height, outerHeight, sorters, filters) {
            for (var i = 0; i < sorters.length; i++) {
                dataModel.sort(
                    SmallGrid.Column.Comparer[sorters[i].getSortComparer()]({
                        "sortOrder": sorters[i].getSortOrder(),
                        "field": sorters[i].getField()
                    })
                );
            }

            return dataModel.filter(rowsRangeByHeight(top, height, outerHeight, getFilterFunc(filters)));
        }

        function getRowsTotal(height, filters) {
            var total = {
                height: 0,
                count: 0
            };
            var rows = dataModel.getRows();
            var filter = getFilterFunc(filters);

            for (var i = 0; i < rows.length; i++) {
                if ((filter && (filter(rows[i]) === false)) || (rows[i].hidden === true)) continue;
                total.height += rows[i].height + height;
                total.count++;
            }
            return total;
        }

        $.extend(this, {
            "getRowsInRange": getRowsInRange,
            "getRowsTotal": getRowsTotal
        });
    }

    function CreateRequest(dataModel) {
        if (dataModel instanceof SmallGrid.Row.Model === false) {
            throw new TypeError("Rows model is not defined.");
        }

        return new SmallGrid.Query.Row.Request(dataModel);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Query": {
            "Sorter": SorterQuery
        }
    });

    function SorterQuery(field, sortOrder, sortComparer) {
        var self = this,
            id = SmallGrid.Utils.createGuid();

        function getId() {
            return id;
        }

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
            "getId": getId,
            "getField": getField,
            "getSortOrder": getSortOrder,
            "getSortComparer": getSortComparer
        });
    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Row": {
            "Create": CreateModel,
            "Model": RowModel,
            "RowData": RowData
        }
    });

    function RowData() { }
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

        this.items = {

            addItem: function (item) {
                addRow(createRow(item));
                return self;
            },

            addItems: function (items) {
                if (items.length) {
                    self.onChange.lock();
                    for (var i = 0; i < items.length; i++) {
                        self.items.addItem(items[i]);
                    }
                    self.onChange.notifyLocked();
                }
                return self;
            },

            deleteItems: function () {
                return deleteRows();
            },

            deleteItemById: function (id) {
                return deleteRowById(id);
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
                    self.onChange.lock();
                    data = [];
                    for (var i = 0; i < items.length; i++) {
                        self.items.addItem(items[i]);
                    }
                    self.onChange.notifyLocked();
                }
                return self;
            },

            updateItemById: function (id, item) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id === id) {
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
        };

        function destroy() {
            data = [];
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
                data.sort(comparer);
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
         * Batch updates
         */
        function addRows(rows) {
            if (rows.length) {
                self.onChange.lock();
                for (var i = 0; i < rows.length; i++) {
                    addRow(rows[i]);
                }
                self.onChange.notifyLocked();
            }
            return self;
        }


        function updateRows(rows) {
            if (rows.length) {
                self.onChange.lock();
                for (var i = 0; i < rows.length; i++) {
                    updateRow(rows[i]);
                }
                self.onChange.notifyLocked();
            }
            return self;
        }

        function setRows(rows) {
            if (rows.length) {
                self.onChange.lock();
                data = [];
                for (var i = 0; i < rows.length; i++) {
                    addRow(rows[i]);
                }
                self.onChange.notifyLocked();
            }
            return self;
        }

        function setRowsProperty(propertyName, propertyValue) {
            self.onChange.lock();
            for (var i = 0; i < data.length; i++) {
                data[i][propertyName] = propertyValue;
                self.onChange.notify({ "id": data[i].id });
            }
            self.onChange.notifyLocked();
            return self;
        }


        function deleteRows() {
            if (data.length) {
                self.onChange.lock();
                data = [];
                self.onChange.notifyLocked();
            }
            return self;
        }

        /*
         * Single updates
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
                if (data[i].id === id) {
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
                if (data[i].id === id) {
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
                if (data[i].id === id) {
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
                if (data[i].id === id) {
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
                    if (data[i].id === id) {
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

        function createRow(item) {
            if (item instanceof Object) {
                var row = new RowData();

                if (SmallGrid.Utils.isProperty(settings.rows.idProperty, item)) {
                    row.id = item[settings.rows.idProperty];
                }else if (settings.rows.newIdType === "number") {
                    row.id = SmallGrid.Utils.createId();
                } else {
                    row.id = SmallGrid.Utils.createGuid();
                }

                row.item = item;

                if ("cellCssClass" in item) row.cellCssClass = item.cellCssClass;
                if ("disabled" in item) row.disabled = item.disabled;
                if ("editable" in item) row.editable = item.editable;
                if ("editMode" in item) row.editMode = item.editMode;
                if ("height" in item) row.height = item.height;
                if ("hidden" in item) row.hidden = item.hidden;
                if ("maxHeight" in item) row.maxHeight = item.maxHeight;
                if ("minHeight" in item) row.minHeight = item.minHeight;
                if ("rowCssClass" in item) row.rowCssClass = item.rowCssClass;

                return row;
            }
        }

        $.extend(this, {
            "destroy": destroy,

            "onChange": SmallGrid.Callback.Create(),

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
            "updateRows": updateRows
        });
    }

    function CreateModel(data, settings) {
        if (Array.isArray(data) === false) {
            throw new TypeError("Data is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        return new RowModel(settings).items.addItems(data);
    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
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
        var $table = $("<table class='grid-content-table' style='position:absolute; top:-100px; left:-100px;'><tbody><tr><td class='" + cssClass + "' style='width:5px; height:5px;'>-</td></tr></tbody></table>").appendTo(document.body);
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

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "View": {
            "Builder": {
                "Create": Create,
                "Builder": Builder
            }
        }
    });

    function Builder(settings) {
        var self = this;

        /*
         * Structure
         */
        function buildViewPortElements($container) {
            var el = {
                'headerCol': null,
                'headerTbody': null,
                'headerTable': null,
                'headerWrap': null,
                'contentCol': null,
                'contentTbody': null,
                'contentTable': null,
                'contentWrap': null,
                'header': null,
                'content': null,
                'footer': null,
                'preload': null,
                'viewport': null,
                'container': $container
            };

            //create
            el['viewport'] = $("<div class='grid-viewport'/>");
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
         * Header columns
         */
        function buildHeaderColumnsHtml(columns, opts) {
            var html = "<tr class='" + settings.cssClass.headerRow + "'>";
            for (var i = 0, length = columns.length - 1; i <= length; i++) {
                html += buildHeaderColumnHtml(columns[i], opts, length === i);
            }

            if (opts.virtualColumnWidth >= 0 && settings.showLastColumn === true) {
                html += buildLastHeaderColumn(columns[i - 1], opts);
            }

            return html + "</tr>";
        }

        function buildHeaderColumnCss(column, opts, isLastColumn) {
            var cellCssClass = [settings.cssClass.headerCell];

            if (column.headerCssClass) {
                cellCssClass.push(column.headerCssClass);
            }

            if (isLastColumn && opts.hideColumnBorder) {
                cellCssClass.push(settings.cssClass.cellColumnLast);
            }

            if (column.sortable || column.filterable) {
                cellCssClass.push(settings.cssClass.cursorPointer);
            }

            return self.onHeaderColumnCss.notify(cellCssClass, { column: column, opts: opts, isLastColumn: isLastColumn }).join(" ");
        }

        function buildHeaderColumnHtml(column, opts, isLastColumn) {
            var html;

            html = "<td style='height:" + settings.header.height + "px' class='" + buildHeaderColumnCss(column, opts, isLastColumn) + "'><div class='" + settings.cssClass.headerCellDiv + "'><span class='" + settings.cssClass.headerColumnName + "'>" + (column.name || "") + "</span>";


            if (column.sortable && column.sortOrder !== 0) {
                html += "<span class='" + (column.sortOrder === 1 ? settings.cssClass.headerSortUp : settings.cssClass.headerSortDown) + "' data-click-type='sort'></span>";
            }

            if (column.filterable) {
                html += "<span class='" + settings.cssClass.headerFilter + "' data-click-type='menu'></span>";
            }

            html += "</div>";

            if (column.resizeable) {
                html += "<span class='" + settings.cssClass.headerResizeHandle + "' data-click-type='resize'></span>";
            }

            return html + "</td>";
        }

        function buildLastHeaderColumn(column, opts) {
            return "<td class='" + settings.cssClass.headerCell + ' ' + settings.cssClass.cellColumnLast + "' style='height:" + settings.header.height + "px'></td>";
        }

        /*
         * Cols
         */
        function buildColsHtml(columns, opts) {
            var html = '';
            for (var i = 0, length = columns.length; i < length; i++) {
                html += buildColHtml(columns[i]);
            }

            if (opts.virtualColumnWidth >= 0 && settings.showLastColumn === true) {
                html += buildLastColHtml(columns[i - 1], opts);
            }

            return html;
        }

        function buildColCss(column) {
            var cellCssClass = settings.cssClass.col;
            if (column.headerCssClass) {
                cellCssClass += " " + column.headerCssClass;
            }

            return cellCssClass;
        }

        function buildColHtml(column) {
            return "<col style='width:" + (column.width + settings.cellOuterSize.width) + "px;' class='" + buildColCss(column) + "'/>";
        }

        function buildLastColHtml(column, opts) {
            return "<col style='width:" + opts.virtualColumnWidth + "px;' class='" + settings.cssClass.col + " " + settings.cssClass.collLast + "'/>";
        }

        /*
         * Rows
         */
        function buildRowsHtml(columns, rows, opts) {
            var html = '';
            for (var i = 0, length = rows.length - 1; i <= length; i++) {
                html += buildRowHtml(columns, rows[i], opts, length === i);
            }
            return html;
        }

        function buildRowCss(columns, row, opts, isLastRow) {
            var rowCssClass = [settings.cssClass.row, row.calcIndex & 1 === 1 ? settings.cssClass.rowEven : settings.cssClass.rowOdd];

            if (row.rowCssClass) rowCssClass.push(row.rowCssClass);

            return self.onRowCss.notify(rowCssClass, { columns: columns, row: row, opts: opts, isLastRow: isLastRow }).join(" ");
        }

        function buildRowHtml(columns, row, opts, isLastRow) {
            var html = "<tr class='" + buildRowCss(columns, row, opts, isLastRow) + "'>";
            for (var i = 0, length = columns.length - 1; i <= length; i++) {
                html += buildCellHtml(columns[i], row, opts, length === i, isLastRow);
            }

            if (opts.virtualColumnWidth >= 0 && settings.showLastColumn === true) {
                html += buildLastCellHtml(columns[i - 1], opts, isLastRow);
            }

            return html + '</tr>';
        }

        function buildCellCss(column, row, opts, isLastColumn, isLastRow) {
            var cellCssClass = [settings.cssClass.cell];
            if (column.cellCssClass) {
                cellCssClass.push(column.cellCssClass);
            }

            if (isLastColumn && opts.hideColumnBorder) {
                cellCssClass.push(settings.cssClass.cellColumnLast);
            }

            if (isLastRow && opts.hideRowBorder) {
                cellCssClass.push(settings.cssClass.cellRowLast);
            }

            if (row.cellCssClass && column.field in row.cellCssClass) {
                cellCssClass.push(row.cellCssClass[column.field]);
            }

            return self.onCellCss.notify(cellCssClass, { column: column, row: row, opts: opts, isLastColumn: isLastColumn, isLastRow: isLastRow }).join(" ");
        }

        function buildCellHtml(column, row, opts, isLastColumn, isLastRow) {
            return "<td height='" + row.height + "' class='" + buildCellCss(column, row, opts, isLastColumn, isLastRow) + "'>" + buildCellContentHtml(column, row) + "</td>";
        }

        function buildLastCellHtml(column, opts, isLastRow) {
            var cssClass = settings.cssClass.cell + ' ' + settings.cssClass.cellColumnLast;
            if (isLastRow && opts.hideRowBorder) cssClass += ' ' + settings.cssClass.cellRowLast;
            return "<td class='" + cssClass + "'></td>";
        }

        /*
         * Cell content
         */
        function buildCellContentHtml(column, row) {
            var value = "";

            if (column.field in row.item && (row.editMode === false || column.editMode === false)) {
                value = getCellFormatter(column, row);
            }
            return value;
        }

        function getCellFormatter(column, row) {
            return column.formatter ? SmallGrid.Cell.Formatter[column.formatter](getCellValue(column, row), column, row, settings) : getCellValue(column, row);
        }

        function getCellValue(column, row) {
            return row.item[column.field];
        }


        $.extend(this, {
            "buildCellContentHtml": buildCellContentHtml,
            "buildColsHtml": buildColsHtml,
            "buildHeaderColumnsHtml": buildHeaderColumnsHtml,
            "buildRowsHtml": buildRowsHtml,
            "buildViewPortElements": buildViewPortElements,

            "onHeaderColumnCss": SmallGrid.Callback.Create(),
            "onRowCss": SmallGrid.Callback.Create(),
            "onCellCss": SmallGrid.Callback.Create()
        });
    }

    function Create(settings) {
        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        return new Builder(settings);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "View": {
            "Create": CreateView,
            "View": ViewData
        }
    });

    function ViewData($container, viewModel, builder, settings) {
        var self = this,
            contentSize =
            {
                width: 0,
                height: 0
            },
            modelSize = {
                rowsHeight: 0,
                columnsWidth: 0
            },
            el = {},
            handlers = [],
            requestDataCounter = null,
            requestRenderTimer = null,
            renderDelayTimer = null,
            scrollVisibility =
            {
                horisontal: false,
                vertical: false
            },
            suspendRequests = [],
            suspendScrollEvent = false,
            suspendRenderRequests = 0;

        el = builder.buildViewPortElements($container);
        el.container.empty().addClass(settings.uid);
        el.viewport.appendTo(el.container);

        /*
         * Init and destroy
         */
        function init() {
            var request = suspendRender();

            //bind events
            handlers.push(
                SmallGrid.Handler.Resize.Create(el.header, {
                    "handleResize": handleHeaderResize,
                    "handleResizeStart": handleHeaderResizeStart,
                    "handleResizeStop": handleHeaderResizeStop,
                    "handlerIdentifier": "." + settings.cssClass.headerResizeHandle
                }),
                SmallGrid.Handler.Click.Create(el.header, {
                    "handleClick": handleHeaderClick,
                    "handleDblClick": handleHeaderDblClick,
                    "handleContextMenu": handleHeaderContextMenu
                }),
                SmallGrid.Handler.Click.Create(el.content, {
                    "handleClick": handleCellClick,
                    "handleDblClick": handleCellDblClick,
                    "handleContextMenu": handleCellContextMenu,
                    "handleKeyDown": handleCellKeyDown
                }),
                SmallGrid.Handler.Scroll.Create(el.content, {
                    "handleScrollStart": handleScrollStart,
                    "handleScrollStop": handleScrollStop,
                    "handleScroll": handleScroll,
                    "handleMouseWheelStart": handleMouseWheelStart,
                    "handleMouseWheelStop": handleMouseWheelStop,
                    "handleMouseWheel": handleMouseWheel
                })
            );

            var sharedHandler = SmallGrid.Handler.Shared.GetInstance();
            sharedHandler.onClick.subscribe(handleDocumentClick);
            sharedHandler.onResize.subscribe(handleDocumentResize);
            sharedHandler.onContextMenu.subscribe(handleDocumentContextMenu);

            viewModel.onRowsChange.subscribe(handleRowsChange);
            viewModel.onColumnsChange.subscribe(handleColumnsChange);
            viewModel.onInitialize.subscribe(handleModelInit);

            resumeRender(request);

            return self;
        }

        function destroy() {
            suspendRender();

            clearTimeout(requestRenderTimer);
            clearTimeout(renderDelayTimer);

            viewModel.onRowsChange.unsubscribe(handleRowsChange);
            viewModel.onColumnsChange.unsubscribe(handleColumnsChange);
            viewModel.onInitialize.unsubscribe(handleModelInit);

            var sharedHandler = SmallGrid.Handler.Shared.GetInstance();
            sharedHandler.onClick.unsubscribe(handleDocumentClick);
            sharedHandler.onResize.unsubscribe(handleDocumentResize);
            sharedHandler.onContextMenu.unsubscribe(handleDocumentContextMenu);

            if (el.container.length) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].destroy();
                    handlers[i] = undefined;
                }

                el.container.removeClass(settings.uid);
                delete el.container;
            }

            var elKeys = Object.keys(el);
            for (var idx = 0; idx < elKeys.length; idx++) {
                el[elKeys[idx]].remove();
                delete el[elKeys[idx]];
            }

            $container.empty();
        }

        function handleModelInit() {
            var request = suspendRender();
            resize();
            renderView();
            resumeRender(request);

            self.onInitialize.notify({});
        }

        /*
         * Other
         */
        function getContentSize() {
            return contentSize;
        }

        function getBuilder() {
            return builder;
        }
        /* 
         * Scroll
         */
        function isHorisontalScrollVisible() {
            return scrollVisibility.horisontal;
        }

        function isVerticalScrollVisible() {
            return scrollVisibility.vertical;
        }

        /*
         * Nodes
         */
        function getNode(name) {
            if (el[name]) return el[name];
        }

        /*
         * Column func
         */
        function isColumnVisible(columnId) {
            var column = viewModel.getColumnById(columnId);
            if (column) {
                return column.calcWidth - column.width - settings.cellOuterSize.width >= el.content[0].scrollLeft && column.calcWidth < contentSize.width + el.content[0].scrollLeft;
            }
            return false;
        }

        /*
         * Row func
         */
        function isRowVisible(rowId) {
            var row = viewModel.getRowById(rowId);
            if (row) {
                return row.calcHeight - row.height - settings.cellOuterSize.height >= el.content[0].scrollTop && row.calcHeight + row.height + settings.cellOuterSize.height < contentSize.height + el.content[0].scrollTop;

            }
            return false;
        }

        function getRowNodeByIndex(rowIndex) {
            return el.contentTbody[0].rows[rowIndex];
        }

        function getRowNodeById(rowId) {
            var rowIndex = viewModel.getRowIndexById(rowId);
            if (rowIndex !== -1) {
                return getRowNodeByIndex(rowIndex);
            }
        }

        /*
         * Cell func
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
            if (rowIndex !== -1 && columnIndex !== -1) {
                return getCellNodeByIndex(columnIndex, rowIndex);
            }
        }

        /*
         * Render
         */
        function render() {
            suspendRenderRequests++;
            renderRequests();
            return self;
        }

        function renderRequests() {
            if (suspendRenderRequests > 0) {
                if (requestDataCounter !== null || isSuspended() === true) {
                    clearTimeout(requestRenderTimer);
                    requestRenderTimer = setTimeout(render, 187);
                } else {
                    requestDataCounter++;
                    clearTimeout(requestRenderTimer);
                    renderView();
                    if (settings.renderDelay) {
                        renderDelayTimer = setTimeout(function () {
                            requestDataCounter = null;
                        }, settings.renderDelay);
                    } else {
                        requestDataCounter = null;
                    }
                }
            }
            return self;
        }

        function renderView() {

            var request = suspendRender();

            suspendRenderRequests = 0;

            var heightRatio = 1;
            if (modelSize.rowsHeight >= settings.maxSupportedCssHeight) {
                var contentSizeHeight = contentSize.height + (scrollVisibility.horisontal ? settings.scrollbarDimensions.height : 0);
                heightRatio = (modelSize.rowsHeight - contentSizeHeight) / (settings.maxSupportedCssHeight - contentSizeHeight);
            }

            var result = viewModel.requestDataFromRange(
                {
                    top: el.content[0].scrollTop * heightRatio,
                    left: el.content[0].scrollLeft
                },
                contentSize,
                settings.cellOuterSize,
                {
                    width: scrollVisibility.vertical ? settings.scrollbarDimensions.width : 0,
                    height: scrollVisibility.horisontal ? settings.scrollbarDimensions.height : 0
                },
                heightRatio === 1
            );

            if (result.isCached === 0) {
                if (result.columns.length > 0) {
                    el.headerTable.css({
                        'left': result.columns[0].calcWidth - result.columns[0].width - settings.cellOuterSize.width
                    });

                    if (result.rows.length > 0) {
                        el.contentTable.css({
                            'top': result.rows[0].calcHeight - result.rows[0].height - settings.cellOuterSize.height - el.content[0].scrollTop * heightRatio + el.content[0].scrollTop,
                            'left': result.columns[0].calcWidth - result.columns[0].width - settings.cellOuterSize.width
                        });
                    }

                    var lastColumn = result.columns[result.columns.length - 1];

                    var opts = {
                        hideRowBorder: scrollVisibility.horisontal === false && scrollVisibility.vertical === true,
                        hideColumnBorder: scrollVisibility.vertical === false && contentSize.width <= lastColumn.calcWidth,
                        virtualColumnWidth: settings.showLastColumn === true && contentSize.width >= lastColumn.calcWidth ? contentSize.width - lastColumn.calcWidth : 0
                    };

                    renderViewHtml(
                        builder.buildHeaderColumnsHtml(result.columns, opts),
                        builder.buildColsHtml(result.columns, opts),
                        builder.buildRowsHtml(result.columns, result.rows, opts)
                    );

                } else {
                    renderViewHtml("", "", "");
                }
            }

            resumeRender(request);
        }

        function renderViewHtml(columnsHtml, colsHtml, rowsHtml) {
            self.onBeforeRowsRendered.notify({});

            var contentTbody = el.contentTbody[0].cloneNode(false);
            var headerTbody = el.headerTbody[0].cloneNode(false);
            var headerCol = el.headerCol[0].cloneNode(false);
            var contentCol = el.contentCol[0].cloneNode(false);

            headerCol.innerHTML = contentCol.innerHTML = colsHtml;
            contentTbody.innerHTML = rowsHtml;
            headerTbody.innerHTML = columnsHtml;

            if (el.contentCol[0].innerHTML !== contentCol.innerHTML) {
                el.contentTable[0].replaceChild(contentCol, el.contentCol[0]);
                el.contentCol = $(contentCol);
            }

            if (el.contentTbody[0].innerHTML !== contentTbody.innerHTML) {
                el.contentTable[0].replaceChild(contentTbody, el.contentTbody[0]);
                el.contentTbody = $(contentTbody);
            }

            if (el.headerCol[0].innerHTML !== headerCol.innerHTML) {
                el.headerTable[0].replaceChild(headerCol, el.headerCol[0]);
                el.headerCol = $(headerCol);
            }

            if (el.headerTbody[0].innerHTML !== headerTbody.innerHTML) {
                el.headerTable[0].replaceChild(headerTbody, el.headerTbody[0]);
                el.headerTbody = $(headerTbody);
            }

            self.onAfterRowsRendered.notify({});
        }

        function isSuspended() {
            return suspendRequests.length > 0;
        }

        function suspendRender(callback) {
            var id = SmallGrid.Utils.createGuid();
            suspendRequests.push(id);
            if (callback) {
                callback();
                return resumeRender(id);
            }
            return id;
        }

        function resumeRender(value) {
            for (var i = 0; i < suspendRequests.length; i++) {
                if (suspendRequests[i] === value) {
                    suspendRequests.splice(i, 1);
                    return true;
                }
            }
            return false;
        }

        /*
         * Event funcs
         */
        function getColumnEvent(evt) {
            var column = viewModel.getColumnByIndex(evt.cellIndex);
            if (column) {
                evt.type = $(evt.event.target).attr("data-click-type") || "";
                evt.column = column;
                return evt;
            }
        }

        function getCellEvent(evt) {
            var column = viewModel.getColumnByIndex(evt.cellIndex);
            var row = viewModel.getRowByIndex(evt.rowIndex);
            if (column && column.field.length > 0 && row && column.field in row.item) {
                evt.row = row;
                evt.column = column;
                return evt;
            }
        }

        function notifyEvent(evt, handlerName) {
            self[handlerName].notify(evt);
        }

        /*
         * Resize 
         */
        function resize() {
            contentSize.width = el.container.width();
            contentSize.height = Math.max(el.container.height() - settings.header.height - settings.cellOuterSize.height, 0);

            if (contentSize.height) el.content.height(contentSize.height);

            modelSize.rowsHeight = viewModel.getRowsHeight(settings.cellOuterSize);
            modelSize.columnsWidth = viewModel.getColumnsWidth(settings.cellOuterSize);
            applyModelChange();

            self.onViewResized.notify({});

            return self;
        }

        /*
         * Data handlers
         */
        function getScrollVisibility(modelSize, contentSize, scrollbarDimensions) {
            var visibility = {
                vertical: false,
                horisontal: false
            };

            if (modelSize.columnsWidth > contentSize.width) {
                visibility.vertical = modelSize.rowsHeight + scrollbarDimensions.height > contentSize.height;
                visibility.horisontal = true;
            } else if (modelSize.rowsHeight > contentSize.height) {
                visibility.horisontal = modelSize.columnsWidth + scrollbarDimensions.width > contentSize.width;
                visibility.vertical = true;
            }

            return visibility;
        }

        function applyModelChange() {

            var visibility = scrollVisibility;
            scrollVisibility = getScrollVisibility(modelSize, contentSize, settings.scrollbarDimensions);
            if (scrollVisibility.vertical !== visibility.vertical || scrollVisibility.horisontal !== visibility.horisontal) {
                //force chrome hide scrolls
                el.content.css({ 'overflow': scrollVisibility.vertical || scrollVisibility.horisontal ? 'auto' : 'hidden' });

                //for rigth corner in the header
                el.header.css({
                    'width': scrollVisibility.vertical ? contentSize.width - settings.scrollbarDimensions.width : contentSize.width
                });

                self.onViewScrollChange.notify({});
            }

            var width = Math.max(
                modelSize.columnsWidth,
                scrollVisibility.vertical ? contentSize.width - settings.scrollbarDimensions.width : contentSize.width
            );

            var height = modelSize.columnsWidth ? Math.min(modelSize.rowsHeight, settings.maxSupportedCssHeight) : 0;

            el.headerWrap.css({
                'width': width
            });

            el.contentWrap.css({
                'width': width,
                'height': height
            });
        }


        function handleRowsChange() {
            modelSize.rowsHeight = viewModel.getRowsHeight(settings.cellOuterSize);
            applyModelChange();
            render();
        }

        function handleColumnsChange() {
            modelSize.columnsWidth = viewModel.getColumnsWidth(settings.cellOuterSize);
            applyModelChange();
            render();
        }

        /*
         * Handle cell events
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
         * Handle resize events
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
         * Handle mouse wheel
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
         * Handle scroll
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
         * Handle document events
         */
        function handleDocumentResize(evt) {
            suspendRender(function () {
                notifyEvent(evt, "onDocumentResize");
                resize();
                renderView();
            });
        }

        function handleDocumentContextMenu(evt) {
            notifyEvent(evt, "onDocumentContextMenu");
        }

        function handleDocumentClick(evt) {
            notifyEvent(evt, "onDocumentClick");
        }

        /*
         * Handle header events
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



        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "getBuilder": getBuilder,
            "getContentSize": getContentSize,

            "getCellNodeById": getCellNodeById,
            "getCellNodeByIndex": getCellNodeByIndex,
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

            "resumeRender": resumeRender,
            "suspendRender": suspendRender,

            "onViewResized": SmallGrid.Event.Create(),
            "onViewScrollChange": SmallGrid.Event.Create(),

            "onScroll": SmallGrid.Event.Create(),
            "onScrollStart": SmallGrid.Event.Create(),
            "onScrollStop": SmallGrid.Event.Create(),

            "onMouseWheel": SmallGrid.Event.Create(),
            "onMouseWheelStart": SmallGrid.Event.Create(),
            "onMouseWheelStop": SmallGrid.Event.Create(),

            "onDocumentClick": SmallGrid.Event.Create(),
            "onDocumentResize": SmallGrid.Event.Create(),
            "onDocumentContextMenu": SmallGrid.Event.Create(),

            "onHeaderClick": SmallGrid.Event.Create(),
            "onHeaderContextMenu": SmallGrid.Event.Create(),
            "onHeaderDblClick": SmallGrid.Event.Create(),

            "onCellClick": SmallGrid.Event.Create(),
            "onCellContextMenu": SmallGrid.Event.Create(),
            "onCellDblClick": SmallGrid.Event.Create(),
            "onCellKeyDown": SmallGrid.Event.Create(),

            "onColumnResize": SmallGrid.Event.Create(),
            "onColumnResizeStart": SmallGrid.Event.Create(),
            "onColumnResizeStop": SmallGrid.Event.Create(),

            "onAfterRowsRendered": SmallGrid.Event.Create(),
            "onBeforeRowsRendered": SmallGrid.Event.Create(),

            "onInitialize": SmallGrid.Callback.Create(),
            "onDestroy": SmallGrid.Callback.Create()
        });
    }


    function CreateView(container, viewModel, settings, autoInit) {
        var $container = $(container);
        if (!$container.length) {
            throw new TypeError("Container is not defined or does not exist in the DOM.");
        }

        if ($container.length !== 1) {
            throw new TypeError("There should be only 1 container.");
        }

        if (viewModel instanceof SmallGrid.View.Model.Model === false) {
            throw new TypeError("View model is not defined.");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        var builder = SmallGrid.View.Builder.Create(settings);
        var view = new ViewData($container, viewModel, builder, settings);

        if (autoInit !== false) view.init();

        return view;
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "View": {
            "Model": {
                "Model": ViewModel,
                "Create": CreateModel
            }
        }
    });

    function ViewModel(rowsModel, columnsModel, rowsRequest, columnsRequest, settings) {
        var self = this,
            rowsTotal = { count: 0, height: 0 },
            columnsTotal = { count: 0, width: 0 };

        var rowsCache = [],
            columnsCache = [];

        var cachedRange = {
            minTop: undefined,
            maxTop: undefined,
            minLeft: undefined,
            maxLeft: undefined
        };

        var rowFilters = [],
            rowSorters = [],
            newRowSorters = [];

        /*
         * Init && destroy
         */
        function init() {
            rowsModel.onChange.subscribe(handleRowsChange);
            columnsModel.onChange.subscribe(handleColumnsChange);

            self.onInitialize.notify({});
            return self;
        }

        function destroy() {
            rowsModel.onChange.unsubscribe(handleRowsChange);
            columnsModel.onChange.unsubscribe(handleColumnsChange);
            rowFilters = [];
            rowSorters = [];
            newRowSorters = [];
            rowsCache = undefined;
            columnsCache = undefined;
        }

        /*
         * Handlers
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
            newRowSorters = rowSorters.slice();
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
         * Cached row and column helpers
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
                if (rowsCache[i].id === id) {
                    return i;
                }
            }
            return -1;
        }

        function getColumnIndexById(id) {
            for (var i = 0; i < columnsCache.length; i++) {
                if (columnsCache[i].id === id) {
                    return i;
                }
            }
            return -1;
        }

        function getRowById(id) {
            for (var i = 0; i < rowsCache.length; i++) {
                if (rowsCache[i].id === id) {
                    return rowsCache[i];
                }
            }
        }

        function getColumnById(id) {
            for (var i = 0; i < columnsCache.length; i++) {
                if (columnsCache[i].id === id) {
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
         * Row filters part
         */
        function getFilters() {
            return rowFilters;
        }

        function setFilter(filterObj) {
            if (filterObj instanceof SmallGrid.Query.Filter) {
                for (var i = 0; i < rowFilters.length; i++) {
                    if (rowFilters[i].getId() === filterObj.getId()) {
                        break;
                    }
                }
                rowFilters[i] = filterObj;
                updateCacheHeight();
                self.onRowsChange.notify();
            }
        }

        function clearFilterByField(field) {
            for (var i = 0; i < rowFilters.length; i++) {
                if (rowFilters[i].getField() === field) {
                    rowFilters.splice(i, 1);
                    updateCacheHeight();
                    self.onRowsChange.notify();
                    break;
                }
            }
        }

        function clearFilterById(id) {
            for (var i = 0; i < rowFilters.length; i++) {
                if (rowFilters[i].getId() === id) {
                    rowFilters.splice(i, 1);
                    updateCacheHeight();
                    self.onRowsChange.notify();
                    break;
                }
            }
        }

        function clearFilters() {
            rowFilters = [];
            updateCacheHeight();
            self.onRowsChange.notify();
        }

        /* 
         * Row sorters part
         */
        function getSorters() {
            return rowSorters;
        }

        function setSorter(sorterObj) {
            if (sorterObj instanceof SmallGrid.Query.Sorter) {
                rowSorters = [sorterObj];
                newRowSorters = rowSorters.slice();
                updateCacheHeight();
                self.onRowsChange.notify();
            }
        }

        function clearSorterById(id) {
            for (var i = 0; i < rowSorters.length; i++) {
                if (rowSorters[i].getId() === id) {
                    rowSorters.splice(i, 1);
                    newRowSorters = rowSorters.slice();
                    updateCacheHeight();
                    self.onRowsChange.notify();
                    break;
                }
            }
        }

        function clearSorterByField(field) {
            for (var i = 0; i < rowSorters.length; i++) {
                if (rowSorters[i].getField() === field) {
                    rowSorters.splice(i, 1);
                    newRowSorters = rowSorters.slice();
                    updateCacheHeight();
                    self.onRowsChange.notify();
                    break;
                }
            }
        }

        function clearSorters() {
            rowSorters = [];
            newRowSorters = [];
            updateCacheHeight();
            self.onRowsChange.notify();
        }

        /*
         * Data calculations
         */
        function getRowsHeight(cellOuterSize) {
            rowsTotal = rowsRequest.getRowsTotal(cellOuterSize.height, rowFilters);
            return rowsTotal.height;
        }

        function getColumnsWidth(cellOuterSize) {
            columnsTotal = columnsRequest.getColumnsTotal(cellOuterSize.width);
            return columnsTotal.width;
        }

        function requestDataFromRange(point, size, outerSize, scrollSize, allowCache) {
            var rowsCached = (cachedRange.minTop <= point.top && point.top <= cachedRange.maxTop + scrollSize.height) & allowCache;
            var columnsCached = (cachedRange.minLeft <= point.left && point.left <= cachedRange.maxLeft + scrollSize.width) & allowCache;

            if (rowsCached === 0) {
                rowsCache = rowsRequest.getRowsInRange(point.top, size.height, outerSize.height, newRowSorters, rowFilters);
                newRowSorters = [];
                updateCacheHeight(rowsCache, size, outerSize);
                self.onCacheRowsChange.notify({});
            }

            if (columnsCached === 0) {
                columnsCache = columnsRequest.getColumnsInRange(point.left, size.width, outerSize.width);
                updateCacheWidth(columnsCache, size, outerSize);
                self.onCacheColumnsChange.notify({});
            }

            return {
                isCached: rowsCached && columnsCached,
                rows: rowsCache,
                columns: columnsCache
            };
        }

        /*
         * Cache range
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

            "requestDataFromRange": requestDataFromRange,

            "clearFilterByField": clearFilterByField,
            "clearFilterById": clearFilterById,
            "clearFilters": clearFilters,
            "clearSorterByField": clearSorterByField,
            "clearSorterById": clearSorterById,
            "clearSorters": clearSorters,
            "getFilters": getFilters,
            "getSorters": getSorters,
            "setFilter": setFilter,
            "setSorter": setSorter,

            "getColumnById": getColumnById,
            "getColumnByIndex": getColumnByIndex,
            "getColumnIndexById": getColumnIndexById,
            "getColumns": getColumns,
            "getColumnsWidth": getColumnsWidth,
            "getRowById": getRowById,
            "getRowByIndex": getRowByIndex,
            "getRowIndexById": getRowIndexById,
            "getRows": getRows,
            "getRowsHeight": getRowsHeight,

            "onInitialize": SmallGrid.Callback.Create(),
            "onDestroy": SmallGrid.Callback.Create(),

            "onColumnsChange": SmallGrid.Callback.Create(),
            "onRowsChange": SmallGrid.Callback.Create(),
            "onCacheColumnsChange": SmallGrid.Callback.Create(),
            "onCacheRowsChange": SmallGrid.Callback.Create()
        });
    }

    function CreateModel(rowsModel, columnsModel, settings, autoInit) {
        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        if (rowsModel instanceof SmallGrid.Row.Model === false) {
            throw new TypeError("Rows model is not defined.");
        }

        if (columnsModel instanceof SmallGrid.Column.Model === false) {
            throw new TypeError("Column model is not defined.");
        }

        var rowsRequest = new SmallGrid.Query.Row.Create(rowsModel);
        var columnsRequest = new SmallGrid.Query.Column.Create(columnsModel);
        var viewModel = new ViewModel(rowsModel, columnsModel, rowsRequest, columnsRequest, settings);

        if (autoInit !== false) viewModel.init();

        return viewModel;
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "View": {
            "Window": {
                "Create": Create,
                "Manager": Manager
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
                if (cache[i].id === id) {
                    return true;
                }
            }
            return false;
        }

        function getWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id === id) {
                    return {
                        id: cache[i].id,
                        opts: cache[i].opts,
                        container: view.getNode('container').children('.grid-window-' + id)
                    };
                }
            }
            return self;
        }

        function removeWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id === id) {
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
            if (data !== null) {
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
            if (data !== null) {
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
                    height: $target.height()
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
            return view.getNode('container').children('.grid-window-' + id + ':visible').length > 0;
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
            "showWindow": showWindow
        });
    }


    function Create(view, settings, autoInit) {
        if (view instanceof SmallGrid.View.View === false) {
            throw new TypeError("View is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        var windowManager = new SmallGrid.View.Window.Manager(view, settings);

        if (autoInit !== false) windowManager.init();

        return windowManager;
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});if (typeof jQuery === "undefined") {
    throw new Error("Small grid requires jquery module to be loaded.");
}
if (typeof SmallGrid === "undefined") {
    throw new Error("Small grid required to be loaded.");
}

(function ($, SmallGrid) {
    "use strict";
    var defaultSettings = {
        renderDelay: 0,
        showLastColumn: true,//show last column
        uidPrefix: "smallgrid_",
        maxSupportedCssHeight: undefined,//internal
        scrollbarDimensions: undefined,//internal
        cellOuterSize: undefined,//internal
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
            cellAlignRight: "grid-cell-align-right"
        },
        header: {
            height: 20,
            disableTextSelection: true
        },

        columns: {
            idProperty: undefined,
            newIdType: "",//number, guid
        },
        rows: {
            disableTextSelection: false,
            idProperty: undefined,//TODO: other fields mapping
            newIdType: "",//number, guid
            valign: "" //middle, top, bottom, baseline
        },
        formatter: {
            floatFormatter: {
                decimals: 2
            },
            integerFormatter: {
                decimals: 0
            },
            moneyFormatter: {
                locales: 'en-US',
                options: {
                    currency: 'EUR',
                    style: 'currency'
                }
            },
            dateFormatter: {
                locales: 'en-US',
                options: {}
            }
        },

        plugins: {
            AutoResize: {
                enabled: true,
            },
            ColumnSort: {
                enabled: true,
            },
            ColumnResize: {
                enabled: true,
            },
            RowSelection: {
                enabled: true,
                multipleRowSelection: false//allow multiplerow selection
            },
            CellEdit: {
                enabled: true,
                editOnClick: false,//when true, editor loaded after click
                autoFocus: true//autofocus edited cell when scrolling
            },
            ColumnFilterMenu: {
                enabled: true,
            },
            ColumnPickerMenu: {
                enabled: true,
            },
            Footer: {
                enabled: false,
            },
            CellAlign: {
                enabled: false,
            }
        }
    };

    function CreateSettings(opts) {

        var settings = $.extend(true, {}, defaultSettings, opts || {});

        if (settings.maxSupportedCssHeight === undefined) {
            defaultSettings.maxSupportedCssHeight = settings.maxSupportedCssHeight = SmallGrid.Utils.measureMaxSupportedCssHeight();
        }

        if (settings.scrollbarDimensions === undefined) {
            defaultSettings.scrollbarDimensions = settings.scrollbarDimensions = SmallGrid.Utils.measureScrollbar();
        }

        if (settings.cellOuterSize === undefined) {
            settings.cellOuterSize = SmallGrid.Utils.measureCellDiff(settings.cssClass.cell);
        }

        if (settings.uid === undefined) {
            settings.uid = SmallGrid.Utils.createGuid();
        }

        return settings;
    }

    $.extend(true, SmallGrid, {
        "Settings": {
            "Create": CreateSettings,
            "Default": defaultSettings
        }
    });
})(jQuery, window.SmallGrid = window.SmallGrid || {});