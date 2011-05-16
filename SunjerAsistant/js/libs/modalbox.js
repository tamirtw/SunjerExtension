/**
  * An extremely minimalistic modal box
  *
  * Copyright (c) 2010 Ankit Ahuja
  * Dual licensed under GPL and MIT licenses.
 **/

// constructor
var ModalBox = function(html, options) {
    if (options)
    {
        for (var option in options)
            this.options[option] = options[option];
    }
    
    this.box = $('<div>', {
        id:'stylebot-modal'
    })
	
    .append(html);

	if (this.options.parent) {
		this.box.appendTo(this.options.parent);
	}
	
	else {
		this.box.appendTo(document.body);
	}

	this.box.css({
		height: this.options.height + "!important",	
		width: this.options.width + " !important",
		top: this.options.top + " !important",
		left: this.options.left + " !important"
	});
};

ModalBox.prototype.reset = function(options) {
	if (options)
    {
        for (var option in options)
            this.options[option] = options[option];

		this.box
		
		.css({
			height: this.options.height + "!important",			
			width: this.options.width + " !important",
			top: this.options.top + " !important",
			left: this.options.left + " !important"
		});
    }
}

ModalBox.prototype.options = {
    bgOpacity: 0.7,
    bgFadeSpeed: 120,
    fadeSpeed: 0,
    closeOnBgClick: true,
    closeOnEsc: true,
	width: '50%',
	height: '50%',
	top: '15%',
	left: '25%',
    onClose: function() {},
    onOpen: function() {},
	parent: null
}

ModalBox.prototype.darkenBg = function(callback) {
	
	if (this.options.bgOpacity == 0)
		return;
	
    // darken background
    this.background = $('<div>', {
        id: 'stylebot-background'
    })

    .css({
        opacity: this.options.bgOpacity,
        height: document.height
    })

    .appendTo(document.body)

    .fadeIn(this.options.bgFadeSpeed);
}

ModalBox.prototype.show = function(content, options) {
    this.box.fadeIn(this.options.fadeSpeed);
    this.darkenBg();
    this.options.onOpen();
    
    var closeBox = function(e) {
        if (e.type == "keyup" &&
            (e.keyCode != 27 || !e.data.modal.options.closeOnEsc)
        )
            return true;
        
        var id = e.target.id;
        var parent = $(e.target).closest('#stylebot-modal');
        
        if ((e.type == "mousedown" &&
            id != "stylebot-modal" &&
            parent.length == 0 &&
            e.data.modal.options.closeOnBgClick ) ||
            e.type == "keyup"
        )
        {
            e.preventDefault();
            e.data.modal.hide();
            $(document).unbind('keyup mousedown', closeBox);
        }
		
        return true;
    }
    
    $(document).bind('keyup mousedown', {modal: this}, closeBox);
}

ModalBox.prototype.hide = function() {
	this.box.fadeOut(this.options.fadeSpeed);
	if (this.background)
		this.background.fadeOut(this.options.bgFadeSpeed).remove();
	this.options.onClose();
}