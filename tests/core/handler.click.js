QUnit.module("SmallGrid.Handler");
QUnit.test("Click", function (assert) {

    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    var done4 = assert.async();

    var $wrapper = $('<div style="overflow: scroll;width:500px; height:500px; position:absolute; left:-1000px; top:-1000px;"/>');
    var $r1 = $('<div style="width:100px; height:100px" class="row"></div>').appendTo($wrapper);
    var $r1el1 = $('<div style="width:100px; height:100px">cell1</div>').appendTo($r1);
    var $r1el2 = $('<div style="width:100px; height:100px">cell2</div>').appendTo($r1);
    var $r1el3 = $('<div style="width:100px; height:100px">cell3</div>').appendTo($r1);

    var $r2 = $('<div style="width:100px; height:100px"  class="row"></div>').appendTo($wrapper);
    var $r2el1 = $('<div style="width:100px; height:100px">cell1</div>').appendTo($r2);
    var $r2el2 = $('<div style="width:100px; height:100px">cell2</div>').appendTo($r2);
    var $r2el3 = $('<div style="width:100px; height:100px">cell3</div>').appendTo($r2);

    var $r3 = $('<div style="width:100px; height:100px"  class="row"></div>').appendTo($wrapper);
    var $r3el1 = $('<div style="width:100px; height:100px">cell1</div>').appendTo($r3);
    var $r3el2 = $('<div style="width:100px; height:100px">cell2</div>').appendTo($r3);
    var $r3el3 = $('<div style="width:100px; height:100px">cell3</div>').appendTo($r3);


    $wrapper.appendTo('#qunit-fixture');

    var handleCellClickExecuted = false;
    var handleCellContextMenuExecuted = false;
    var handleCellDblClickExecuted = false;
    var handleCellKeyDownExecuted = false;

    var handler = SmallGrid.Handler.Click.Create($wrapper, {
        "rowIdentifier": ".row",
        "cellIdentifier": "DIV",
        "handleClick": handleCellClick,
        "handleDblClick": handleCellDblClick,
        "handleContextMenu": handleCellContextMenu,
        "handleKeyDown": handleCellKeyDown
    });

    $r3el2.trigger('click');
    $r1el3.trigger('dblclick');
    $r2el3.trigger('keydown');
    $r2el1.trigger('contextmenu');

    setTimeout(function () {
        assert.equal(handleCellClickExecuted, true, "handleCellClickExecuted");
        done1();
    });

    setTimeout(function () {
        assert.equal(handleCellDblClickExecuted, true, "handleCellDblClickExecuted");
        done2();
    });

    setTimeout(function () {
        assert.equal(handleCellKeyDownExecuted, true, "handleCellKeyDownExecuted");
        done3();
    });

    setTimeout(function () {
        assert.equal(handleCellContextMenuExecuted, true, "handleCellContextMenuExecuted");
        done4();
    });


    function handleCellClick(e) {
        assert.ok(e.rowIndex === 2 && e.cellIndex === 1, "handleCellClick");
        handleCellClickExecuted = true;
    }

    function handleCellDblClick(e) {
        assert.ok(e.rowIndex === 0 && e.cellIndex === 2, "handleCellDblClick");
        handleCellDblClickExecuted = true;
    }

    function handleCellKeyDown(e) {
        assert.ok(e.rowIndex === 1 && e.cellIndex === 2, "handleCellKeyDown");
        handleCellKeyDownExecuted = true;
    }

    function handleCellContextMenu(e) {
        assert.ok(e.rowIndex === 1 && e.cellIndex === 0, "handleCellContextMenu");
        handleCellContextMenuExecuted = true;
    }


    handler.destroy();
});



