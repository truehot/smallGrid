QUnit.module("SmallGrid");
QUnit.test("Plugins", function (assert) {
    var $container = $('<div/>');
    var settings = new SmallGrid.Settings.Create({});
    var columnModel = new SmallGrid.Column.Create([], settings);
    var rowsModel = new SmallGrid.Row.Create([], settings);

    var viewModel = new SmallGrid.View.Model.Create(rowsModel, columnModel, settings);
    var view = new SmallGrid.View.Create($container, viewModel, settings);
    var windowManager = new SmallGrid.View.Window.Create(view, settings);

    var plugin = SmallGrid.Plugins.Create("CellEdit", { view: view, windowManager: windowManager }, settings, {});
    assert.ok(plugin instanceof SmallGrid.Plugins.CellEdit, "Create");

    assert.throws(
        function () { SmallGrid.Plugins.Create("CellEdit123", { view: view, windowManager: windowManager }, settings, {}) },
        TypeError,
        "Create"
    );

    viewModel.destroy();
    view.destroy();
});


