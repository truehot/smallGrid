QUnit.module("SmallGrid");
QUnit.test("Column", function (assert) {
    var model = new SmallGrid.Column.Create([], SmallGrid.Settings.Create());

    assert.ok(model.items.getItems().length == 0, "Column.Create");
    assert.ok(model.isEmpty() == true, "isEmpty");
    assert.ok(model.total() == 0, "total");

    assert.ok(model.items.getItems().length == 0, "init");

    var item = getItem();
    model.items.addItems([item]);
    assert.equal(model.items.getItems().length, 1, "items.addItems");
    assert.deepEqual(model.items.getItems()[0], item, "items.addItems");
    model.deleteColumns();

    model.items.addItems([]);
    assert.ok(model.items.getItems().length == 0, "items.addItems");

    model.addColumns([]);
    assert.ok(model.items.getItems().length == 0, "items.addColumns");

    model.updateColumns([]);
    assert.ok(model.items.getItems().length == 0, "updateItems");

    model.deleteColumns();
    assert.ok(model.items.getItems().length == 0, "items.deleteItems");

    model.items.setItems([]);
    assert.ok(model.items.getItems().length == 0, "items.setItems");

    model.setColumns([]);
    assert.ok(model.items.getItems().length == 0, "setColumns");

    assert.ok(model.items.getItems().length == 0, "items.getItems");
    assert.ok(model.getColumns().length == 0, "getColumns");

    var item = getItem();
    var model = new SmallGrid.Column.Create([item], SmallGrid.Settings.Create());
    assert.ok(model.items.getItems().length == 1, "Data.Create");
    assert.ok(model.getColumns().length == 1, "Data.Create");
    assert.deepEqual(model.getColumns()[0].item, item, "Data.Create");

    model.items.updateItems([item]);
    assert.ok(model.getColumns().length == 1, "items.updateItems");
    assert.deepEqual(model.getColumns()[0].item, item, "items.updateItems");

    model.items.deleteItems();
    assert.ok(model.getColumns().length == 0, "items.deleteItems");

    model.items.setItems([item]);
    assert.ok(model.getColumns().length == 1, "items.setItems");
    assert.deepEqual(model.getColumns()[0].item, item, "items.setItems");

    assert.deepEqual(model.getColumnById(model.getColumns()[0].id), model.getColumnByIndex(0), "getColumnById && getColumnByIndex");
    assert.deepEqual(model.getColumnByIndex(0).item, item, "getColumnByIndex");
    assert.deepEqual(model.getColumnById(model.getColumns()[0].id).item, item, "getColumnById");

    assert.deepEqual(model.getColumnById(model.getColumns()[0].id), model.getColumnByIndex(0), "getColumnById && getColumnByIndex");
    assert.deepEqual(model.getColumnByIndex(0).item, item, "getColumnByIndex");
    assert.deepEqual(model.getColumnById(model.getColumns()[0].id).item, item, "getColumnById");

    model.items.deleteItemById(model.getColumns()[0].id);
    assert.ok(model.getColumns().length == 0, "items.deleteItemById");

    model.items.setItems([item]);
    assert.ok(model.getColumns().length == 1, "items.setItems");

    var newItem = model.getColumns()[0];
    model.items.updateItem(newItem);
    assert.deepEqual(model.getColumns()[0], newItem, "items.updateItem");

    model.items.updateItemById(newItem.id, newItem.item);
    assert.deepEqual(model.getColumns()[0], newItem, "items.updateItemById");

    model.items.updateItemByIndex(0, newItem.item);
    assert.deepEqual(model.getColumns()[0], newItem, "items.updateItemByIndex");

    model.updateColumnByIndex(0, newItem);
    assert.deepEqual(model.getColumns()[0], newItem, "updateColumnByIndex");

    model.items.updateItems([newItem]);
    assert.deepEqual(model.getColumns()[0], newItem, "items.updateItems");


    assert.ok(model.getColumnIdByIndex(0) == newItem.id, "getColumnIdByIndex");
    assert.ok(model.getColumnIndexById(newItem.id) == 0, "getColumnIndexById");

    assert.ok(model.getColumnPropertyById(newItem.id, "editMode") == false, "getColumnPropertyById");
    assert.ok(model.getColumnPropertyByIndex(0, "editMode") == false, "gettColumnPropertyByIndex");

    model.setColumnPropertyById(newItem.id, "editMode", newItem["editMode"]);
    assert.deepEqual(model.getColumnById(newItem.id).item, item, "setColumnPropertyById");

    model.setColumnPropertyByIndex(0, "test", newItem["editMode"]);
    assert.deepEqual(model.getColumnById(newItem.id).item, item, "setColumnPropertyByIndex");


    model.deleteColumnByIndex(0);
    assert.ok(model.getColumns().length == 0, "deleteColumnByIndex");

    model.items.addItem(item);
    assert.ok(model.getColumns().length == 1, "items.addItem");
    assert.deepEqual(model.getColumns()[0].item, item, "items.addItem");

    model.deleteColumn(model.getColumns()[0]);
    assert.ok(model.getColumns().length == 0, "deleteColumn");

    model.items.setItems([item, item]);
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


    model.items.setItems([getItem(), getItem()]);
    assert.ok(model.getColumns().length == 2, "items.setItems");

    model.setColumnsProperty("editMode", true);
    assert.ok(model.getColumns()[0].editMode == true, "setColumnsProperty");
    assert.ok(model.getColumns()[1].editMode == true, "setColumnsProperty");


    function getItem() {
        return {
            "cssClass": "",
            "cssFormatter": null,
            "dataFormatter": null,
            "editor": null,
            "editorArg": null,
            "field": Math.random(),
            "filterable": false,
            "hidden": false,
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



