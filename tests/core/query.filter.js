QUnit.test("Query.Filter", function (assert) {

    var settings = new SmallGrid.Settings.Create({});
    var filter1 = new SmallGrid.Query.FilterQuery('test', settings).and();
    var filter2 = new SmallGrid.Query.FilterQuery('test', settings).add("and", "");

    assert.deepEqual(filter1.get(), filter2.get(), "Result query check 1");
    assert.deepEqual(filter1.get(), [{ action: "and" }], "Result query check 2");
    assert.ok(filter1.getField() == filter2.getField(), "Field compare 1");
    assert.ok(filter1.getField() == 'test', "Field compare 2");
    assert.ok(filter1.getId() != filter2.getId(), "Generated id");

    filter1.clear();
    filter2.clear();
    assert.deepEqual(filter1.get(), [], "Clear");

    filter1.contains(1);
    assert.deepEqual(filter1.get(), [{ action: "contains", "value": 1 }], "Check contains");

    filter1.clear();
    filter1.eq(1);
    assert.deepEqual(filter1.get(), [{ action: "eq", "value": 1 }], "Check eq");

    filter1.clear();
    filter1.neq(1);
    assert.deepEqual(filter1.get(), [{ action: "neq", "value": 1 }], "Check neq");

    filter1.clear();
    filter1.startswith(1);
    assert.deepEqual(filter1.get(), [{ action: "startsWith", "value": 1 }], "Check startswith");

    filter1.clear();
    filter1.endswith(1);
    assert.deepEqual(filter1.get(), [{ action: "endsWith", "value": 1 }], "Check endswith");

    filter1.clear();
    filter1.doesnotcontain(1);
    assert.deepEqual(filter1.get(), [{ action: "doesNotContain", "value": 1 }], "Check doesnotcontain");

});


