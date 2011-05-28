// sunjer keyboard shortcuts
//

function handleKeyboardShortcut(e) {
    var tag = e.target.tagName.toLowerCase();
    if ((tag == "input" && e.target.type == 'text') || tag == "textarea") {
        return true;
    }
    if (sunjer.isKeyboardHelpVisible) {
        closeShortcutHelp(e);
        return true;
    }
    switch (e.keyCode) {
        case 83: 	if (e.ctrlKey && e.shiftKey) {
						// 'ctrl+shift+s': Push styles, if sync is enabled
						sunjer.chrome.pushStyles();
					}
					else {
						// 's': shortcut to toggle selection of element, keypress: 115
						sunjer.toggleSelection();
					}
					return false;
        
        // 'h': hide/show currently selected element(s), keypress: 104
        case 72:    if (sunjer.selectedElement) { 
                        $("#sunjer-display").click();
                    }
                    return false;

        // 'm': toggle basic/advanced mode, keypress: 109
        case 77:    sunjer.panel.toggleMode(); return false;

        // 'e': Open the edit css popup, keypress: 101, keydown: 69
        case 69:    e.stopPropagation();
                    e.preventDefault();
                    $("#sunjer-main-buttons button:contains(Edit CSS)").click();
                    return false;
                    
        // 'p': Toggle sunjer's position, keypress: 112
        case 80:    sunjer.panel.togglePosition(); return false;
        
        // 'z': Undo last action, keypress: 122
        case 90:    sunjer.style.undo(); return false;
        
        // 'w': Write selector manually
        case 87:    e.stopPropagation();
                    e.preventDefault();
                    sunjer.panel.elements.headerSelector.click();
                    return false;
        
        // 'd': Open selector dropdown
        case 68:    sunjer.panel.showSelectorDropdown();
                    // select first selector
                    sunjer.panel.selectNextDropdownOption();
                    return false;
        
        // ↑ when dropdown is open
        case 38:    if ($("#sunjer-dropdown").length != 0) {
                        e.stopPropagation();
                        e.preventDefault();
                        sunjer.panel.selectPreviousDropdownOption();
                        return false;
                    }
        // ↓ when dropdown is open
        case 40:    if ($("#sunjer-dropdown").length != 0) {
                        e.stopPropagation();
                        e.preventDefault();
                        sunjer.panel.selectNextDropdownOption();
                        return false;
                    }
        /** Jump around sections **/
        
        // 't': Jump to Text, keypress: 116
        case 84:    $(".sunjer-accordion-header:contains('Text')").focus(); return false;
        
        // 'c': Jump to Color, keypress: 99
        case 67:    $(".sunjer-accordion-header:contains('Color')").focus(); return false;
        
        // 'b': Jump to Borders, keypress: 98
        case 66:    $(".sunjer-accordion-header:contains('Borders')").focus(); return false;
        
        // 'l': Jump to Layout, keypress: 108
        case 76:    $(".sunjer-accordion-header:contains('Layout')").focus(); return false;
        
        // '?': Display shortcuts keypress: 63
        case 191:   if (e.shiftKey) {
                        e.stopPropagation();
                        e.preventDefault();
                        displayShortcutHelp(); return false;
                    }
                    break;
    }

    // 'v': toggle highlight of *all* the elements for current selector
    // TODO: Add functionality to this
    
    return true;
}

function attachKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyboardShortcut, true);
}

function detachKeyboardShortcuts() {
    document.removeEventListener('keydown', handleKeyboardShortcut, true);
}

// Keyboard shortcuts help

function displayShortcutHelp() {
    var div = $("<div>", {
        id: "sunjer-shortcuts"
    });

    var content = $("<div>", {
        id: "sunjer-shortcuts-content"
    }).appendTo(div);

    $("<h1>", {
        html: "sunjer Keyboard shortcuts"
    }).appendTo(content);
    
    var sec1 = "<ul class='sunjer-shortcut-section'><h2>Manage sunjer</h2>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>Alt + m</span><span class='sunjer-key-desc'>Launch sunjer</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>s</span><span class='sunjer-key-desc'>Toggle ability to select an element</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>m</span><span class='sunjer-key-desc'>Switch between Basic / Advanced Mode</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>p</span><span class='sunjer-key-desc'>Move Panel Left / Right</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>e</span><span class='sunjer-key-desc'>Open Popup to edit page's CSS</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>w</span><span class='sunjer-key-desc'>Write CSS selector manually</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>d</span><span class='sunjer-key-desc'>Open CSS selector dropdown</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>↑↓</span><span class='sunjer-key-desc'>Navigate CSS selectors in dropdown</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>Ctrl + Shift + s</span><span class='sunjer-key-desc'>Push styles <i>(if sync is enabled)</i></span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>?</span><span class='sunjer-key-desc'>Bring up this help</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>esc</span><span class='sunjer-key-desc'>Close sunjer</span></li></ul>";
                
    var sec2 = "<ul class='sunjer-shortcut-section'><h2>Navigate Sections</h2>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>t</span><span class='sunjer-key-desc'>Move to <i>Text</i> section</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>c</span><span class='sunjer-key-desc'>Move to <i>Color & Background Color</i> section</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>b</span><span class='sunjer-key-desc'>Move to <i>Borders</i> section</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>l</span><span class='sunjer-key-desc'>Move to <i>Layout & Visibility</i> section</span></li></ul>";
                
    var sec3 = "<ul class='sunjer-shortcut-section'><h2>Apply property values</h2>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>h</span><span class='sunjer-key-desc'>Hide/Show selected element(s)</span></li>"+
                "<li class='sunjer-shortcut'><span class='sunjer-key'>z</span><span class='sunjer-key-desc'>Undo Last Action</span></li></ul>";
                
    var footer = $("<a href='#' id='sunjer-shortcuts-close'>Close</a>").click(closeShortcutHelp);
    content.append(sec1)
    .append(sec2)
    .append(sec3)
    .append(footer);
    div.appendTo(document.body);

    // darken page background
    $('<div>', {
        id: 'sunjer-background'
    })
    .css({
        height: document.height,
        opacity: "0.1",
        display: "block"
    })
    .appendTo(document.body);
    sunjer.isKeyboardHelpVisible = true;
}

function closeShortcutHelp(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    $("#sunjer-shortcuts").remove();
    $("#sunjer-background").remove();
    sunjer.isKeyboardHelpVisible = false;
}