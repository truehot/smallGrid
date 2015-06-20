"use strict";

(function ($) {
    $.extend(true, window, {
        "Small": {
            "Grid": {
                "Create": CreateModel,
                "Model": GridModel,
            }
        }
    });

    function GridModel($container, viewModel, settings) {
        var self = this;
        var view = {};
        var plugins = {};

        /*
        Init & Destroy
        */
        function init() {
            view = new settings.View.Create($container, settings);
            view.setModel(viewModel);
            registerPlugins(settings.plugins);
            view.render();
        }

        function destroy() {
            for (var i = 0; i < plugins.length; i++) {
                unregisterPlugin(plugins[i]);
            }
        }

        /*
        View
        */
        function getView() {
            return view;
        }

        /*View model*/
        function getViewModel() {
            return viewModel;
        }

        /*
        Settings
        */
        function getSettings() {
            return settings;
        }

        /*
        Plugins
        */
        function isRegisteredPlugin(name) {
            return plugins[name] != undefined;
        }

        function registerPlugin(name) {
            if (isRegisteredPlugin(name)) {
                unregisterPlugin(name);
            }
            plugins[name] = new settings.Plugins[name](viewModel, view, settings);
        }

        function registerPlugins(array) {
            for (var i = 0; i < array.length; i++) {
                registerPlugin(array[i]);
            }
        }

        function unregisterPlugin(name) {
            if (plugins[name]) {
                plugins[name].destroy();
                delete plugins[name];
            }
        }

        function unregisterPlugins() {
            var keys = Object.keys(plugins);
            for (var i = 0; i < keys.length; i++) {
                unregisterPlugin(keys[i]);
            }
        }

        $.extend(this, {
            "destroy": destroy,
            "getSettings": getSettings,
            "getView": getView,
            "getViewModel": getViewModel,
            "init": init,
            "isRegisteredPlugin": isRegisteredPlugin,
            "registerPlugins": registerPlugins,
            "registerPlugin": registerPlugin,
            "unregisterPlugin": unregisterPlugin,
            "unregisterPlugins": unregisterPlugins,
        });
    }

    function CreateModel($container, rows, columns, settings) {
        var settings = new Small.Settings.Create(settings);
        var viewModel = new Small.View.Model(
            new Small.Row.Create(rows, settings),
            new Small.Column.Create(columns, settings),
            settings
        );

        var grid = new GridModel(
            $container,
            viewModel,
            settings
        );

        if (settings.explicitInitialization == false) {
            grid.init();
        }

        return grid;

    }

})(jQuery);