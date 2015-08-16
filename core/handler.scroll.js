"use strict";

(function ($) {
    $.extend(true, window, {
        "SmallGrid": {
            "Handler": {
                "Scroll": ScrollHandler
            }
        }
    });

    var defaultSettings = {
        "handleMouseWheel": undefined,
        "handleMouseWheelStart": undefined,
        "handleMouseWheelStop": undefined,
        "handlescroll": undefined,
        "handlescrollStart": undefined,
        "handlescrollStop": undefined,
        latency: 300,
        resetLeft: true,
        resetTop: true,
    }

    /*
    TODO: direction change
    https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
    */
    function ScrollHandler($element, settings) {
        var settings = jQuery.extend({}, defaultSettings, settings);

        if (settings.resetTop) {
            $element[0].scrollTop = 0;
        }
        if (settings.resetLeft) {
            $element[0].scrollLeft = 0;
        }

        var scrollStopTimer, wheelStopTimer,
            isScrollMoved = false, isWheelMoved = false,
            lastScroll = {
                scrollTop: $element[0].scrollTop,
                scrollLeft: $element[0].scrollLeft,
            };

        $element.on('scroll', handleScroll);
        $element.on('wheel', handleMouseWheel);

        function handleMouseWheel(e) {
            clearTimeout(wheelStopTimer);

            if (isWheelMoved == false) {
                isWheelMoved = true;
                settings.handleMouseWheelStart({ event: e });
            }

            settings.handleMouseWheel({ event: e });

            wheelStopTimer = setTimeout(function () {
                settings.handleMouseWheelStop({ event: e });
                isWheelMoved = false;
            }, settings.latency);

        }

        function handleScroll(e) {

            var scroll = {
                scrollTop: $element[0].scrollTop,
                scrollLeft: $element[0].scrollLeft,
                topDelta: $element[0].scrollTop - lastScroll.scrollTop,
                leftDelta: $element[0].scrollLeft - lastScroll.scrollLeft,
                event: e,
            };

            clearTimeout(scrollStopTimer);

            if (isScrollMoved == false) {
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
                scrollLeft: scroll.scrollLeft,
            };
        }

        function destroy() {
            clearTimeout(scrollStopTimer);
            clearTimeout(wheelStopTimer);

            $element.off('scroll', handleScroll);
            $element.off('wheel', handleMouseWheel);
        }

        $.extend(this, {
            "destroy": destroy
        });
    };

})(jQuery);