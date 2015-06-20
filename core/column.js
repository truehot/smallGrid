"use strict";

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





})(jQuery);