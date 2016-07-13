(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "View": {
            "Window": {
                "Create": Create,
                "Manager": Manager
            }
        }
    });

    function Manager(view, settings) {
        var self = this;
        var cache = [];

        function createWindow(id, $contentElement, opts) {
            if (isWindow(id) === false) {
                cache.push({ id: id, opts: opts || {} });

                var $container = $('<div class="grid-window grid-window-' + id + '"/>');
                if ($contentElement && $contentElement.length) $contentElement.appendTo($container);
                $container.appendTo(view.getNode('container')).hide();
            }
            return self;
        }

        function isWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id === id) {
                    return true;
                }
            }
            return false;
        }

        function getWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id === id) {
                    return {
                        id: cache[i].id,
                        opts: cache[i].opts,
                        container: view.getNode('container').children('.grid-window-' + id)
                    };
                }
            }
            return self;
        }

        function removeWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id === id) {
                    cache.splice(i, 1);
                    var window = view.getNode('container').children('.grid-window-' + id);
                    if (window.length) {
                        window.remove();
                    }
                    break;
                }
            }
            return self;
        }

        function showWindowNearPosition(id, position, margin) {
            var containerMargin = margin || 0;
            var data = getWindow(id);
            if (data !== null) {
                data.container.show();

                var $container = view.getNode('container');

                var elementSize = {
                    width: data.container.width(),
                    height: data.container.height()
                };

                var left = (elementSize.width + position.x > $container.width() && elementSize.width < position.x - $container.offset().left) ? position.x - elementSize.width + containerMargin : position.x - containerMargin;

                data.container.offset({
                    top: position.y - containerMargin,
                    left: left
                });
            }
            return self;
        }

        function showWindowNearTarget(id, $target) {
            var data = getWindow(id);
            if (data !== null) {
                data.container.show();

                var $container = view.getNode('container');

                var elementSize = {
                    width: data.container.width(),
                    height: data.container.height()
                };

                var targetSizes = {
                    left: $target.offset().left,
                    top: $target.offset().top,
                    width: $target.width(),
                    height: $target.height()
                };

                var left = (elementSize.width + targetSizes.left > $container.width() && elementSize.width < targetSizes.left - $container.offset().left) ? targetSizes.left + targetSizes.width - elementSize.width : targetSizes.left;

                data.container.offset({
                    top: targetSizes.top + targetSizes.height,
                    left: left
                });
            }
            return self;
        }

        function isVisible(id) {
            return view.getNode('container').children('.grid-window-' + id + ':visible').length > 0;
        }

        function showWindow(id) {
            view.getNode('container').children('.grid-window-' + id).show();
            return self;
        }

        function hideWindow(id) {
            view.getNode('container').children('.grid-window-' + id).hide();
            return self;
        }

        function hideWindows() {
            view.getNode('container').children('.grid-window').hide();
            return self;
        }

        function init() {
            view.onDocumentClick.subscribe(hideWindows);
            view.onColumnResizeStart.subscribe(hideWindows);
            return self;
        }

        function destroy() {
            view.onDocumentClick.unsubscribe(hideWindows);
            view.onColumnResizeStart.unsubscribe(hideWindows);
            cache = [];
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "createWindow": createWindow,
            "showWindowNearPosition": showWindowNearPosition,
            "showWindowNearTarget": showWindowNearTarget,
            "getWindow": getWindow,
            "hideWindow": hideWindow,
            "hideWindows": hideWindows,
            "isWindow": isWindow,
            "isVisible": isVisible,
            "removeWindow": removeWindow,
            "showWindow": showWindow
        });
    }


    function Create(view, settings, autoInit) {
        if (view instanceof SmallGrid.View.View === false) {
            throw new TypeError("View is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        var windowManager = new SmallGrid.View.Window.Manager(view, settings);

        if (autoInit !== false) windowManager.init();

        return windowManager;
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});