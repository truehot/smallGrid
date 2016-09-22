(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "Footer": FooterPlugin
        }
    });

    function FooterPlugin(context, settings) {
        var self = this;

        var totalRows = 0;

        /*
         * Init && destroy
         */
        function init() {
            //register plugin settings
            if (!settings.plugins.Footer) {
                settings.plugins.Footer = {
                    enabled: false
                };
            }

            context.viewModel.onCacheRowsChange.subscribe(handleDataChange);
            context.viewModel.onCacheColumnsChange.subscribe(handleDataChange);
            context.view.onInitialize.subscribe(handleModelInit);

            return self;
        }

        function destroy() {
            context.viewModel.onRowsChange.unsubscribe(handleDataChange);
            context.viewModel.onCacheColumnsChange.unsubscribe(handleDataChange);
            context.view.onInitialize.unsubscribe(handleModelInit);
        }

        /*
         * Handlers
         */
        function handleModelInit() {
            if (settings.plugins.Footer.enabled === true) {
                context.view.getNode('footer').css({ display: 'block' });
                updateFooter(context.viewModel.getRowsTotal().count, context.viewModel.getColumnsTotal().count);
            }
        }
        function handleDataChange() {
            if (settings.plugins.Footer.enabled === true) {
                updateFooter(context.viewModel.getRowsTotal().count, context.viewModel.getColumnsTotal().count);
            }
        }

        /*
         * Other
         */
        function updateFooter(newTotalRows, newTotalColumns) {
            if (newTotalColumns === 0) {
                updateNode(0, 0, 0);
            } else if (totalRows !== newTotalRows) {
                var rows = context.viewModel.getRows();
                if (rows.length) {
                    totalRows = newTotalRows;
                    updateNode(newTotalRows, rows[0].calcIndex, rows[rows.length - 1].calcIndex);
                }
            }
        }

        function updateNode(totalRows, fromRow, toRow) {
            var el = context.view.getNode('footer');
            if (totalRows) {
                el.html("Showing " + fromRow + " to " + toRow + " of  " + totalRows);
            } else {
                el.html("No data available");
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy
        });
    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});