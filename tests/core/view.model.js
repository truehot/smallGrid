QUnit.module("SmallGrid.View");
QUnit.test("Model", function (assert) {
    var settings = SmallGrid.Settings.Create();
    var rowsModel = SmallGrid.Row.Create([], settings);
    var columnsModel = SmallGrid.Column.Create([], settings);
    var rowsRequest = new SmallGrid.Query.Row.Create(rowsModel);
    var columnsRequest = new SmallGrid.Query.Column.Create(columnsModel);
    var viewModel = new SmallGrid.View.Model.Model(rowsModel, columnsModel, rowsRequest, columnsRequest, settings);
    viewModel.init();

    var sorter = new SmallGrid.Query.Sorter("test1");
    var filter = new SmallGrid.Query.Filter('test').and();

    assert.deepEqual(viewModel.getRowsTotal(), { "count": 0, "height": 0 }, "getRowsTotal");
    assert.deepEqual(viewModel.getColumnsTotal(), { "count": 0, "width": 0 }, "getColumnsTotal");

    assert.deepEqual(viewModel.requestDataFromRange({ top: 0, left: 0 }, { width: 0, height: 0 }, 0, 0, 0), { "columns": [], "isCached": 0, "rows": [] }, "requestDataFromRange");

    //sorters
    viewModel.setSorter(sorter);
    assert.ok(viewModel.getSorters()[0].getField() === sorter.getField(), "setSorter && getSorters");

    viewModel.clearSorterByField(sorter.getField());
    assert.deepEqual(viewModel.getSorters(), [], "clearSorterByField");

    viewModel.setSorter(sorter);
    viewModel.clearSorterById(sorter.getId());
    assert.deepEqual(viewModel.getSorters(), [], "clearSorterById");


    viewModel.setSorter(sorter);
    viewModel.clearSorters();
    assert.deepEqual(viewModel.getSorters(), [], "clearSorters");


    //filters
    viewModel.setFilter(filter);
    assert.ok(viewModel.getFilters()[0].get() === filter.get(), "setFilter && getFilters");

    viewModel.clearFilterByField(filter.getField());
    assert.deepEqual(viewModel.getFilters(), [], "clearFilterByField");

    viewModel.clearFilterById(filter.getId());
    assert.deepEqual(viewModel.getFilters(), [], "clearFilterById");

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

    //next part with values

    columnsModel.items.addItems([{ 'name': 'name', 'field': 'test', 'width': 20 }]);
    rowsModel.items.addItems([{ 'test': Math.random(), 'height': 21 }]);

    var rows = rowsModel.getRows();
    var columns = columnsModel.getColumns();

    assert.deepEqual(
        viewModel.getRowsHeight({ width: 0, height: 0 }),
        21,
        "getRowsHeight"
    );
    assert.deepEqual(
        viewModel.getColumnsWidth({ width: 0, height: 0 }),
        20,
        "getColumnsWidth"
    );

    assert.deepEqual(viewModel.getRowsTotal(), { "count": 1, "height": 21 }, "getRowsTotal");
    assert.deepEqual(viewModel.getColumnsTotal(), { "count": 1, "width": 20 }, "getColumnsTotal");

    assert.deepEqual(
        viewModel.requestDataFromRange({ top: 0, left: 0 }, { width: 500, height: 500 }, { width: 0, height: 0 }, true),
        { "columns": columns, "isCached": 0, "rows": rows },
        "requestDataFromRange"
    );

    assert.deepEqual(viewModel.getColumns(), columns, "getColumns");
    assert.deepEqual(viewModel.getColumnById(columns[0].id), columns[0], "getColumnById");
    assert.deepEqual(viewModel.getColumnByIndex(0), columns[0], "getColumnByIndex");
    assert.deepEqual(viewModel.getColumnIndexById(columns[0].id), 0, "getColumnIndexById");

    assert.deepEqual(viewModel.getRows(), rows, "getRows");
    assert.deepEqual(viewModel.getRowById(rows[0].id), rows[0], "getRowById");
    assert.deepEqual(viewModel.getRowByIndex(0), rows[0], "getRowByIndex");
    assert.deepEqual(viewModel.getRowIndexById(rows[0].id), 0, "getRowIndexById");

    viewModel.destroy();
});


