QUnit.module("SmallGrid.Query");
QUnit.test("Request", function (assert) {


    var columns = [];
    for (var i = 1; i <= 60; i++) {
        var column = { 'name': "Column", 'field': "property" + i };
        for (var ii = 1; ii < 6; ii++) {
            column["property" + ii] = i + '' + ii;
        }
        columns.push(column);
    }


    var items = [];
    for (var i = 1; i <= 60; i++) {
        var item = {};
        for (var ii = 1; ii < 6; ii++) {
            item["property" + ii] = i + '' + ii;
        }
        items.push(item);
    }

    var settings = SmallGrid.Settings.Create();
    var columnsModel = new SmallGrid.Column.Create(columns, settings);
    var rowsModel = new SmallGrid.Row.Create(items, settings);
    var rowsRequest = new SmallGrid.Query.Request([], [], rowsModel);
    var columnsRequest = new SmallGrid.Query.Request([], [], columnsModel);


    assert.ok(rowsRequest.getRowsHeight(2) == 1320, "getRowsHeight");
    assert.ok(rowsRequest.getRowsHeight(20) == 2400, "getRowsHeight");

    assert.ok(rowsRequest.getRowsInRange(1, 5, 2)[0].item.property1 == "11", "getRowsInRange");
    assert.ok(rowsRequest.getRowsInRange(2000, 500, 20)[0].item.property1 == "371", "getRowsInRange");


    assert.ok(columnsRequest.getColumnsWidth(5) == 3300, "getColumnsWidth");
    assert.ok(columnsRequest.getColumnsWidth(100) == 9000, "getColumnsWidth");

    assert.ok(columnsRequest.getColumnsInRange(0, 200, 4)[0].item.property1 == "11", "getColumnsInRange");
    assert.ok(columnsRequest.getColumnsInRange(1000, 250, 10)[0].item.property1 == "131", "getColumnsInRange");
});


