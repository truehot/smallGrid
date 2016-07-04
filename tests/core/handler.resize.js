QUnit.module("SmallGrid.Handler");
QUnit.test("Resize", function (assert) {

    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();

    var handleResizeExecuted = false;
    var handleResizeStartExecuted = false;
    var handleResizeStopExecuted = false;

    var $wrapper = $('<div style="overflow: scroll;width:500px; height:500px; position:absolute; left:-1000px; top:-1000px;"/>');

    var $el1 = $('<div style="width:100px; height:100px">element1</div>');
    var $hd1 = $('<span class="resize-handler" ></span>').appendTo($el1);
    var $el2 = $('<div style="width:100px; height:100px">element2</div>');
    var $hd2 = $('<span class="resize-handler" ></span>').appendTo($el2);
    var $el3 = $('<div style="width:100px; height:100px">element3</div>');
    var $hd3 = $('<span class="resize-handler" ></span>').appendTo($el3);

    $el1.appendTo($wrapper);
    $el2.appendTo($wrapper);
    $el3.appendTo($wrapper);

    $wrapper.appendTo('#qunit-fixture');

    var handler = SmallGrid.Handler.Resize.Create($wrapper, {
        "cellIdentifier": "DIV",
        "handleResize": handleResize,
        "handleResizeStart": handleResizeStart,
        "handleResizeStop": handleResizeStop,
        "handlerIdentifier": ".resize-handler",
    });

    $hd2.trigger("mousedown");

    $("body").trigger(
        $.extend(
            {},
            $.Event('mousemove'),
            {
                pageX: 1000,
                pageY: 1000
            }
        )
    );

    $hd2.trigger("mouseup");

    setTimeout(function () {
        assert.equal(handleResizeExecuted, true, "handleResizeExecuted");
        done1();
    });

    setTimeout(function () {
        assert.equal(handleResizeStartExecuted, true, "handleResizeStartExecuted");
        done2();
    });

    setTimeout(function () {
        assert.equal(handleResizeStopExecuted, true, "handleResizeStopExecuted");
        done3();
    });

    function handleResize(e) {
        assert.equal(e.cellIndex, 1, "Resize");
        assert.equal(e.width, 12000, "Resize width");
        handleResizeExecuted = true;
    }

    function handleResizeStart(e) {
        assert.equal(e.cellIndex, 1, "ResizeStart");
        handleResizeStartExecuted = true;
    }

    function handleResizeStop(e) {
        assert.equal(e.cellIndex, 1, "ResizeStop");
        handleResizeStopExecuted = true;
    }

    handler.destroy();
});


