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


    var filter1 = new SmallGrid.Query.FilterQuery('property1', settings).contains("6");
    var filter2 = new SmallGrid.Query.FilterQuery('field', settings).contains("property6");
    var sorter = new SmallGrid.Query.SorterQuery('property1', 1, "Default", settings);
    var rowsRequestFS = new SmallGrid.Query.Request([filter1], [sorter], rowsModel);
    var columnsRequestFS = new SmallGrid.Query.Request([filter2], [sorter], columnsModel);

    assert.ok(rowsRequest.getRowsTotal(2).height == 1320, "getRowsTotal");
    assert.deepEqual(rowsRequest.getRowsTotal(20), { count: 60, height: 2400 }, "getRowsTotal");

    assert.equal(rowsRequest.getRowsInRange(1, 5, 2)[0].item.property1, 11, "getRowsInRange");
    assert.equal(rowsRequestFS.getRowsInRange(1, 5, 2)[0].item.property1, 61, "getRowsInRange");
    assert.equal(rowsRequest.getRowsInRange(2000, 500, 20)[0].item.property1, 371, "getRowsInRange");

    assert.equal(columnsRequest.getColumnsTotal(5).width, 3300, "getColumnsTotal");
    assert.deepEqual(columnsRequest.getColumnsTotal(100), { count: 60, width: 9000 }, "getColumnsTotal");

    assert.equal(columnsRequest.getColumnsInRange(0, 200, 4)[0].item.property1, 11, "getColumnsInRange");
    assert.equal(columnsRequestFS.getColumnsInRange(0, 200, 4)[0].item.property1, 11, "getColumnsInRange");//only rows filters supported
    assert.equal(columnsRequest.getColumnsInRange(1000, 250, 10)[0].item.property1, 131, "getColumnsInRange");
});


