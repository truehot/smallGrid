(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "Create": Create,
            }
        }
    });

    function Create(name, context, settings, pluginSettings) {
        if (!name.length) {
            throw new Error("Plugin name is not defined.");
        }

        if (context.view instanceof SmallGrid.View.View === false) {
            throw new TypeError("View is not defined");
        }

        if (context.windowManager instanceof SmallGrid.View.Window.Manager === false) {
            throw new TypeError("WindowManager is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        if (SmallGrid.Utils.isFunction(name, SmallGrid.Plugins) !== true) {
            throw new TypeError("name is not defined");
        }

        settings.plugins[name] = jQuery.extend(true, settings.plugins[name] || {}, pluginSettings || {});
        var plugin = new SmallGrid.Plugins[name](context, settings);
        return plugin.init();

    }

})(jQuery);