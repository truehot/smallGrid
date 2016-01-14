QUnit.module("SmallGrid.View");
QUnit.test("Model", function (assert) {
    var settings = SmallGrid.Settings.Create();
    var rowModel = new SmallGrid.Row.Create([], settings);
    var columnModel = new SmallGrid.Column.Create([], settings);

    var sorter = new SmallGrid.Query.SorterQuery("test1");
    var filter = new SmallGrid.Query.FilterQuery('test', settings).and();

    var viewModel = SmallGrid.View.Model.Create(rowModel, columnModel, settings);

    assert.deepEqual(viewModel.getRowsTotal(), { "count": 0, "height": 0 }, "getRowsTotal");
    assert.deepEqual(viewModel.getColumnsTotal(), { "count": 0, "width": 0 }, "getColumnsTotal");

    assert.deepEqual(viewModel.columns, columnModel, "columnModel");
    assert.deepEqual(viewModel.rows, rowModel, "rowModel");

    assert.deepEqual(viewModel.requestDataFromRange({ top: 0, left: 0 }, { width: 0, height: 0 }, 0, 0, 0), { "columns": [], "isCached": 0, "rows": [] }, "rowModel");

    //sorters
    viewModel.setSorter(sorter);
    assert.ok(viewModel.getSorters()[0].getField() == sorter.getField(), "setSorter && getSorters");

    viewModel.clearSorter(sorter);
    assert.deepEqual(viewModel.getSorters(), [], "clearSorter");

    viewModel.setSorter(sorter);
    viewModel.clearSorters();
    assert.deepEqual(viewModel.getSorters(), [], "clearSorters");


    //filters
    viewModel.setFilter(filter);
    assert.ok(viewModel.getFilters()[0].get() == filter.get(), "setFilter && getFilters");

    viewModel.clearFilter(filter);
    assert.deepEqual(viewModel.getFilters(), [], "clearFilter");

    viewModel.setFilter(filter);
    viewModel.clearFilters();
    assert.deepEqual(viewModel.getFilters(), [], "clearFilters");

    //get
    assert.deepEqual(viewModel.getColumns(), [], "getColumns");
    assert.deepEqual(viewModel.getColumnById(1), undefined, "getColumnById");
    assert.deepEqual(viewModel.getColumnByIndex(1), undefined, "getColumnByIndex");
    assert.deepEqual(viewModel.getColumnIndexById(1), -1, "getColumnIndexById");

    assert.deepEqual(viewModel.getRows(), [], "getRows");
    assert.deepEqual(viewModel.getRowById(1), undefined, "getRowById");
    assert.deepEqual(viewModel.getRowByIndex(1), undefined, "getRowByIndex");
    assert.deepEqual(viewModel.getRowIndexById(1), -1, "getRowIndexById");

    assert.deepEqual(viewModel.getColumnsWidth(0), 0, "getColumnsWidth");
    assert.deepEqual(viewModel.getRowsHeight(0), 0, "getRowsHeight");


});


