(function ($, SmallGrid) {
    "use strict";

    $.extend(true, SmallGrid, {
        "Cell": {
            "Editor": {
                "Create": CreateEditor,
                "Checkbox": CheckboxEditor,
                "Float": FloatEditor,
                "Integer": IntegerEditor,
                "Text": TextEditor,
                "Select": SelectEditor
            }
        }
    });

    function CheckboxEditor(context, settings) {
        var self = this,
            value = !context.value;

        this.destroy = function () { };

        this.getValue = function () {
            self.onChange.notify({
                "value": value
            });
            return value;
        };

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler()
        });

        self.onInitialize.notify({
            "value": context.value
        });
    }

    function FloatEditor(context, settings) {
        var self = this,
            value = context.value,
            $element = $('<input type="text" class="grid-float-editor" />').val(value).width(context.column.width);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            $element = undefined;
            self.onDestroy.notify({});
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            if ($element.is(':focus') === false) {
                $element.val(self.getValue()).select();
            }
            return self;
        };

        function convertValue(value) {
            return parseFloat(value, 10) || 0;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler()
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function IntegerEditor(context, settings) {
        var self = this,
            value = context.value,
            $element = $('<input type="text" class="grid-integer-editor" />').val(value).width(context.column.width);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            $element = undefined;
            self.onDestroy.notify({});
        };

        this.getValue = function () {
            return convertValue($element.val());
        };

        this.setValue = function (value) {
            $element.val(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            if ($element.is(':focus') === false) {
                $element.val(self.getValue()).select();
            }
            return self;
        };

        function convertValue(value) {
            return parseInt(value, 10) || 0;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler()
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function TextEditor(context, settings) {
        var self = this,
            value = context.value,
            $element = $('<input type="text" class="grid-text-editor"/>').val(value).width(context.column.width);

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            $element = undefined;
            self.onDestroy.notify({});
        };

        this.getValue = function () {
            return $element.val();
        };

        this.setValue = function (value) {
            $element.val(value);
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            if ($element.is(':focus') === false) {
                $element.val(self.getValue()).select();
            }
            return self;
        };


        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler()
        });

        self.onInitialize.notify({
            "value": value
        });
    }


    function SelectEditor(context, settings) {
        var self = this,
            option = context.value || { text: "", value: "" },
            $element = $('<select class="grid-select-editor"/>');

        this.append = function (cellNode) {
            $element.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $element.remove();
            $element = undefined;
            self.onDestroy.notify({});
        };

        this.getValue = function () {
            return { text: $element.find('option:selected').text(), value: $element.val() };
        };

        this.setValue = function (value) {
            $element.val(value);
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            $element.focus();
            return self;
        };

        this.setSource = function (values) {
            if (values.constructor === Array) {
                var options = '';
                var selected = false;
                for (var i = 0; i < values.length; i++) {
                    selected = option.value === values[i].value;
                    options += '<option value="' + values[i].value + '"' + (selected ? " selected" : "") + '>' + values[i].text + '</option>';
                }
                $element.append(options);
            }
        };

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler()
        });

        self.onInitialize.notify({
            "value": option
        });
    }

    function CreateEditor(name, context, settings) {
        if (!name.length) {
            throw new TypeError("Editor name is not defined");
        }

        if (settings instanceof Object === false) {
            throw new TypeError("Settings is not defined");
        }

        if (SmallGrid.Utils.isFunction(name, SmallGrid.Cell.Editor) === false) {
            throw new TypeError("name is not defined");
        }

        return new SmallGrid.Cell.Editor[name](context, settings);
    }

})(jQuery, window.SmallGrid = window.SmallGrid || {});