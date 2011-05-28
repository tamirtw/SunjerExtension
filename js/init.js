/**
  * This content script initializes sunjer
 **/

$(document).ready(function() {
    sunjer.chrome.fetchOptions();
});

// callback for request sent to background.html in sunjer.chrome.fetchOptions()
function initialize(response) {
    // init accordion state
//    sunjer.panel.basic.enabledAccordions = response.enabledAccordions;
    sunjer.initialize(response.options);
    attachListeners();
}

function attachListeners() {
    document.addEventListener('keydown', function(e) {
        if (isInputField(e.target))
           return true;

        if (sunjer.options.useShortcutKey && e.keyCode == sunjer.options.shortcutKey)
        {
            if (sunjer.options.shortcutMetaKey === 'ctrl' && e.ctrlKey
              || sunjer.options.shortcutMetaKey === 'shift' && e.shiftKey
              || sunjer.options.shortcutMetaKey === 'alt' && e.altKey
              || sunjer.options.shortcutMetaKey === 'none') {
                  e.preventDefault();
                  e.stopPropagation();
                  sunjer.toggle();
                  return false;
              }
        }
        // Handle Esc key to escape editing mode
        else if (e.keyCode == 27 &&
            sunjer.shouldClose(e.target)
        )
        {
            e.target.blur();
            sunjer.close();
        }
        return true;
    }, true);
}

function isInputField(el) {
    var tagName = el.tagName.toLowerCase();
    var inputTypes = ['input', 'textarea', 'div', 'object'];
    
    if ($.inArray(tagName, inputTypes) != -1 ||
    	el.id === "sunjer"
    )
        return true;
    else
        return false;
}