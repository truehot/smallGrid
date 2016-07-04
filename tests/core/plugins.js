QUnit.module("SmallGrid");
QUnit.test("Plugins", function (assert) {
    var $container = $('<div/>');
    var settings = SmallGrid.Settings.Create({});
    var columnModel = SmallGrid.Column.Create([], settings);
    var rowsModel = SmallGrid.Row.Create([], settings);

    var viewModel = SmallGrid.View.Model.Create(rowsModel, columnModel, settings);
    var view = SmallGrid.View.Create($container, viewModel, settings);
    var windowManager = SmallGrid.View.Window.Create(view, settings);

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


