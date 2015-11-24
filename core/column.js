(function ($) {
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
    function ColumnModel(settings) {
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

        function addItem(item) {
            var column = addColumn(
                createColumn(item)
            );
            self.onChange.notify({ "id": column.id});
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
                self.onChangeStop.notify({ "mode": "all" });
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
                for (var i = 0; i < columns.length; i++) {
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
    }

    function CreateModel(data, settings) {
        if (!Array.isArray(data)) {
            throw "Array expected";
        }
        return new ColumnModel(
            settings
        ).addItems(data);
    }

})(jQuery);