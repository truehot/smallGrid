QUnit.test("Event", function (assert) {

    var counter = 0;
    var event = getEvent();
    var eventArgs = new SmallGrid.Event.Data(event);
    var handler = new SmallGrid.Event.Handler();

    assert.ok(eventArgs.isPropagationStopped() == false, "isPropagationStopped");
    assert.ok(eventArgs.isImmediatePropagationStopped() == false, "isImmediatePropagationStopped");

    handler.subscribe(function (e) {
        if (e.counter) {
            counter++;
        }
    });

    handler.notify({ "counter": 1 });

    assert.ok(counter == 1, "notify");

    handler.unsubscribeLast();

    handler.notify({ "counter": 1 });

    assert.ok(counter == 1, "unsubscribeLast");

    counter = 0;

    for (var i = 0; i < 10; i++) {
        handler.subscribe(function (e) {
            counter++;
        });
    }
    handler.unsubscribeLast();

    handler.notify({ "counter": 1 });
    handler.unsubscribeAll();

    assert.ok(counter == 9, "unsubscribeAll");

    counter = 0;
    handler.subscribe(first);
    handler.notify({ "counter": 1 });
    assert.ok(counter == 1, "subscribe");

    handler.unsubscribe(first);
    handler.notify({ "counter": 1 });
    assert.ok(counter == 1, "unsubscribe");

    function first(e) {
        counter++;
    }

    function getEvent() {
        return {
            "target": null,
            "method": "same",
            "complex": {
                "multi": true,
                "enabled": 56
            }
        }
    }
});




