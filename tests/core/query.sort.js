QUnit.module("SmallGrid.Query");
QUnit.test("Sort", function (assert) {
    var test = {
        "test1": "test1",
        "test2": "test2",
        "test3": "test3"
    };

    var sorter = new SmallGrid.Query.Sorter(test.test1, test.test2, test.test3);
    var sorter2 = new SmallGrid.Query.Sorter(test.test1, test.test2, test.test3);

    assert.ok(sorter.getId() !== sorter2.getId(), "getId");
    assert.equal(sorter.getField(), test.test1, "getField");
    assert.equal(sorter.getSortOrder(), test.test2, "getSortOrder");
    assert.equal(sorter.getSortComparer(), test.test3, "getSortComparer");

});

