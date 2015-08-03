"use strict";

(function ($) {
    $.extend(true, window, {
        "SmallGrid": {
            "Handler": {
                "Resize": ResizeHandler
            }
        }
    });

    var defaultSettings = {
        "cellIdentifier": "TD",
        "handleResize": undefined,
        "handleResizeStart": undefined,
        "handleResizeStop": undefined,
        "handlerIdentifier": undefined,
    };

    function ResizeHandler($container, settings) {
        var settings = jQuery.extend({}, defaultSettings, settings);

        $container.on("mousedown", settings.handlerIdentifier, handleMouseDown);

        function handleMouseDown(e) {

            var $cellElement = $(this).closest(settings.cellIdentifier);

            if ($cellElement.length) {
                var cellIndex = $cellElement.index();

                settings.handleResizeStart({
                    cellElement: $cellElement,
                    cellIndex: cellIndex,
                    event: e
                });

                $("body")
                    .bind("mousemove", function (event) {
                        var newWidth = event.pageX - $cellElement.offset().left;
                        //TODO: remove condition?
                        if (newWidth > 0) {

                            settings.handleResize({
                                cellElement: $cellElement,
                                cellIndex: cellIndex,
                                width: newWidth,
                                event: e
                            });
                        }
                    })
                    .bind("mouseup", function (event) {
                        $(this).unbind("mousemove mouseup");

                        settings.handleResizeStop({
                            cellElement: $cellElement,
                            cellIndex: cellIndex,
                            event: e
                        });
                    });
            }
        }

        function destroy() {
            $container.off('mousedown', handleMouseDown);
        }

        $.extend(this, {
            "destroy": destroy
        });
    };

})(jQuery);