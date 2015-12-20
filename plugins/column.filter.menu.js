(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Plugins": {
                "ColumnFilterMenu": ColumnFilterMenu,
            }
        }
    });

    function ColumnFilterMenu(view, windowManager, settings) {
        var self = this;
        var lastActiveColumnId = null;

        function handleHeaderClick(evt) {
            if (evt && evt.type && evt.type == "filter") {
                evt.stopPropagation();
                lastActiveColumnId = evt.column.id;

                var isVisible = windowManager.isVisible(evt.column.id);
                windowManager.hideWindows();

                if (windowManager.isWindow(evt.column.id) === false) {

                    windowManager.createWindow(
                        evt.column.id,
                        {
                            filter: new SmallGrid.Query.FilterQuery(evt.column.field, settings)
                        },
                        buildElements(evt.column.id)
                    );

                    windowManager.showWindowNearTarget(evt.column.id, $(evt.event.target));
                } else if (isVisible === false) {
                    windowManager.showWindow(evt.column.id);
                }
            }
        }

        function buildElements(id) {
            var $element = $("<div class='grid-header-menu'></div>");
            var $form = $('<form>');
            var $content = $('<div class="grid-header-menucontent"></div>')
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
        Handlers
        */
        function handleMenuSubmit(evt) {
            evt.preventDefault();

            var data = windowManager.getWindow(evt.data.id);
            if (data && data.opts) {
                var column = view.getModel().columns.getColumnById(evt.data.id);
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
                    view.getModel().columns.updateColumn(column);
                    view.getModel().setFilter(filter);
                    windowManager.hideWindow(evt.data.id);
                }
            }
        }

        function handleMenuClear(evt) {
            var data = windowManager.getWindow(evt.data.id);
            if (data) {
                var column = view.getModel().columns.getColumnById(evt.data.id);
                if (column) {
                    column.headerCssClass = column.headerCssClass.replace(' ' + settings.cssClass.headerFilterActive, '');
                    view.getModel().columns.updateColumn(column);

                    view.getModel().clearFilter(data.opts.filter);
                    windowManager.hideWindow(evt.data.id);
                }

            }
        }

        function handleMenuClick(evt) {
            evt.stopPropagation();
        }

        function hideWindow() {
            if (lastActiveColumnId != null) {
                windowManager.hideWindow(lastActiveColumnId);
                lastActiveColumnId = null;
            }
        }

        /*
        Init && destroy
        */
        function init() {
            view.onHeaderClick.subscribe(handleHeaderClick);
            view.onScrollStart.subscribe(hideWindow);
            return self;
        }

        function destroy() {
            view.onHeaderClick.unsubscribe(handleHeaderClick);
            view.onScrollStart.unsubscribe(hideWindow);
        }


        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });
    }



})(jQuery);