QUnit.module("SmallGrid");
QUnit.test("View", function (assert) {
    var $wrapper = $('<div style="width:500px; height:500px;"/>');
    $wrapper.appendTo('#qunit-fixture');

    var settings = SmallGrid.Settings.Create();
    var rowsModel = SmallGrid.Row.Create([], settings);
    var columnsModel = SmallGrid.Column.Create([], settings);
    var viewModel = SmallGrid.View.Model.Create(rowsModel, columnsModel, settings, false);
    var view = SmallGrid.View.Create($wrapper, viewModel, settings, false);
    var windowManager = SmallGrid.View.Window.Create(view, settings, false);

    windowManager.init();
    view.init();
    viewModel.init();


    assert.ok(view.getBuilder() instanceof SmallGrid.View.Builder.Builder, "getBuilder");
    assert.deepEqual(view.getContentSize(), {
        "height": 478,
        "width": 500
    }, "getContentSize");

    assert.deepEqual(view.getColumnNodeById(0), undefined, "getColumnNodeById");
    assert.deepEqual(view.getColumnNodeByIndex(0), undefined, "getColumnNodeByIndex");
    assert.deepEqual(view.getCellNodeById(0, 0), undefined, "getCellNodeById");
    assert.deepEqual(view.getCellNodeByIndex(0, 0), undefined, "getCellNodeByIndex");
    assert.deepEqual(view.getNode('content').html(), $wrapper.find('.grid-content').html(), "getNode");
    assert.deepEqual(view.getRowNodeById(0), undefined, "getRowNodeById");
    assert.deepEqual(view.getRowNodeByIndex(0), undefined, "getRowNodeByIndex");
    assert.deepEqual(view.isCellVisible(0), false, "isCellVisible");
    assert.deepEqual(view.isColumnVisible(0), false, "isColumnVisible");
    assert.deepEqual(view.isHorisontalScrollVisible(), false, "isHorisontalScrollVisible");
    assert.deepEqual(view.isRowVisible(0), false, "isRowVisible");
    assert.deepEqual(view.isSuspended(), false, "isSuspended");
    assert.deepEqual(view.isVerticalScrollVisible(), false, "isVerticalScrollVisible");
    assert.deepEqual(view.render(), view, "render");
    assert.deepEqual(view.resize(), view, "resize");

    var suspendId = view.suspendRender();
    assert.deepEqual(view.isSuspended(), true, "isSuspended");
    assert.ok(suspendId !== undefined, "suspendRender");
    assert.deepEqual(view.resumeRender(suspendId), true, "resumeRender");

    ///next part with values

    columnsModel.items.addItems([{ 'name': 'name', 'field': 'test', 'width': 20 }]);
    rowsModel.items.addItems([{ 'test': Math.random(), 'height': 20 }]);

    var rows = rowsModel.getRows();
    var columns = columnsModel.getColumns();


    assert.deepEqual(view.getColumnNodeById(columns[0].id).tagName, 'TD', "getColumnNodeById");
    assert.deepEqual(view.getColumnNodeById(columns[0].id).innerHTML, "<div class=\"grid-header-cell-div\"><span class=\"grid-column-name\">" + columns[0].name + "</span></div><span class=\"grid-resizable-handle\" data-click-type=\"resize\"></span>", "getColumnNodeById");

    assert.deepEqual(view.getColumnNodeByIndex(0).tagName, 'TD', "getColumnNodeByIndex");
    assert.deepEqual(view.getColumnNodeByIndex(0).innerHTML, "<div class=\"grid-header-cell-div\"><span class=\"grid-column-name\">" + columns[0].name + "</span></div><span class=\"grid-resizable-handle\" data-click-type=\"resize\"></span>", "getColumnNodeByIndex");

    assert.equal(view.getCellNodeById(columns[0].id, rows[0].id).tagName, 'TD', "getCellNodeById");
    assert.equal(view.getCellNodeById(columns[0].id, rows[0].id).innerHTML, rows[0].item.test, "getCellNodeById");

    assert.equal(view.getCellNodeByIndex(0, 0).tagName, 'TD', "getCellNodeById");
    assert.equal(view.getCellNodeByIndex(0, 0).innerHTML, rows[0].item.test, "getCellNodeById");

    assert.equal(view.getRowNodeById(rows[0].id).tagName, "TR", "getRowNodeById");
    assert.equal(view.getRowNodeByIndex(0).tagName, "TR", "getRowNodeByIndex");

    assert.equal(view.isCellVisible(columns[0].id, rows[0].id), true, "isCellVisible");
    assert.equal(view.isColumnVisible(columns[0].id), true, "isColumnVisible");
    assert.equal(view.isRowVisible(rows[0].id), true, "isRowVisible");

    rowsModel.items.addItems([{ 'test': Math.random(), 'height': 455 }]);
    assert.equal(view.isVerticalScrollVisible(), true, "isVerticalScrollVisible");

    columnsModel.items.addItems([{ 'name': 'name', 'field': 'test1', 'width': 485 }]);
    assert.equal(view.isHorisontalScrollVisible(), true, "isHorisontalScrollVisible");

    windowManager.destroy();
    view.destroy();
    viewModel.destroy();


});


