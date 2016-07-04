QUnit.module("SmallGrid.Handler");
QUnit.test("Shared", function (assert) {
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();

    var handleClickExecuted = false;
    var handleResizeExecuted = false;
    var handleContextMenuExecuted = false;

    var handler = SmallGrid.Handler.Shared.GetInstance();
    handler.onClick.subscribe(handleClick);
    handler.onResize.subscribe(handleResize);
    handler.onContextMenu.subscribe(handleContextMenu);

    $(window).trigger('click');
    $(window).trigger('resize');
    $(window).trigger('contextmenu');


    setTimeout(function () {
        assert.equal(handleClickExecuted, true, "handleClick");
        done1();
    });

    setTimeout(function () {
        assert.equal(handleResizeExecuted, true, "handleResize");
        done2();
        handler.destroy();
    }, 1000);

    setTimeout(function () {
        assert.equal(handleContextMenuExecuted, true, "handleContextMenu");
        done3();
    });

    function handleClick(e) {
        handleClickExecuted = true;
    }

    function handleResize(e) {
        handleResizeExecuted = true;
    }

    function handleContextMenu(e) {
        handleContextMenuExecuted = true;
    }


});


