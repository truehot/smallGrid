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

        function handleHeaderClick(event) {
            if (event && event.type && event.type == "filter") {
                event.stopPropagation();
                var isVisible = windowManager.isVisible(event.column.id);
                windowManager.hideWindows();

                if (windowManager.isWindow(event.column.id) === false) {

                    windowManager.createWindow(
                        event.column.id,
                        { filter: new SmallGrid.Query.FilterQuery(event.column.field, settings) },
                        buildElements(event.column.id)
                    );

                    windowManager.showWindowNearTarget(event.column.id, $(event.event.target));
                } else if (isVisible === false) {
                    windowManager.showWindow(event.column.id);
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
        function handleMenuSubmit(event) {
            event.preventDefault();

            var data = windowManager.getWindow(event.data.id);
            if (data) {
                var filter = data.opts.filter;
                var formValues = getFormValues(data.container);

                data.opts.filter.clear();
                data.opts.filter.add(formValues.type[0], formValues.value[0]);
                if (formValues.value[1]) {
                    data.opts.filter.add(formValues.operator);
                    data.opts.filter.add(formValues.type[1], formValues.value[1]);
                }
                view.getModel().setFilter(filter);

                windowManager.hideWindow(event.data.id);
            }
        }

        function handleMenuClear(event) {
            var data = windowManager.getWindow(event.data.id);
            if (data) {
                view.getModel().clearFilter(data.opts.filter);
                windowManager.hideWindow(event.data.id);
            }
        }

        function handleMenuClick(event) {
            event.stopPropagation();
        }

        /*
        Init && destroy
        */
        function init() {
            view.onHeaderClick.subscribe(handleHeaderClick);
            return self;
        }

        function destroy() {
            view.onHeaderClick.unsubscribe(handleHeaderClick);
        }


        $.extend(this, {
            "init": init,
            "destroy": destroy,
        });
    }



})(jQuery);