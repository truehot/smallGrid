(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Plugins": {
            "ColumnFilterMenu": ColumnFilterMenu
        }
    });

    function ColumnFilterMenu(context, settings) {
        var self = this,
            lastActiveColumnId = null;

        /*
         * Init && destroy
         */
        function init() {
            //register plugin settings
            if (!settings.plugins.ColumnFilterMenu) {
                settings.plugins.ColumnFilterMenu = {
                    enabled: false
                };
            }

            context.view.onHeaderClick.subscribe(handleHeaderClick);
            context.view.onScrollStart.subscribe(handleScrollStart);
            return self;
        }

        function destroy() {
            context.view.onHeaderClick.unsubscribe(handleHeaderClick);
            context.view.onScrollStart.unsubscribe(handleScrollStart);
        }

        /*
         * Handlers
         */
        function handleScrollStart() {
            if (settings.plugins.ColumnFilterMenu.enabled === true) {
                hideWindow();
            }
        }

        function handleHeaderClick(evt) {
            if (evt && evt.type && evt.type === "menu" && settings.plugins.ColumnFilterMenu.enabled === true) {
                evt.stopPropagation();
                lastActiveColumnId = evt.column.id;

                var isVisible = context.windowManager.isVisible(evt.column.id);
                context.windowManager.hideWindows();

                if (context.windowManager.isWindow(evt.column.id) === false) {

                    context.windowManager.createWindow(
                        evt.column.id,
                        buildElements(evt.column.id),
                        {
                            filter: new SmallGrid.Query.Filter(evt.column.field)
                        }
                    );

                    context.windowManager.showWindowNearTarget(evt.column.id, $(evt.event.target));
                } else if (isVisible === false) {
                    context.windowManager.showWindow(evt.column.id);
                }
            }
        }

        function buildElements(id) {
            var $element = $("<div class='grid-header-menu'></div>");
            var $form = $('<form>');
            var $content = $('<div class="grid-header-menu-content"></div>')
                .append('<select name="type1"><option value="contains">Contains</option><option value="doesnotcontain">Does not contains</option><option value="eq">Is equal to</option><option value="neq">Is not equal to</option><option value="startswith">Starts with</option><option value="endswith">Ends with</option></select>')
                .append('<input type="text" name="value1" value=""/>')
                .append('<select name="operator"><option value="and">And</option><option value="or">Or</option></select>')
                .append('<select name="type2"><option value="contains">Contains</option><option value="doesnotcontain">Does not contains</option><option value="eq">Is equal to</option><option value="neq">Is not equal to</option><option value="startswith">Starts with</option><option value="endswith">Ends with</option></select>')
                .append('<input type="text" name="value2" value=""/>')
                .append('<input type="submit" name="Filter" value="Filter" class="btn-submit"/>')
                .append('<input type="reset" name="Clear" value="Clear" class="btn-clear"/>')
                .appendTo($form);

            $form.on("submit", { id: id }, handleMenuSubmit);
            $form.on("reset", { id: id }, handleMenuClear);
            $form.on("click", { id: id }, handleMenuClick);
            $form.appendTo($element);

            return $element;
        }

        function getFormValues($element) {
            return {
                "value": [$element.find("input[name='value1']").val(), $element.find("input[name='value2']").val()],
                "type": [$element.find("select[name='type1']").val(), $element.find("select[name='type2']").val()],
                "operator": $element.find("select[name='operator']").val()
            };
        }

        /*
         * Menu handlers
         */
        function handleMenuSubmit(evt) {
            evt.preventDefault();

            var data = context.windowManager.getWindow(evt.data.id);
            if (data && data.opts) {
                var column = context.columnsModel.getColumnById(evt.data.id);
                if (column) {
                    var filter = data.opts.filter;
                    var formValues = getFormValues(data.container);

                    data.opts.filter.clear();
                    data.opts.filter.add(formValues.type[0], formValues.value[0]);
                    if (formValues.value[1]) {
                        data.opts.filter.add(formValues.operator);
                        data.opts.filter.add(formValues.type[1], formValues.value[1]);
                    }

                    column.headerCssClass += ' ' + settings.cssClass.headerFilterActive;
                    context.columnsModel.updateColumn(column);
                    context.viewModel.setFilter(filter);
                    context.windowManager.hideWindow(evt.data.id);
                }
            }
        }

        function handleMenuClear(evt) {
            var data = context.windowManager.getWindow(evt.data.id);
            if (data) {
                var column = context.columnsModel.getColumnById(evt.data.id);
                if (column) {
                    column.headerCssClass = column.headerCssClass.replace(' ' + settings.cssClass.headerFilterActive, '');
                    context.columnsModel.updateColumn(column);

                    context.viewModel.clearFilterById(data.opts.filter.getId());
                    context.windowManager.hideWindow(evt.data.id);
                }
            }
        }

        function handleMenuClick(evt) {
            evt.stopPropagation();
        }

        function hideWindow() {
            if (lastActiveColumnId !== null) {
                context.windowManager.hideWindow(lastActiveColumnId);
                lastActiveColumnId = null;
            }
        }
        /*
         * Public Api
         */
        function filterRows(filter) {
            var request = context.view.suspendRender();
            context.viewModel.setFilter(filter);
            context.view.resumeRender(request);
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
            "filterRows": filterRows
        });
    }



})(jQuery, window.SmallGrid = window.SmallGrid || {});