QUnit.module("SmallGrid.View");
QUnit.test("Builder", function (assert) {
    var settings = SmallGrid.Settings.Create();
    settings.showLastColumn = true;
    var column = getColumn("test");
    var row = getRow();
    var opts = {
        hideColumnBorder: false,
        virtualColumnWidth: 0
    };
    var rows = SmallGrid.Row.Create([row], settings);
    var columns = SmallGrid.Column.Create([column], settings);
    var builder = SmallGrid.View.Builder.Create(settings);

    var el = builder.buildViewPortElements();
    var headerHtml = builder.buildHeaderColumnsHtml(columns.getColumns(), opts);
    var colsHtml = builder.buildColsHtml(columns.getColumns(), opts);
    var rowsHtml = builder.buildRowsHtml(columns.getColumns(), rows.getRows(), opts);
    var cellHtml = builder.buildCellContentHtml(columns.getColumnByIndex(0), rows.getRowByIndex(0));

    assert.equal(Object.keys(el).length, 14, "buildViewPortElements");


    assert.equal(el['viewport'].html(), "<div class=\"grid-header disable-text-selection\"><div class=\"grid-header-wrap\"><table class=\"grid-header-table\"><colgroup></colgroup><tbody></tbody></table></div></div><div class=\"grid-content\"><div class=\"grid-content-wrap\"><table class=\"grid-content-table\"><colgroup></colgroup><tbody></tbody></table></div></div><div class=\"grid-footer\"></div><div class=\"grid-preload-font\"></div>", "buildViewPortElements");

    assert.equal(headerHtml, "<tr class='grid-header-row'><td style='height:20px' class='grid-header-cell grid-cursor-pointer'><div class='grid-header-cell-div'><span class='grid-column-name'>" + column.name + "</span></div><span class='grid-resizable-handle' data-click-type='resize'></span></td><td class='grid-header-cell grid-cell-column-last' style='height:20px'></td></tr>", "buldHeaderColumnsHtml");

    assert.equal(colsHtml, "<col style='width:22px;' class='grid-col'/><col style='width:0px;' class='grid-col grid-coll-last'/>", "buildColsHtml");

    assert.equal(rowsHtml, "<tr class='grid-row grid-row-odd'><td height='20' class='grid-cell'>" + row.test + "</td><td class='grid-cell grid-cell-column-last'></td></tr>", "buildRowsHtml");

    assert.equal(cellHtml, row.test, "buildCellContentHtml");

    function getColumn(field) {
        return {
            "name": field,
            "field": field,
            "width": 20
        };
    }

    function getRow() {
        return { "test": Math.random(), "test2": Math.random() };
    }

});


