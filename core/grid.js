(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Grid": {
            "Create": CreateModel,
            "Model": GridModel
        }
    });

    function GridModel($container, context, settings) {
        var self = this,
            plugins = {},
            version = "0.6.2 beta",
            id = SmallGrid.Utils.createGuid();

        /*
         * Init & Destroy
         */
        function init() {
            registerPlugins(settings.plugins);

            var contextKeys = ["windowManager", "view", "viewModel"];
            for (var i = 0; i < contextKeys.length; i++) {
                context[contextKeys[i]].init();
            }

            self.onInitialize.notify({});
            return self;
        }

        function destroy() {
            unregisterPlugins();

            var contextKeys = ["windowManager", "view", "viewModel", "rowsModel", "columnsModel"];
            for (var i = 0; i < contextKeys.length; i++) {
                context[contextKeys[i]].destroy();
                delete context[contextKeys[i]];
            }

            self.onDestroy.notify({});
        }
        /*
         * WindowManager
         */
        function getWindowManager() {
            return context.windowManager;
        }

        /*
         * View
         */
        function getView() {
            return context.view;
        }

        /*
         * View model
         */
        function getViewModel() {
            return context.viewModel;
        }

        function getRowsModel() {
            return context.rowsModel;
        }

        function getColumnsModel() {
            return context.columnsModel;
        }

        /*
         * Settings
         */
        function getSettings() {
            return settings;
        }

        /*
         * Plugins
         */
        function getPlugin(name) {
            if (plugins[name]) {
                return plugins[name];
            }
        }

        function getPlugins() {
            return plugins;
        }

        function isRegisteredPlugin(name) {
            return plugins[name] !== undefined;
        }

        function registerPlugin(name, pluginSettings) {
            if (isRegisteredPlugin(name)) {
                unregisterPlugin(name);
            }

            var plugin = SmallGrid.Plugins.Create(
                name,
                context,
                settings,
                pluginSettings
            );

            if (!plugin) {
                throw new Error("Plugin is not defined.");
            }

            plugins[name] = plugin;
        }

        function registerPlugins(plugins) {
            var keys = Object.keys(plugins);
            for (var i = 0; i < keys.length; i++) {
                registerPlugin(keys[i], plugins[keys[i]]);
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
         * Other
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
            "getPlugin": getPlugin,
            "getPlugins": getPlugins,
            "getSettings": getSettings,
            "getVersion": getVersion,
            "getView": getView,
            "getViewModel": getViewModel,
            "getRowsModel": getRowsModel,
            "getColumnsModel": getColumnsModel,
            "getWindowManager": getWindowManager,
            "isRegisteredPlugin": isRegisteredPlugin,
            "registerPlugin": registerPlugin,
            "registerPlugins": registerPlugins,
            "unregisterPlugin": unregisterPlugin,
            "unregisterPlugins": unregisterPlugins,

            "onInitialize": SmallGrid.Callback.Create(),
            "onDestroy": SmallGrid.Callback.Create()
        });
    }

    function CreateModel($container, rows, columns, options, autoInit) {
        var settings = SmallGrid.Settings.Create(options || {});
        var rowsModel = SmallGrid.Row.Create(rows || [], settings);
        var columnsModel = SmallGrid.Column.Create(columns || [], settings);
        var viewModel = SmallGrid.View.Model.Create(rowsModel, columnsModel, settings, false);
        var view = SmallGrid.View.Create($container, viewModel, settings, false);
        var windowManager = SmallGrid.View.Window.Create(view, settings, false);

        var grid = new GridModel(
            $container,
            {
                "columnsModel": columnsModel,
                "rowsModel": rowsModel,
                "view": view,
                "viewModel": viewModel,
                "windowManager": windowManager
            },
            settings
        );

        if (autoInit !== false) grid.init();

        return grid;

    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});