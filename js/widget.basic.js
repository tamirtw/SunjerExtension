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

            var menu = $('<div>',{
                id: 'testing',
                html: 'WEEeEeee!!!'
            });

       




            var group = $('<div>', {
                id: 'sunjer-drilldown-menu'
            }).append(menu)
            .appendTo(this.elements.container);

        
            
        
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