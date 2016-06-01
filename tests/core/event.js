QUnit.module("SmallGrid");
QUnit.test("Event", function (assert) {

    var counter = 0;
    var event = getEvent();
    var eventArgs = new SmallGrid.Event.Data(event);
    var handler = new SmallGrid.Event.Handler();

    assert.ok(eventArgs.isPropagationStopped() == false, "isPropagationStopped");
    eventArgs.stopPropagation();
    assert.ok(eventArgs.isPropagationStopped() == true, "isPropagationStopped");

    assert.ok(eventArgs.isImmediatePropagationStopped() == false, "isImmediatePropagationStopped");
    eventArgs.stopImmediatePropagation();
    assert.ok(eventArgs.isImmediatePropagationStopped() == true, "isImmediatePropagationStopped");

    assert.ok(eventArgs.isDefaultPrevented() == false, "isDefaultPrevented");
    eventArgs.preventDefault();
    assert.ok(eventArgs.isDefaultPrevented() == true, "isDefaultPrevented");

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

    counter = 0;
    handler.subscribe(first);
    handler.blockEvents();
    handler.notify({ "counter": 1 });
    handler.notify({ "counter": 1 });
    handler.notifyBlocked();
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




