QUnit.test("Grid", function (assert) {

    var $div = $('<div/>');

    var grid = new Small.Grid.Create($div, [], [], { "explicitInitialization": true, plugins: ["ColumnSort"] });
    var settings = grid.getSettings();
    assert.ok(settings["explicitInitialization"] == true, "getSettings");

    assert.deepEqual(grid.getView(), {}, "getView 1");
    grid.init();
    assert.notDeepEqual(grid.getView(), {}, "getView 2");

    assert.notDeepEqual(grid.getViewModel(), {}, "getViewModel 1");
    assert.ok(grid.getViewModel() instanceof Small.View.Model, "getViewModel 2");

    assert.ok(grid.isRegisteredPlugin('ColumnSort'), "isRegisteredPlugin 1");
    assert.ok(grid.isRegisteredPlugin('ColumnSort1') == false, "isRegisteredPlugin 2");

    grid.unregisterPlugin('ColumnSort');
    assert.ok(grid.isRegisteredPlugin('ColumnSort') == false, "unregisterPlugin");

    grid.registerPlugin('ColumnSort');
    assert.ok(grid.isRegisteredPlugin('ColumnSort') == true, "registerPlugin");

    grid.unregisterPlugins();
    assert.ok(grid.isRegisteredPlugin('ColumnSort') == false, "unregisterPlugins");
});


