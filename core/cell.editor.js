(function ($) {
    "use strict";

    $.extend(true, window, {
        "SmallGrid": {
            "Cell": {
                "Editor": {
                    "Create": CreateEditor,
                    "Checkbox": CheckboxEditor,
                    "Float": FloatEditor,
                    "Integer": IntegerEditor,
                    "None": NoneEditor,
                    "Text": TextEditor,
                },
            }
        }
    });

    function CheckboxEditor(options, settings) {
        var self = this,
            value = options.value,
            $label = $('<label/>'),
            $element = $('<input type="checkbox" class="grid-checkbox-editor" ' + (convertValue(value)?'checked':'') + '/>').val(value);

        this.append = function (cellNode) {
            $element.appendTo($label);
            $label.appendTo(cellNode);
            return self;
        };

        this.remove = function () {
            if ($element && $element.length) {
                $element.detach();
            }
            return self;
        };

        this.destroy = function () {
            $label.remove();
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return convertValue($element.prop('checked'));
        };

        this.setValue = function (value) {
            $element.prop('checked', convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            $element.val(self.getValue()).focus();
            return self;
        };

        function convertValue(value) {
            return (/^true$/i).test(value);
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function FloatEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-float-editor" />').val(value);

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
            self.onDestroy.notify({});
            return self;
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
            $element.val(self.getValue()).select();

            return self;
        };

        function convertValue(value) {
            return parseFloat(value, 10) || 0;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function IntegerEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-integer-editor" />').val(value);

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
            self.onDestroy.notify({});
            return self;
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
            $element.val(self.getValue()).select();

            return self;
        };

        function convertValue(value) {
            return parseInt(value, 10) || 0;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function NoneEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $("<span class='grid-none-editor' />").text(value);

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
            self.onDestroy.notify({});
            return self;
        };

        this.getValue = function () {
            return convertValue($element.text());
        };

        this.setValue = function (value) {

            $element.text(convertValue(value));
            self.onChange.notify({
                "value": value
            });
            return self;
        };

        this.focus = function () {
            $element.select();
            return self;
        };

        function convertValue(value) {
            return value;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function TextEditor(options, settings) {
        var self = this,
            value = options.value,
            $element = $('<input type="text" class="grid-text-editor"/>').val(value);

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
            self.onDestroy.notify({});
            return self;
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
            $element.val(self.getValue()).select();
            return self;
        };

        function convertValue(value) {
            return value;
        }

        $.extend(this, {
            "onInitialize": new SmallGrid.Event.Handler(),
            "onChange": new SmallGrid.Event.Handler(),
            "onDestroy": new SmallGrid.Event.Handler(),
        });

        self.onInitialize.notify({
            "value": value
        });
    }

    function CreateEditor(name, options, settings) {
        if (SmallGrid.Utils.isFunction(name, SmallGrid.Cell.Editor) === true) {
            return new SmallGrid.Cell.Editor[name](options, settings);
        }
    }

})(jQuery);