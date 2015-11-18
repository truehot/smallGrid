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
        if (SmallGrid.Utils.isFunction(name, SmallGrid.Plugins) === true) {
            settings.plugins[name] = jQuery.extend(true, settings.plugins[name] || {}, pluginSettings || {});
            var plugin = new SmallGrid.Plugins[name](view, windowManager, settings);
            plugin.init();
            return plugin;
        }
    }

})(jQuery);