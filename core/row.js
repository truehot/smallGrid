"use strict";

(function ($) {
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
            return data.length === 0;
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
            var result = [];
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
                for (i = 0; i < items.length; i++) {
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

                for (i = 0; i < rows.length; i++) {
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
                var idProperty = settings.rows.idProperty;
                if (settings.Utils.isProperty(idProperty, row)) {
                    updateRowById(row[idProperty], row);
                }
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
            if (settings.rows.mapProperties === true) {
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

})(jQuery);