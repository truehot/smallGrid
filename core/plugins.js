(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "Create": Create,
            }
        }
    });

    function Create(name, view, windowManager, settings, pluginSettings) {
        if (!name.length) {
            throw new Error("Plugin name is not defined.");
        }

        if (view instanceof SmallGrid.View.View === false) {
            throw new TypeError("View expected.");
        }

        if (windowManager instanceof SmallGrid.View.Window.Manager === false) {
            throw new TypeError("Window manager expected.");
        }

        if (SmallGrid.Utils.isFunction(name, SmallGrid.Plugins) === true) {
            settings.plugins[name] = jQuery.extend(true, settings.plugins[name] || {}, pluginSettings || {});
            var plugin = new SmallGrid.Plugins[name](view, windowManager, settings);
            plugin.init();
            return plugin;
        }
    }

})(jQuery);