QUnit.module("SmallGrid.Query");
QUnit.test("Column.Request", function (assert) {

    var columns = [];
    for (var i = 1; i <= 60; i++) {
        var column = { 'name': "Column", 'field': "property" + i };
        for (var ii = 1; ii < 6; ii++) {
            column["property" + ii] = i + '' + ii;
        }
        columns.push(column);
    }


    var settings = SmallGrid.Settings.Create();
    var columnsModel = new SmallGrid.Column.Create(columns, settings);
    var columnsRequest = new SmallGrid.Query.Column.Request(columnsModel);

    assert.equal(columnsRequest.getColumnsTotal(5).width, 3300, "getColumnsTotal");
    assert.deepEqual(columnsRequest.getColumnsTotal(100), { count: 60, width: 9000 }, "getColumnsTotal");

    assert.equal(columnsRequest.getColumnsInRange(0, 200, 4)[0].item.property1, 11, "getColumnsInRange");
    assert.equal(columnsRequest.getColumnsInRange(1000, 250, 10)[0].item.property1, 131, "getColumnsInRange");
});


