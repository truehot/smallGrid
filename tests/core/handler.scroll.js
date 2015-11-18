QUnit.test("Handler.Scroll", function (assert) {

    var $wrapper = $('<div style="overflow: scroll;width:100px; height:100px; position:absolute; left:-1000px; top:-1000px;"/>');
    var $content = $('<div style="width:1000px; height:1000px">test</div>');

    $content.appendTo($wrapper);

    $wrapper.appendTo('#qunit-fixture');

    var scrollHandler = new SmallGrid.Handler.Scroll.Create($wrapper, {
        "handleScrollStart": handleScrollStart,
        "handleScrollStop": handleScrollStop,
        "handleScroll": handleScroll,
        "handleMouseWheel": handleMouseWheel,
        "handleMouseWheelStart": handleMouseWheelStart,
        "handleMouseWheelStop": handleMouseWheelStop,
    });

    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    var done4 = assert.async();
    var done5 = assert.async();
    var done6 = assert.async();

    var handleScrollStartExecuted = false;
    var handleScrollStopExecuted = false;
    var handleScrollExecuted = false;
    var handleMouseWheelExecuted = false;
    var handleMouseWheelStartExecuted = false;
    var handleMouseWheelStopExecuted = false;



    setTimeout(function () {
        assert.equal(handleScrollStartExecuted, true, "handleScrollStart");
        done1();
    });

    setTimeout(function () {
        assert.equal(handleScrollStopExecuted, true, "handleScrollStopExecuted");
        done2();
    }, 500);

    setTimeout(function () {
        assert.equal(handleScrollExecuted, true, "handleScrollExecuted");
        done3();
    });

    setTimeout(function () {
        assert.equal(handleMouseWheelStartExecuted, true, "handleMouseWheelStartExecuted");
        done4();
    });

    setTimeout(function () {
        assert.equal(handleMouseWheelExecuted, true, "handleMouseWheelExecuted");
        done5();
    });

    setTimeout(function () {
        assert.equal(handleMouseWheelStopExecuted, true, "handleMouseWheelStopExecuted");
        done6();
    }, 400);

    function handleScrollStart(e) {
        assert.equal(e.topDelta, 100, "topDelta");
        assert.equal(e.leftDelta, 200, "leftDelta");
        handleScrollStartExecuted = true;
    }

    function handleScrollStop(e) {
        handleScrollStopExecuted = true;
        scrollHandler.destroy();
        $wrapper.remove();
    }

    function handleScroll(e) {
        handleScrollExecuted = true;
    }

    function handleMouseWheel(e) {
        handleMouseWheelExecuted = true;
    }

    function handleMouseWheelStart(e) {
        handleMouseWheelStartExecuted = true;
    }

    function handleMouseWheelStop(e) {
        handleMouseWheelStopExecuted = true;
    }


    $wrapper.scrollTop(100);
    $wrapper.scrollLeft(200);
    $wrapper.scroll();

    $wrapper.trigger("wheel", {});

});


