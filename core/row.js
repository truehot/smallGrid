(function ($, SmallGrid) {
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
})(jQuery, window.SmallGrid = window.SmallGrid || {});