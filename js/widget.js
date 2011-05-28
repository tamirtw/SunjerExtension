/**
  * sunjer.panel
  *
  * Widget UI and functionality
  **/

sunjer.panel = {
    
    elements: {
        box: null,
        header: null,
        headerSelector: null,
        headerSelectIcon: null,
        undoBt: null,
        dropDown: null
    },
    
    defaults: {
        width: 320
    },
    
    isBeingDragged: false,
    
    //	Initialize widget UI
    createUI: function() {
        this.elements.box = $('<div>', {
            id: 'sunjer'
        });
        
        //	Header
        
        //	Selection toggle button
        this.elements.headerSelectIcon = $('<div>', {
            id: 'sunjer-select-icon'
        })
        .tipsy({
            delayIn: 1500,
            gravity:'nw'
        })
        .click(function(e) {
            sunjer.toggleSelection();
        });

        //	Selector
        this.elements.headerSelector = $('<div>', {
            class: 'sunjer-editable-text',
            html: 'custom styles',
            title: 'Click to edit the CSS selector'
        })
        .tipsy({
            delayIn: 1500,
            gravity:'nw'
        });
        
        //	Selectors dropdown
        this.dropDown = $('<div>', {
            id: 'sunjer-dropdown-button',
            class: 'sunjer-header-button',
            title: "View previously edited CSS selectors"
        })
        .tipsy({
            delayIn: 1500,
            gravity: 'ne'
        })
        .mouseup(sunjer.panel.showSelectorDropdown);
        
        var selectorContainer = $('<div>', {
            id: 'sunjer-header-selector'
        })
        .append(this.elements.headerSelector)
        .append(this.dropDown);
        
        //	Make selector editable
        Utils.makeEditable(this.elements.headerSelector, function(value) {
            sunjer.panel.updateHeight();
            sunjer.select(null, value);
        }, {
            selectText: true,
            fixedWidth: 200
        });
        
        //	URL
        var url = $('<div>', {
            html: sunjer.style.elements.url,
            class: 'sunjer-editable-text',
            title: 'Click to edit the partial URL for which custom CSS will be saved. <br><br>Tip: You can add multiple such URLs by separating them with a ,'
        })
        .tipsy({
            delayIn: 1500,
            gravity:'n',
            html: true
        });
        
        var urlContainer = $('<div>', {
            id: 'sunjer-header-url'
        })
        .append(url);
        
        // 	Make URL editable
        Utils.makeEditable(url, function(value) {
            sunjer.panel.updateHeight();
            if (value != sunjer.style.elements.url) {
                sunjer.chrome.transfer(sunjer.style.elements.url, value);
            }
            sunjer.style.elements.url = value;
        }, {
            selectText: true,
            fixedWidth: 200
        });

        //	Container for URL and selector
        var headerTextContainer = $('<div>', {
            id: 'sunjer-header-container'
        })
        .append(selectorContainer)
        .append(urlContainer);

        //	Close button
        var closeButton = $('<div>', {
            id: 'sunjer-close-button',
            class: 'sunjer-header-button'
        })
        .click(sunjer.close);
        
        //	Arrow button to toggle sunjer position
        var arrowButton = $('<div>', {
            id: 'sunjer-arrow-button',
            class: 'sunjer-arrow-left sunjer-header-button',
            title: "Move sunjer to the left"
        })
        .data('position', "Right")
        .tipsy({
            delayIn: 1500,
            gravity: 'ne'
        })
        .appendTo(this.elements.box)
        .mouseup(sunjer.panel.togglePosition);
        
        this.elements.header = $('<div>', {
            id: 'sunjer-header'
        })
        .append(this.elements.headerSelectIcon)
        .append(headerTextContainer)
        .append(closeButton)
        .append(arrowButton)
        .appendTo(this.elements.box);
        
        // 	Basic mode
        sunjer.panel.basic.createUI().appendTo(this.elements.box);
        

        //	Options (footer)
        var optionsContainer = $('<div>', {
            id: 'sunjer-widget-options'
        });
        
        
        var btContainer = $('<div>', {
            id: 'sunjer-main-buttons'
        });
        
        WidgetUI.createButton("Edit CSS")
        .attr('title', 'Edit entire page\'s CSS')
        .tipsy({
            delayIn: 800,
            gravity:'sw',
            html: true
        })
        .appendTo(btContainer)
        .click(sunjer.panel.editCSS)

        this.elements.undoBt = WidgetUI.createButton("Undo").attr({
            title: "Undo your last action",
            'disabled': "disabled"
        })

        .tipsy({
            delayIn: 800,
            gravity:'s',
            html: true
        })
        .appendTo(btContainer).click(function(e) {
            sunjer.style.undo();
        });
        
        WidgetUI.createButton("Reset")
        .attr('title', "Reset custom CSS for the selected elements")
        .tipsy({
            delayIn: 800,
            gravity:'s',
            html: true
        })
        .appendTo(btContainer).click(sunjer.panel.resetCSS);
        
        WidgetUI.createButton("Reset Page")
        .attr('title', "Reset custom CSS for the entire page")
        .tipsy({
            delayIn: 500,
            gravity:'se',
            html: true
        })
        .appendTo(btContainer).click(sunjer.panel.resetAllCSS);

        btContainer.appendTo(optionsContainer);
        optionsContainer.appendTo(this.elements.box);
        
        this.elements.box.appendTo(document.body);
        this.basic.setElementsSelectors();
        
        //	Initially, place the widget on the right of the screen
        sunjer.panel.setPosition("Right");
    },
    
    //	Attach listeners for TAB keypresses and window resize
    attachListeners: function() {
        var lastBt = $('#sunjer-main-buttons').find('button').last();
        
        // Shift + TAB on first accordion sets focus to last button
        //        $(this.basic.elements.accordionHeaders[0] ).bind('keydown', {lastBt: lastBt}, function(e) {
        //            if (e.keyCode == 9 && e.shiftKey)
        //            {
        //                e.stopImmediatePropagation();
        //                e.preventDefault();
        //                e.data.lastBt.focus();
        //            }
        //        });
        
        // TAB on last button sets focus to first accordion header
        //        lastBt.keydown(function(e) {
        //            if (e.keyCode == 9 && !e.shiftKey)
        //            {
        //                e.stopImmediatePropagation();
        //                e.preventDefault();
        //                sunjer.panel.basic.elements.accordionHeaders[0].focus();
        //            }
        //        });
        
        // listen to window resize event to update position/dimension of widget
        $(window).bind('resize', this.onWindowResize);
    },
    
    //	Get rid of the window resize listener
    detachListeners: function() {
        $(window).unbind('resize', this.onWindowResize);
    },
    
    //	Called on when the window is resized. Updates height of widget and selection UI
    //	@param e Event	Event object for when the window is resized
    onWindowResize: function(e) {
        sunjer.panel.setPosition(sunjer.options.position);
        sunjer.panel.updateHeight();
        
        if(sunjer.selectionBox)
            sunjer.selectionBox.highlight(sunjer.selectedElement);
    },
    
    //	Open the sunjer widget
    open: function() {
        if (!this.elements.box)
            this.createUI();
        this.attachListeners();
        this.setPosition(sunjer.options.position);

        //        if (sunjer.style.elements.selector) {
        //			this.enable();
        //		}
        //		else {
        //			this.disable();
        //		}

        setTimeout(function() {
            sunjer.panel.updateHeight();
        }, 0);

        this.elements.box.show();
    },

    update:function(){
        sunjer.chrome.getMenuData("bla=5&j=2", function(response) {
            alert(response);
            if (response) {
                //                $('#sunjer-drilldown-menu').html(menuHtml);
                doc = eval('(' + response + ')');
                for(var i in doc.projects){
                    var startLi = document.createElement("li");
                    var newDiv = document.createElement("div");
                    newDiv.innerHTML = doc.projects[i].projectName;
                    var start = document.getElementById("sunjer-drill-down-menu");
                    start.appendChild(startLi);
                    startLi.appendChild(newDiv);

                    newUl = document.createElement("ul");
                    startLi.appendChild(newUl);

                    for(var j in doc.projects[i].modelsList){
                        var newLi = document.createElement("li");
                        newUl.appendChild(newLi);
                        var newA = document.createElement("a");
                        newA.innerHTML = doc.projects[i].modelsList[j];
                        newLi.appendChild(newA);
                    }

                }
                $('#sunjer-drill-down-menu').uiPod({
                    rootTitle: 'More Info',
                    duration: 250,
                    height: 'auto',
                    useSideScroller: true,
                    fnAfter: function() {
                    //$.ddMenu.urlHelper('currentPageName');
                    }
                });
            }
        });
      
    },
	
    //	Close sunjer widget
    close: function() {
        this.detachListeners();
        this.elements.box.hide();
    },
    
    //	Enable UI of widget
    enable: function() {
        this.elements.headerSelector.html(sunjer.style.elements.selector);
        this.basic.elements.textfields.attr('disabled', '');
        this.basic.elements.buttons.attr('disabled', '');
        this.basic.elements.selectboxes.attr('disabled', '');
        this.basic.elements.colorSelectors.removeClass('disabled');
    },
    
    //	Disable UI of widget
    disable: function() {
        this.elements.headerSelector.html("Select an element");
        this.basic.elements.textfields.attr('disabled', 'disabled');
        this.basic.elements.buttons.attr('disabled', 'disabled');
        this.basic.elements.selectboxes.attr('disabled', 'disabled');
        this.basic.elements.colorSelectors.addClass('disabled');
    },
    
    //	Update widget position
    setPosition: function(where) {
        var left;
        if (where === "Left")
            left = 0;
        else if (where === "Right")
            left = $(window).width() - this.defaults.width - 3; // some padding

        this.elements.box.css('left', left);
        sunjer.options.position = where;
    },
    
    //	Refresh height of widget
    updateHeight: function() {
        sunjer.panel.elements.box.css('height', window.innerHeight);

        var headerHeight = sunjer.panel.elements.header.height();
        
        var optionsHeight = 150;
        if (headerHeight != 0)
            headerHeight -= 36;
        var newHeight = window.innerHeight - (optionsHeight + headerHeight);
        
        if (sunjer.options.mode == "Basic")
            sunjer.panel.basic.elements.container.css('height',  newHeight);
        else
            sunjer.panel.advanced.elements.cssField.css('height',  newHeight - 44);
    },
    

   
    
    //	Save styles
    save: function(e) {
        sunjer.style.save();
    },
    
    //	Reset the UI of the widget
    reset: function() {
        if (sunjer.options.mode === "Basic")
            sunjer.panel.basic.reset();
        else
            sunjer.panel.advanced.reset();
    },
    
    //	Display the page's CSS in a popup for editing
    editCSS: function(e) {
        sunjer.page.show(CSSUtils.crunchFormattedCSS(sunjer.style.rules, false), e.target);
    },
    
    //	Reset CSS for current selector
    resetCSS: function() {
        sunjer.panel.reset();
        sunjer.style.remove();
    },
    
    //	Reset the entire CSS for the page
    resetAllCSS: function() {
        sunjer.panel.reset();
        sunjer.style.removeAll();
    },
    
    //	Toggle sunjer position between left / right
    //	@param Event e The event object for when the left/right arrow button is clicked
    //
    togglePosition: function(e) {
        var $el = $("#sunjer-arrow-button");
        var pos;

        if (e)
            pos = $el.data('position');
        else
            pos = sunjer.options.position;
		
        if (pos === "Left")
        {
            pos = "Right";
			
            $el.removeClass("sunjer-arrow-right")
            .addClass("sunjer-arrow-left")
            .attr('title', "Move sunjer to the left");
        }
        else
        {
            pos = "Left";

            $el.removeClass("sunjer-arrow-left")
            .addClass("sunjer-arrow-right")
            .attr('title', "Move sunjer to the right");
        }

        $el.data('position', pos);
        sunjer.panel.setPosition(pos);
    },
    
    //	Toggle between Basic / Advanced modes
    // 	@param e Event Event object for when the Basic/Advanced mode buttons are clicked. Optional
    //
    toggleMode: function(e) {
        if (e)
            sunjer.options.mode = $(e.target).html();

        else if (sunjer.options.mode === "Basic") 
            sunjer.options.mode = "Advanced";
        
        else
            sunjer.options.mode = "Basic";
		
        sunjer.panel.updateHeight();
        sunjer.panel.basic.show();
    },
    
    //	Initialize and toggle the visibility of the selectors dropdown
    showSelectorDropdown: function() {
        var dropdown = $("#sunjer-dropdown");

        if (dropdown.length != 0) {
            dropdown.remove();
            return true;
        }

        var parent = sunjer.panel.elements.headerSelector.parent();
        var parentHeight = parent.height() + 10
        var height = $(window).height() - 50 - parentHeight;

        dropdown = $("<div>", {
            id: "sunjer-dropdown"
        })
        .css({
            left: parent.offset().left + (parent.width()/2),
            top: parentHeight,
            'max-height': height
        })
        
        var onClickElsewhere = function(e) {
            var $target = $(e.target);
            var id = "sunjer-dropdown";
            if ((e.target.id.indexOf(id) === -1 && $target.parent().attr('id') != id && e.type === "mousedown")
                || e.keyCode == 27)
                {
                $("#sunjer-dropdown").remove();
                sunjer.unhighlight();
                sunjer.select(null, sunjer.style.elements.selector);
                $(document).unbind('mousedown keydown', onClickElsewhere);
                return true;
            }
            return true;
        };
        
        var any = false;
        for (var selector in sunjer.style.rules) {
            any = true;

            var li = $("<li>", {
                class: 'sunjer-dropdown-li',
                tabIndex: 0,
                html: selector
            })

            .hover(function(e) {
                if (sunjer.selectionStatus)
                    return true;
                sunjer.highlight($(e.target.innerText)[0]);
                $(e.target).addClass('sunjer-dropdown-li-selected');
                return true;
            })

            .mouseout(function(e) {
                $(e.target).removeClass('sunjer-dropdown-li-selected');
            })

            .bind('click keydown', function(e) 
            {
                if (e.type === 'keydown' && e.keyCode != 13)
                    return true;
                var value = e.target.innerHTML;
                sunjer.panel.elements.headerSelector.html(value);
                sunjer.panel.updateHeight();
                sunjer.select(null, Utils.HTMLDecode(value));
                $(document).unbind('mousedown keydown', onClickElsewhere);
                $("#sunjer-dropdown").remove();
            })
            .appendTo(dropdown);
        }

        if (!any)
            $("<li>", {
                html: "No CSS selectors edited"
            } ).appendTo(dropdown);

        dropdown.appendTo(parent);
        $(document).bind('mousedown keydown', onClickElsewhere);
    },
    
    //	Select the next selector in the selectors dropdown list. Called when down arrow key is pressed
    selectNextDropdownOption: function() {
        var $li = $(".sunjer-dropdown-li");

        if ($li.length === 0)
            return;
		
        var $current = $(".sunjer-dropdown-li-selected");

        if ($current.length === 0) 
        {
            $li = $( $li.get(0) );
            sunjer.highlight( $( $li.text() ).get(0) );
            $li.addClass("sunjer-dropdown-li-selected").focus();
            return;
        }

        else {
            $current = $( $current.get(0) );
            $current.removeClass("sunjer-dropdown-li-selected");
            var $next = $( $current.next().get(0) );
            if ($next.length != 0) 
            {
                sunjer.highlight( $( $next.text() ).get(0) );
                $next.addClass("sunjer-dropdown-li-selected").focus();
            }
            else {
                $li = $( $li.get(0) );
                sunjer.highlight( $( $li.text() ).get(0) );
                $li.addClass("sunjer-dropdown-li-selected").focus();
            }
            return;
        }
    },
    
    //	Select the previous selector in the selectors dropdown list. Called when up arrow key is pressed
    selectPreviousDropdownOption: function() {
        var $li = $(".sunjer-dropdown-li");
        if ($li.length === 0)
            return;
		
        var $current = $(".sunjer-dropdown-li-selected");

        if ($current.length === 0) 
        {
            $li = $( $li[ $li.length - 1 ] );
            sunjer.highlight( $( $li.text() ).get(0) );
            $li.addClass("sunjer-dropdown-li-selected").focus();
            return;
        }

        else {
            $current = $( $current.get(0) );
            $current.removeClass("sunjer-dropdown-li-selected");
            var $prev = $( $current.prev().get(0) );

            if ($prev.length != 0) 
            {
                sunjer.highlight( $( $prev.text() ).get(0) );
                $prev.addClass("sunjer-dropdown-li-selected").focus();
            }
            else {
                $li = $( $li[ $li.length - 1 ] );
                sunjer.highlight( $( $li.text() ).get(0) );
                $li.addClass("sunjer-dropdown-li-selected").focus();
            }
            return;
        }
    },
    
    //	Enable the Undo button
    enableUndo: function() {
        this.elements.undoBt.attr('disabled', '');
    },
    
    //	Disable the Undo button
    disableUndo: function() {
        this.elements.undoBt.attr('disabled', 'disabled');
    }
}