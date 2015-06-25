QUnit.test("Settings", function (assert) {

    var settings = new SmallGrid.Settings.Create({});
    assert.ok(settings.length != 0, "Settings.Create");
    assert.ok(settings["Utils"] == SmallGrid.Utils, "getSettings");

    var value = Math.random();
    settings["maxSupportedCssHeight"] = value;
    assert.ok(settings["maxSupportedCssHeight"] == value, "setSettings");

    var value = Math.random();
    var settings1 = jQuery.extend({}, settings);
    settings1["maxSupportedCssHeight"] = value;
    settings["maxSupportedCssHeight"] = value;
    assert.deepEqual(settings1, settings, "setSettings");

});


