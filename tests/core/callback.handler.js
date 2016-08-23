QUnit.module("SmallGrid");
QUnit.test("Callback.Handler", function (assert) {

    var counter = 0;
    var handler = new SmallGrid.Callback.Handler();

    handler.subscribe(function (e) {
        if (e.counter) {
            counter++;
            e.counter++;
            return e;
        }
    });

    var result = handler.notify({ "counter": 1 });

    assert.equal(counter, 1, "notify");
    assert.equal(result.counter, 2, "notify");

    handler = new SmallGrid.Callback.Handler();

    counter = 0;

    for (var i = 0; i < 10; i++) {
        handler.subscribe(function (e) {
            counter++;
            e.counter++;
            return e;
        });
    }

    result = handler.notify({ "counter": 1 });
    handler.unsubscribeAll();

    assert.equal(counter, 10, "unsubscribeAll");
    assert.equal(result.counter, 11, "unsubscribeAll");

    counter = 0;
    handler.subscribe(first);
    result = handler.notify({ "counter": 1 });
    assert.equal(counter, 1, "subscribe");
    assert.equal(result.counter, 2, "subscribe");

    handler.unsubscribe(first);
    result = handler.notify({ "counter": 1 });
    assert.equal(counter, 1, "unsubscribe");
    assert.equal(result.counter, 1, "unsubscribe");

    handler = new SmallGrid.Callback.Handler();

    counter = 0;
    handler.subscribe(first);
    handler.lock();
    handler.notify({ "counter": 1 });
    handler.notify({ "counter": 1 });
    var result = handler.notifyLocked();

    assert.equal(counter, 1, "notifyLocked");
    assert.equal(result.data[0].counter, 2, "notifyLocked");

    function first(e) {
        if (e.data) {
            counter++;
            e.data[0].counter++;
        } else {
            counter++;
            e.counter++;
        }

        return e;
    }
});




