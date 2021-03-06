QUnit.module("SmallGrid");
QUnit.test("Utils", function (assert) {

    assert.ok(
        (SmallGrid.Utils.isFunction("isFunction", SmallGrid.Utils) &&
        SmallGrid.Utils.isFunction("isFunction1", SmallGrid.Utils) === false) === true,
        "isFunction"
   );

    assert.ok(
        (SmallGrid.Utils.isProperty("id", { ids: 55 }) === false &&
        SmallGrid.Utils.isProperty("id", { ID: 55 }) === false &&
        SmallGrid.Utils.isProperty("id", { id: false }) === true &&
        SmallGrid.Utils.isProperty("id", { id: 55 }) === true &&
        SmallGrid.Utils.isProperty("id", { id: 0 }) === true) === true,
        "isProperty"
   );

    var result = true;
    for (var i = 0; i < 1000; i++) {
        if (SmallGrid.Utils.createGuid() === SmallGrid.Utils.createGuid()) {
            result = false;
        }
    }
    assert.ok(result, "createGuid");

    result = true;
    for (i = 0; i < 1000; i++) {
        if (SmallGrid.Utils.createId() === SmallGrid.Utils.createId()) {
            result = false;
        }
    }
    assert.ok(result, "createId");

    assert.ok(
        SmallGrid.Utils.parseBool(false) === false &&
        SmallGrid.Utils.parseBool(true) === true &&
        SmallGrid.Utils.parseBool("false") === false &&
        SmallGrid.Utils.parseBool("true") === true &&
        SmallGrid.Utils.parseBool("FALSE") === false &&
        SmallGrid.Utils.parseBool("TRUE") === true,
        "parseBool"
     );

    assert.ok(SmallGrid.Utils.changeSortOrder(5) === SmallGrid.Utils.changeSortOrder(10) && SmallGrid.Utils.changeSortOrder(-15) === SmallGrid.Utils.changeSortOrder(-1), "changeSortOrder");

});