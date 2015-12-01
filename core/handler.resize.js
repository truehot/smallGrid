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

        function handleMouseDown(evt) {
            var $cellElement = $(this).closest(settings.cellIdentifier);

            if ($cellElement.length) {
                var cellIndex = $cellElement.index();

                settings.handleResizeStart({
                    cellElement: $cellElement,
                    cellIndex: cellIndex,
                    event: evt
                });

                $(document)
                    .bind("mousemove", function (evt) {
                        var newWidth = evt.pageX - $cellElement.offset().left;
                        if (newWidth > 0) {
                            settings.handleResize({
                                cellElement: $cellElement,
                                cellIndex: cellIndex,
                                width: newWidth,
                                event: evt
                            });
                        }
                    })
                    .bind("mouseup", function (evt) {
                        $(this).unbind("mousemove mouseup");

                        settings.handleResizeStop({
                            cellElement: $cellElement,
                            cellIndex: cellIndex,
                            event: evt
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