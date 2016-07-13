(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "Footer": FooterPlugin
        }
    });

    function FooterPlugin(context, settings) {
        var self = this;
        var totalColumns = {
            height: 0,
            count: 0
        };
        var totalRows = {
            width: 665,
            count: 5
        };
        var rowsRange = {
            from: 0,
            to: 0
        };

        /*
         * Init && destroy
         */
        function init() {
            context.viewModel.onColumnsChange.subscribe(handleColumnsChange);
            context.viewModel.onRowsChange.subscribe(handleRowsChange);
            context.view.onInitialize.subscribe(handleModelInit);
            return self;
        }

        function destroy() {
            context.viewModel.onColumnsChange.unsubscribe(handleColumnsChange);
            context.viewModel.onRowsChange.unsubscribe(handleRowsChange);
            context.view.onInitialize.unsubscribe(handleModelInit);
        }

        /*
         * Handlers
         */
        function handleModelInit() {
            if (settings.plugins.Footer.enabled !== true) return;

            getInfo();
            updateFooter();
        }

        function handleColumnsChange() {
            if (settings.plugins.Footer.enabled !== true) return;

            getInfo();
            updateFooter();
        }

        function handleRowsChange() {
            if (settings.plugins.Footer.enabled !== true) return;

            getInfo();
            updateFooter();
        }

        /*
         * Other
         */

        function getInfo() {
            totalColumns = context.viewModel.getColumnsTotal();
            totalRows = context.viewModel.getRowsTotal();

            var rows = context.viewModel.getRows();
            if (rows.length) {
                rowsRange.from = rows[0].calcIndex;
                rowsRange.to = rows[rows.length - 1].calcIndex;
            }
        }

        function updateFooter() {
            if (totalColumns.count > 0 && totalRows.count) {
                context.view.getNode('footer').html("Showing " + rowsRange.from + " to " + rowsRange.to + " of  " + totalRows.count);
            } else {
                context.view.getNode('footer').html();
            }
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy
        });
    }
})(jQuery, window.SmallGrid = window.SmallGrid || {});