QUnit.test("Columns", function (assert) {

    var model = new SmallGrid.Column.Create({}, SmallGrid.Settings.Default);

    assert.ok(model.getItems().length == 0, "Column.Create");
    assert.ok(model.isEmpty() == true, "isEmpty");
    assert.ok(model.total() == 0, "total");

    assert.ok(model.getItems().length == 0, "init");

    model.addItems([]);
    assert.ok(model.getItems().length == 0, "addItems");

    model.addColumns([]);
    assert.ok(model.getItems().length == 0, "addColumns");

    model.updateColumns([]);
    assert.ok(model.getItems().length == 0, "updateItems");

    model.deleteColumns();
    assert.ok(model.getItems().length == 0, "deleteItems");

    model.setItems([]);
    assert.ok(model.getItems().length == 0, "setItems");

    model.setColumns([]);
    assert.ok(model.getItems().length == 0, "setColumns");

    assert.ok(model.getItems().length == 0, "getItems");
    assert.ok(model.getColumns().length == 0, "getColumns");

    var item = getItem();
    var model = new SmallGrid.Column.Create([item], SmallGrid.Settings.Default);
    assert.ok(model.getItems().length == 1, "Data.Create");
    assert.ok(model.getColumns().length == 1, "Data.Create");
    assert.deepEqual(model.getColumns()[0].item, item, "Data.Create");

    model.updateItems([item]);
    assert.ok(model.getColumns().length == 1, "updateItems");
    assert.deepEqual(model.getColumns()[0].item, item, "updateItems");

    model.deleteItems([item]);
    assert.ok(model.getColumns().length == 0, "deleteItems");

    model.setItems([item]);
    assert.ok(model.getColumns().length == 1, "setItems");
    assert.deepEqual(model.getColumns()[0].item, item, "setItems");

    assert.deepEqual(model.getColumnById(model.getColumns()[0].id), model.getColumnByIndex(0), "getColumnById && getColumnByIndex");
    assert.deepEqual(model.getColumnByIndex(0).item, item, "getColumnByIndex");
    assert.deepEqual(model.getColumnById(model.getColumns()[0].id).item, item, "getColumnById");

    assert.deepEqual(model.getColumnById(model.getColumns()[0].id), model.getColumnByIndex(0), "getColumnById && getColumnByIndex");
    assert.deepEqual(model.getColumnByIndex(0).item, item, "getColumnByIndex");
    assert.deepEqual(model.getColumnById(model.getColumns()[0].id).item, item, "getColumnById");

    model.deleteItemById(model.getColumns()[0].id);
    assert.ok(model.getColumns().length == 0, "deleteItemById");

    model.setItems([item]);
    assert.ok(model.getColumns().length == 1, "setItems");

    var newItem = model.getColumns()[0];
    model.updateItem(newItem);
    assert.deepEqual(model.getColumns()[0], newItem, "updateItem");

    model.updateItemById(newItem.id, newItem.item);
    assert.deepEqual(model.getColumns()[0], newItem, "updateItemById");

    model.updateColumnByIndex(0, newItem);
    assert.deepEqual(model.getColumns()[0], newItem, "updateColumnByIndex");

    model.updateItems([newItem]);
    assert.deepEqual(model.getColumns()[0], newItem, "updateItems");


    assert.ok(model.getColumnIdByIndex(0) == newItem.id, "getColumnIdByIndex");
    assert.ok(model.getColumnIndexById(newItem.id) == 0, "getColumnIndexById");

    //assert.ok(model.getColumnPropertyById(newItem.id, "hidden") == false, "getColumnPropertyById");
    //assert.ok(model.getColumnPropertyByIndex(0, "hidden") == false, "gettColumnPropertyByIndex");

    //model.setColumnPropertyById(newItem.id, "hidden", newItem["hidden"]);
    //assert.deepEqual(model.getColumnById(newItem.id).item, item, "setColumnPropertyById");

    //model.setColumnPropertyByIndex(0, "test", newItem["hidden"]);
    //assert.deepEqual(model.getColumnById(newItem.id).item, item, "setColumnPropertyByIndex");


    model.deleteColumnByIndex(0);
    assert.ok(model.getColumns().length == 0, "deleteColumnByIndex");

    model.addItem(item);
    assert.ok(model.getColumns().length == 1, "addItem");
    assert.deepEqual(model.getColumns()[0].item, item, "addItem");

    model.deleteColumn(model.getColumns()[0]);
    assert.ok(model.getColumns().length == 0, "deleteColumn");

    model.setItems([item, item]);
    var dataItem = model.getColumns()[0];
    var newItem = getItem();

    model.insertColumnBeforeId(dataItem.id, model.createColumn(newItem));

    assert.ok(model.getColumns().length == 3, "insertColumnBeforeId");
    assert.deepEqual(model.getColumns()[0].item, newItem, "insertColumnBeforeId");

    model.insertColumnBeforeIndex(0, model.createColumn(newItem));
    assert.ok(model.getColumns().length == 4, "insertItemBeforeIndex");
    assert.deepEqual(model.getColumns()[0].item, newItem, "insertItemBeforeIndex");

    var newItem = getItem();
    model.insertColumnAfterId(dataItem.id, model.createColumn(newItem));

    assert.ok(model.getColumns().length == 5, "insertColumnAfterId");
    assert.deepEqual(model.getColumns()[3].item, newItem, "insertColumnAfterId");

    model.insertColumnAfterIndex(0, model.createColumn(newItem));
    assert.ok(model.getColumns().length == 6, "insertColumnAfterIndex");
    assert.deepEqual(model.getColumns()[1].item, newItem, "insertColumnAfterIndex");


    model.setItems([getItem(), getItem()]);
    assert.ok(model.getColumns().length == 2, "setItems");

    //model.setColumnsProperty("hidden", true);
    //assert.ok(model.getColumns()[0].hidden == true, "setColumnsProperty");
    //assert.ok(model.getColumns()[1].hidden == true, "setColumnsProperty");

    function getItem() {
        return {
            "cssClass": "",
            "cssFormatter": null,
            "dataFormatter": null,
            "editor": null,
            "editorArg": null,
            "field": Math.random(),
            "filterable": false,
            "maxWidth": 9999,
            "minWidth": 10,
            "resizable": false,
            "sortable": false,
            "template": "",
            "test": 0.4112587209923818,
            "test2": 0.6235248450282617,
            "title": "",
            "toolTip": null,
            "width": 20
        };
    }
});



