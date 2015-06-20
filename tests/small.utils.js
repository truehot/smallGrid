QUnit.test("Utils", function (assert) {

    assert.ok(
        (Small.Utils.isFunction("isFunction", Small.Utils) &&
        Small.Utils.isFunction("isFunction1", Small.Utils) === false) === true,
        "isFunction"
   );

    assert.ok(
        (Small.Utils.isProperty("id", { ids: 55 }) == false &&
        Small.Utils.isProperty("id", { ID: 55 }) == false &&
        Small.Utils.isProperty("id", { id: false }) == true &&
        Small.Utils.isProperty("id", { id: 55 }) == true &&
        Small.Utils.isProperty("id", { id: 0 }) == true) === true,
        "isProperty"
   );

    var result = true;
    for (var i = 0; i < 1000; i++) {
        if (Small.Utils.getNewGuid() == Small.Utils.getNewGuid()) {
            result = false;
        }
    }
    assert.ok(result, "getNewGuid");

    assert.ok(
        Small.Utils.parseBool(false) === false &&
        Small.Utils.parseBool(true) === true &&
        Small.Utils.parseBool("false") === false &&
        Small.Utils.parseBool("true") === true &&
        Small.Utils.parseBool("FALSE") === false &&
        Small.Utils.parseBool("TRUE") === true,
        "parseBool"
     );
});