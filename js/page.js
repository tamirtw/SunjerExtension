/**
  * sunjer.page
  * 
  * Shows the editor for the entire page's CSS
  **/

sunjer.page = {
    
    isVisible: false,
    
    modal: null,

	timer: null,
    
    elements: {
		livePreview: false,
		originalCSS: null,		
        textarea: null,
        css: null,
		// Reset CSS from http://meyerweb.com/eric/tools/css/reset/
		//
		resetCSS: 'html, body, div, span, applet, object, iframe,\n\
h1, h2, h3, h4, h5, h6, p, blockquote, pre,\n\
a, abbr, acronym, address, big, cite, code,\n\
del, dfn, em, img, ins, kbd, q, s, samp,\n\
small, strike, strong, sub, sup, tt, var,\n\
b, u, i, center,\n\
dl, dt, dd, ol, ul, li,\n\
fieldset, form, label, legend,\n\
table, caption, tbody, tfoot, thead, tr, th, td,\n\
article, aside, canvas, details, embed,\n\
figure, figcaption, footer, header, hgroup,\n\
menu, nav, output, ruby, section, summary,\n\
time, mark, audio, video {\n\
	margin: 0 !important;\n\
	padding: 0 !important;\n\
	border: 0 !important;\n\
	font-size: 100% !important;\n\
	font: inherit !important;\n\
	vertical-align: baseline !important;\n\
}\n\
\n\
article, aside, details, figcaption, figure,\n\
footer, header, hgroup, menu, nav, section {\n\
	display: block !important;\n\
}\n\
\n\
body {\n\
	line-height: 1 !important;\n\
}\n\
\n\
ol, ul {\n\
	list-style: none !important;\n\
}\n\
\n\
blockquote, q {\n\
	quotes: none !important;\n\
}\n\
\n\
blockquote:before, blockquote:after,\n\
q:before, q:after {\n\
	content: "" !important;\n\
	content: none !important;\n\
}\n\
\n\
table {\n\
	border-collapse: collapse !important;\n\
	border-spacing: 0 !important;\n\
}\n'
    },

    create: function(options) {
		var html = "<div style='font-size: 12px !important; line-height: 14px !important;'>Edit the CSS for <b>" + sunjer.style.elements.url + "</b>:</div>\
		<textarea class='sunjer-textarea sunjer-css-code' tabindex='0'></textarea>\
		<div style='font-size: 11px !important; margin-bottom: 10px !important;'>\
		<input type='checkbox' title='This may cause performance issues' class='sunjer-button' />\
		Live Preview Changes\
		</div>\
		<button class='sunjer-button' title='Copy to Clipboard' style='float:left !important; margin: 0px !important;' tabindex='0'>\
		Copy\
		</button>\
		<div style='float: right !important; margin-right: -5px !important;'>\
		<button class='sunjer-button' style='margin: 0px !important; margin-right: 3px !important; float: none !important;' tabindex='0'>\
		Save\
		</button>\
		<button class='sunjer-button' style='margin: 0px !important; float: none !important;' tabindex='0'>\
		Cancel\
		</button>\
		</div>";
		
        this.modal = new ModalBox(html, options, function(){});

        sunjer.page.elements.textarea = sunjer.page.modal.box.find('textarea').keyup(this.contentUpdated);

        var buttons = sunjer.page.modal.box.find('.sunjer-button');

		var $livePreviewCheckbox = $(buttons.get(0));
		
		$livePreviewCheckbox.click(this.toggleLivePreview)
        .tipsy({delayIn: 100, gravity:'sw'});

		sunjer.chrome.getPreference("sunjer_page_live_preview", function(livePreview) {
			if (livePreview) {
				$livePreviewCheckbox.attr('checked', 'checked');
			}
			
			sunjer.page.elements.livePreview = livePreview;
		});
		
        $(buttons.get(1)).click(this.copyToClipboard)
        .tipsy({delayIn: 100, gravity:'sw'});

        $(buttons.get(2)).click(this.save);
        $(buttons.get(3)).click(this.cancel);
    },
    
    fill: function(content) {
        this.elements.textarea.attr('value', content);
    },
    
    show: function(content, prevTarget) {
        if (!this.modal) {
		    this.create({
                closeOnEsc: false,
                closeOnBgClick: false,
                bgFadeSpeed: 0,
				width: $("#sunjer").width() - 30 + "px",
				top: '0%',
				left: '0',
				height: $("#sunjer").height() - 30 + "px",
				bgOpacity: 0,
				parent: $("#sunjer"),

                onOpen: function() {
                    var textarea = sunjer.page.elements.textarea.get(0);
                    Utils.moveCursorToEnd(textarea);
                    sunjer.page.elements.textarea.focus();
                    sunjer.style.saveState();
                    sunjer.page.elements.css = textarea.value;
                },

                onClose: function() {
                    sunjer.page.isVisible = false;
                    prevTarget.focus();
        			$(window).unbind('resize', sunjer.page.onWindowResize);
                }
            });
		}
		
		else {
			sunjer.page.modal.reset({
				width: $("#sunjer").width() - 30 + "px",
				top: '0%',
				left: '0',
				height: '100%',
			});
		}

		this.elements.textarea.css('height', $("#sunjer").height() - 125 + "px");
		
        this.fill(content);
		this.elements.originalCSS = content;
        this.isVisible = true;

        sunjer.page.modal.show();

        $(window).bind('resize', this.onWindowResize);
    },
    
    copyToClipboard: function() {
        var text = sunjer.page.elements.textarea.attr('value');
        sunjer.chrome.copyToClipboard(text);
    },

	applyResetCSS: function() {
		sunjer.page.elements.textarea.attr('value', sunjer.page.elements.resetCSS);

		if (sunjer.page.elements.livePreview) {
			sunjer.page.saveCSS(sunjer.page.elements.textarea.attr('value'));
		}
	},
	
	toggleLivePreview: function() {
		if (sunjer.page.elements.livePreview)
			sunjer.page.elements.livePreview = false;
			
		else {
			sunjer.page.elements.livePreview = true;
			sunjer.page.contentUpdated();
		}
		
		sunjer.chrome.savePreference("sunjer_page_live_preview", true);
	},
	
	contentUpdated: function() {
		if (!sunjer.page.elements.livePreview)
			return;
		
		if (sunjer.page.timer) {
			clearTimeout(sunjer.page.timer);
			sunjer.page.timer = null;
		}
		
		sunjer.page.timer = setTimeout(function() {
			sunjer.page.saveCSS(sunjer.page.elements.textarea.attr('value'));
		}, 100);
	},
    
    cancel: function(e) {
		sunjer.page.cancelChanges();
        sunjer.style.clearLastState();
        sunjer.page.modal.hide();
    },
    
    save: function(e) {
		sunjer.page.saveCSS(sunjer.page.elements.textarea.attr('value'));
        sunjer.panel.open();
        sunjer.page.modal.hide();
    },

	cancelChanges: function() {
		sunjer.page.saveCSS(sunjer.page.elements.originalCSS);
	},

	saveCSS: function(css) {
        if (sunjer.page.elements.css != css) {
            sunjer.style.applyPageCSS(css);
            sunjer.style.refreshUndoState();
        }

        else
            sunjer.style.clearLastState();

        sunjer.page.elements.css = null;
	},
	
	onWindowResize: function() {
		sunjer.page.modal.reset({
			width: $("#sunjer").width() - 30 + "px",
			top: '0%',
			left: '0',
			height: '100%',
		});
		
		sunjer.page.elements.textarea.css('height', $("#sunjer").height() - 125 + "px");		
	}
}