"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
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

        var scrollTimer,
            wheelTimer,
            last = {
                scrollTop: $element[0].scrollTop,
                scrollLeft: $element[0].scrollLeft,
            };

        $element.on('scroll', handleScroll);
        $element.on('wheel', handleMouseWheel);

        function handleMouseWheel(e) {
            if (wheelTimer) {
                clearTimeout(wheelTimer);
            } else {
                settings.handleMouseWheelStart({ event: e });
            }

            settings.handleMouseWheel({ event: e });

            wheelTimer = setTimeout(function () {
                wheelTimer = null;
                settings.handleMouseWheelStop({ event: e });
            }, settings.latency);
        }

        function handleScroll(e) {

            var dim = {
                scrollTop: $element[0].scrollTop,
                scrollLeft: $element[0].scrollLeft,
            }

            if (scrollTimer) {
                clearTimeout(scrollTimer);
            } else {
                settings.handleScrollStart({
                    scrollTop: dim.scrollTop,
                    scrollLeft: dim.scrollLeft,
                    topDelta: dim.scrollTop - last.scrollTop,
                    leftDelta: dim.scrollLeft - last.scrollLeft,
                    event: e,
                });
            }

            settings.handleScroll({
                scrollTop: dim.scrollTop,
                scrollLeft: dim.scrollLeft,
                topDelta: dim.scrollTop - last.scrollTop,
                leftDelta: dim.scrollLeft - last.scrollLeft,
                event: e,
            });

            scrollTimer = setTimeout(function () {
                scrollTimer = null;
                settings.handleScrollStop({
                    scrollTop: dim.scrollTop,
                    scrollLeft: dim.scrollLeft,
                    topDelta: dim.scrollTop - last.scrollTop,
                    leftDelta: dim.scrollLeft - last.scrollLeft,
                    event: e,
                });

            }, settings.latency);

            last = {
                scrollTop: dim.scrollTop,
                scrollLeft: dim.scrollLeft,
            }
        }

        function destroy() {
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            if (wheelTimer) {
                clearTimeout(wheelTimer);
            }

            $element.off('scroll', handleScroll);
            $element.off('wheel', handleMouseWheel);
        }

        $.extend(this, {
            "destroy": destroy
        });

    };

})(jQuery);