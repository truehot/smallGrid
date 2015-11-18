QUnit.test("Grid", function (assert) {

    var $div = $('<div/>');

    var grid = new SmallGrid.Grid.Create($div, [], [], { "explicitInitialization": true, plugins: { "ColumnSort": {}} });
    var settings = grid.getSettings();
    grid.unregisterPlugins();
    assert.ok(settings["explicitInitialization"] == true, "getSettings");

    assert.deepEqual(grid.getView(), {}, "getView 1");
    grid.init();
    assert.notDeepEqual(grid.getView(), {}, "getView 2");

    assert.notDeepEqual(grid.getViewModel(), {}, "getViewModel 1");
    assert.ok(grid.getViewModel() instanceof SmallGrid.View.Model.Model, "getViewModel 2");

    assert.ok(grid.isRegisteredPlugin('ColumnSort'), "isRegisteredPlugin 1");
    assert.ok(grid.isRegisteredPlugin('ColumnSort1') == false, "isRegisteredPlugin 2");

    assert.ok(Object.keys(grid.getPlugins()).length > 0, "getPlugins");
    assert.ok(grid.getPlugin('ColumnSort') !== undefined, "getPlugin");
 
    grid.unregisterPlugin('ColumnSort');

    assert.ok(grid.isRegisteredPlugin('ColumnSort') == false, "unregisterPlugin");

    grid.registerPlugin('ColumnSort');
    assert.ok(grid.isRegisteredPlugin('ColumnSort') == true, "registerPlugin");

    grid.unregisterPlugins();
    assert.ok(grid.isRegisteredPlugin('ColumnSort') == false, "unregisterPlugins");

    assert.ok(grid.getWindowManager() instanceof SmallGrid.View.Window.Manager, "getWindowManager");
});


