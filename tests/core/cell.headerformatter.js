QUnit.module("SmallGrid.Cell");
QUnit.test("HeaderFormatter", function (assert) {

    var settings = SmallGrid.Settings.Create({});
    var model = SmallGrid.Column.Create([getItem()], SmallGrid.Settings.Create());
    var column = model.getColumnByIndex(0);

    assert.equal(SmallGrid.Cell.HeaderFormatter.Default(column, settings), column.name, "Default");
    assert.equal(SmallGrid.Cell.HeaderFormatter.Checkbox(column, settings), "<i class='fa fa-square-o' data-click-type='checkbox'></i>", "Text");

    assert.equal(SmallGrid.Cell.HeaderFormatter.SelectionCheckbox(column, settings), "<i class='fa fa-square-o' data-click-type='selection-checkbox'></i>", "Checkbox");
    assert.equal(SmallGrid.Cell.HeaderFormatter.Star(column, settings), "<i class='fa fa-star-o' data-click-type='star'></i>", "Checkbox");

    function getItem() {
        return {
            "name": Math.random(),
            "field": Math.random(),
            "width": 20
        };
    }
});


