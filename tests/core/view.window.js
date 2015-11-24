QUnit.module("SmallGrid.View");
QUnit.test("Window", function (assert) {

    var $div = $('<div style="width:50;height:50px;"/>');
    var $target = $('<div style="width:100px;height:100px;"/>');
    var $content = $('<div>Content</div>');
    var opts1 = { id: 'test1' };
    var opts2 = { id: 'test2', opts: { visiblity: "hidden" } };
    var opts3 = { id: 'test3', opts: { visiblity: "hidden" }, container: $content };

    $target.appendTo($div);
    $div.appendTo('#qunit-fixture');

    var grid = new SmallGrid.Grid.Create($div, [], [], {});
    var windowManager = grid.getWindowManager();

    assert.ok(windowManager.createWindow(opts1.id).isWindow(opts1.id), "isWindow");
    assert.ok(windowManager.createWindow(opts2.id, opts2.opts).isWindow(opts2.id), "isWindow");
    assert.ok(windowManager.createWindow(opts3.id, opts3.opts, opts3.container).isWindow(opts3.id), "isWindow");
    assert.ok(windowManager.isWindow("test") === false, "isWindow");

    assert.ok($div.find('.grid-window-' + opts1.id).length > 0, "createWindow");
    assert.ok($div.find('.grid-window-' + opts2.id).length > 0, "createWindow");
    assert.ok($div.find('.grid-window-' + opts3.id).length > 0, "createWindow");

    var getW1 = windowManager.getWindow(opts1.id);
    var getW2 = windowManager.getWindow(opts2.id);
    var getW3 = windowManager.getWindow(opts3.id);

    assert.ok(getW1.id == opts1.id, "getWindow");
    assert.ok(getW2.id == opts2.id && getW2.opts == opts2.opts, "getWindow");
    assert.ok(getW3.id == opts3.id && getW3.opts == opts3.opts && getW3.container.hasClass('grid-window'), "getWindow");

    assert.ok(windowManager.hideWindow(opts1.id).isVisible(opts1.id) == false, "hideWindow");
    assert.ok(windowManager.hideWindow(opts2.id).isVisible(opts2.id) == false, "hideWindow");

    assert.ok(windowManager.showWindow(opts2.id).isVisible(opts2.id) == true, "showWindow");
    assert.ok(windowManager.showWindow(opts3.id).isVisible(opts3.id) == true, "showWindow");

    assert.ok(windowManager.showWindowNearPosition(opts1.id, { x: 10, y: 10 }).isVisible(opts2.id) == true, "showWindowNearPosition");

    var offset1 = $div.find('.grid-window-' + opts1.id).offset();
    assert.ok(offset1.top == 10 && offset1.left == -990, "showWindowNearPosition");

    assert.ok(windowManager.showWindowNearTarget(opts2.id, $target).isVisible(opts3.id) == true, "showWindowNearTarget");
    var offset2 = $div.find('.grid-window-' + opts2.id).offset();
    assert.ok(offset2.top == 100 && offset2.left == 0, "showWindowNearTarget");

    assert.ok(windowManager.removeWindow(opts1.id).isWindow(opts1.id) == false, "removeWindow");
    assert.ok(windowManager.removeWindow(opts2.id).isWindow(opts2.id) == false, "removeWindow");
    assert.ok(windowManager.isWindow(opts3.id) == true, "removeWindow");

});


