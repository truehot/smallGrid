(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Grid": {
                "Create": CreateModel,
                "Model": GridModel,
            }
        }
    });

    function GridModel($container, view, viewModel, windowManager, settings) {
        var self = this,
            plugins = {},
            version = "0.5",
            id = SmallGrid.Utils.createGuid();

        /*
        Init & Destroy
        */
        function init() {
            registerPlugins(settings.plugins);
            return self;
        }

        function destroy() {
            for (var i = 0; i < plugins.length; i++) {
                unregisterPlugin(plugins[i]);
            }
            windowManager.destroy();
            view.destroy();
        }
        /*
         WindowManager
         */
        function getWindowManager() {
            return windowManager;
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

        function getRowsModel() {
            return viewModel.getRowsModel();
        }

        function getColumnsModel() {
            return viewModel.getColumnsModel();
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

            var plugin = SmallGrid.Plugins.Create(name, { view: view, viewModel: viewModel, windowManager: windowManager }, settings, pluginSettings);
            if (plugin) {
                plugins[name] = plugin;
            }
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
            }
            if (name in plugins) {
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
        });
    }

    function CreateModel($container, rows, columns, options) {
        var settings = SmallGrid.Settings.Create(options || {});

        var viewModel = SmallGrid.View.Model.Create(
            new SmallGrid.Row.Create(rows || [], settings),
            new SmallGrid.Column.Create(columns || [], settings),
            settings
        );

        var view = SmallGrid.View.Create($container, viewModel, settings);
        var windowManager = SmallGrid.View.Window.Create(view, settings);

        var grid = new GridModel(
            $container,
            view,
            viewModel,
            windowManager,
            settings
        );

        return grid.init();
    }

})(jQuery);