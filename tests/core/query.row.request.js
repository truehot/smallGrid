QUnit.module("SmallGrid.Query");
QUnit.test("Row.Request", function (assert) {

    var items = [];
    for (var i = 1; i <= 60; i++) {
        var item = {};
        for (var ii = 1; ii < 6; ii++) {
            item["property" + ii] = i + '' + ii;
        }
        items.push(item);
    }

    var filter1 = new SmallGrid.Query.Filter('property1').contains("6");
    var sorter = new SmallGrid.Query.Sorter('property1', 1, "Default");
    var settings = SmallGrid.Settings.Create();
    var rowsModel = new SmallGrid.Row.Create(items, settings);
    var rowsRequest = new SmallGrid.Query.Row.Create(rowsModel);

    assert.ok(rowsRequest.getRowsTotal(2, []).height === 1320, "getRowsTotal");
    assert.deepEqual(rowsRequest.getRowsTotal(20, []), { count: 60, height: 2400 }, "getRowsTotal");
    assert.deepEqual(rowsRequest.getRowsTotal(20, [filter1]), { count: 7, height: 280 }, "getRowsTotal (filtered)");
    assert.deepEqual(rowsRequest.getRowsTotal(20, [filter1]), { count: 7, height: 280 }, "getRowsTotal (filtered)");
    assert.equal(rowsRequest.getRowsInRange(1, 5, 2, [], [])[0].item.property1, 11, "getRowsInRange");
    assert.equal(rowsRequest.getRowsInRange(1, 5, 2, [sorter], [filter1])[0].item.property1, 61, "getRowsInRange (sorted and filtered)");
    assert.equal(rowsRequest.getRowsInRange(2000, 500, 20, [], [])[0].item.property1, 371, "getRowsInRange");

    rowsRequest.getRowsCallback(function (item) { item.item.property1 = 10000; }, [filter1]);
    assert.equal(rowsModel.getRows()[5].item.property1, 10000, "getRowsCallback");
});


