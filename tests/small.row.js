QUnit.test("Rows", function (assert) {

    var model = new SmallGrid.Row.Create({}, SmallGrid.Settings.Default);

    assert.ok(model.getItems().length == 0, "Row.Create");
    assert.ok(model.isEmpty() == true, "isEmpty");
    assert.ok(model.total() == 0, "total");

    assert.ok(model.getItems().length == 0, "init");

    model.addItems([]);
    assert.ok(model.getItems().length == 0, "addItems");

    model.addRows([]);
    assert.ok(model.getItems().length == 0, "addRows");

    model.updateRows([]);
    assert.ok(model.getItems().length == 0, "updateItems");

    model.deleteRows();
    assert.ok(model.getItems().length == 0, "deleteItems");

    model.setItems([]);
    assert.ok(model.getItems().length == 0, "setItems");

    model.setRows([]);
    assert.ok(model.getItems().length == 0, "setRows");

    assert.ok(model.getItems().length == 0, "getItems");
    assert.ok(model.getRows().length == 0, "getRows");

    var item = getItem();
    var model = new SmallGrid.Row.Create([item], SmallGrid.Settings.Default);
    assert.ok(model.getItems().length == 1, "Data.Create");
    assert.ok(model.getRows().length == 1, "Data.Create");
    assert.deepEqual(model.getRows()[0].item, item, "Data.Create");

    model.updateItems([item]);
    assert.ok(model.getRows().length == 1, "updateItems");
    assert.deepEqual(model.getRows()[0].item, item, "updateItems");

    model.deleteItems([item]);
    assert.ok(model.getRows().length == 0, "deleteItems");

    model.setItems([item]);
    assert.ok(model.getRows().length == 1, "setItems");
    assert.deepEqual(model.getRows()[0].item, item, "setItems");

    assert.deepEqual(model.getRowById(model.getRows()[0].id), model.getRowByIndex(0), "getRowById && getRowByIndex");
    assert.deepEqual(model.getRowByIndex(0).item, item, "getRowByIndex");
    assert.deepEqual(model.getRowById(model.getRows()[0].id).item, item, "getRowById");

    assert.deepEqual(model.getRowById(model.getRows()[0].id), model.getRowByIndex(0), "getRowById && getRowByIndex");
    assert.deepEqual(model.getRowByIndex(0).item, item, "getRowByIndex");
    assert.deepEqual(model.getRowById(model.getRows()[0].id).item, item, "getRowById");

    model.deleteItemById(model.getRows()[0].id);
    assert.ok(model.getRows().length == 0, "deleteItemById");

    model.setItems([item]);
    assert.ok(model.getRows().length == 1, "setItems");

    var newItem = model.getRows()[0];
    model.updateItem(newItem);
    assert.deepEqual(model.getRows()[0], newItem, "updateItem");

    model.updateItemById(newItem.id, newItem.item);
    assert.deepEqual(model.getRows()[0], newItem, "updateItemById");

    model.updateRowByIndex(0, newItem);
    assert.deepEqual(model.getRows()[0], newItem, "updateRowByIndex");

    model.updateItems([newItem]);
    assert.deepEqual(model.getRows()[0], newItem, "updateItems");


    assert.ok(model.getRowIdByIndex(0) == newItem.id, "getRowIdByIndex");
    assert.ok(model.getRowIndexById(newItem.id) == 0, "getRowIndexById");

    //assert.ok(model.getRowPropertyById(newItem.id, "hidden") == false, "getRowPropertyById");
    //assert.ok(model.getRowPropertyByIndex(0, "hidden") == false, "gettRowPropertyByIndex");

    //model.setRowPropertyById(newItem.id, "hidden", newItem["hidden"]);
    //assert.deepEqual(model.getRowById(newItem.id).item, item, "setRowPropertyById");

    //model.setRowPropertyByIndex(0, "test", newItem["hidden"]);
    //assert.deepEqual(model.getRowById(newItem.id).item, item, "setRowPropertyByIndex");


    model.deleteRowByIndex(0);
    assert.ok(model.getRows().length == 0, "deleteRowByIndex");

    model.addItem(item);
    assert.ok(model.getRows().length == 1, "addItem");
    assert.deepEqual(model.getRows()[0].item, item, "addItem");

    model.deleteRow(model.getRows()[0]);
    assert.ok(model.getRows().length == 0, "deleteRow");

    model.setItems([item, item]);
    var dataItem = model.getRows()[0];
    var newItem = getItem();

    model.insertRowBeforeId(dataItem.id, model.createRow(newItem));

    assert.ok(model.getRows().length == 3, "insertRowBeforeId");
    assert.deepEqual(model.getRows()[0].item, newItem, "insertRowBeforeId");

    model.insertRowBeforeIndex(0, model.createRow(newItem));
    assert.ok(model.getRows().length == 4, "insertItemBeforeIndex");
    assert.deepEqual(model.getRows()[0].item, newItem, "insertItemBeforeIndex");

    var newItem = getItem();
    model.insertRowAfterId(dataItem.id, model.createRow(newItem));

    assert.ok(model.getRows().length == 5, "insertRowAfterId");
    assert.deepEqual(model.getRows()[3].item, newItem, "insertRowAfterId");

    model.insertRowAfterIndex(0, model.createRow(newItem));
    assert.ok(model.getRows().length == 6, "insertRowAfterIndex");
    assert.deepEqual(model.getRows()[1].item, newItem, "insertRowAfterIndex");


    model.setItems([getItem(), getItem()]);
    assert.ok(model.getRows().length == 2, "setItems");

    //model.setRowsProperty("hidden", true);
    //assert.ok(model.getRows()[0].hidden == true, "setRowsProperty");
    //assert.ok(model.getRows()[1].hidden == true, "setRowsProperty");

    function getItem() {
        return { "test": Math.random(), "test2": Math.random() };
    }

});

