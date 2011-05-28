/**
  * sunjer.panel.basic
  * 
  * Basic mode
  **/

sunjer.panel.basic = {
    
    
    elements: {
        container: null
    },
    
    
    
    
    createUI: function() {
        this.elements.container = $('<div>', {
            id: 'sunjer-controls'
        });


            var group = $('<div>', {
                id: 'sunjer-drill-down-menu'
            }).appendTo(this.elements.container);

        
            
        
        return this.elements.container;
    },
    
    setElementsSelectors: function() {
        // controls
//        this.elements.controls = $('.sunjer-control');
    },
    
    
    // reset values to default for all controls
    reset: function() {
        
    },

    show: function() {

        this.elements.container.show();
    },
    
    hide: function() {
        $('#sunjer-controls').hide();
    }
    
}