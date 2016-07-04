(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Handler": {
            "Resize": {
                "Create": Create,
                "Handler": ResizeHandler
            }
        }
    });

    function ResizeHandler($container, settings) {
        var $cellElement, cellIndex, pageX, canBeMoved = false;

        $container.on("mousedown", settings.handlerIdentifier, handleMouseDown);
        $(document).on("mousemove", handleMouseMove).on("mouseup", handleMouseUp);

        function handleMouseDown(evt) {
            $cellElement = $(this).closest(settings.cellIdentifier);
            if ($cellElement.length) {
                cellIndex = $cellElement.index();
                pageX = evt.pageX;
                settings.handleResizeStart({
                    cellElement: $cellElement,
                    cellIndex: cellIndex,
                    event: evt
                });

                canBeMoved = true;
            }
        }

        function handleMouseMove(evt) {
            if (canBeMoved) {
                var newWidth = evt.pageX - $cellElement.offset().left;
                if (newWidth > 0) {
                    settings.handleResize({
                        cellElement: $cellElement,
                        cellIndex: cellIndex,
                        xDelta: evt.pageX - pageX,
                        width: newWidth,
                        event: evt
                    });
                }
            }
        }

        function handleMouseUp(evt) {
            if (canBeMoved) {
                canBeMoved = false;

                settings.handleResizeStop({
                    cellElement: $cellElement,
                    cellIndex: cellIndex,
                    event: evt
                });
            }
        }

        function destroy() {
            $container.off('mousedown', handleMouseDown);
            $(document).off("mousemove", handleMouseMove).off("mouseup", handleMouseUp);
            $cellElement = undefined;

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

        if ($container.length !== 1) {
            throw new TypeError("There should be only 1 container.");
        }

        var defaultSettings = {
            "cellIdentifier": "TD",
            "handleResize": undefined,
            "handleResizeStart": undefined,
            "handleResizeStop": undefined,
            "handlerIdentifier": undefined
        };

        var settings = $.extend({}, defaultSettings, options);

        return new ResizeHandler($container, settings);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});