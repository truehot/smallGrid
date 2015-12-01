QUnit.module("SmallGrid");
QUnit.test("Row", function (assert) {

    var model = new SmallGrid.Row.Create([], SmallGrid.Settings.Create());

    assert.ok(model.items.getItems().length == 0, "Row.Create");
    assert.ok(model.isEmpty() == true, "isEmpty");
    assert.ok(model.total() == 0, "total");

    assert.ok(model.items.getItems().length == 0, "init");

    model.items.addItems([]);
    assert.ok(model.items.getItems().length == 0, "items.addItems");

    model.addRows([]);
    assert.ok(model.items.getItems().length == 0, "items.addRows");

    model.updateRows([]);
    assert.ok(model.items.getItems().length == 0, "items.updateItems");

    model.deleteRows();
    assert.ok(model.items.getItems().length == 0, "items.deleteItems");

    model.items.setItems([]);
    assert.ok(model.items.getItems().length == 0, "items.setItems");

    model.setRows([]);
    assert.ok(model.items.getItems().length == 0, "setRows");

    assert.ok(model.items.getItems().length == 0, "items.getItems");
    assert.ok(model.getRows().length == 0, "getRows");

    var item = getItem();
    var model = new SmallGrid.Row.Create([item], SmallGrid.Settings.Create());
    assert.ok(model.items.getItems().length == 1, "Data.Create");
    assert.ok(model.getRows().length == 1, "Data.Create");
    assert.deepEqual(model.getRows()[0].item, item, "Data.Create");

    model.items.updateItems([item]);
    assert.ok(model.getRows().length == 1, "items.updateItems");
    assert.deepEqual(model.getRows()[0].item, item, "items.updateItems");

    model.items.deleteItems();
    assert.ok(model.getRows().length == 0, "items.deleteItems");

    model.items.setItems([item]);
    assert.ok(model.getRows().length == 1, "items.setItems");
    assert.deepEqual(model.getRows()[0].item, item, "items.setItems");

    assert.deepEqual(model.getRowById(model.getRows()[0].id), model.getRowByIndex(0), "getRowById && getRowByIndex");
    assert.deepEqual(model.getRowByIndex(0).item, item, "getRowByIndex");
    assert.deepEqual(model.getRowById(model.getRows()[0].id).item, item, "getRowById");

    assert.deepEqual(model.getRowById(model.getRows()[0].id), model.getRowByIndex(0), "getRowById && getRowByIndex");
    assert.deepEqual(model.getRowByIndex(0).item, item, "getRowByIndex");
    assert.deepEqual(model.getRowById(model.getRows()[0].id).item, item, "getRowById");

    model.items.deleteItemById(model.getRows()[0].id);
    assert.ok(model.getRows().length == 0, "items.deleteItemById");

    model.items.setItems([item]);
    assert.ok(model.getRows().length == 1, "items.setItems");

    var newItem = model.getRows()[0];
    model.items.updateItem(newItem);
    assert.deepEqual(model.getRows()[0], newItem, "items.updateItem");

    model.items.updateItemById(newItem.id, newItem.item);
    assert.deepEqual(model.getRows()[0], newItem, "items.updateItemById");

    model.items.updateItemByIndex(0, newItem.item);
    assert.deepEqual(model.getRows()[0], newItem, "items.updateItemByIndex");

    model.updateRowByIndex(0, newItem);
    assert.deepEqual(model.getRows()[0], newItem, "updateRowByIndex");

    model.items.updateItems([newItem]);
    assert.deepEqual(model.getRows()[0], newItem, "items.updateItems");


    assert.ok(model.getRowIdByIndex(0) == newItem.id, "getRowIdByIndex");
    assert.ok(model.getRowIndexById(newItem.id) == 0, "getRowIndexById");

    assert.ok(model.getRowPropertyById(newItem.id, "editMode") == false, "getRowPropertyById");
    assert.ok(model.getRowPropertyByIndex(0, "editMode") == false, "gettRowPropertyByIndex");

    model.setRowPropertyById(newItem.id, "editMode", newItem["editMode"]);
    assert.deepEqual(model.getRowById(newItem.id).item, item, "setRowPropertyById");

    model.setRowPropertyByIndex(0, "test", newItem["editMode"]);
    assert.deepEqual(model.getRowById(newItem.id).item, item, "setRowPropertyByIndex");


    model.deleteRowByIndex(0);
    assert.ok(model.getRows().length == 0, "deleteRowByIndex");

    model.items.addItem(item);
    assert.ok(model.getRows().length == 1, "items.addItem");
    assert.deepEqual(model.getRows()[0].item, item, "items.addItem");

    model.deleteRow(model.getRows()[0]);
    assert.ok(model.getRows().length == 0, "deleteRow");

    model.items.setItems([item, item]);
    var dataItem = model.getRows()[0];
    var newItem = getItem();

    model.insertRowBeforeId(dataItem.id, model.createRow(newItem));

    assert.ok(model.getRows().length == 3, "insertRowBeforeId");
    assert.deepEqual(model.getRows()[0].item, newItem, "insertRowBeforeId");

    model.insertRowBeforeIndex(0, model.createRow(newItem));
    assert.ok(model.getRows().length == 4, "insertItemBeforeIndex");
    assert.deepEqual(model.getRows()[0].item, newItem, "items.insertItemBeforeIndex");

    var newItem = getItem();
    model.insertRowAfterId(dataItem.id, model.createRow(newItem));

    assert.ok(model.getRows().length == 5, "insertRowAfterId");
    assert.deepEqual(model.getRows()[3].item, newItem, "insertRowAfterId");

    model.insertRowAfterIndex(0, model.createRow(newItem));
    assert.ok(model.getRows().length == 6, "insertRowAfterIndex");
    assert.deepEqual(model.getRows()[1].item, newItem, "insertRowAfterIndex");


    model.items.setItems([getItem(), getItem()]);
    assert.ok(model.getRows().length == 2, "items.setItems");

    model.setRowsProperty("editMode", true);
    assert.ok(model.getRows()[0].editMode == true, "setRowsProperty");
    assert.ok(model.getRows()[1].editMode == true, "setRowsProperty");

    function getItem() {
        return { "test": Math.random(), "test2": Math.random() };
    }

});


