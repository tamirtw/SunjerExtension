/**
  * Utility Methods to create various UI Controls for Basic Mode
  *
  **/

var WidgetUI = {
    
    validSizeUnits: ['px', 'em', '%', 'pt'],
    
    createOption: function(control) {
        var container = $('<div>', {
            class: 'sunjer-widget-option'
        });
        
        return container.append(control);
    },
    
    createAccordionHeader: function(name) {
        return $('<a>', {
            class: 'sunjer-accordion-header',
            tabIndex: 0,
            html: name
        })
        .prepend( $('<div>', {
            class: 'sunjer-accordion-icon'
        }))
        .bind('mousedown keydown', function (e) {
            if (e.type == "keydown" && e.keyCode != 13)
                return true;
            e.preventDefault();
            
            var el = $(e.target);
            if (!el.hasClass('sunjer-accordion-header'))
                el = el.parent();
            
            Events.toggleAccordion(el);
        });
    },
    
    createTextField: function(property, size, onKeyDownHandler, onKeyUpHandler) {
		var $input = $('<input>',{
            type: 'text',
            id: 'sunjer-' + property,
            class: 'sunjer-control sunjer-textfield',
            size: size
        })

        .data('property', property)

        .click(function(e) {
            Utils.selectAllText(e.target);
        })

        .focus(Events.onTextFieldFocus)

        .blur(Events.onTextFieldBlur);

		if (onKeyDownHandler)
			$input.keydown(onKeyDownHandler)

		if (onKeyUpHandler)
			$input.keyup(onKeyUpHandler);
		
		return $input;
    },
    
    createSizeControl: function(property) {
        var container = $('<span>');
        
        // Textfield for entering size
        this.createTextField(property, 2, Events.onSizeFieldKeyDown, Events.onSizeFieldKeyUp)
        .appendTo(container);

        // Select box for choosing unit
        var select = $('<select>', {
            class: 'sunjer-control sunjer-select'
        })
        .change(function(e) {
            $(this).prev().keyup();
        })
        .appendTo(container);
        
        var len = this.validSizeUnits.length;
        
        for (var i = 0; i < len; i++) {
            this.createSelectOption(this.validSizeUnits[i], null, this.validSizeUnits[i])
            .appendTo(select);
        }
        return container;
    },
    
    createMultiSizeControl: function(control) {
        var container = $('<span>', {
            style: 'display: inline-block !important; margin-left: 50px !important; margin-top: -10px !important;'
        });
        var len = control.id.length;
        for (var i = 0; i < len; i++)
        {
            this.createLabel(control.options[i])
            .appendTo(container);
            
            this.createSizeControl(control.id[i])
            .attr('style', 'margin-bottom: 3px !important; display: inline-block !important;')
            .appendTo(container);
        }
        return container;
    },
    
    createFontFamilyControl: function(control) {
        var container = $('<span>');
        
        var select = $('<select>', {
            class: 'sunjer-control sunjer-select'
        })
        .change(function(e) {
            var el = $(this);
            var input = el.next();
            if (el.attr('value') == "Custom")
            {
                input
                .attr('value', '')
                .show();
            }
            else
            {
                input
                .hide()
                .attr('value', el.attr('value'));
            }
            input.keyup();
        })
        .appendTo(container);
        
        // default option
        this.createSelectOption('Default', null, '')
        .appendTo(select);
        
        var len = control.options.length;
        for (var i = 0; i < len; i++)
        {
            this.createSelectOption(control.options[i], null, control.options[i])
            .appendTo(select);
        }
        
        // custom option
        this.createSelectOption('Custom', null, 'Custom')
        .appendTo(select);

        // end of select
        
        // create custom font field
        $('<input>', {
            type: 'text',
            id: 'sunjer-' + control.id,
            class: 'sunjer-textfield',
            size: 20
        })

        .data('property', control.id)

        .keyup(Events.onTextFieldKeyUp)

        .css({
            marginLeft: '95px !important',
            marginTop: '5px !important',
            display: 'none'
        })

        .appendTo(container);
        
        return container;
    },
    
    createToggleButton: function(text, property, value) {

        return this.createButton(text)
        .addClass('sunjer-toggle sunjer-control')
        .attr('id', 'sunjer-' + property)
        .data({
            'value': value,
            'property': property
        })
        .click(Events.onToggle);
    },
    
    createRadio: function(text, name, property, value) {
        var span = $('<span>', {
            id: 'sunjer-' + property,
            class: 'sunjer-control'
        });

        var radio = $('<input>',{
            type: 'radio',
            name: name,
            class: 'sunjer-control sunjer-radio'
        });
        
        if (typeof(property) == 'string')
            radio.attr('value', value);
        else
            radio.attr('value', value.join(','));
        
        radio.data('property', property);
        radio.click(Events.onRadioClick);
        radio.appendTo(span);
        this.createInlineLabel(text).appendTo(span);
        return span;
    },
    
    createSelect: function(property) {
        return $('<select>', {
            id:'sunjer-' + property,
            class: 'sunjer-control sunjer-select'
        })
        .data('property', property)
        .change(Events.onSelectChange);
    },
    
    createSelectOption: function(text, property, value) {
        var option = $('<option>', {
            class: 'sunjer-select-option',
            html: text,
            value: value
        });
        
        if (property)
            option.data('property', property);
        return option;
    },
    
    createColorPicker: function(input) {
        return $( '<div>', {
            class: 'sunjer-colorselector sunjer-control', 
            tabIndex: 0
        })

        .append($('<div>', {class: 'sunjer-colorselector-color'}))

        .ColorPicker({
            flat: false,

            onChange: function(hsb, hex, rgb) {
                var colorCode = '#' + hex;
                // set input value to reflect the newly picked color's code
                input.attr( 'value', colorCode );
                // update the color selector color
                WidgetUI.setColorSelectorColor( input );
				
				// if live preview is enabled, update DOM
				if (sunjer.options.livePreviewColorPicker)
					input.keyup().blur();
            },
            
            onBeforeShow: function() {
                var color = input.attr('value');
                if(color == "")
                    color = "#ffffff"; // default is white
                $(this).ColorPickerSetColor(color);
                sunjer.panel.basic.isColorPickerVisible = true;
                input.focus();
            },
            
            onHide: function() {
                input.keyup().blur();
                sunjer.panel.basic.isColorPickerVisible = false;
            }
        })

        .keyup(function(e) {
            if(e.keyCode == 13 && !$(e.target).hasClass('disabled')) // enter
                $(this).ColorPickerToggle();
        });
    },
    
    // Set color selector value by fetching value from connected input textfield
    setColorSelectorColor: function(input) {
        // get the color value
        var color = input.attr('value');
        // get the color selector connected to the input field
        var colorSelector = input.prev().find('div');
        colorSelector.css('backgroundColor', color);
    },

    createLabel: function(text) {
        return $('<label>', {
            class: 'sunjer-label',
            html: text+":"
        });
    },
    
    createInlineLabel: function(text) {
        return $('<label>', {
            class: 'sunjer-inline-label',
            html: text
        });
    },
    
    createButton: function(text) {
        return $('<button>', {
            class: 'sunjer-button',
            html: text
        })
        .mouseup( function(e) { e.target.focus(); } );
    },
    
    createButtonSet: function(buttons, className,  enabledButtonIndex, callback) {
        var container = $('<span>');
        var len = buttons.length;
        for(var i=0; i<len; i++)
        {
            var bt = this.createButton(buttons[i])
            .addClass(className)
            .data('class', className)
            .appendTo(container)
            .click(callback);

            if(i == enabledButtonIndex)
                bt.addClass('sunjer-active-button');
        }
        return container;
    }, 
    
    createSegmentedControl: function(control) {
        var container = $('<span>', {
            class: 'sunjer-control sunjer-segmented-control',
            id: 'sunjer-' + control.id,
        });
        
        var len = control.options.length;
        for(var i = 0; i < len; i++)
        {
            var bt = this.createButton(control.options[i])
            .addClass('sunjer-segmented-button')
            .data({
                 value: control.values[i],
                 property: control.id
            })
            .click(Events.onSegmentedControlClick)
            .appendTo(container);
			// explicitly having to add the 'sunjer-last-child' class as :last-child causes weird issue in Chrome
			if (i == (len - 1))
			{
				bt.addClass('sunjer-last-child');
			}
        }
        return container;
    }
}