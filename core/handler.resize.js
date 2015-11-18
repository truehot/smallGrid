(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Handler": {
                "Resize": {
                    "Create": Create,
                    "Handler": ResizeHandler,
                }
            }
        }
    });

    function ResizeHandler($container, settings) {
        $container.on("mousedown", settings.handlerIdentifier, handleMouseDown);

        function handleMouseDown(event) {
            var $cellElement = $(this).closest(settings.cellIdentifier);

            if ($cellElement.length) {
                var cellIndex = $cellElement.index();

                settings.handleResizeStart({
                    cellElement: $cellElement,
                    cellIndex: cellIndex,
                    event: event
                });

                $(document)
                    .bind("mousemove", function (event) {
                        var newWidth = event.pageX - $cellElement.offset().left;
                        if (newWidth > 0) {
                            settings.handleResize({
                                cellElement: $cellElement,
                                cellIndex: cellIndex,
                                width: newWidth,
                                event: event
                            });
                        }
                    })
                    .bind("mouseup", function (event) {
                        $(this).unbind("mousemove mouseup");

                        settings.handleResizeStop({
                            cellElement: $cellElement,
                            cellIndex: cellIndex,
                            event: event
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
    }

    function Create($container, settings) {
        var defaultSettings = {
            "cellIdentifier": "TD",
            "handleResize": undefined,
            "handleResizeStart": undefined,
            "handleResizeStop": undefined,
            "handlerIdentifier": undefined,
        };

        settings = $.extend({}, defaultSettings, settings);

        return new ResizeHandler($container, settings);
    }

})(jQuery);