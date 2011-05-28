// Handles actions triggered from the right click menu
//
sunjer.contextmenu = {
    elements: {
        el: null
    },
    
    initialize: function() {
        this.attachListeners();
    },
    
    attachListeners: function() {
        $(document.body).bind('contextmenu', function(e) {
            sunjer.contextmenu.elements.el = e.target;
        });
    },
    
    openWidget: function() {
        if (sunjer.contextmenu.elements.el && sunjer.contextmenu.elements.el.nodeType == 1)
        {
            sunjer.open();
            sunjer.select(sunjer.contextmenu.elements.el);
        }
    },

	searchSocial: function() {
		window.open("http://sunjer.me/search?q=" + document.domain);
	},
	
	shareStyleOnSocial: function() {
		// check if the current page has any styles
		if (sunjer.style.rules) {
			
			var css = CSSUtils.crunchFormattedCSS(sunjer.style.rules, false);
			var url = "http://sunjer.me/post";

			// create a form and submit data
			var temp_form = $('<form>', {
				'method': 'post',
				'action': url,
				'target': '_self'
			});
			
			// site
			$('<input>', {
				type: 'hidden',
				name: 'site',
				value: sunjer.style.elements.url
			}).appendTo(temp_form);

			// css
			$('<input>', {
				type: 'hidden',
				name: 'css',
				value: css
			}).appendTo(temp_form);

			$('<submit>').appendTo(temp_form);

			temp_form.submit();

			temp_form.remove();
		}
	}
}