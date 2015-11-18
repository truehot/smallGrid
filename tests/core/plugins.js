QUnit.test("Plugins", function (assert) {
    var $container = $('<div/>');
    var settings = new SmallGrid.Settings.Create({});
    var columnModel = new SmallGrid.Column.Create([], settings);
    var rowsModel = new SmallGrid.Row.Create([], settings);

    var viewModel = new SmallGrid.View.Model.Create(columnModel, rowsModel, settings);
    var view = new SmallGrid.View.Create($container, viewModel, settings);
    var windowManager = new SmallGrid.View.Window.Create(view, settings);

    var plugin = SmallGrid.Plugins.Create("CellEdit", view, windowManager, settings, {});
    assert.ok(plugin instanceof SmallGrid.Plugins.CellEdit, "Create 1");

    plugin = SmallGrid.Plugins.Create("CellEdit123", view, windowManager, settings, {})
    assert.ok((plugin instanceof SmallGrid.Plugins.CellEdit) === false, "Create 2");

});


