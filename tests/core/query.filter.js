QUnit.module("SmallGrid.Query");
QUnit.test("Filter", function (assert) {

    var settings = SmallGrid.Settings.Create({});
    var filter1 = new SmallGrid.Query.FilterQuery('test').and();
    var filter2 = new SmallGrid.Query.FilterQuery('test').add("and", "");

    assert.deepEqual(filter1.get(), filter2.get(), "get");
    assert.deepEqual(filter1.get(), [{ action: "and" }], "get");
    assert.ok(filter1.getField() == filter2.getField(), "getField");
    assert.ok(filter1.getField() == 'test', "getField");
    assert.ok(filter1.getId() != filter2.getId(), "getId");

    filter1.clear();
    filter2.clear();
    assert.deepEqual(filter1.get(), [], "clear");

    filter1.contains(1);
    assert.deepEqual(filter1.get(), [{ action: "contains", "value": 1 }], "contains");

    filter1.clear();
    filter1.eq(1);
    assert.deepEqual(filter1.get(), [{ action: "eq", "value": 1 }], "eq");

    filter1.clear();
    filter1.neq(1);
    assert.deepEqual(filter1.get(), [{ action: "neq", "value": 1 }], "neq");

    filter1.clear();
    filter1.startswith(1);
    assert.deepEqual(filter1.get(), [{ action: "startsWith", "value": 1 }], "startswith");

    filter1.clear();
    filter1.endswith(1);
    assert.deepEqual(filter1.get(), [{ action: "endsWith", "value": 1 }], "endswith");

    filter1.clear();
    filter1.doesnotcontain(1);
    assert.deepEqual(filter1.get(), [{ action: "doesNotContain", "value": 1 }], "doesnotcontain");

});


