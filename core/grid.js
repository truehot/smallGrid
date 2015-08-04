"use strict";

(function ($) {
    $.extend(true, window, {
        "SmallGrid": {
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
        var version = "0.2";
        var id = settings.Utils.getNewGuid();

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
            return plugins[name] !== undefined;
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

        /*
        Other
        */
        function getVersion() {
            return version;
        }

        function getId() {
            return id;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "getId": getId,
            "getSettings": getSettings,
            "getVersion": getVersion,
            "getView": getView,
            "getViewModel": getViewModel,
            "isRegisteredPlugin": isRegisteredPlugin,
            "registerPlugin": registerPlugin,
            "registerPlugins": registerPlugins,
            "unregisterPlugin": unregisterPlugin,
            "unregisterPlugins": unregisterPlugins,
        });
    }

    function CreateModel($container, rows, columns, settings) {
        var newSettings = new SmallGrid.Settings.Create(settings);
        var viewModel = new SmallGrid.View.Model(
            new SmallGrid.Row.Create(rows, newSettings),
            new SmallGrid.Column.Create(columns, newSettings),
            newSettings
        );

        var grid = new GridModel(
            $container,
            viewModel,
            newSettings
        );

        if (newSettings.explicitInitialization === false) {
            grid.init();
        }

        return grid;
    }

})(jQuery);