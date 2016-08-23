QUnit.module("SmallGrid");
QUnit.test("Event.Hanlder", function (assert) {

    var counter = 0;
    var event = getEvent();
    var eventArgs = new SmallGrid.Event.Data(event);
    var handler = new SmallGrid.Event.Create();

    assert.ok(eventArgs.isPropagationStopped() === false, "isPropagationStopped");
    eventArgs.stopPropagation();
    assert.ok(eventArgs.isPropagationStopped() === true, "isPropagationStopped");

    assert.ok(eventArgs.isImmediatePropagationStopped() === false, "isImmediatePropagationStopped");
    eventArgs.stopImmediatePropagation();
    assert.ok(eventArgs.isImmediatePropagationStopped() === true, "isImmediatePropagationStopped");

    assert.ok(eventArgs.isDefaultPrevented() === false, "isDefaultPrevented");
    eventArgs.preventDefault();
    assert.ok(eventArgs.isDefaultPrevented() === true, "isDefaultPrevented");

    handler.subscribe(function (e) {
        if (e.counter) {
            counter++;
        }
    });

    handler.notify({ "counter": 1 });

    assert.ok(counter === 1, "notify");

    handler = new SmallGrid.Event.Handler();

    counter = 0;

    for (var i = 0; i < 10; i++) {
        handler.subscribe(function (e) {
            counter++;
        });
    }

    handler.notify({ "counter": 1 });
    handler.unsubscribeAll();

    assert.equal(counter, 10, "unsubscribeAll");

    counter = 0;
    handler.subscribe(first);
    handler.notify({ "counter": 1 });
    assert.ok(counter === 1, "subscribe");

    handler.unsubscribe(first);
    handler.notify({ "counter": 1 });
    assert.ok(counter === 1, "unsubscribe");

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
        };
    }
});




