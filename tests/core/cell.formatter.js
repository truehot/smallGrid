QUnit.module("SmallGrid.Cell");
QUnit.test("Formatter", function (assert) {

    var settings = new SmallGrid.Settings.Create({});

    settings.formatter.integerFormatter.decimals = 2;
    settings.formatter.floatFormatter.decimals = 2

    assert.ok(SmallGrid.Cell.Formatter.Default("<div>test</div>", {}, {}, settings) == "&lt;div&gt;test&lt;/div&gt;", "Default(Text)");
    assert.ok(SmallGrid.Cell.Formatter.Text(undefined, {}, {}, settings) == "", "Default(Text)");

    assert.ok(SmallGrid.Cell.Formatter.Checkbox(true, {}, {}, settings) == "<i class='fa fa-check-square-o'></i>", "Checkbox");
    assert.ok(SmallGrid.Cell.Formatter.Checkbox(false, {}, {}, settings) == "<i class='fa fa-square-o'></i>", "Checkbox");

    assert.ok(SmallGrid.Cell.Formatter.Float(6.666, {}, {}, settings) == 6.67, "Float");
    assert.ok(SmallGrid.Cell.Formatter.Float(1000.66, {}, {}, settings) == "1,000.66", "Float");

    assert.ok(SmallGrid.Cell.Formatter.Integer(123.55, {}, {}, settings) == 123.00, "Integer");
    assert.ok(SmallGrid.Cell.Formatter.Integer(100000, {}, {}, settings) == "100,000.00", "Integer");

    assert.ok(SmallGrid.Cell.Formatter.None(null, {}, {}, settings) == "", "None");
    assert.ok(SmallGrid.Cell.Formatter.None("test12356$", {}, {}, settings) == "test12356$", "None");

    assert.ok(SmallGrid.Cell.Formatter.Radio(true, {}, {}, settings) == "<i class='fa fa-dot-circle-o'></i>", "Radio");
    assert.ok(SmallGrid.Cell.Formatter.Radio(false, {}, {}, settings) == "<i class='fa fa-circle-o'></i>", "Radio");

    if(Intl != undefined){

        settings.formatter.moneyFormatter = {
            locales: 'en-US',
            options: {
                currency: 'USD',
                style: 'currency'
            }
        }
        assert.ok(SmallGrid.Cell.Formatter.Money("12345.12345", {}, {}, settings) == "$12,345.12", "Money");
        assert.ok(SmallGrid.Cell.Formatter.Money(-123, {}, {}, settings) == "-$123.00", "Money");

        settings.formatter.dateFormatter = {
            locales: 'en-US',
            options: {}
        }
        assert.ok(SmallGrid.Cell.Formatter.Date("Wed, 09 Aug 1995 00:00:00", {}, {}, settings) == "8/9/1995", "Date");
        assert.ok(SmallGrid.Cell.Formatter.Date("2015-01-17T16:42:24.598Z", {}, {}, settings) == "1/17/2015", "Date");
    }
});


