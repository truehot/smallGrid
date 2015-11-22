(function ($) {
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

    function RowModel(settings) {
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

        /*
        Batch updates
        */
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

        function setRows(rows) {
            if (rows.length) {
                self.onChangeStart.notify();
                data = [];
                for (var i = 0; i < rows.length; i++) {
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
                self.onChange.notify({ "id": data[i].id, "type": "update" });
            }
            self.onChangeStop.notify();
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

        function deleteRows() {
            if (data.length) {
                self.onChangeStart.notify();
                data = [];
                self.onChangeStop.notify({ "mode": "all" });
            }
            return self;
        }

        /*
        Single updates
        */

        function addRow(row) {
            if (row instanceof RowData) {
                data.push(row);
                self.onChange.notify({ "id": row.id, "type": "add" });
            }
            return self;
        }

        function addItem(item) {
            var row = addRow(
                createRow(item)
            );
            self.onChange.notify({ "id": row.id, "type": "add" });
            return row;
        }

        function deleteItem(item) {
            if (SmallGrid.Utils.isProperty(settings.rows.idProperty, item)) {
                deleteRowById(item[settings.rows.idProperty]);
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

        function updateItem(item) {
            if (SmallGrid.Utils.isProperty(settings.rows.idProperty, item)) {
                updateItemById(item[settings.rows.idProperty], item);
            }
        }

        function updateItemById(id, item) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data[i].item = item;
                    self.onChange.notify({ "id": id, "type": "update" });
                    break;
                }
            }
            return self;
        }

        function updateItemByIndex(idx, item) {
            if (data[idx]) {
                data[idx].item = item;
                self.onChange.notify({ "id": data[idx].id, "type": "update" });
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
                    self.onChange.notify({ "id": id, "type": "delete" });
                    break;
                }
            }
            return self;
        }

        function deleteRowByIndex(idx) {
            if (data[idx]) {
                var id = data[idx].id;
                data.splice(idx, 1);
                self.onChange.notify({ "id": id, "type": "delete" });
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
                self.onChange.notify({ "id": row.id, "type": "add" });
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
                self.onChange.notify({ "id": row.id, "type": "add" });
            }
            return self;
        }

        function setRowPropertyById(id, propertyName, propertyValue) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    if (propertyName && propertyName in data[i]) {
                        data[i][propertyName] = propertyValue;
                        self.onChange.notify({ "id": id, "type": "update" });
                    }
                    break;
                }
            }
            return self;
        }

        function setRowPropertyByIndex(idx, propertyName, propertyValue) {
            if (propertyName && propertyName in data[idx]) {
                data[idx][propertyName] = propertyValue;
                self.onChange.notify({ "id": data[idx].id, "type": "update" });
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
                        self.onChange.notify({ "id": id, "type": "update" });
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
                    self.onChange.notify({ "id": row.id, "type": "update" });
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
    }

    function CreateModel(data, settings) {
        if (!Array.isArray(data)) {
            throw "Array expected";
        }
        return new RowModel(
            settings
        ).addItems(data);
    }
})(jQuery);