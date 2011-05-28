/**
  * sunjer.style
  * 
  * Generation and application of CSS rules
  **/

sunjer.style = {
    /*  elements of custom CSS rules applied to elements on the current page
        e.g.: 
        rules = {
            'a': { 
                    'color': '#fff',
                    'font-size': '12px'
                }
            }
    */
    rules: {},
    
    timer: null,
    
    parser: null,

	status: true,
    
    // the undo stack. size is limited to last 5 actions
    undoStack: [],
    
    elements: {
        // most recently selected elements' selector
        selector: null,
        // most recently selected elements
        elements: null,
        url: document.domain,
        styleEl: null
    },
    
    // initialize rules and url from temporary variables in apply-css.js
    initialize: function() {
        if (sunjerTempUrl)
        {
            this.elements.url = sunjerTempUrl;
            delete sunjerTempUrl;
        }
        // if domain is empty, return url
        else if (!this.elements.url || this.elements.url == "") {
            this.elements.url = location.href;
        }
        if (sunjerTempRules)
        {
            this.rules = sunjerTempRules;
            delete sunjerTempRules;
        }
    },
    
    // update current selector and selected elements
    fillelements: function(selector) {
        if (selector != this.elements.selector)
        {
            this.elements.selector = selector;
            try {
                this.elements.elements = $(selector + ":not(#sunjer, #sunjer *)");
            }
            catch(e) {
                this.elements.elements = null;
            }
        }
    },
    
    // applies property-value pair to currently selected elements as inline css, updates elements and saves the rule
    // called by basic mode
    apply: function(property, value) {
        if (!this.elements.selector || this.elements.selector == "")
            return true;
        this.savePropertyToelements(this.elements.selector, property, value);
        this.save();
        setTimeout(function() {
            if (sunjer.style.elements.elements && sunjer.style.elements.elements.length != 0) {
                sunjer.style.updateInlineCSS(sunjer.style.elements.elements, sunjer.style.getInlineCSS( sunjer.style.elements.selector));
            }
            // if no elements, update the stylesheet
            else {
                sunjer.style.updateStyleElement(sunjer.style.rules);
            }
        }, 0);
    },
    
    // applies css to selected elements as inline css and calls saveRuleFromCSS
    // called by advanced mode
    applyCSS: function(css) {
        if (!sunjer.style.elements.selector)
            return true;

        // calculating timer duration based upon number of elements
        var duration;
        if (sunjer.style.elements.elements) {
            var noOfElements = sunjer.style.elements.elements.length;

            if (noOfElements >= 400)
                duration = 400;
            else if (noOfElements >= 200)
                duration = 300;
            else
                duration = 0;
        }

        else {
            duration = 0;
        }

        if (sunjer.style.updateCSSTimer)
        {
            clearTimeout(sunjer.style.updateCSSTimer);
            sunjer.style.updateCSSTimer = null;
        }
        
        sunjer.style.updateCSSTimer = setTimeout(function() {
            sunjer.style.saveRuleFromCSS(css, sunjer.style.elements.selector);
            
            if (sunjer.style.elements.elements && sunjer.style.elements.elements.length != 0) {
                var newCSS = CSSUtils.crunchCSSForSelector(sunjer.style.rules, sunjer.style.elements.selector, true);
                sunjer.style.updateInlineCSS(sunjer.style.elements.elements, newCSS);
            }
            else
                sunjer.style.updateStyleElement(sunjer.style.rules);

        }, duration);
        
        if (sunjer.style.timer) {
            clearTimeout(sunjer.style.timer);
            sunjer.style.timer = null;
        }
        
        sunjer.style.timer = setTimeout(function() {
            sunjer.style.save();
        }, 1000);
    },
    
    // called when CSS of the entire page is edited in a popup
    applyPageCSS: function(css) {
        if (css == "")
            this.rules = {};

        else {
            if (!this.parser)
                this.parser = new CSSParser();

            try {
                var sheet = this.parser.parse(css);
                var rules = CSSUtils.getRulesFromParserObject(sheet);
                this.rules = rules;
            }

            catch(e) {}
        }

        this.clearInlineCSS(this.elements.elements);
        this.updateStyleElement(this.rules);
        this.save();
    },
    
    // parses CSS into a rule, updates the elements and saves the rule
    saveRuleFromCSS: function(css, selector) {
        if (!selector)
            return true;
        // empty rule for selector
        delete this.rules[selector];

        if (css != "") {
            if (!this.parser)
                this.parser = new CSSParser();
                
            var sheet = this.parser.parse(selector + "{" + css + "}");
            var generatedRule = CSSUtils.getRuleFromParserObject(sheet);
            // save rule to elements
            this.rules[selector] = generatedRule;
        }
    },
    
    
    // add/update property-value pair in rules elements
    savePropertyToelements: function(selector, property, value) {
        // check if the selector already exists in the list
        var rule = this.rules[selector];
        if (rule != undefined)
        {
            if (!this.filter(property, value))
            {
                // does a value for property already exist
                if (rule[property] != undefined)
                {
                    delete this.rules[selector][property];
                 
                    // if no properties left, remove rule as well
                    // TODO: Use something more elegant than this hack.
                    var i = null;
                    for (i in this.rules[selector])
                    { break; }
                    if (!i)
                        delete this.rules[selector];
                }
            }
            else
                rule[property] = value;
        }
        else if (this.filter(property, value))
        {
            this.rules[selector] = new Object();
            this.rules[selector][property] = value;
        }
    },
    
    // check if a property / value pair is valid for addition to rules elements
    filter: function(property, value) {
        if (value == "")
            return false;
        
        var sizeProperties = [ 'font-size', 'line-height', 'letter-spacing', 'letter-height', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-width', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width' ];
        
        if ($.inArray(property, sizeProperties) != -1 && parseFloat(value))
        {
            if ($.inArray(value, WidgetUI.validSizeUnits) != -1)
                return false;
        }
        return true;
    },
    
    // generate inline CSS for selector
    getInlineCSS: function(selector) {
        var rule = this.rules[selector];
        if (rule != undefined)
        {
            var css = "";
            for (var property in rule)
                css += CSSUtils.getCSSDeclaration(property, rule[property], true);

            return css;
        }
        return "";
    },
    
    // apply inline CSS to element(s)
    updateInlineCSS: function(el, newCustomCSS) {
        if (!el || el.length == 0)
            return false;
        el.each(function() {
            var existingCSS = $.trim($(this).attr('style'));
            var existingCustomCSS = $(this).data("sunjer-css");
            var newCSS;
            // if sunjer css is being applied to the element for the first time
            if (!existingCustomCSS)
            {
                // if there is any existing inline CSS, append sunjer CSS to it
                if (existingCSS != undefined)
                {
                    if (existingCSS.length != 0 && existingCSS[existingCSS.length-1] != ";")
                        newCSS = existingCSS + ";" + newCustomCSS;
                    else
                        newCSS = existingCSS + newCustomCSS;
                }
                else
                    newCSS = newCustomCSS;
                $(this).attr({
                    style: newCSS
                });
            }
            else
            {
                // replace existing sunjer CSS with updated sunjer CSS
                newCSS = existingCSS.replace(existingCustomCSS, newCustomCSS);
                $(this).attr({
                    style: newCSS
                });
            }
            // update sunjer css data associated with element
            $(this).data("sunjer-css", newCustomCSS);
        });
        
        // update selection box
        setTimeout(function() {
            sunjer.selectionBox.highlight(sunjer.selectedElement);
        }, 0);
    },

    // clear any custom inline CSS for element(s)
    clearInlineCSS: function(el) {
        if (!el)
            return false;
        el.each(function(){
            var existingCSS = $(this).attr('style');
            var existingCustomCSS = $(this).data("sunjer-css");
            if (existingCustomCSS && existingCSS != undefined)
            {
                var newCSS = existingCSS.replace(existingCustomCSS, '');
                $(this).attr({
                    style: newCSS
                });
                // clear sunjer css data associated with element
                $(this).data("sunjer-css", null);
            }
        });
    },
    
    // clear all custom inline CSS
    resetInlineCSS: function() {
        for (var selector in sunjer.style.rules)
            sunjer.style.clearInlineCSS($(selector));
    },

    // remove rule for current selector from sunjer's <style> element and apply it as inline css
    removeFromStyleElement: function() {
        // if no elements are selected, return
        if (!this.elements.elements || this.elements.elements.length == 0)
            return;
        this.updateInlineCSS(this.elements.elements, this.getInlineCSS(this.elements.selector));
        
        var tempRules = {};
        for (var sel in this.rules)
        {
            if (sel != this.elements.selector)
                tempRules[sel] = this.rules[sel];
        }
        this.updateStyleElement(tempRules);
    },
    
    // update css in sunjer's <style> element
    updateStyleElement: function(rules) {
        if (!this.elements.styleEl)
            this.elements.styleEl = $("#sunjer-css");
        
        if (this.elements.styleEl.length != 0)
            this.elements.styleEl.html(CSSUtils.crunchCSS(rules, true));
        else
        {
            CSSUtils.injectCSS(CSSUtils.crunchCSS( rules, true ), "sunjer-css");
            this.elements.styleEl = $("#sunjer-css");
        }
    },
    
    // get the rule for a selector from rules elements
    getRule: function(selector) {
        var rule = this.rules[selector];
        if (rule != undefined)
            return rule;
        else
            return null;
    },
    
    // remove any existing custom CSS for current selector from rules elements and selected elements' inline css
    remove: function() {
        if (this.rules[this.elements.selector])
            delete this.rules[this.elements.selector];
        this.clearInlineCSS(this.elements.elements);
        setTimeout(function() {
            sunjer.selectionBox.highlight(sunjer.selectedElement);
        }, 0);
        // save
        this.save();
    },
    
    // remove all custom css for page from rules elements, sunjer's <style> element and inline css
    removeAll: function() {
        for (var selector in this.rules)
        {
            delete this.rules[selector];
            this.clearInlineCSS($(selector));
        }
        this.updateStyleElement(null);
        setTimeout(function() {
            sunjer.selectionBox.highlight(sunjer.selectedElement);
        }, 0);
        // save
        this.save();
    },
    
    // send request to background.html to save all rules in elements
    save: function() {
        // if no rules are present, send null as value, so that entry for url is removed from storage
        var rules = null;
        var i = false;
        for (var i in sunjer.style.rules)
            break;
        if (i)
            rules = sunjer.style.rules;
        sunjer.chrome.save(sunjer.style.elements.url, rules);
    },
    
    // called when sunjer is disabled. resets elements and all inline css. Also, updates the <style> element
    reset: function() {
        var duration = 100;
        sunjer.style.elements.selector = null;
        sunjer.style.elements.elements = null;
        setTimeout(function() {
            sunjer.style.updateStyleElement(sunjer.style.rules);
            sunjer.style.resetInlineCSS();
        }, duration);
    },
    
    undo: function() {
        if (this.undoStack.length == 0)
            return false;
        this.rules = this.undoStack.pop();
        this.clearInlineCSS(this.elements.elements);
        this.updateStyleElement(this.rules);
        this.save();
        sunjer.panel.open();
        setTimeout(function() {
            sunjer.highlight(sunjer.selectedElement);
        }, 0);
        this.refreshUndoState();
    },
    
    // save current state to undo stack
    saveState: function() {
        if (this.undoStack.length >= 5) {
            this.undoStack.shift();
        }
        this.undoStack.push(Utils.cloneObject(this.rules));
    },
    
    clearLastState: function() {
        this.undoStack.pop();
    },
    
    shouldEnableUndo: function() {
        if (this.undoStack.length == 0)
            return false;
        else
            return true;
    },
    
    refreshUndoState: function() {
        if (!this.shouldEnableUndo())
            sunjer.panel.disableUndo();
        else
            sunjer.panel.enableUndo();
    },

	disable: function() {
		this.status = false;
		$("#sunjer-css").html('');
	},
	
	enable: function() {
		if (this.status)
			return;
		this.status = true;
		$("#sunjer-css").html(CSSUtils.crunchCSS(this.rules, true));
	},
	
	toggle: function() {
		// if sunjer is open, don't allow user to disable styling on the page
		if (sunjer.status)
			return false;
		if (this.status) {
			this.disable();
		}
		else
			this.enable();
	}
}