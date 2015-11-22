QUnit.test("Query.Sort", function (assert) {

    var test = {
        "test1": "test1",
        "test2": "test2",
        "test3": "test3",
    }

    var sorter = new SmallGrid.Query.SorterQuery(test.test1, test.test2, test.test3);

    assert.equal(sorter.getField(), test.test1, "getField");
    assert.equal(sorter.getSortOrder(), test.test2, "getSortOrder");
    assert.equal(sorter.getSortComparer(), test.test3, "getSortComparer");

});


