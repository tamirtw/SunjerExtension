/**
  * Events
  * 
  * Events for sunjer Panel Controls in Basic Mode
  **/

Events = {
    
    accordionTimer: null,
    
    onToggle: function(e) {
        var el = $(this);
        var className = 'sunjer-active-button';
        var status = el.hasClass(className);
        var value = '';
        var property = el.data('property');
        if (status)
            el.removeClass(className);
        else
        {
            el.addClass(className);
            value = el.data('value');
        }
        Events.saveProperty(property, value);
    },
    
    onRadioClick: function(e) {
        var value;

        if (e.target.checked == true)
            value = e.target.value;
        else
            value = '';
        value = value.split(',');

        var property = $(e.target).data('property');

        if (typeof(property) == "object")
        {
            var len = property.length;
            for (var i = 0; i < len; i++)
                Events.saveProperty(property[i], value[i]);
        }
        else
            Events.saveProperty(property, value);
    },
    
    onTextFieldKeyUp: function(e) {
        if (e.keyCode == 27) { // esc
            e.target.blur();
            return;
        }
	
		var value = e.target.value;
        var property = $(e.target).data('property');
		
		sunjer.style.apply(property, value);
    },
    
    onTextFieldFocus: function(e) {
        sunjer.style.saveState();
        $(e.target).data('lastState', e.target.value);
    },
    
    onTextFieldBlur: function(e) {
        if ($(e.target).data('lastState') == e.target.value) {
            sunjer.style.clearLastState();
        }

        $(e.target).data('lastState', null);
        sunjer.style.refreshUndoState();
    },

	onSizeFieldKeyDown: function(e) {
		// increment / decrement value by 1 with arrow keys
		//	        
		if (e.keyCode === 38 || e.keyCode === 40) { // up / down arrow
			e.preventDefault();
	
			var value = e.target.value;
		       var property = $(e.target).data('property');
		       var unit = $(e.target).next().attr('value');
	
			value = parseInt(value);
	
			if (isNaN(value)) {
				value = 0;
			}
	
			else {
				if (e.keyCode === 38) // up
					value += 1;
				else
					value -= 1;
			}
	
			e.target.value = value;
	
			if ( parseFloat(value) )
		           value += unit;

	      	sunjer.style.apply(property, value);
		}
	},
    
    onSizeFieldKeyUp: function(e) {
        if (e.keyCode === 27) // esc
		{
            e.target.blur();
            return;
        }

		if (e.keyCode === 38 || e.keyCode === 40) {
			// we're already handling this case in onSizeFieldKeyDown
			return;
		}
		
		var value = e.target.value;
        var property = $(e.target).data('property');
        var unit = $(e.target).next().attr('value');

        if ( parseFloat(value) )
            value += unit;

        sunjer.style.apply(property, value);
        // state is saved for undo in onTextFieldFocus and onTextFieldBlur
    },
    
    onSelectChange: function(e) {
        var value = e.target.value.split(',');
        var property = $(e.target).find('[value=' + e.target.value + ']').data('property');
        
		if (typeof(property) == "object")
        {
            var len = property.length;
            for (var i = 0; i < len; i++)
                Events.saveProperty(property[i], value[i]);
        }

        else
            Events.saveProperty(property, value);
    },
    
    onSegmentedControlClick: function(e) {
        var el = $(e.target);
        if (el.get(0).tagName != 'BUTTON')
            el = el.parent('button');

        // TODO: Try to implement the next element's border width using CSS
        var control = el.parent();
        var status = el.hasClass('sunjer-active-button');
        control.find('.sunjer-active-button')
        .removeClass('sunjer-active-button')
        .next().removeClass('sunjer-active-button-next');
        if (!status)
        {
            el.addClass('sunjer-active-button');
            el.next().addClass('sunjer-active-button-next');
            Events.saveProperty(el.data('property'), el.data('value'));
        }
        else
            Events.saveProperty(el.data('property'), '');
        el.focus();
    },
    
    toggleAccordion: function(h) {
        if (h.hasClass('sunjer-accordion-active'))
        {
            h.removeClass('sunjer-accordion-active')
            .focus()
            .next().hide();
        }
        else
        {
            h.addClass( 'sunjer-accordion-active' )
            .focus()
            .next().show();
        }
        
        // determine which accordions are open and
        // send request to save the new state to background.html elements
        if (this.accordionTimer)
            clearTimeout(this.accordionTimer);
        	this.accordionTimer = setTimeout(function() {
            var len = sunjer.panel.basic.elements.accordionHeaders.length;
            var enabledAccordions = [];
            
			for (var i = 0; i < len; i++)
            {
                if ($(sunjer.panel.basic.elements.accordionHeaders[i]).hasClass( 'sunjer-accordion-active' ))
                    enabledAccordions[enabledAccordions.length] = i;
            }

            sunjer.chrome.saveAccordionState(enabledAccordions);

        }, 500);
    },
    
    saveProperty: function(property, value) {
        // save current state to undo stack
        sunjer.style.saveState();
        sunjer.style.apply(property, value);
        sunjer.style.refreshUndoState();
    }
}