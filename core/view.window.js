(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "View": {
                "Window": {
                    "Create": Create,
                    "Manager": Manager,
                },
            }
        }
    });

    function Manager(view, settings) {
        var self = this;
        var cache = [];

        function createWindow(id, opts, $contentElement) {
            if (isWindow(id) === false) {
                cache.push({ id: id, opts: opts });

                var $container = $('<div class="grid-window grid-window-' + id + '"/>');
                if ($contentElement && $contentElement.length) $contentElement.appendTo($container);
                $container.appendTo(view.getNode('container')).hide();
            }
            return self;
        }

        function isWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id == id) {
                    return true;
                }
            }
            return false;
        }

        function getWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id == id) {
                    return {
                        id: cache[i].id,
                        opts: cache[i].opts,
                        container: view.getNode('container').children('.grid-window-' + id),
                    };
                }
            }
            return self;
        }

        function removeWindow(id) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id == id) {
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

        function showWindowNearPosition(id, position) {
            var data = getWindow(id);
            if (data != null) {
                data.container.show();

                var $container = view.getNode('container');

                var elementSizes = {
                    width: data.container.width(),
                    height: data.container.height()
                };

                var left = (elementSizes.width + position.x > $container.width() && elementSizes.width < position.x - $container.offset().left) ? position.x - elementSizes.width : position.x;

                data.container.offset({
                    top: position.y,
                    left: left
                });
            }
            return self;
        }

        function showWindowNearTarget(id, $target) {
            var data = getWindow(id);
            if (data != null) {
                data.container.show();

                var $container = view.getNode('container');

                var elementSizes = {
                    width: data.container.width(),
                    height: data.container.height()
                };

                var targetSizes = {
                    left: $target.offset().left,
                    top: $target.offset().top,
                    width: $target.width(),
                    height: $target.height(),
                };

                var left = (elementSizes.width + targetSizes.left > $container.width() && elementSizes.width < targetSizes.left - $container.offset().left) ? targetSizes.left + targetSizes.width - elementSizes.width : targetSizes.left;

                data.container.offset({
                    top: targetSizes.top + targetSizes.height,
                    left: left
                });
            }
            return self;
        }

        function isVisible(id) {
            return (view.getNode('container').children('.grid-window-' + id + ':visible').length > 0);
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
            view.onBodyClick.subscribe(hideWindows);
            view.onColumnResizeStart.subscribe(hideWindows);
            return self;
        }

        function destroy() {
            view.onBodyClick.unsubscribe(hideWindows);
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
            "showWindow": showWindow,
        });
    }


    function Create(view, settings) {
        if (view instanceof SmallGrid.View.View === false) {
            throw new TypeError("View expected.");
        }

        return new SmallGrid.View.Window.Manager(view, settings).init();
    }

})(jQuery);