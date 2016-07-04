(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Handler": {
            "Scroll": {
                "Create": Create,
                "Handler": ScrollHandler
            }
        }
    });

    /*
    TODO: direction change
    https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
    */
    function ScrollHandler($container, settings) {

        if (settings.resetTop) {
            $container[0].scrollTop = 0;
        }
        if (settings.resetLeft) {
            $container[0].scrollLeft = 0;
        }

        var scrollStopTimer, wheelStopTimer,
            isScrollMoved = false, isWheelMoved = false,
            lastScroll = {
                scrollTop: $container[0].scrollTop,
                scrollLeft: $container[0].scrollLeft
            };

        $container.on('scroll', handleScroll);
        $container.on('wheel', handleMouseWheel);

        function handleMouseWheel(evt) {
            clearTimeout(wheelStopTimer);

            if (isWheelMoved === false) {
                isWheelMoved = true;
                settings.handleMouseWheelStart({ event: evt });
            }

            settings.handleMouseWheel({ event: evt });

            wheelStopTimer = setTimeout(function () {
                settings.handleMouseWheelStop({ event: evt });
                isWheelMoved = false;
            }, settings.latency);

        }

        function handleScroll(evt) {
            var scroll = {
                scrollTop: $container[0].scrollTop,
                scrollLeft: $container[0].scrollLeft,
                topDelta: $container[0].scrollTop - lastScroll.scrollTop,
                leftDelta: $container[0].scrollLeft - lastScroll.scrollLeft,
                event: evt
            };

            clearTimeout(scrollStopTimer);

            if (isScrollMoved === false) {
                isScrollMoved = true;
                settings.handleScrollStart(scroll);
            }

            settings.handleScroll(scroll);

            scrollStopTimer = setTimeout(function () {
                settings.handleScrollStop(scroll);
                isScrollMoved = false;
            }, settings.latency);

            lastScroll = {
                scrollTop: scroll.scrollTop,
                scrollLeft: scroll.scrollLeft
            };
        }

        function destroy() {
            clearTimeout(scrollStopTimer);
            clearTimeout(wheelStopTimer);

            $container.off('scroll', handleScroll);
            $container.off('wheel', handleMouseWheel);

            var settingsKeys = Object.keys(settings);
            for (var i = 0; i < settingsKeys.length; i++) {
                delete settings[settingsKeys[i]];
            }
        }

        $.extend(this, {
            "destroy": destroy
        });
    }

    function Create($container, options) {
        if (!$container.length) {
            throw new TypeError("Container is not defined or does not exist in the DOM.");
        }

        if ($container.length != 1) {
            throw new TypeError("There should be only 1 container.");
        }

        var defaultSettings = {
            "handleMouseWheel": undefined,
            "handleMouseWheelStart": undefined,
            "handleMouseWheelStop": undefined,
            "handlescroll": undefined,
            "handlescrollStart": undefined,
            "handlescrollStop": undefined,
            "latency": 300,
            "resetLeft": true,
            "resetTop": true
        };

        var settings = $.extend({}, defaultSettings, options);

        return new ScrollHandler($container, settings);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});