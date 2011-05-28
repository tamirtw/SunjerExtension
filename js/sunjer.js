/**
  * sunjer
  * Source: http://github.com/ankit/sunjer
  *
  * Copyright (c) 2010 Ankit Ahuja
  * Dual licensed under GPL and MIT licenses
 **/

var sunjer = {

    status: false,

    selectedElement: null,

    hoveredElement: null,

    selectionStatus: false,
    
    selectionBox: null,

    options: {
        useShortcutKey: true,
        shortcutKey: 77, // 77 is keycode for 'm'
        shortcutMetaKey: 'alt',
        mode: 'Basic',
        position: 'Right',
		sync: false,
		livePreviewColorPicker: false
    },
    
    initialize: function(options) {
        this.style.initialize();
        this.setOptions(options);
        this.contextmenu.initialize();
    },
    
    setOptions: function(options) {
		for (option in options) {
			this.options[option] = options[option];
		}
    },
    
    // toggle sunjer editing status
    toggle: function() {
        if (this.status === true)
            this.close();
        else
            this.open();
    },
    
	open: function() {
        this.attachListeners();
	this.style.enable();
        this.panel.open();
        this.status = true;
        this.chrome.setIcon(true);
        this.enableSelection();
        attachKeyboardShortcuts();
        this.panel.update();
    },
    
	close: function() {
        sunjer.panel.close();
        sunjer.status = false;
        sunjer.chrome.setIcon(false);
        sunjer.style.reset();
        sunjer.disableSelection();
		sunjer.detachClickListener();
        sunjer.unhighlight();
        sunjer.selectedElement = null;
        sunjer.destroySelectionBox();
        detachKeyboardShortcuts();
		// sync styles
		if (sunjer.options.sync === true) {
			sunjer.chrome.pushStyles();
		}
    },
    
    highlight: function(el) {
        if (!sunjer.selectionBox)
            sunjer.createSelectionBox();

        sunjer.hoveredElement = el;
        sunjer.selectionBox.highlight(el);
    },
    
    unhighlight: function() {
        sunjer.hoveredElement = null;
        if (sunjer.selectionBox)
            sunjer.selectionBox.hide();
    },
    
    // called when user selects an element
    select: function(el, selector) {
        sunjer.disableSelection();
        // preference is given to element over selector
        if (el)
        {
            sunjer.selectedElement = el;
            selector = SelectorGenerator.generate(el);
            sunjer.highlight(el);
        }
        else if (selector)
        {
            try {
                el = $(selector).get(0);
                sunjer.selectedElement = el;
                sunjer.highlight(el);
            }
            catch(e) {
                sunjer.selectedElement = null;
            }
        }
        else
        {
            sunjer.selectedElement = sunjer.hoveredElement;
            selector = SelectorGenerator.generate(sunjer.selectedElement);
        }
        sunjer.style.fillelements(selector);
        sunjer.panel.open();
        setTimeout(function() {
            sunjer.style.removeFromStyleElement();
        }, 100);
    },
    
    toggleSelection: function() {
        if (sunjer.selectionStatus)
        {
            sunjer.select(null, sunjer.style.elements.selector);
            sunjer.disableSelection();
        }
        else
        {
            sunjer.panel.disable();
            sunjer.unhighlight();
            sunjer.enableSelection();
        }
    },
    
    enableSelection: function() {
        sunjer.attachListeners();
        sunjer.selectionStatus = true;
//        sunjer.panel.elements.headerSelectIcon
//        .addClass('sunjer-select-icon-active')
//        .attr('title', 'Click to disable selection of element');
    },
    
    disableSelection: function() {
        sunjer.detachListeners();
        sunjer.selectionStatus = false;
//        sunjer.panel.elements.headerSelectIcon
//        .removeClass('sunjer-select-icon-active')
//        .attr('title', 'Click to enable selection of element');
    },
    
    createSelectionBox: function() {
        sunjer.selectionBox = new SelectionBox(2, "sunjer-selection");
    },
    
    destroySelectionBox: function() {
        if (sunjer.selectionBox)
        {
            sunjer.selectionBox.destroy();
            delete sunjer.selectionBox;
        }
    },
    
    attachListeners: function() {
        document.addEventListener('mousemove', this.onMouseMove, true);
        document.addEventListener('mousedown', this.onMouseDown, true);
        document.addEventListener('click', this.onMouseClick, true);
    },
    
    detachListeners: function() {
        document.removeEventListener('mousemove', this.onMouseMove, true);
        document.removeEventListener('mousedown', this.onMouseDown, true);
    },
    
    detachClickListener: function() {
        // We have to remove the click listener in a second phase because if we remove it
        // after the mousedown, we won't be able to cancel clicked links
        // thanks to firebug
        document.removeEventListener('click', this.onMouseClick, true);
    },
    
    onMouseMove: function(e) {
        // for dropdown
        if (e.target.className == "sunjer-dropdown-li") {
            var $el = $(e.target.innerText).get(0);
            if ($el != sunjer.hoveredElement) {
                sunjer.highlight($el);
            }
            return true;
        }
        if (!sunjer.shouldSelect(e.target))
            return true;
        if(sunjer.belongsTosunjer(e.target)) {
            sunjer.unhighlight();
            return true;
        }
        e.preventDefault();
        e.stopPropagation();
        sunjer.highlight(e.target);
    },

    onMouseDown: function(e) {
        if (!sunjer.belongsTosunjer(e.target))
        {
            e.preventDefault();
            e.stopPropagation();
            sunjer.select();
            return false;
        }
    },
    
    onMouseClick: function(e) {
        if (!sunjer.belongsTosunjer(e.target))
        {
            e.preventDefault();
            e.stopPropagation();
            sunjer.detachClickListener();
            return false;
        }
    },
    
    belongsTosunjer: function(el) {
        var $el = $(el);
        var parent = $el.closest('#sunjer, .sunjer_colorpicker, #sunjer-modal');
        var id = $el.attr('id');
        if (parent.length != 0 || id.indexOf("sunjer") != -1)
            return true;
        return false;
    },
    
    shouldClose: function(el) {
        if (!sunjer.status ||
            sunjer.panel.basic.isColorPickerVisible ||
            sunjer.isKeyboardHelpVisible ||
            sunjer.page.isVisible ||
            $("#sunjer-dropdown").length != 0 ||
            el.tagName === 'SELECT')
        {
            return false;
        }
        return true;
    },
    
    shouldSelect: function(el) {
        if (el.className === "sunjer-selection"
            || sunjer.panel.isBeingDragged
            || sunjer.page.isVisible
            || sunjer.isKeyboardHelpVisible
            || sunjer.hoveredElement === el
            )
        {
            return false;
        }
        return true;
    }
}