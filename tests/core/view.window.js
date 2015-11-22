QUnit.test("View.Window", function (assert) {

    var $div = $('<div/>');
    var $target = $('<div/>');
    var $content = $('<div class="content">Content</div>');
    var opts1 = { id: 'test1' };
    var opts2 = { id: 'test2', opts: { visiblity: "hidden" } };
    var opts3 = { id: 'test3', opts: { visiblity: "hidden" }, container: $content };

    $target.appendTo($div);
    $div.appendTo('#qunit-fixture');

    var grid = new SmallGrid.Grid.Create($div, [], [], {});
    var windowManager = grid.getWindowManager();

    assert.ok(windowManager.createWindow(opts1.id).isWindow(opts1.id), "isWindow1");
    assert.ok(windowManager.createWindow(opts2.id, opts2.opts).isWindow(opts2.id), "isWindow2");
    assert.ok(windowManager.createWindow(opts3.id, opts3.opts, opts3.container).isWindow(opts3.id), "isWindow3");
    assert.ok(windowManager.isWindow("test") === false, "isWindow4");

    assert.ok($div.find('.grid-window-' + opts1.id).length > 0, "createWindow1");
    assert.ok($div.find('.grid-window-' + opts2.id).length > 0, "createWindow2");
    assert.ok($div.find('.grid-window-' + opts3.id).length > 0, "createWindow3");

    var getW1 = windowManager.getWindow(opts1.id);
    var getW2 = windowManager.getWindow(opts2.id);
    var getW3 = windowManager.getWindow(opts3.id);

    assert.ok(getW1.id == opts1.id, "getWindow1");
    assert.ok(getW2.id == opts2.id && getW2.opts == opts2.opts, "getWindow2");
    assert.ok(getW3.id == opts3.id && getW3.opts == opts3.opts && getW3.container.hasClass('grid-window'), "getWindow3");

    assert.ok(windowManager.hideWindow(opts1.id).isVisible(opts1.id) == false, "hideWindow1");
    assert.ok(windowManager.hideWindow(opts2.id).isVisible(opts2.id) == false, "hideWindow2");

    assert.ok(windowManager.showWindow(opts2.id).isVisible(opts2.id) == true, "showWindow1");
    assert.ok(windowManager.showWindow(opts3.id).isVisible(opts3.id) == true, "showWindow2");

    assert.ok(windowManager.showWindowNearPosition(opts1.id, { x: 0, y: 0 }).isVisible(opts2.id) == true, "showWindowNearPosition");
    assert.ok(windowManager.showWindowNearTarget(opts2.id, $target).isVisible(opts3.id) == true, "showWindowNearTarget");

    assert.ok(windowManager.removeWindow(opts1.id).isWindow(opts1.id) == false, "removeWindow1");
    assert.ok(windowManager.removeWindow(opts2.id).isWindow(opts2.id) == false, "removeWindow2");
    assert.ok(windowManager.isWindow(opts3.id) == true, "removeWindow3");

});


