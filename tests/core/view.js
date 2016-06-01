QUnit.module("SmallGrid");
QUnit.test("View", function (assert) {
    var $wrapper = $('<div style="width:500px; height:500px;"/>');
    $wrapper.appendTo('#qunit-fixture');

    var settings = SmallGrid.Settings.Create();
    var rowModel = new SmallGrid.Row.Create([], settings);
    var columnModel = new SmallGrid.Column.Create([], settings);
    var viewModel = SmallGrid.View.Model.Create(rowModel, columnModel, settings);

    var view = new SmallGrid.View.Create($wrapper, viewModel, settings);

    assert.deepEqual(view.getCellNodeById(0), undefined, "getCellNodeById");

    assert.deepEqual(view.getCellNodeByIndex(0), undefined, "getCellNodeByIndex");
    assert.deepEqual(view.getModel(), viewModel, "getModel");
    assert.deepEqual(view.getNode('content').html(), $wrapper.find('.grid-content').html(), "getNode");
    assert.deepEqual(view.getRowNodeById(0), undefined, "getRowNodeById");
    assert.deepEqual(view.getRowNodeByIndex(0), undefined, "getRowNodeByIndex");
    assert.deepEqual(view.isCellVisible(0), false, "isCellVisible");
    assert.deepEqual(view.isColumnVisible(0), false, "isColumnVisible");
    assert.deepEqual(view.isHorisontalScrollVisible(0), false, "isHorisontalScrollVisible");
    assert.deepEqual(view.isRowVisible(0), false, "isRowVisible");
    assert.deepEqual(view.isSuspended(), false, "isSuspended");
    assert.deepEqual(view.isVerticalScrollVisible(), false, "isVerticalScrollVisible");
    assert.deepEqual(view.render(), view, "render");
    assert.deepEqual(view.resize(), view, "resize");
    assert.deepEqual(view.resizeColumns(), view, "resizeColumns");

    var suspendId = view.suspendRender();
    assert.ok(suspendId != undefined, "suspendRender");
    assert.deepEqual(view.resumeRender(suspendId), true, "resumeRender");

    view.destroy();
});


