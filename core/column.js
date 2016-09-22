(function ($, SmallGrid) {
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
    ColumnData.prototype.headerFormatter = "Default";//default header cell content formatter
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
                    for (var i = 0, len = items.length; i < len; i++) {
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
                for (var i = 0, len = data.length; i < len; i++) {
                    result.push(data[i].item);
                }
                return result;
            },

            setItems: function (items) {
                if (items.length) {
                    self.onChange.lock();
                    data = [];
                    for (var i = 0, len = items.length; i < len; i++) {
                        self.items.addItem(items[i]);
                    }
                    self.onChange.notifyLocked();
                }
                return self;
            },

            updateItemById: function (id, item) {
                for (var i = 0, len = data.length; i < len; i++) {
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
                for (var i = 0, len = columns.length; i < len; i++) {
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
            for (var i = 0, len = data.length; i < len; i++) {
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
            for (var i = 0, len = data.length; i < len; i++) {
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
            for (var i = 0, len = data.length; i < len; i++) {
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
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].id === id) {
                    if (propertyName) {
                        data[i][propertyName] = propertyValue;
                        self.onChange.notify({ "id": id });
                    }
                    break;
                }
            }
            return self;
        }

        function setColumnPropertyByIndex(idx, propertyName, propertyValue) {
            if (propertyName && data[idx]) {
                data[idx][propertyName] = propertyValue;
                self.onChange.notify({ "id": data[idx].id });
            }
            return self;
        }

        function setColumns(columns) {
            if (columns.length) {
                self.onChange.lock();
                data = [];
                for (var i = 0, len = columns.length; i < len; i++) {
                    addColumn(columns[i]);
                }

                self.onChange.notifyLocked();
            }
            return self;
        }

        function setColumnsProperty(propertyName, propertyValue) {
            self.onChange.lock();
            for (var i = 0, len = data.length; i < len; i++) {
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
                for (var i = 0, len = data.length; i < len; i++) {
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
                for (var i = 0, len = columns.length; i < len; i++) {
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
                if ("headerFormatter" in item) column.headerFormatter = item.headerFormatter;
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

})(jQuery, window.SmallGrid = window.SmallGrid || {});