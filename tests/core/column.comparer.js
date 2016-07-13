QUnit.module("SmallGrid.Column");
QUnit.test("Comparer", function (assert) {
    assert.ok(
        SmallGrid.Utils.changeSortOrder(-1) === 1 &&
        SmallGrid.Utils.changeSortOrder(1) === -1 &&
        SmallGrid.Utils.changeSortOrder(0) === -1, "changeSortOrder");

    /*
    Number
    */
    var val = [0, 1, 2];
    var settings = getSettings("!", -1);
    var items = [{ item: { "!": val[0] } }, { item: { "!": val[1] } }, { item: { "!": val[2] } }];
    items.sort(new SmallGrid.Column.Comparer.Number(settings));
    assert.ok(
        items[0].item["!"] === val[2] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[0], "Number");

    settings = getSettings("!", 1);
    items = [{ item: { "!": val[2] } }, { item: { "!": val[1] } }, { item: { "!": val[0] } }];
    items.sort(new SmallGrid.Column.Comparer.Number(settings));
    assert.ok(
        items[0].item["!"] === val[0] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[2], "Number");

    /*
    String
    */
    val = ["ab", "bc", "cd"];
    settings = getSettings("!", -1);
    items = [{ item: { "!": val[0] } }, { item: { "!": val[1] } }, { item: { "!": val[2] } }];
    items.sort(new SmallGrid.Column.Comparer.String(settings));
    assert.ok(
        items[0].item["!"] === val[2] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[0], "String");


    settings = getSettings("!", 1);
    items = [{ item: { "!": val[2] } }, { item: { "!": val[1] } }, { item: { "!": val[0] } }];
    items.sort(new SmallGrid.Column.Comparer.String(settings));
    assert.ok(
        items[0].item["!"] === val[0] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[2], "String");

    /*
    Date
    */
    val = [new Date(2014, 1, 1), new Date(2014, 1, 2), new Date(2014, 1, 3)];
    settings = getSettings("!", -1);
    items = [{ item: { "!": val[0] } }, { item: { "!": val[1] } }, { item: { "!": val[2] } }];
    items.sort(new SmallGrid.Column.Comparer.Date(settings));
    assert.ok(
        items[0].item["!"] === val[2] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[0], "Date");


    settings = getSettings("!", 1);
    items = [{ item: { "!": val[2] } }, { item: { "!": val[1] } }, { item: { "!": val[0] } }];
    items.sort(new SmallGrid.Column.Comparer.Date(settings));
    assert.ok(
        items[0].item["!"] === val[0] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[2], "Date");

    /*
    Default numbers
    */
    val = [0, 1, 2];
    settings = getSettings("!", -1);
    items = [{ item: { "!": val[0] } }, { item: { "!": val[1] } }, { item: { "!": val[2] } }];
    items.sort(new SmallGrid.Column.Comparer.Default(settings));
    assert.ok(
        items[0].item["!"] === val[2] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[0], "Default");

    settings = getSettings("!", 1);
    items = [{ item: { "!": val[2] } }, { item: { "!": val[1] } }, { item: { "!": val[0] } }];
    items.sort(new SmallGrid.Column.Comparer.Default(settings));
    assert.ok(
        items[0].item["!"] === val[0] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[2], "Default");

    /*
    Default date
    */

    val = [new Date(2014, 1, 1), new Date(2014, 1, 2), new Date(2014, 1, 3)];
    settings = getSettings("!", -1);
    items = [{ item: { "!": val[0] } }, { item: { "!": val[1] } }, { item: { "!": val[2] } }];
    items.sort(new SmallGrid.Column.Comparer.Default(settings));
    assert.ok(
        items[0].item["!"] === val[2] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[0], "Default");

    settings = getSettings("!", 1);
    items = [{ item: { "!": val[2] } }, { item: { "!": val[1] } }, { item: { "!": val[0] } }];
    items.sort(new SmallGrid.Column.Comparer.Default(settings));
    assert.ok(
        items[0].item["!"] === val[0] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[2], "Default");

    /*
    Default string
    */
    val = ["ab", "bc", "cd"];
    settings = getSettings("!", -1);
    items = [{ item: { "!": val[0] } }, { item: { "!": val[1] } }, { item: { "!": val[2] } }];
    items.sort(new SmallGrid.Column.Comparer.Default(settings));
    assert.ok(
        items[0].item["!"] === val[2] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[0], "Default");


    settings = getSettings("!", 1);
    items = [{ item: { "!": val[2] } }, { item: { "!": val[1] } }, { item: { "!": val[0] } }];
    items.sort(new SmallGrid.Column.Comparer.Default(settings));
    assert.ok(
        items[0].item["!"] === val[0] &&
        items[1].item["!"] === val[1] &&
        items[2].item["!"] === val[2], "Default");


    function getSettings(value, sort) {
        return { "field": value, "sortOrder": sort };
    }
});


