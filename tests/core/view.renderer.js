QUnit.module("SmallGrid.View");
QUnit.test("Renderer", function (assert) {
    var settings = SmallGrid.Settings.Create();
    var column = getColumn("test");
    var row = getRow();
    var opts = {
        hideColumnBorder: false,
        virtualColumnWidth: 0,
    };
    var rows = new SmallGrid.Row.Create([row], settings);
    var columns = new SmallGrid.Column.Create([column], settings);
    var renderer = new SmallGrid.View.Renderer.Create(settings);

    var el = renderer.buildViewPortElements();
    var headerHtml = renderer.buildHeaderColumnsHtml(columns.getColumns(), opts);
    var colsHtml = renderer.buildColsHtml(columns.getColumns(), opts);
    var rowsHtml = renderer.buildRowsHtml(columns.getColumns(), rows.getRows(), opts);

    assert.equal(el['viewport'].html(), "<div class=\"grid-header disable-text-selection\"><div class=\"grid-header-wrap\"><table class=\"grid-header-table\"><colgroup></colgroup><tbody></tbody></table></div></div><div class=\"grid-content\"><div class=\"grid-content-wrap\"><table class=\"grid-content-table\"><colgroup></colgroup><tbody></tbody></table></div></div><div class=\"grid-footer\"></div><div class=\"grid-preload-font\"></div>", "buildViewPortElements");
    

    assert.equal(headerHtml, "<tr class='grid-header-row'><td style='height:20px' class='grid-header-cell grid-cursor-pointer'><div class='grid-header-cell-div'><span class='grid-column-name'>" + column.name + "</span></div><span class='grid-resizable-handle'></span></td></tr>", "buldHeaderColumnsHtml");

    assert.equal(colsHtml, "<col style='width:27px;' class='grid-col'/>", "buildColsHtml");
    
    assert.equal(rowsHtml, "<tr class='grid-row grid-row-odd'><td height='20' class='grid-cell'>" + row.test + "</td></tr>", "buildRowsHtml");

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


