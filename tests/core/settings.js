QUnit.module("SmallGrid");
QUnit.test("Settings", function (assert) {

    var settings = SmallGrid.Settings.Create({});
    assert.ok(Object.keys(settings).length !== 0, "Settings.Create");

    assert.ok(settings["uid"] !== undefined, "uid");
    assert.ok(settings["cellOuterSize"] !== undefined, "cellOuterSize");
    assert.ok(settings["scrollbarDimensions"] !== undefined, "scrollbarDimensions");
    assert.ok(settings["maxSupportedCssHeight"] !== undefined, "maxSupportedCssHeigh");

    var value = Math.random();
    var settings1 = jQuery.extend({}, settings);
    settings1["maxSupportedCssHeight"] = value;
    settings["maxSupportedCssHeight"] = value;
    assert.deepEqual(settings1, settings, "setSettings");

});


